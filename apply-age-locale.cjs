const fs=require('fs'),path=require('path');
const extra=fs.readFileSync('uk-and-gate.js','utf8');
const gate=`<section id="ageGate" class="age-gate" role="dialog" aria-modal="true" aria-labelledby="ageTitle" aria-describedby="ageText">
<div class="languages gate-languages" aria-label="Language"><button type="button" data-lang="en" aria-pressed="true">EN</button><span>/</span><button type="button" data-lang="de" aria-pressed="false">DE</button><span>/</span><button type="button" data-lang="uk" aria-pressed="false">UK</button></div>
<div class="age-content"><img class="age-logo" src="logo.svg" alt="WHISKY ACADEMY"><div id="ageQuestion"><h2 id="ageTitle" data-t="ageTitle"></h2><p id="ageText" data-t="ageText"></p><div class="age-actions"><button type="button" class="button" id="ageNo" data-t="ageNo"></button><button type="button" class="button solid" id="ageYes" data-t="ageYes"></button></div><label class="age-remember"><input type="checkbox" id="ageRemember"><span data-t="ageRemember"></span></label></div><div id="ageDeclined" hidden><p role="status" data-t="ageDenied"></p><button type="button" class="button" id="ageBack" data-t="ageBack"></button></div><p class="age-note" data-t="ageNote"></p></div></section>`;
const css=`
/* Age confirmation */
[hidden]{display:none!important}.age-locked{overflow:hidden}.age-gate{position:fixed;inset:0;z-index:1000;overflow:auto;background:#050605;display:grid;place-items:center;padding:90px 24px 45px;text-align:center;color:var(--white)}.gate-languages{position:absolute;right:6%;top:30px}.age-content{width:min(100%,560px);margin:auto}.age-logo{width:clamp(200px,25vw,320px);height:auto;object-fit:contain;margin:0 auto 45px}.age-gate h2{font-size:clamp(28px,3vw,40px);letter-spacing:0;line-height:1.25;margin-bottom:17px}.age-gate p{max-width:440px;margin:0 auto 24px;font-size:13px}.age-actions{display:flex;justify-content:center;gap:14px;margin:27px 0}.age-actions .button{min-width:120px;background:transparent;color:var(--white);border-color:#777}.age-actions .solid{background:var(--gold);color:var(--bg);border-color:var(--gold)}.age-actions .button:hover{background:#333}.age-actions .solid:hover{background:#d7bf86}.age-remember{display:flex;justify-content:center;align-items:center;gap:10px;font-size:11px;color:var(--muted);cursor:pointer}.age-remember input{width:16px;height:16px;margin:0;accent-color:var(--gold)}.age-gate .age-note{margin-top:35px;margin-bottom:0;font-size:10px;letter-spacing:1px}.age-gate .languages button{min-width:32px;min-height:38px}.languages button{cursor:pointer}.age-gate .button{white-space:normal}.age-gate:focus{outline:none}
@media(max-width:720px){.age-gate{padding-top:85px}.age-logo{width:220px;max-height:230px;margin-bottom:35px}.age-gate h2{font-size:30px}.age-actions .button{padding:14px 18px}.header-actions{gap:5px}.languages{gap:4px}.languages button{padding:5px}.hero h1{overflow-wrap:normal}html[lang="uk"] h1{font-size:clamp(40px,11vw,60px)}html[lang="uk"] .experience-card .text-link{font-size:8px;letter-spacing:.3px}html[lang="uk"] .hero-buttons .text-link{font-size:9px}}
`;
for(const dir of ['github-pages','site/dist']){
 let html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
 html=html.replace('<body>','<body class="age-locked">'+gate);
 html=html.replace('<button data-lang="de" aria-pressed="false">DE</button>','<button data-lang="de" aria-pressed="false">DE</button><span>/</span><button data-lang="uk" aria-pressed="false">UK</button>');
 html=html.replace('class="vertical-note">A WORLD WORTH DISCOVERING','class="vertical-note" data-t="worldNote">A WORLD WORTH DISCOVERING');
 html=html.replace('<span>OLEKSANDR MARTYNOV · WHISKY ACADEMY</span>','<span data-t="heroByline">OLEKSANDR MARTYNOV · WHISKY ACADEMY</span>');
 html=html.replace('class="photo-caption">OLEKSANDR MARTYNOV','class="photo-caption" data-name>OLEKSANDR MARTYNOV').replace('class="name">Oleksandr Martynov','class="name" data-name>Oleksandr Martynov').replace('<span>Oleksandr Martynov</span>','<span data-name>Oleksandr Martynov</span>');
 fs.writeFileSync(path.join(dir,'index.html'),html);
 let app=fs.readFileSync(path.join(dir,'app.js'),'utf8');
 app=app.replace('const arrow=',extra+'\nconst arrow=');
 app=app.replace("document.getElementById('next').setAttribute('aria-label',lang==='de'?'Nächstes Bild':'Next tasting detail');}","document.getElementById('next').setAttribute('aria-label',lang==='de'?'Nächstes Bild':'Next tasting detail');localizeDetails(lang);}");
 app=app.replace("render('en');","render(copy[stored('wa-language')]?stored('wa-language'):'en');");
 app+='\ninitAgeGate();\n';
 fs.writeFileSync(path.join(dir,'app.js'),app);
 fs.appendFileSync(path.join(dir,'style.css'),css);
 fs.copyFileSync('D:/WHISKEY/Академия_Виски_№2_9_8_24_20261031T152920Z_1_001 (2)/Академия Виски №2 9.8.24/ЛОГО/LOGO_manrop.svg',path.join(dir,'logo.svg'));
}
