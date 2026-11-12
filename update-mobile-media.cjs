const fs=require('node:fs');
const edit=(file,fn)=>fs.writeFileSync(file,fn(fs.readFileSync(file,'utf8')));
edit('apply-home-structure.cjs',s=>s.replace("const images=['collection-new-03.webp'","const images=['collection-new-09.webp'"));
// This alt describes the replacement in every language, including after switching locales.
const c=require('./home-copy.cjs');
c.en.collectionAlts[0]='John Walker & Sons King George V in its presentation case';
c.de.collectionAlts[0]='John Walker & Sons King George V im Präsentationsetui';
c.uk.collectionAlts[0]='John Walker & Sons King George V у презентаційному футлярі';
fs.writeFileSync('home-copy.cjs','module.exports = '+JSON.stringify(c,null,2)+';\n');
const catalog=require('./localization/en-content.json');catalog.homeCopy.collectionAlts[0]=c.en.collectionAlts[0];
fs.writeFileSync('localization/en-content.json',JSON.stringify(catalog,null,2));
const strings=require('./localization/en-strings.json');let id=strings.indexOf(c.en.collectionAlts[0]);
if(id<0){id=strings.length;strings.push(c.en.collectionAlts[0]);fs.writeFileSync('localization/en-strings.json',JSON.stringify(strings,null,2));fs.appendFileSync('localization/fr-it-02.txt',`\n${id}|John Walker & Sons King George V dans son coffret de présentation|John Walker & Sons King George V nella sua confezione di presentazione\n`)}
edit('github-pages/home-layout.css',s=>s.replace('.home-collection-grid img{height:300px}.home-collection-grid figure:first-child img{object-fit:contain;background:#111310}', '.home-collection-grid img{height:auto;aspect-ratio:auto;object-fit:contain;background:transparent}'));
edit('github-pages/nov11-interactions.js',s=>{
 const at=s.indexOf(' // Original low-resolution colour field');
 if(at<0)throw Error('Missing background installer');
 return s.slice(0,at)+` // Compositor-driven soft colour movement: no canvas loop or viewport observer needed.
 let previousAnimated=null;
 document.querySelectorAll('main section').forEach(section=>{
  if(section.classList.contains('home-invitation')||previousAnimated?.nextElementSibling===section)return;
  const rgb=getComputedStyle(section).backgroundColor.match(/[\\d.]+/g)?.map(Number);
  if(!rgb||rgb[0]<25||rgb[1]<=rgb[0]||rgb[1]<=rgb[2]||rgb[3]===0)return;
  section.classList.add('amber-silk');previousAnimated=section;
  const field=document.createElement('div');field.className='amber-canvas';field.setAttribute('aria-hidden','true');section.prepend(field);
 });
 function backgroundState(){document.querySelectorAll('.amber-silk').forEach(s=>s.classList.toggle('silk-paused',document.hidden||!allowed()))}
 document.addEventListener('visibilitychange',backgroundState);window.addEventListener('wa:age-state',backgroundState);window.addEventListener('pageshow',backgroundState);backgroundState();
})();\n`;
});
edit('github-pages/nov11-effects.css',s=>s.replace(/\/\* Subtle amber silk;[\s\S]*?(?=\.logo-sheen)/,`/* Broad diffuse olive-to-amber light, moving on the compositor on mobile too. */
.amber-silk{position:relative;isolation:isolate;overflow:hidden;background:#1b2018!important}
.amber-silk>.amber-canvas{position:absolute;inset:-22%;width:144%;height:144%;pointer-events:none;z-index:0;opacity:.65;background:radial-gradient(ellipse at 25% 32%,#8b643d40 0%,#66533925 24%,transparent 58%),radial-gradient(ellipse at 78% 75%,#a4744533 0%,#5d503126 28%,transparent 62%),linear-gradient(125deg,#1b2018 5%,#343024 32%,#20271b 54%,#413326 76%,#1b2018 98%);filter:blur(24px);transform:translate3d(-5%,-3%,0) scale(1.05);animation:silk-soft-drift 36s ease-in-out infinite alternate;will-change:transform}
.amber-silk>:not(.amber-canvas){position:relative;z-index:1}
.silk-paused>.amber-canvas{animation-play-state:paused}
@keyframes silk-soft-drift{0%{transform:translate3d(-5%,-3%,0) scale(1.05) rotate(-4deg)}50%{transform:translate3d(2%,4%,0) scale(1.12) rotate(0deg)}100%{transform:translate3d(7%,-2%,0) scale(1.05) rotate(5deg)}}
@media(max-width:720px){.amber-silk>.amber-canvas{opacity:.55;filter:blur(20px)}}
@media(prefers-reduced-motion:reduce){.amber-silk>.amber-canvas{animation:none;will-change:auto}}
`));
edit('version-site.cjs',s=>s.replace(/const release='[^']+'/,'const release=\'20261112-mobile-photos-soft-light\''));
