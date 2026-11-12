const fs=require('fs'),vm=require('vm'),a=require('assert/strict'),renderSilkFrame=require('./github-pages/silk-field.js');
const events={},frames=new Map();let next=0,paints=0,snapshot;
const gate={hidden:true},section={classList:{contains(){return false},add(){}},prepend(c){this.canvas=c}};
const context2d={createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(p){paints++;snapshot=Buffer.from(p.data)}};
const document={hidden:false,documentElement:{lang:'en'},getElementById:id=>id==='ageGate'?gate:null,querySelectorAll:s=>s==='main section'?[section]:[],querySelector:()=>null,addEventListener(k,f){events[k]=f},createElement(){return {setAttribute(){},getContext(){return context2d}}}};
const reduced={matches:false,addEventListener(k,f){this.change=f}},observers=[];
vm.runInNewContext(fs.readFileSync('github-pages/nov11-interactions.js','utf8'),{document,window:{innerWidth:390,addEventListener(k,f){events[k]=f}},URL,matchMedia:()=>reduced,getComputedStyle:()=>({backgroundColor:'rgb(27,32,24)'}),IntersectionObserver:class{constructor(cb){this.cb=cb;observers.push(this)}observe(){}},renderSilkFrame,requestAnimationFrame:f=>{frames.set(++next,f);return next},cancelAnimationFrame:id=>frames.delete(id)});
a.equal(section.canvas.width,192);a.equal(section.canvas.height,112);a.equal(paints,1);a.equal(frames.size,0);
observers[0].cb([{target:section,isIntersecting:true}]);a.equal(frames.size,1);
const tick=time=>{const [id,f]=frames.entries().next().value;frames.delete(id);f(time)};
tick(100);const first=Buffer.from(snapshot);tick(1300);a.notDeepEqual(snapshot,first);a.equal(frames.size,1);
document.hidden=true;events.visibilitychange();a.equal(frames.size,0);document.hidden=false;events.pageshow();a.equal(frames.size,1);tick(1500);
gate.hidden=false;events['wa:age-state']();a.equal(frames.size,0);gate.hidden=true;events['wa:age-state']();a.equal(frames.size,1);
reduced.matches=true;reduced.change();a.equal(frames.size,0);reduced.matches=false;reduced.change();a.equal(frames.size,1);
observers[0].cb([{target:section,isIntersecting:false}]);a.equal(frames.size,0);
const html=fs.readFileSync('github-pages/index.html','utf8');a.equal((html.match(/data-author-step=/g)||[]).length,2);a.ok(!html.includes('class="author-autoplay"'));
for(const file of fs.readdirSync('github-pages').filter(f=>f.endsWith('.html'))){const h=fs.readFileSync('github-pages/'+file,'utf8');a.equal((h.match(/class="logo-sheen"/g)||[]).length,2,file)}
console.log('PASS: mobile 192x112 animated frames, page-return restart, age/visibility/reduced-motion/offscreen guards, two gallery arrows and two logo light masks on seven pages.');
