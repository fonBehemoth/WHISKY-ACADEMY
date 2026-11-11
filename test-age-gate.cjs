const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const nodes=new Map();function node(id){if(!nodes.has(id))nodes.set(id,{hidden:false,checked:false,handlers:{},focus(){},addEventListener(k,fn){this.handlers[k]=fn}});return nodes.get(id)}
const store=()=>{const m=new Map();return{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)}};
const background=[{inert:false},{inert:false},{inert:false}];
const context={localStorage:store(),sessionStorage:store(),document:{getElementById:node,body:{classList:{toggle(){}}},querySelector:()=>node('wordmark'),querySelectorAll:s=>s.includes('body>')?background:[]}};
let code=fs.readFileSync('github-pages/app.js','utf8').split('const arrow=')[0];
code+=';globalThis.api={initAgeGate,ageApproved,setGate,copy}';vm.runInNewContext(code,context);const api=context.api;
api.initAgeGate();assert.equal(node('ageGate').hidden,false);assert.ok(background.every(x=>x.inert));
node('ageNo').handlers.click();assert.equal(node('ageQuestion').hidden,true);assert.equal(node('ageDeclined').hidden,false);assert.equal(api.ageApproved(),false);
node('ageBack').handlers.click();assert.equal(node('ageQuestion').hidden,false);
node('ageYes').handlers.click();assert.equal(node('ageGate').hidden,true);assert.ok(background.every(x=>!x.inert));assert.equal(context.sessionStorage.getItem('wa-adult-v1'),'yes');assert.equal(context.localStorage.getItem('wa-adult-v1'),null);
node('ageRemember').checked=true;node('ageYes').handlers.click();assert.equal(context.localStorage.getItem('wa-adult-v1'),'yes');
assert.deepEqual(Object.keys(api.copy.uk).sort(),Object.keys(api.copy.en).sort());
console.log('PASS: denied access, return, session acceptance, optional device persistence, background lock, locale parity.');
