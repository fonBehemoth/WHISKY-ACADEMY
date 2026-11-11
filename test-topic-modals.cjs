const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class El{
 constructor(){this.listeners={};this.children=[];this.attrs={};this.dataset={};this.isConnected=true;this.textContent=''}
 setAttribute(k,v){this.attrs[k]=v}addEventListener(k,f){this.listeners[k]=f}replaceChildren(...c){this.children=c}focus(){this.focused=true}
}
const dialog=new El(),grid=new El(),close=new El(),heading=new El(),body=new El(),sources=new El(),eyebrow=new El(),gate={hidden:true};
dialog.querySelector=s=>({'h2':heading,'.topic-body':body,'.topic-close':close,'.topic-sources':sources,'.eyebrow':eyebrow}[s]);
dialog.showModal=()=>dialog.open=true;dialog.close=()=>{dialog.open=false;dialog.listeners.close()};dialog.getBoundingClientRect=()=>({left:100,top:100,right:800,bottom:700});
const buttons=Array.from({length:16},(_,i)=>{const e=new El();e.dataset.theme=String(i);return e});grid.contains=e=>buttons.includes(e);grid.querySelector=s=>buttons[Number(s.match(/"(\d+)"/)[1])];
const classes=new Set(),events={};
const ctx={document:{documentElement:{lang:'uk'},getElementById:id=>({topicDialog:dialog,themes:grid,ageGate:gate}[id]),createElement:()=>new El(),body:{classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)}}},window:{addEventListener:(k,f)=>events[k]=f}};
for(const f of ['page-data.js','academy-data.js','topics-data.js','topics-modal.js'])vm.runInNewContext(fs.readFileSync('github-pages/'+f,'utf8'),ctx);
vm.runInNewContext('globalThis.expectedTopics=whiskyTopics',ctx);
const open=i=>grid.listeners.click({target:{closest:()=>buttons[i]}});
for(const lang of ['en','de','uk','fr','it']){ctx.document.documentElement.lang=lang;events['wa:language']();for(let i=0;i<16;i++){open(i);assert.equal(dialog.open,true);assert.deepEqual(body.children.map(p=>p.textContent),Array.from(ctx.expectedTopics[i][lang]));assert.equal(body.children[0].className,'topic-subtitle');assert.ok(heading.textContent.length>5);assert.equal(sources.children.length,0);assert.ok(close.focused);assert.ok(classes.has('topic-open'));close.listeners.click();assert.equal(dialog.open,false);assert.ok(buttons[i].focused);assert.ok(!classes.has('topic-open'))}}
open(0);dialog.listeners.click({target:dialog,clientX:200,clientY:200});assert.equal(dialog.open,true);dialog.listeners.click({target:dialog,clientX:50,clientY:50});assert.equal(dialog.open,false);
gate.hidden=false;open(0);assert.equal(dialog.open,false);gate.hidden=true;
buttons[0].dataset.theme='__proto__';open(0);assert.equal(dialog.open,false);
assert.ok(fs.readFileSync('github-pages/tastings.html','utf8').includes('aria-labelledby="topicTitle"'));
console.log('PASS: all 16 approved programmes in EN/DE/UK/FR/IT; complete paragraphs, subtitles, close control, backdrop, scroll-lock state, focus return, invalid index and age gate guard. Native Escape/focus trapping require browser verification.');
