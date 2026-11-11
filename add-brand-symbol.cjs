const fs=require('node:fs'),path=require('node:path');
const dir=path.join(__dirname,'github-pages');
fs.copyFileSync(path.join(__dirname,'assets','brand-symbol-002.svg'),path.join(dir,'brand-symbol.svg'));
fs.copyFileSync(path.join(__dirname,'assets','brand-symbol-003.svg'),path.join(dir,'brand-symbol-003.svg'));
fs.copyFileSync(path.join(__dirname,'assets','brand-symbol-006.svg'),path.join(dir,'brand-symbol-006.svg'));
fs.copyFileSync(path.join(__dirname,'assets','brand-symbol-008.svg'),path.join(dir,'brand-symbol-008.svg'));
const academyLetters='<span aria-label="ACADEMY"><i>A</i><i>C</i><i>A</i><i>D</i><i>E</i><i>M</i><i>Y</i></span>';
const gateBrand='<div class="age-brand wordmark" role="img" aria-label="WHISKY ACADEMY"><img class="brand-symbol" src="brand-symbol-008.svg" alt="" width="88" height="87"><div class="brand-name">WHISKY '+academyLetters+'</div></div>';
for(const file of fs.readdirSync(dir).filter(x=>x.endsWith('.html'))){
 let html=fs.readFileSync(path.join(dir,file),'utf8');
 html=html.replace(/(<a\b[^>]*class="wordmark"[^>]*>)([\s\S]*?)(<\/a>)/g,(all,open,content,close)=>content.includes('brand-symbol')?all:open+'<img class="brand-symbol" src="brand-symbol.svg" alt="" width="64" height="63"><div class="brand-name">'+content+'</div>'+close);
 html=html.replace(/<(header|footer)\b[\s\S]*?<\/\1>/g,section=>section.replace(/src="brand-symbol(?:-\d+)?\.svg"/g,'src="brand-symbol-008.svg"'));
 html=html.replace(/(<div class="brand-name">)(?:OM\s+)?WHISKY\s+/g,'$1WHISKY ');
 html=html.replace(/(<a\b[^>]*class="wordmark"[^>]*aria-label=")OM\s+/g,'$1');
 html=html.replace(/<img class="age-logo"[^>]*>/g,gateBrand);
 html=html.replace(/(<div class="age-brand wordmark"[^>]*aria-label=")OM\s+/g,'$1');
 html=html.replace(/(<div class="age-brand wordmark"[^>]*>[\s\S]*?<img[^>]*src=")brand-symbol(?:-\d+)?\.svg/g,'$1brand-symbol-008.svg');
 fs.writeFileSync(path.join(dir,file),html);
}
const cssPath=path.join(dir,'multipage.css');let css=fs.readFileSync(cssPath,'utf8');
if(!css.includes('/* Brand symbol 002 */'))css+=`\n/* Brand symbol 002 */
.wordmark{flex-direction:row;align-items:center;gap:14px;flex-shrink:0}.wordmark .brand-symbol{width:58px;height:58px;object-fit:contain;flex:none}.brand-name{display:flex;flex-direction:column;align-items:stretch}.brand-name>span{display:flex;justify-content:space-between;letter-spacing:0;margin-right:4px}.brand-name>span i{font-style:normal}
@media(max-width:1100px) and (min-width:721px){header .wordmark{gap:10px;font-size:21px}header .wordmark .brand-symbol{width:48px;height:48px}}
@media(max-width:720px){header .wordmark{gap:9px;font-size:18px;letter-spacing:3px}header .wordmark .brand-symbol{width:42px;height:42px}header .brand-name>span{font-size:7px;margin-right:3px}header{padding-left:5%;padding-right:5%}}
`;
if(!css.includes('/* Approved logo 007 age screen */'))css+=`\n/* Approved logo 007 age screen */
.age-brand.wordmark{display:flex;justify-content:center;width:max-content;max-width:100%;margin:0 auto 40px;gap:18px;font-size:28px;letter-spacing:5px;color:var(--white)}.age-brand .brand-symbol{width:88px;height:88px}.age-brand .brand-name>span{font-size:9px;letter-spacing:0;margin-top:8px}
@media(max-width:480px){.age-brand.wordmark{font-size:23px;gap:13px;letter-spacing:4px}.age-brand .brand-symbol{width:72px;height:72px}.age-brand .brand-name>span{font-size:8px}}
`;
fs.writeFileSync(cssPath,css);
