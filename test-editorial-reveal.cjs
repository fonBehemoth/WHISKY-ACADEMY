const fs=require('fs'),vm=require('vm'),a=require('assert/strict');
class Element{
 constructor(tag){this.tagName=tag;this.isConnected=true;this.parentElement=null;this.animations=[];this.words=[];this.hidden=false;this.classList={items:new Set(),add(k){this.items.add(k)},remove(k){this.items.delete(k)},contains(k){return this.items.has(k)}}}
 closest(){return this.hidden?{}:null}getClientRects(){return this.hidden?[]:[{}]}
 querySelector(){return this.words[0]||null}querySelectorAll(){return this.words}
 animate(frames,options){const animation={frames,options,finished:Promise.resolve(),cancelled:false,cancel(){this.cancelled=true}};this.animations.push(animation);return animation}
}
const heading=new Element('H1');heading.words=[new Element('SPAN'),new Element('SPAN'),new Element('SPAN')];
const paragraph=new Element('P'),photo=new Element('IMG'),latePhoto=new Element('IMG');latePhoto.hidden=true;
const targets=[heading,paragraph,photo,latePhoto],events={},queue=[],observers=[],gate={hidden:false};
const document={body:{},getElementById:()=>gate,querySelectorAll:s=>s==='.editorial-pending'?targets.filter(e=>e.classList.contains('editorial-pending')):targets,addEventListener(k,f){events[k]=f}};
const reduced={matches:false,addEventListener(k,f){this.change=f}};
class IO{constructor(cb){this.cb=cb;this.targets=new Set();observers.push(this)}observe(e){this.targets.add(e)}unobserve(e){this.targets.delete(e)}}
class MO{constructor(cb){this.cb=cb;MO.instance=this}disconnect(){}observe(){}}
const context={Element,document,window:{IntersectionObserver:IO,addEventListener(k,f){events[k]=f}},matchMedia:()=>reduced,IntersectionObserver:IO,MutationObserver:MO,requestAnimationFrame:f=>queue.push(f),Promise};
const flush=()=>{while(queue.length)queue.shift()()};
vm.runInNewContext(fs.readFileSync('github-pages/editorial-reveal.js','utf8'),context);flush();a.equal(observers[0].targets.size,0);
gate.hidden=true;events['wa:age-state']();flush();a.equal(observers[0].targets.size,3);a.ok(paragraph.classList.contains('editorial-pending'));
observers[0].cb([{target:heading,isIntersecting:true},{target:paragraph,isIntersecting:true},{target:photo,isIntersecting:true}]);
a.deepEqual(heading.words.map(w=>w.animations[0].options.delay),[0,55,110]);a.equal(photo.animations[0].options.duration,1400);a.ok(!paragraph.classList.contains('editorial-pending'));a.equal(observers[0].targets.size,0);
// Already shown nodes do not replay on ordinary DOM updates elsewhere.
MO.instance.cb([]);flush();a.equal(observers[0].targets.size,0);
// A newly visible author frame is observed when aria-hidden changes.
latePhoto.hidden=false;MO.instance.cb([]);flush();a.ok(observers[0].targets.has(latePhoto));
// Keyboard focus must reveal a pending element immediately.
events.focusin({target:latePhoto});a.ok(!latePhoto.classList.contains('editorial-pending'));
// Language switching re-arms retained heading nodes as well as replacement content.
events['wa:language']();flush();a.ok(observers[0].targets.has(heading));
reduced.matches=true;reduced.change();a.ok(targets.every(e=>!e.classList.contains('editorial-pending')));
observers[0].cb([{target:paragraph,isIntersecting:true}]);a.equal(paragraph.animations.length,1);
for(const file of fs.readdirSync('github-pages').filter(f=>f.endsWith('.html'))){const h=fs.readFileSync('github-pages/'+file,'utf8');a.equal((h.match(/src="editorial-reveal.js/g)||[]).length,1);a.ok(h.includes('editorial-reveal.css'))}
console.log('PASS: age guard, heading stagger, photo mask, once-only entrance, new gallery frames, keyboard focus, language re-render, reduced motion and seven-page integration.');
