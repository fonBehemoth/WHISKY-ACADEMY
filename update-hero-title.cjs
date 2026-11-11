const fs=require('node:fs');
for(const f of ['github-pages/locale-data.js','github-pages/app.js','github-pages/page-data.js','github-pages/index.html','landing-original.html','build-multipage.cjs']){
 let text=fs.readFileSync(f,'utf8');
 text=text.replaceAll('The art of<br>understanding<br><em>whisky.</em>','The Art of<br>understanding<br><em>Whisky</em>').replaceAll('The art of understanding whisky','The Art of understanding Whisky');
 fs.writeFileSync(f,text);
}
