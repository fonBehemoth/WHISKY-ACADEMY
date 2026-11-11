// Local-only negative tests. This file is never included in github-pages or site/dist.
(async()=>{
const violations=[];document.addEventListener('securitypolicyviolation',e=>violations.push(e.effectiveDirective));
let evalBlocked=false,fetchBlocked=false;
try{eval('window.unexpectedEval=true')}catch(e){evalBlocked=e instanceof EvalError}
const inline=document.createElement('script');inline.textContent='window.unexpectedInline=true';document.body.append(inline);
const dataScript=document.createElement('script');dataScript.src='data:text/javascript,window.unexpectedData=true';document.body.append(dataScript);
try{await fetch('/__blocked_network_probe')}catch(e){fetchBlocked=e instanceof TypeError}
const frame=document.createElement('iframe');frame.src='/index.html';document.body.append(frame);
frame.name='blocked-test-frame';const form=document.createElement('form');form.method='post';form.action='/__blocked_form_probe';document.body.append(form);form.requestSubmit();
setTimeout(()=>{const results={evalBlocked,inlineBlocked:window.unexpectedInline!==true,dataScriptBlocked:window.unexpectedData!==true,fetchBlocked,frameBlocked:violations.includes('frame-src'),formBlocked:violations.includes('form-action'),violations:[...new Set(violations)]};document.getElementById('results').textContent=JSON.stringify(results,null,2);document.body.dataset.passed=String(Object.entries(results).filter(([k])=>k!=='violations').every(([,v])=>v===true))},150);
})();

