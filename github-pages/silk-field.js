// Draped fabric: warped fold height, surface normals and a narrow satin sheen.
// Muted olive shadows retain the original section palette; amber lives in the light.
const silkSurfaceBuffers=new WeakMap();
function renderSilkFrame(pixels,width,height,time){
 const data=pixels.data,drift=time*.075;
 function surface(u,v){
  const warp=u*9.2+v*2.4+1.45*Math.sin(v*3.8+drift)+.65*Math.sin(u*3.1-v*4.6-drift*.7);
  const phase=warp+1.1*Math.sin(v*5.3+u*1.4+drift*.6);
  return Math.sin(phase)+.24*Math.sin(phase*2+.65*Math.sin(v*3.4-drift))+.055*Math.sin(phase*4.1+v*2.2);
 }
 const stride=width+2,du=1.7/(width-1),dv=1/(height-1);
 let heights=silkSurfaceBuffers.get(pixels);
 if(!heights||heights.length!==stride*(height+2)){heights=new Float32Array(stride*(height+2));silkSurfaceBuffers.set(pixels,heights)}
 for(let y=0;y<height+2;y++)for(let x=0;x<width+2;x++)heights[y*stride+x]=surface((x-1)*du,(y-1)*dv);
 let i=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const u=x*du,cell=(y+1)*stride+x+1,h=heights[cell];
  let nx=-(heights[cell+1]-heights[cell-1])/(2*du)*.16;
  let ny=-(heights[cell+stride]-heights[cell-stride])/(2*dv)*.16;
  const length=Math.sqrt(nx*nx+ny*ny+1);nx/=length;ny/=length;const nz=1/length;
  const light=Math.max(0,nx*-.52+ny*-.34+nz*.78);
  const sheen=Math.pow(Math.max(0,nx*-.28+ny*-.18+nz*.943),24);
  const shadow=.62+.38*Math.max(0,Math.min(1,(h+1.3)/2.6));
  const amber=Math.min(1,Math.max(0,(light-.24)*.48+sheen*.54));
  const edge=1-.14*Math.pow(Math.abs(u/1.7-.5)*2,2);
  // Olive #1b2018 and restrained amber, with a neutral satin highlight.
  data[i++]=(27*shadow+amber*31+sheen*9)*edge;
  data[i++]=(32*shadow+amber*13+sheen*8)*edge;
  data[i++]=(24*shadow-amber*2+sheen*6)*edge;
  data[i++]=255;
 }
 return pixels;
}
if(typeof module!=='undefined')module.exports=renderSilkFrame;
