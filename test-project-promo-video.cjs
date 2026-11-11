const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const name of ['index.html','projects.html']){
 const h=fs.readFileSync('github-pages/'+name,'utf8'),tag=h.match(/<video\b[^>]*id="linkwoodPromoVideo"[^>]*>/)?.[0];assert.ok(tag);
 for(const key of ['muted','loop','playsinline','preload="none"','disablepictureinpicture'])assert.ok(tag.includes(key));
 assert.ok(!tag.includes(' controls'));assert.ok(h.includes('data-src="linkwood-promo.mp4"'));assert.ok(!h.includes('<iframe'));assert.ok(h.includes("frame-src 'none'"));assert.ok(!h.includes('class="project-promo-direct"'));assert.ok(!h.includes('https://www.youtube.com/shorts/vR-8fbn0NhU'));
}
assert.ok(fs.statSync('github-pages/linkwood-promo.mp4').size<1e6);
function harness({reduce=false,saveData=false,blocked=false}={}){
 let observer;const winEvents={},docEvents={};
 const el=()=>({attrs:{},events:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.events[k]=f}});
 const source=el();source.dataset={src:'linkwood-promo.mp4'};source.hasAttribute=k=>k==='src'&&Boolean(source.src);
 const video=el();Object.assign(video,{paused:true,muted:false,loads:0,plays:0,querySelector:()=>source,load(){this.loads++},async play(){this.plays++;if(blocked)throw Error('Autoplay blocked');this.paused=false;this.events.play?.()},pause(){if(!this.paused){this.paused=true;this.events.pause?.()}}});
 const cover=el(),motion=el(),label={},motionLabel={},playIcon={},pauseIcon={},direct={},gate={hidden:false};motion.hidden=true;
 motion.querySelector=s=>({'.promo-motion-label':motionLabel,'.promo-motion-play':playIcon,'.promo-motion-pause':pauseIcon})[s];
 const shell={querySelector:s=>({'video':video,'.project-promo-play':cover,'.project-promo-motion':motion,'.project-promo-label':label})[s],parentElement:{querySelector:()=>direct}};
 const reduced={matches:reduce,addEventListener(k,f){this.change=f}};
 const doc={documentElement:{lang:'uk'},visibilityState:'visible',getElementById:id=>id==='ageGate'?gate:shell,addEventListener(k,f){docEvents[k]=f},createElement(){throw Error('No external player may be created')}};
 vm.runInNewContext(fs.readFileSync('github-pages/project-promo-video.js','utf8'),{document:doc,window:{addEventListener(k,f){winEvents[k]=f}},navigator:{connection:{saveData,addEventListener(){}}},matchMedia:()=>reduced,IntersectionObserver:class{constructor(f){observer=f}observe(){}}});
 return {video,source,cover,motion,motionLabel,gate,doc,winEvents,docEvents,reduced,view(visible){observer([{isIntersecting:visible}])}};
}
(async()=>{
 const settle=()=>new Promise(resolve=>setImmediate(resolve));
 const h=harness();h.view(true);assert.ok(!h.source.src);h.cover.events.click();assert.ok(!h.source.src);
 h.gate.hidden=true;h.winEvents['wa:age-state']();await settle();assert.equal(h.source.src,'linkwood-promo.mp4');assert.equal(h.video.paused,false);assert.equal(h.video.muted,true);assert.equal(h.video.loads,1);assert.match(h.motionLabel.textContent,/Призупинити/);
 h.motion.events.click();await settle();assert.equal(h.video.paused,true);const n=h.video.plays;h.view(false);h.view(true);await settle();assert.equal(h.video.plays,n,'Manual pause survives re-entry');
 h.motion.events.click();await settle();assert.equal(h.video.paused,false);h.view(false);assert.equal(h.video.paused,true);h.view(true);await settle();assert.equal(h.video.paused,false);assert.equal(h.video.loads,1,'Video file must not be reloaded on re-entry');
 h.doc.visibilityState='hidden';h.docEvents.visibilitychange();assert.equal(h.video.paused,true);
 for(const config of [{reduce:true},{saveData:true}]){const t=harness(config);t.view(true);t.gate.hidden=true;t.winEvents['wa:age-state']();await settle();assert.ok(!t.source.src);t.cover.events.click();await settle();assert.equal(t.video.paused,false)}
 const off=harness();off.gate.hidden=true;off.winEvents['wa:age-state']();assert.ok(!off.source.src);off.view(true);await settle();assert.equal(off.video.paused,false);
 const b=harness({blocked:true});b.gate.hidden=true;b.view(true);await settle();assert.equal(b.video.paused,true);assert.equal(b.motion.hidden,false,'Show Play if browser refuses autoplay');
 h.source.events.error();assert.equal(h.cover.hidden,false);assert.equal(h.motion.hidden,true);
 const race=harness();race.gate.hidden=true;race.view(true);race.view(false);await settle();assert.equal(race.video.paused,true,'Offscreen state wins a pending play promise');
 assert.ok(fs.readFileSync('github-pages/linkwood-media.js','utf8').includes('S2U7kPjaxWg'));
 console.log('PASS: native video with no platform controls or iframe, muted/loop/inline, under 1 MB, deferred source until age and visibility, manual/offscreen/tab pause, one load across repeats, reduced-motion/saveData, blocked-autoplay/error fallback and pending-play race.');
})().catch(e=>{console.error(e);process.exitCode=1});
