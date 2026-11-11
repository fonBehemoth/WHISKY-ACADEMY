// Faithful vector tracing and estimated front-view rectification of the supplied image.
const fs=require('node:fs'),{spawnSync}=require('node:child_process'),vm=require('node:vm');
const source='D:/WHISKEY/Академия_Виски_№2_9_8_24_20261031T152920Z_1_001 (2)/Академия Виски №2 9.8.24/ЛОГО/c5e35433ebf60d8761a4895e31876baa.jpg';
const magick='C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe';
const w=2400,h=1856;
const r=spawnSync(magick,[source,'-resize',`${w}x${h}!`,'-blur','0x1.15','-depth','8','rgb:-'],{maxBuffer:30e6});if(r.status)throw Error(r.stderr.toString());
const mask=new Uint8Array(w*h),lum=new Float32Array(w*h),rgb=r.stdout;
for(let i=0;i<mask.length;i++){const r=rgb[3*i],g=rgb[3*i+1],b=rgb[3*i+2];mask[i]=r>48&&r>g-3&&g>b+5&&r-b>12?1:0;lum[i]=.299*r+.587*g+.114*b;}
// Reuse the checked contour and Bezier helpers; no image is embedded in either SVG.
const previous=fs.readFileSync('vectorise-monogram.cjs','utf8');
const context={w,h};vm.createContext(context);
vm.runInContext(previous.slice(previous.indexOf('function simplify('),previous.indexOf('const loops=contours'))+previous.slice(previous.indexOf('function path('),previous.indexOf('const d=loops.map'))+';globalThis.trace=contours;globalThis.curves=path;',context);
let loops=context.trace(mask,160,2.3);
// Exclude unrelated warm pixels outside the artwork and isolated scan noise.
loops=loops.filter(ps=>{const xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]);return Math.min(...xs)>480&&Math.max(...xs)<2180&&Math.min(...ys)>140&&Math.max(...ys)<1510;});
const transform=process.argv[2]||'original';
const integral=new Float64Array((w+1)*(h+1));
for(let y=0;y<h;y++){let sum=0;for(let x=0;x<w;x++){sum+=lum[y*w+x];integral[(y+1)*(w+1)+x+1]=integral[y*(w+1)+x+1]+sum;}}
const light=new Uint8Array(w*h),radius=12;
for(let y=0;y<h;y++)for(let x=0;x<w;x++){
 const a=Math.max(0,x-radius),b=Math.min(w,x+radius+1),c=Math.max(0,y-radius),d=Math.min(h,y+radius+1);
 const mean=(integral[d*(w+1)+b]-integral[c*(w+1)+b]-integral[d*(w+1)+a]+integral[c*(w+1)+a])/((b-a)*(d-c));
 const i=y*w+x;light[i]=mask[i]&&lum[i]>65&&lum[i]>mean+4.5?1:0;
}
let details=context.trace(light,24,1.05).filter(ps=>{const xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]);return Math.min(...xs)>480&&Math.max(...xs)<2180&&Math.min(...ys)>140&&Math.max(...ys)<1510;});
// Coordinates are in the original 1200x928 photograph.
function front(p){let x=p[0]/2,y=p[1]/2;
 if(transform==='front'){
  // Opposing stems lean to the right by about 12 degrees in the photograph.
  // First remove that shear, then restore the foreshortened horizontal axis.
  x=(x-645-.20*(y-420))*1.19;
  y=y-420;
 }
 return [x,y];
}
loops=loops.map(ps=>ps.map(front));
details=details.map(ps=>ps.map(front));
const pts=loops.flat(),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
const minx=Math.min(...xs)-15,miny=Math.min(...ys)-15,width=Math.max(...xs)-minx+15,height=Math.max(...ys)-miny+15;
const d=loops.map(context.curves).join(' ');
const strokes=details.map(context.curves).join(' ');
const base=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${[minx,miny,width,height].map(v=>v.toFixed(2)).join(' ')}" role="img" aria-labelledby="title desc"><title id="title">Ornamental monogram</title><desc id="desc">Vector tracing of the supplied monogram with scrollwork and engraved hatching. ${transform==='front'?'Estimated correction of photographic tilt and foreshortening. ':''}Transparent background.</desc>`;
const defs='<defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b98b38"/><stop offset=".3" stop-color="#efda9c"/><stop offset=".6" stop-color="#b58c45"/><stop offset="1" stop-color="#e7ce88"/></linearGradient></defs>';
const dest='assets/monogram-ornate-'+transform;
fs.writeFileSync(dest+'.svg',base+defs+`<path fill="#79663e" fill-rule="evenodd" d="${d}"/><path fill="url(#gold)" fill-rule="evenodd" d="${strokes}"/></svg>\n`);
fs.writeFileSync(dest+'-flat.svg',base+`<path fill="#caaa62" fill-rule="evenodd" d="${d}"/></svg>\n`);
const preview=spawnSync(magick,['-background','#151a1c','-density','180',dest+'.svg','-resize','1200x1200',dest+'-preview.png'],{maxBuffer:2e6});if(preview.status)throw Error(preview.stderr.toString());
console.log(JSON.stringify({transform,loops:loops.length,engravingContours:details.length,bounds:[minx,miny,width,height],svg:dest+'.svg'}));
