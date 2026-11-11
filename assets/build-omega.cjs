const fs = require('node:fs');
const path = require('node:path');
// Manual vector reconstruction from the supplied low-resolution reference.
const pt=(r,a)=>[500+r*Math.cos(a*Math.PI/180),420+r*Math.sin(a*Math.PI/180)];
const p=v=>v.map(n=>n.toFixed(2)).join(' ');
function sector(r1,r2,a,b){return `M${p(pt(r1,a))} A${r1} ${r1} 0 ${b-a>180?1:0} 1 ${p(pt(r1,b))} L${p(pt(r2,b))} A${r2} ${r2} 0 ${b-a>180?1:0} 0 ${p(pt(r2,a))}Z`;}
const defs=`<defs>
 <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e4d3a5"/><stop offset=".28" stop-color="#bca16b"/><stop offset=".57" stop-color="#d7bd83"/><stop offset="1" stop-color="#79633e"/></linearGradient>
 <linearGradient id="outerWood" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ded3af"/><stop offset=".48" stop-color="#a99b77"/><stop offset="1" stop-color="#716448"/></linearGradient>
 <linearGradient id="letterGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0c1"/><stop offset=".38" stop-color="#d6bc7d"/><stop offset=".74" stop-color="#b18d4d"/><stop offset="1" stop-color="#e3c58a"/></linearGradient>
 <pattern id="grain" width="84" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><path d="M0 8 Q22 2 45 9T90 8 M-10 21 Q19 15 42 23T94 20 M0 35 Q25 29 48 36T90 34" fill="none" stroke="#503f24" stroke-width="1.2" opacity=".17"/><path d="M0 12 Q26 7 49 13T90 12 M0 38 Q23 33 48 39T90 37" fill="none" stroke="#fff0c4" stroke-width="1" opacity=".18"/></pattern>
</defs>`;
function band(id,r1,r2,angles,fill,gap){return `<g id="${id}" stroke-linejoin="round">`+angles.slice(0,-1).map((a,i)=>{const d=sector(r1,r2,a+gap,angles[i+1]-gap);return `<path d="${d}" fill="${fill}" stroke="#534a35" stroke-width="2.5"/><path d="${d}" fill="url(#grain)"/><path d="M${p(pt(r1-3,a+gap+.4))} A${r1-3} ${r1-3} 0 0 1 ${p(pt(r1-3,angles[i+1]-gap-.4))}" fill="none" stroke="#f2dfb2" stroke-width="2" opacity=".55"/>`;}).join('')+`</g>`;}
const outer=band('outer-staves',397,365,[130,180,220,270,320,360,410],'url(#outerWood)',.7);
const inner=band('inner-staves',351,303,[105,155,200,245,295,340,385,435],'url(#wood)',.4);
const joints=[155,200,245,295,340,385].map(a=>`<path d="${sector(353,301,a-3.2,a+3.2)}" fill="url(#outerWood)" stroke="#685a3d" stroke-width="2"/><path d="M${p(pt(348,a-1.8))} L${p(pt(307,a-1.8))}" stroke="#eee0b4" opacity=".6" stroke-width="2"/>`).join('');
const feet=`<g id="omega-feet" stroke="#655235" stroke-width="3" stroke-linejoin="round">
<path d="M116 724H390V804H116Z M610 724H884V804H610Z" fill="url(#wood)"/>
<path d="M116 724H390V804H116Z M610 724H884V804H610Z" fill="url(#grain)" stroke="none"/>
<path d="M119 727H390 M610 727H881" fill="none" stroke="#e8d7ab" stroke-width="4"/>
<path d="M116 724H148V804H116Z M390 716H427V804H390Z M573 716H610V804H573Z M852 724H884V804H852Z" fill="url(#outerWood)"/>
<path d="M122 730V796 M396 723V797 M579 723V797 M858 730V796" fill="none" stroke="#eddfb7" stroke-width="3" opacity=".55"/>
</g>`;
// Drawn outline, not a font dependency; the supplied mark contains a serif M.
const letter=`<g id="letter-m"><path d="M306 264H384L500 520L615 264H695V278C661 277 657 288 659 322L670 567C671 593 681 598 710 600V615H605V600C636 598 643 590 642 565L632 316L500 592H489L368 319L358 559C356 589 365 598 394 600V615H294V600C324 598 333 589 335 559L346 311C348 288 338 279 306 278Z" fill="url(#letterGold)" stroke="#75603c" stroke-width="2" stroke-linejoin="round"/><path d="M310 269H380 M620 269H690 M300 606H386 M612 606H700" fill="none" stroke="#fff0c8" stroke-width="3" opacity=".65"/></g>`;
function svg(withM){return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="850" viewBox="0 0 1000 850" role="img" aria-labelledby="title desc"><title id="title">${withM?'Omega with M monogram':'Stylised stave omega'}</title><desc id="desc">Manual vector reconstruction of a wooden segmented omega${withM?' and central serif M':''}. Transparent background. No embedded raster images or fonts.</desc>${defs}<g id="omega">${outer}${inner}<g id="stave-joints">${joints}</g>${feet}</g>${withM?letter:''}</svg>\n`;}
for(const [name,hasM] of [['omega-monogram-v1.svg',true],['omega-symbol-v1.svg',false]]) fs.writeFileSync(path.join(__dirname,name),svg(hasM));
