const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
function element(){return {attrs:{},dataset:{},events:{},children:[],classList:{add(){}},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},addEventListener(k,f){(this.events[k]??=[]).push(f)},emit(k,e={}){for(const f of this.events[k]||[])f(e)},append(...v){this.children.push(...v)},matches(){return false},contains(){return false},querySelector(){return null},querySelectorAll(){return []}}}
const events={},listen=(key,f)=>{const previous=events[key];events[key]=(...args)=>{previous?.(...args);f(...args)}},timers=new Map();let next=0;
const gallery=element(),footer=element(),output=element(),gate={hidden:true},dialog=element(),image=element(),photoButtons=Array.from({length:3},(_,i)=>{const b=element();b.dataset.photo=`photo-${i}.webp`;b.querySelector=()=>({alt:`Photo ${i}`});b.closest=()=>({querySelectorAll:()=>photoButtons});return b});
const dots=Array.from({length:4},(_,i)=>{const e=element();e.attrs['aria-pressed']=String(i===0);e.click=()=>{dots.forEach((d,j)=>d.attrs['aria-pressed']=String(j===i));gallery.emit('click')};return e});
gallery.querySelector=s=>s==='output'?output:footer;gallery.querySelectorAll=()=>dots;dialog.querySelector=()=>image;
const educational={href:'https://example.test/tastings.html?lang=en#academy-method'},cta=element();
const group=element(),ua=element(),separator=element();ua.previousElementSibling=separator;group.querySelector=()=>ua;
const doc={hidden:false,activeElement:null,documentElement:{lang:'en'},createElement:element,getElementById:id=>({ageGate:gate,'author-moments':gallery,lightbox:dialog})[id],querySelector:s=>s==='#homeCollectionCta a'?cta:null,querySelectorAll:s=>s==='.languages'?[group]:s==='#homeFormats a'?[{},{},{},educational]:s==='[data-photo]'?photoButtons:s==='[data-lightbox-direction]'?dialog.children:[],addEventListener(k,f){listen('doc:'+k,f)}};
const observers=[],media={matches:false,addEventListener(k,f){const old=this.change;this.change=()=>{old?.();f()}}};
const context={document:doc,window:{addEventListener(k,f){listen(k,f)}},matchMedia:()=>media,URL,setTimeout(f,ms){const id=++next;timers.set(id,{f,ms});return id},clearTimeout(id){timers.delete(id)},getComputedStyle:()=>({backgroundColor:'transparent'}),IntersectionObserver:class{constructor(cb){this.cb=cb;observers.push(this)}observe(){}},requestAnimationFrame(){throw Error('No visible animated background expected')},cancelAnimationFrame(){}};
vm.runInNewContext(fs.readFileSync('github-pages/nov11-interactions.js','utf8'),context);
assert.equal(group.children.at(-1),ua);assert.ok(educational.href.endsWith('?lang=en#main'));
for(const lang of ['en','de','fr','it','uk']){doc.documentElement.lang=lang;events['wa:language']();assert.ok(cta.textContent.length>15);assert.ok(dialog.children.every(b=>b.attrs['aria-label']))}
assert.equal(cta.textContent,'Познайомитися зі зразками колекції');
observers[0].cb([{isIntersecting:true}]);assert.equal(timers.size,1);const tick=[...timers.values()][0];timers.clear();tick.f();assert.equal(dots[1].attrs['aria-pressed'],'true');
gallery.emit('mouseenter');assert.equal(timers.size,0);gallery.emit('mouseleave');assert.equal(timers.size,1);
footer.children[0].emit('click');assert.equal(timers.size,0);footer.children[0].emit('click');assert.equal(timers.size,1);
gate.hidden=false;events['wa:age-state']();assert.equal(timers.size,0);gate.hidden=true;events['wa:age-state']();assert.equal(timers.size,1);
doc.hidden=true;events['doc:visibilitychange']();assert.equal(timers.size,0);doc.hidden=false;events['doc:visibilitychange']();assert.equal(timers.size,1);
media.matches=true;media.change();assert.equal(timers.size,0);
photoButtons[1].emit('click');dialog.children[1].emit('click');assert.equal(image.src,'photo-2.webp');dialog.children[1].emit('click');assert.equal(image.src,'photo-0.webp');dialog.emit('keydown',{key:'ArrowLeft',preventDefault(){}});assert.equal(image.src,'photo-2.webp');
dialog.emit('pointerdown',{pointerType:'touch',clientX:150,clientY:30});dialog.emit('pointerup',{clientX:30,clientY:35});assert.equal(image.src,'photo-0.webp');
console.log('PASS: UA last, five translated CTAs, education at page start, automatic slides with hover/manual/visibility/age/reduced-motion pauses, lightbox arrows/wrap/keyboard/swipe.');
