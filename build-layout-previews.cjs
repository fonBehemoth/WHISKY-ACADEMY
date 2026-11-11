// Private browser QA documents: exact HTML/CSS, static media and no age attestation.
// These fixtures are outside the public directory and never deployed.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const dir=path.join(__dirname,'github-pages'),out=path.join(__dirname,'collection-review');
const magick='C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe';
for(const page of ['index','collection']){
 let h=fs.readFileSync(path.join(dir,page+'.html'),'utf8');
 h=h.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/,'').replace(/<script\b[\s\S]*?<\/script>/g,'').replace(/<noscript>[\s\S]*?<\/noscript>/g,'').replace(/<section id="ageGate"[\s\S]*?<\/section>/,'').replace('class="age-locked"','class=""');
 h=h.replace(/<video[^>]*>[\s\S]*?<\/video>/,'<img class="hero-image" src="hero-poster.jpg" alt="">');
 h=h.replace(/<link rel="stylesheet" href="([^"?]+)(?:\?[^"]*)?">/g,(_,name)=>'<style>'+fs.readFileSync(path.join(dir,name),'utf8')+'</style>');
 const sources=[...new Set([...h.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m=>m[1]))];
 for(const src of sources){
  let b,mime;
  if(src.endsWith('.svg')){b=fs.readFileSync(path.join(dir,src));mime='image/svg+xml'}else{
   const preview=path.join(out,'qa-'+path.basename(src).replace(/\.[^.]+$/,'.webp'));
   cp.execFileSync(magick,[path.join(dir,src),'-resize',page==='index'?'1100x1100>':'500x700>','-strip','-quality','76',preview]);b=fs.readFileSync(preview);mime='image/webp';
  }
  h=h.replaceAll('src="'+src+'"','src="data:'+mime+';base64,'+b.toString('base64')+'"');
 }
 const files=['locale-data.js','page-data.js',...(page==='index'?['home-data.js','home-render.js']:['new-collection.js'])];
 const code=files.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n');
 const fixture=`function fixtureRender(lang){document.documentElement.lang=lang;document.querySelectorAll('[data-t]').forEach(el=>el.innerHTML=copy[lang][el.dataset.t]||'');document.querySelectorAll('[data-n]').forEach(el=>el.textContent=pagesCopy[lang][el.dataset.n]||'');document.querySelectorAll('[data-nav]').forEach(el=>el.textContent=pagesCopy[lang].nav[el.dataset.nav]);document.querySelectorAll('[data-name]').forEach(el=>el.textContent=copy[lang].personName);document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===lang)));window.renderHomePage?.(lang);window.dispatchEvent(new CustomEvent('wa:language',{detail:lang}));}document.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(b)fixtureRender(b.dataset.lang)});fixtureRender('en');`;
 h=h.replace('</body>','<script>'+code+'\n'+fixture+'</script></body>');
 fs.writeFileSync(path.join(out,page+'-layout-preview.html'),h);
 console.log(page+' QA HTML: '+Buffer.byteLength(h)+' bytes');
}
