// Colour-mask tracing: editable vector paths, never an embedded bitmap.
const fs=require('node:fs'),{spawnSync}=require('node:child_process');
const source='D:/WHISKEY/Академия_Виски_№2_9_8_24_20261031T152920Z_1_001 (2)/Академия Виски №2 9.8.24/ЛОГО/monogram_simplified_modern.png';
const magick='C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe';
const w=1200,h=900;
const raw=spawnSync(magick,[source,'-resize',`${w}x${h}!`,'-blur','0x1.1','-depth','8','rgb:-'],{maxBuffer:20e6});
if(raw.status!==0)throw Error(raw.stderr.toString());
const rgb=raw.stdout,mask=new Uint8Array(w*h);
for(let i=0;i<w*h;i++){
 const r=rgb[i*3],g=rgb[i*3+1],b=rgb[i*3+2];
 // The cold graphite background and black studio credit are excluded by hue.
 mask[i]=r>65&&r>g+4&&g>b+8?1:0;
}
function morphology(a,dilate){const b=new Uint8Array(a.length);for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){let v=dilate?0:1;for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++)v=dilate?Math.max(v,a[(y+yy)*w+x+xx]):Math.min(v,a[(y+yy)*w+x+xx]);b[y*w+x]=v;}return b;}
const silhouette=morphology(morphology(mask,true),false);
function simplify(points,eps){
 const sq=eps*eps;
 function rec(a,b,out){let max=0,at=-1;const p=points[a],q=points[b],dx=q[0]-p[0],dy=q[1]-p[1],den=dx*dx+dy*dy;
  for(let i=a+1;i<b;i++){const s=points[i],t=den?Math.max(0,Math.min(1,((s[0]-p[0])*dx+(s[1]-p[1])*dy)/den)):0,d=(s[0]-p[0]-t*dx)**2+(s[1]-p[1]-t*dy)**2;if(d>max){max=d;at=i}}
  if(max>sq){rec(a,at,out);out.push(points[at]);rec(at,b,out);}
 }
 const out=[points[0]];rec(0,points.length-1,out);out.push(points.at(-1));return out;
}
function contours(a,minArea=25,eps=.65){
 const stride=w+1,edges=new Map();
 const edge=(x,y,xx,yy)=>{const k=y*stride+x;let v=edges.get(k);if(!v)edges.set(k,v=[]);v.push(yy*stride+xx);};
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!a[y*w+x])continue;
  if(!y||!a[(y-1)*w+x])edge(x,y,x+1,y);
  if(x===w-1||!a[y*w+x+1])edge(x+1,y,x+1,y+1);
  if(y===h-1||!a[(y+1)*w+x])edge(x+1,y+1,x,y+1);
  if(!x||!a[y*w+x-1])edge(x,y+1,x,y);
 }
 const loops=[];
 while(edges.size){const start=edges.keys().next().value;let p=start;const ps=[];let safety=0;
  do {ps.push([p%stride,Math.floor(p/stride)]);const out=edges.get(p);if(!out)break;const next=out.pop();if(!out.length)edges.delete(p);p=next;if(++safety>1e7)throw Error('Contour loop');}while(p!==start);
  if(ps.length<4)continue;let area=0;for(let i=0;i<ps.length;i++){const p=ps[i],q=ps[(i+1)%ps.length];area+=p[0]*q[1]-q[0]*p[1];}if(Math.abs(area/2)<minArea)continue;
  ps.push(ps[0]);loops.push(simplify(ps,eps));
 }
 return loops;
}
const loops=contours(silhouette,45,2.3);
const all=loops.flat(),xmin=Math.min(...all.map(p=>p[0]))-10,ymin=Math.min(...all.map(p=>p[1]))-10,xmax=Math.max(...all.map(p=>p[0]))+10,ymax=Math.max(...all.map(p=>p[1]))+10;
function path(ps){
 const p=ps.slice(0,-1),n=p.length,fmt=v=>v.map(x=>Math.round(x*100)/100).join(' ');
 const tangents=p.map((q,i)=>{const prev=p[(i+n-1)%n],next=p[(i+1)%n],a=[q[0]-prev[0],q[1]-prev[1]],b=[next[0]-q[0],next[1]-q[1]],la=Math.hypot(...a),lb=Math.hypot(...b);if(!la||!lb||((a[0]*b[0]+a[1]*b[1])/(la*lb))<.45)return [0,0];const u=[a[0]/la+b[0]/lb,a[1]/la+b[1]/lb],s=Math.min(la,lb)*.33/Math.hypot(...u);return [u[0]*s,u[1]*s]});
 let d='M'+fmt(p[0]);for(let i=0;i<n;i++){const j=(i+1)%n,a=p[i],b=p[j],ta=tangents[i],tb=tangents[j];d+='C'+fmt([a[0]+ta[0],a[1]+ta[1]])+' '+fmt([b[0]-tb[0],b[1]-tb[1]])+' '+fmt(b);}return d+'Z';
}
const d=loops.map(path).join(' ');
const head=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${xmin} ${ymin} ${xmax-xmin} ${ymax-ymin}" role="img" aria-labelledby="title desc"><title id="title">Calligraphic monogram</title><desc id="desc">Vector tracing of the supplied gold monogram, with transparent background.</desc>`;
const defs='<defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ebcf81"/><stop offset=".3" stop-color="#b48c40"/><stop offset=".53" stop-color="#fae4a3"/><stop offset=".76" stop-color="#a77c32"/><stop offset="1" stop-color="#e3c575"/></linearGradient></defs>';
fs.mkdirSync('assets',{recursive:true});
fs.writeFileSync('assets/monogram-vector-gold.svg',head+defs+`<path fill="url(#gold)" fill-rule="evenodd" d="${d}"/></svg>\n`);
fs.writeFileSync('assets/monogram-vector-flat.svg',head+`<path fill="#c9a858" fill-rule="evenodd" d="${d}"/></svg>\n`);
const preview=spawnSync(magick,['-background','#171b1c','-density','240','assets/monogram-vector-gold.svg','-resize','1100x1000','assets/monogram-vector-preview.png'],{maxBuffer:2e6});
if(preview.status!==0)throw Error(preview.stderr.toString());
console.log(JSON.stringify({loops:loops.length,vertices:all.length,viewBox:[xmin,ymin,xmax-xmin,ymax-ymin],files:['assets/monogram-vector-gold.svg','assets/monogram-vector-flat.svg','assets/monogram-vector-preview.png']}));
