import * as THREE from '../vendor-source/package/build/three.module.js';

// Approximate profile reconstructed from the supplied film, not a measured scan.
export async function mountBottle(host,{front='linkwood-front.jpg',back='linkwood-back.jpg',label='Linkwood 3D'}={}){
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0x171b16);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
host.append(renderer.domElement);const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',label);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,50);let distance=8.8;camera.position.set(0,2.5,distance);camera.lookAt(0,2.03,0);
scene.add(new THREE.HemisphereLight(0xffedd1,0x302618,1.8));const key=new THREE.DirectionalLight(0xffe4ba,3);key.position.set(-3,6,5);scene.add(key);const rim=new THREE.DirectionalLight(0xc9e0ff,2);rim.position.set(3,4,-3);scene.add(rim);
const studio=new THREE.Scene();studio.add(new THREE.Mesh(new THREE.BoxGeometry(30,30,30),new THREE.MeshBasicMaterial({color:0x343832,side:THREE.BackSide})));
for(const [x,y,z,sx,sy,c] of [[-4,4,3,2,7,0xffedcf],[4,3,1,1,6,0xffffff],[0,8,0,6,4,0xffffff]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(sx,sy),new THREE.MeshBasicMaterial({color:c}));p.position.set(x,y,z);p.lookAt(0,2,0);studio.add(p)}
const pmrem=new THREE.PMREMGenerator(renderer),env=pmrem.fromScene(studio,.04);scene.environment=env.texture;pmrem.dispose();
const bottle=new THREE.Group();scene.add(bottle);
const profile=[[0,0],[.38,0],[.46,.035],[.495,.1],[.5,.18],[.5,2.5],[.49,2.63],[.45,2.76],[.35,2.93],[.23,3.08],[.175,3.18],[.17,3.66],[.185,3.69],[.185,3.74],[0,3.74]].map(([r,y])=>new THREE.Vector2(r,y));
const glass=new THREE.MeshPhysicalMaterial({color:0xfff3d9,roughness:.12,metalness:.08,transparent:true,opacity:.09,depthWrite:false,clearcoat:1,envMapIntensity:1.0});
const shell=new THREE.Mesh(new THREE.LatheGeometry(profile,96),glass);bottle.add(shell);
const liquidProfile=[[0,.1],[.41,.1],[.467,.14],[.468,2.55],[.46,2.65],[.38,2.82],[.25,3.0],[0,3.0]].map(([r,y])=>new THREE.Vector2(r,y));
const spirit=new THREE.Mesh(new THREE.LatheGeometry(liquidProfile,64),new THREE.MeshPhysicalMaterial({color:0xa85b14,roughness:.12,metalness:0,transmission:.6,thickness:1,attenuationColor:0xb86f10,attenuationDistance:.45,envMapIntensity:.4}));bottle.add(spirit);
const capMaterial=new THREE.MeshStandardMaterial({color:0x11100e,roughness:.55,metalness:.15});const cap=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.49,64),capMaterial);cap.position.y=3.91;bottle.add(cap);
for(const y of [3.68,3.75,4.13]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.19,.008,8,64),new THREE.MeshStandardMaterial({color:0x29251c,roughness:.6}));ring.rotation.x=Math.PI/2;ring.position.y=y;bottle.add(ring)}
const floor=new THREE.Mesh(new THREE.CylinderGeometry(.95,1.02,.08,80),new THREE.MeshStandardMaterial({color:0x171914,roughness:.65,metalness:.05}));floor.position.y=-.07;scene.add(floor);

async function labelTexture(url,darkBorder){const image=new Image();image.src=url;await image.decode();const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);const pixels=g.getImageData(0,0,c.width,c.height),d=pixels.data,w=c.width,h=c.height,seen=new Uint8Array(w*h),queue=new Uint32Array(w*h);let head=0,tail=0;
const background=i=>darkBorder?d[i*4]<40&&d[i*4+1]<45&&d[i*4+2]<65:d[i*4]>225&&d[i*4+1]>225&&d[i*4+2]>225;
const add=i=>{if(!seen[i]&&background(i)){seen[i]=1;queue[tail++]=i}};for(let x=0;x<w;x++){add(x);add((h-1)*w+x)}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1)}
while(head<tail){const i=queue[head++],x=i%w;d[i*4+3]=0;if(x>0)add(i-1);if(x<w-1)add(i+1);if(i>=w)add(i-w);if(i<w*(h-1))add(i+w)}
g.putImageData(pixels,0,0);let minX=w,minY=h,maxX=0,maxY=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}
const out=document.createElement('canvas');out.width=maxX-minX+1;out.height=maxY-minY+1;out.getContext('2d').drawImage(c,minX,minY,out.width,out.height,0,0,out.width,out.height);const texture=new THREE.CanvasTexture(out);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return texture}
const [frontMap,backMap]=await Promise.all([labelTexture(front,false),labelTexture(back,true)]);
for(const [texture,center,span,height,y] of [[frontMap,0,2.6,2.35,1.42],[backMap,Math.PI,3.0,2.15,1.4]]){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.505,.505,height,96,1,true,center-span/2,span),new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.15,toneMapped:false,side:THREE.FrontSide}));mesh.position.y=y;mesh.renderOrder=2;bottle.add(mesh)}
let queued=false,destroyed=false;function draw(){queued=false;if(!destroyed)renderer.render(scene,camera)}function invalidate(){if(!queued&&!destroyed){queued=true;requestAnimationFrame(draw)}}
function size(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();invalidate()}const resize=new ResizeObserver(size);resize.observe(host);size();
let active=null,lastX=0,lastY=0;canvas.addEventListener('pointerdown',e=>{active=e.pointerId;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging')});canvas.addEventListener('pointermove',e=>{if(active!==e.pointerId)return;bottle.rotation.y+=(e.clientX-lastX)*.012;bottle.rotation.x=THREE.MathUtils.clamp(bottle.rotation.x+(e.clientY-lastY)*.003,-.2,.2);lastX=e.clientX;lastY=e.clientY;invalidate()});const end=()=>{active=null;canvas.classList.remove('dragging')};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
function zoom(step){distance=THREE.MathUtils.clamp(distance+step,5.8,11);camera.position.z=distance;camera.lookAt(0,2.03,0);invalidate()}
canvas.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();zoom(e.deltaY*.008)},{passive:false});canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','+','-','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')bottle.rotation.y-=.15;if(e.key==='ArrowRight')bottle.rotation.y+=.15;if(e.key==='+')zoom(-.6);if(e.key==='-')zoom(.6);if(e.key==='Home')bottle.rotation.y=0;if(e.key==='End')bottle.rotation.y=Math.PI;invalidate()});
invalidate();return{front(){bottle.rotation.set(0,0,0);invalidate()},back(){bottle.rotation.set(0,Math.PI,0);invalidate()},zoomIn(){zoom(-.6)},zoomOut(){zoom(.6)},dispose(){destroyed=true;resize.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of [].concat(o.material))m.dispose()}});frontMap.dispose();backMap.dispose();env.dispose();renderer.dispose();canvas.remove()}};
}


