const fs=require('fs'),path=require('path');const dir=path.join(__dirname,'github-pages');
// Bump on publication when HTML, shared code or presentation changes.
const release='20261111-silk-gallery';
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.html'))){let html=fs.readFileSync(path.join(dir,file),'utf8');html=html.replace(/<meta name="wa-release"[^>]*>/g,'').replace('<meta charset="utf-8">',`<meta charset="utf-8"><meta name="wa-release" content="${release}">`);
html=html.replace(/\b(href|src)="([^"#]+)"/g,(all,attr,raw)=>{if(/^(?:https?:|\/\/|data:|mailto:|tel:)/i.test(raw))return all;const u=new URL(raw,'https://example.invalid/');if(!/\.(?:html|js|css)$/.test(u.pathname))return all;u.searchParams.set('v',release);return `${attr}="${u.pathname.slice(1)}${u.search}${u.hash}"`});fs.writeFileSync(path.join(dir,file),html)}
for(const file of fs.readdirSync(dir)){if(fs.statSync(path.join(dir,file)).isFile())fs.copyFileSync(path.join(dir,file),path.join(__dirname,'site','dist',file))}
console.log('Stamped HTML, navigation and code resources: '+release);

