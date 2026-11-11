const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
async function run({reduced=false,saveData=false}={}){
const events={},mediaEvents={},documentEvents={},nodes={};let observe,loads=0;const source={dataset:{src:'hero.mp4'},hasAttribute(){return !!this.src},addEventListener(k,f){mediaEvents['source:'+k]=f}};
const video={paused:true,muted:false,querySelector:()=>source,pause(){this.paused=true;mediaEvents.pause?.()},load(){loads++},async play(){this.paused=false;mediaEvents.play?.()},addEventListener(k,f){mediaEvents[k]=f}};
const button={hidden:false,setAttribute(k,v){this[k]=v},querySelector:s=>nodes[s]??(nodes[s]={}),addEventListener(k,f){events['button:'+k]=f}};const gate={hidden:false};const motion={matches:reduced,addEventListener(k,f){events['motion:'+k]=f}};
const document={visibilityState:'visible',documentElement:{lang:'en'},getElementById:id=>({heroVideo:video,heroMotion:button,ageGate:gate}[id]),addEventListener(k,f){documentEvents[k]=f}};
const c={document,navigator:{connection:{saveData}},matchMedia:()=>motion,window:{addEventListener(k,f){events[k]=f}},IntersectionObserver:class{constructor(f){observe=f}observe(){}}};vm.runInNewContext(fs.readFileSync('github-pages/hero-video.js','utf8'),c);await Promise.resolve();
assert.equal(loads,0,'no video requests before age confirmation');gate.hidden=true;events['wa:age-state']();await Promise.resolve();assert.equal(video.paused,reduced||saveData);
if(reduced||saveData){events['button:click']();await Promise.resolve();assert.equal(video.paused,false,'explicit play allowed')}
assert.equal(source.src,'hero.mp4');assert.equal(loads,1);assert.equal(video.muted,true);assert.equal(button['aria-label'],'Pause video');
events['button:click']();assert.equal(video.paused,true);events['wa:age-state']();assert.equal(video.paused,true,'manual pause survives refresh');events['button:click']();await Promise.resolve();
observe([{isIntersecting:false}]);assert.equal(video.paused,true);observe([{isIntersecting:true}]);await Promise.resolve();assert.equal(video.paused,false);
document.visibilityState='hidden';documentEvents.visibilitychange();assert.equal(video.paused,true);document.visibilityState='visible';documentEvents.visibilitychange();await Promise.resolve();assert.equal(video.paused,false);
document.documentElement.lang='uk';events['wa:language']();assert.equal(button['aria-label'],'Призупинити відео');mediaEvents['source:error']();assert.equal(button.hidden,true);
}
(async()=>{await run();await run({reduced:true});await run({saveData:true});const html=fs.readFileSync('github-pages/index.html','utf8');assert.match(html,/<video[^>]*muted loop playsinline preload="none"/);assert.ok(!html.includes('youtube.com/embed'));console.log('PASS: deferred local video, mute, explicit play/pause, reduced motion/data saving, visibility/offscreen pause, Ukrainian control, error fallback.');})().catch(e=>{console.error(e);process.exit(1)});
