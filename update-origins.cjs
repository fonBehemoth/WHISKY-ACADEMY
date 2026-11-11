const fs=require('fs');
for(const file of ['github-pages/app.js','github-pages/locale-data.js','uk-and-gate.js']){let s=fs.readFileSync(file,'utf8');s=s.replace(/origins:'([^']*)'/g,(all,value)=>{if(/ · (Canada|Kanada|Канада)$/.test(value))return all;const extra=value.startsWith('Schottland')?'Israel · Australien · USA · Kanada':value.startsWith('Шотландія')?'Ізраїль · Австралія · США · Канада':'Israel · Australia · USA · Canada';return "origins:'"+value+' · '+extra+"'"});fs.writeFileSync(file,s)}
const vm=require('vm'),ctx={};vm.runInNewContext(fs.readFileSync('github-pages/locale-data.js','utf8')+';globalThis.words=copy',ctx);
for(const file of fs.readdirSync('github-pages').filter(x=>x.endsWith('.html'))){let html=fs.readFileSync('github-pages/'+file,'utf8').replace(/(<p[^>]*data-t="origins"[^>]*>)[\s\S]*?<\/p>/g,'$1'+ctx.words.en.origins+'</p>');fs.writeFileSync('github-pages/'+file,html)}
console.log('Country lists updated in EN/DE/UK and generation sources.');
