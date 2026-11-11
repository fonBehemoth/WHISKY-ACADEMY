const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'github-pages');
const csp="default-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; media-src 'self'; connect-src 'none'; object-src 'none'; frame-src 'none'; worker-src 'none'; manifest-src 'none'; base-uri 'none'; form-action 'none'";
for(const name of fs.readdirSync(dir).filter(x=>x.endsWith('.html'))){let html=fs.readFileSync(path.join(dir,name),'utf8');
html=html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi,'').replace(/<meta name="referrer"[^>]*>/gi,'');
const policy=name==='project-linkwood.html'?csp.replace("frame-src 'none'",'frame-src https://www.youtube-nocookie.com'):csp;
html=html.replace(/(<meta charset="utf-8">)/,`$1<meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="referrer" content="strict-origin-when-cross-origin">`);
html=html.replace(/<noscript><style>[\s\S]*?<\/style><\/noscript>/g,'<noscript><p class="no-script-notice">Please enable JavaScript to confirm your age and browse this website.</p></noscript>');
fs.writeFileSync(path.join(dir,name),html);}
for(const file of fs.readdirSync(dir)){if(fs.statSync(path.join(dir,file)).isFile())fs.copyFileSync(path.join(dir,file),path.join(__dirname,'site','dist',file))}
console.log('Applied static CSP and referrer policy to all seven pages; dist synchronised.');
