const fs=require('node:fs'),path=require('node:path');
const pt=(r,a)=>[500+r*Math.cos(a*Math.PI/180),470+r*Math.sin(a*Math.PI/180)];
const p=v=>v.map(n=>n.toFixed(3)).join(' ');
function sector(ro,ri,a,b){return `M${p(pt(ro,a))} A${ro} ${ro} 0 ${b-a>180?1:0} 1 ${p(pt(ro,b))} L${p(pt(ri,b))} A${ri} ${ri} 0 ${b-a>180?1:0} 0 ${p(pt(ri,a))}Z`;}
// One uninterrupted annular path; the lower opening belongs to the omega form.
const outer=`<path id="outer-ring-continuous" d="${sector(480,450,125,415)}"/>`;
const cuts=[105,152,158,202,208,242,248,292,298,332,338,382,388,435];
const inner='<g id="inner-segments">'+cuts.slice(0,-1).map((a,i)=>`<path d="${sector(430,365,a+.45,cuts[i+1]-.45)}"/>`).join('')+'</g>';
const feet=`<g id="omega-feet"><path d="M30 850H60V945H30Z M67 850H350V945H67Z M357 842H400V945H357Z"/><path d="M600 842H643V945H600Z M650 850H933V945H650Z M940 850H970V945H940Z"/></g>`;
const letter=`<path id="letter-m-solid" d="M235 235H349L500 560L651 235H765L779 253C744 253 734 271 738 309L778 690L740 738L705 371L524 682H476L295 371L260 738L222 690L262 309C266 271 256 253 221 253Z"/>`;
const svg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="980" viewBox="0 -20 1000 980" role="img" aria-labelledby="title desc">
<title id="title">Омега с цельной внешней дугой и залитой M</title>
<desc id="desc">Векторная реконструкция предоставленного варианта 4: непрерывная внешняя дуга, сегментированная внутренняя дуга, однородная заливка M. Прозрачный фон.</desc>
<g fill="#ffffff">${outer}${inner}${feet}${letter}</g></svg>\n`;
fs.writeFileSync(path.join(__dirname,'omega-m-solid-continuous-v1.svg'),svg);

