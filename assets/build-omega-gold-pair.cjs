const fs = require('node:fs');
const path = require('node:path');

// Manual, symmetric vector reconstruction of the two supplied JPEG references.
// Every visible element is a path; no embedded bitmap or font dependency.
const n = v => Number(v.toFixed(3));
function point(cx, cy, rx, ry, angle) {
  const a = angle * Math.PI / 180;
  return `${n(cx + rx * Math.cos(a))} ${n(cy + ry * Math.sin(a))}`;
}
function band(cx, cy, rx, ry, thickness, a, b) {
  const pt = (x, y, z) => point(cx, cy, x, y, z);
  return `M${pt(rx,ry,a)} A${rx} ${ry} 0 0 1 ${pt(rx,ry,b)} L${pt(rx-thickness,ry-thickness,b)} A${rx-thickness} ${ry-thickness} 0 0 0 ${pt(rx-thickness,ry-thickness,a)}Z`;
}
function segments(cx,cy,rx,ry,thickness,angles) {
  return `<g id="gold-segments" fill="url(#gold)">\n${angles.slice(0,-1).map((a,i)=>{
    const b=angles[i+1], start=a+.65, end=b-.65;
    return `  <path id="segment-${i+1}" d="${band(cx,cy,rx,ry,thickness,start,end)}"/>`;
  }).join('\n')}\n</g>`;
}
const defs = `<defs>
  <linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="300" y1="170" x2="1000" y2="900">
    <stop stop-color="#e4be61"/>
    <stop offset=".22" stop-color="#ffe69b"/>
    <stop offset=".48" stop-color="#d9af4f"/>
    <stop offset=".71" stop-color="#b58a35"/>
    <stop offset=".88" stop-color="#f3cf78"/>
    <stop offset="1" stop-color="#c69c46"/>
  </linearGradient>
</defs>`;
const boldM = 'M402 294H507L642 571L777 294H882V307C854 309 845 320 850 358L901 745L832 805L783 449L665 709H621L497 449L451 805L382 745L432 358C437 320 430 310 402 307Z';
const boldOmega = 'M211 869H451C330 801 252 680 252 540C252 325 426 151 641 151C856 151 1030 325 1030 540C1030 680 952 801 831 869H1072V951H729V851C870 812 973 687 973 540C973 357 824 209 641 209C458 209 309 357 309 540C309 687 412 812 553 851V951H211Z';
const serifM = 'M432 335H514L650 615L787 335H865V344C835 347 826 357 828 390L849 672C850 704 859 719 887 724V734H762V724C794 719 803 707 802 682L794 409L657 703H645L500 418L488 676C485 704 493 719 533 724V734H410V724C440 718 449 704 451 675L469 393C473 360 461 347 432 344Z';
const serifOmega = 'M266 897H484C346 822 263 693 263 554C263 350 436 185 648 185C860 185 1033 350 1033 554C1033 693 950 822 812 897H1032V975H735V872C875 829 977 697 977 554C977 379 829 237 648 237C467 237 319 379 319 554C319 697 421 829 561 872V975H266Z';
const variants = [
  {
    name:'omega-m-gold-bold-v1', title:'Золотая широкая M и белая омега',
    view:'190 90 900 875', width:900,height:875,
    ring:segments(641,540,438,438,35,[130,147,168,190,212,240,270,300,328,350,372,393,410]),
    m:boldM, omega:boldOmega, ends:''
  },
  {
    name:'omega-m-gold-serif-v1', title:'Золотая M с засечками и белая омега',
    view:'200 120 900 870', width:900,height:870,
    ring:segments(648,554,435,420,35,[130,146,167,190,212,242,270,299,328,351,373,394,410]),
    m:serifM, omega:serifOmega,
    ends:'<path id="separate-foot-ends" fill="#ffffff" d="M230 897H258V975H230Z M1040 897H1068V975H1040Z"/>'
  }
];
for (const v of variants) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${v.width}" height="${v.height}" viewBox="${v.view}" role="img" aria-labelledby="title desc">
<title id="title">${v.title}</title>
<desc id="desc">Векторная реконструкция по предоставленному изображению от 6 ноября 2026 года. Золотая сегментированная внешняя дуга, золотая буква M, белая омега. Прозрачный фон. Контуры без шрифтов и встроенных растровых изображений.</desc>
${defs}
${v.ring}
<path id="letter-m" fill="url(#gold)" d="${v.m}"/>
<path id="white-omega" fill="#ffffff" d="${v.omega}"/>
${v.ends}
</svg>
`;
  fs.writeFileSync(path.join(__dirname,`${v.name}.svg`),svg);
}
console.log('Created two standalone SVGs.');
