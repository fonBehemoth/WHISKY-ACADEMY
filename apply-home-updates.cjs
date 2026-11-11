const fs=require('fs'),path=require('path');const dir=path.join(__dirname,'github-pages');
// User corrected the collection total to exactly 2,000 on 4 November 2026.
function updateCount(s){return s.replaceAll('more than 3,000','2,000').replaceAll('More than 3,000','2,000').replaceAll('mehr als 3.000','2.000').replaceAll('Mehr als 3.000','2.000').replaceAll('понад 3 000','2 000').replaceAll('Понад 3 000','2 000').replaceAll('3,000+','2,000').replaceAll('3.000+','2.000').replaceAll('3,000','2,000').replaceAll('3.000','2.000').replaceAll('3 000','2 000')}
for(const file of ['page-data.js',...fs.readdirSync(dir).filter(x=>x.endsWith('.html'))]){const p=path.join(dir,file);fs.writeFileSync(p,updateCount(fs.readFileSync(p,'utf8')))}
const original=fs.readFileSync(path.join(__dirname,'landing-original.html'),'utf8');const get=id=>[...original.matchAll(/<section\b[\s\S]*?<\/section>/g)].map(x=>x[0]).find(x=>x.includes(`id="${id}"`));
const authorPath=path.join(dir,'author.html');
let author=fs.readFileSync(authorPath,'utf8');
author=author.replace(/(<div class="founder-photo[^>]*><img src=")[^"]+/, '$1founder-blue-blazer.jpg');
fs.writeFileSync(authorPath,author);
let home=fs.readFileSync(path.join(dir,'index.html'),'utf8');home=home.replace(/(<div class="founder-photo[^>]*><img src=")[^"]+/, '$1founder-blue-blazer.jpg');
if(!home.includes('id="experiences"'))home=home.replace(/<section class="section"><p class="eyebrow" data-n="tastingIntro">[\s\S]*?<\/section>/,get('experiences'));
if(!home.includes('id="community"'))home=home.replace('<section class="section project-feature">',get('community')+'<section class="section project-feature">');
home=home.replaceAll('href="#contact"','href="contact.html"');
const vm=require('vm'),ctx={};vm.runInNewContext(fs.readFileSync(path.join(dir,'locale-data.js'),'utf8')+';globalThis.t=copy.en;',ctx);
home=home.replace(/<([a-z][a-z0-9]*)\b([^>]*data-t="([^"]+)"[^>]*)>[\s\S]*?<\/\1>/g,(_,tag,a,key)=>`<${tag}${a}>${ctx.t[key]||''}</${tag}>`);fs.writeFileSync(path.join(dir,'index.html'),home);
let project=fs.readFileSync(path.join(dir,'project-linkwood.html'),'utf8');
const film='<div class="linkwood-film-shell" id="linkwoodFilmPlayer"><button type="button" class="linkwood-film-play" aria-label="Play Linkwood film on YouTube"><img src="linkwood-film-poster.jpg" alt="" loading="lazy" width="352" height="640"><span class="film-play-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7Z"/></svg></span><span class="film-play-label" data-lw="filmPlay">Watch on YouTube</span></button></div>';
if(!project.includes('id="linkwoodFilm"'))project=project.replace('<section class="section linkwood-artwork" id="linkwoodArtwork">','<section class="section linkwood-film-section" id="linkwoodFilm"><div><p class="eyebrow">LINKWOOD</p><h2 data-lw="filmTitle">The project in motion.</h2><p data-lw="filmText">A closer look at the Linkwood project.</p></div>'+film+'</section><section class="section linkwood-artwork" id="linkwoodArtwork">');
else project=project.replace(/<video class="linkwood-film"[\s\S]*?<\/video>/,film);
fs.writeFileSync(path.join(dir,'project-linkwood.html'),project);console.log('Applied 2,000 total, homepage portrait and restored club/collection sections; added Linkwood film.');
