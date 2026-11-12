// Editorial entrances inspired by 21 TSI. No scroll interception or layout changes.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 if(!('IntersectionObserver' in window)||!Element.prototype.animate)return;
 const prepared=new WeakSet(),finished=new WeakSet(),running=new Map();
 const selector='main h1,main h2,main h3,main h4,main p,main li,main label,main legend,main [data-t],main [data-n],main [data-fact],main [data-name],main .origin-list,main .section-mark,main .programme-subtitle,main blockquote,main figcaption,main dt,main dd,main summary,main .theme-trigger,main .hero-proof,main .city-number,main .cities h3,main .cities p,main .text-link,main .button,main img,footer .wordmark,footer p,footer nav,footer .footer-bottom,header .wordmark,header #nav,header .header-actions,dialog h2,dialog p,dialog li,dialog img';
 const allowed=()=>document.getElementById('ageGate')?.hidden!==false;
 const easing='cubic-bezier(.19,1,.22,1)';
 function visible(el){return el.isConnected&&!el.closest('[hidden],[aria-hidden="true"]')&&el.getClientRects().length>0}
 function finish(el){observer.unobserve(el);const animations=running.get(el);animations?.forEach(a=>a.cancel());running.delete(el);el.classList.remove('editorial-pending');finished.add(el)}
 function words(el){
  if(el.querySelector('.editorial-word'))return;
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())if(walker.currentNode.textContent.trim()&&!walker.currentNode.parentElement.closest('svg,script,style'))nodes.push(walker.currentNode);
  nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){fragment.append(document.createTextNode(part));return}const mask=document.createElement('span'),word=document.createElement('span');mask.className='editorial-word-mask';word.className='editorial-word';word.textContent=part;mask.append(word);fragment.append(mask)});node.replaceWith(fragment)});
 }
 function enter(el){
  if(finished.has(el)){observer.unobserve(el);return}
  if(!visible(el)||!allowed())return;
  observer.unobserve(el);el.classList.remove('editorial-pending');
  if(reduced.matches){finish(el);return}
  let animations=[];
  if(/^H[1-4]$/.test(el.tagName)){
   const parts=[...el.querySelectorAll('.editorial-word')];
   parts.forEach((word,i)=>animations.push(word.animate([{transform:'translateY(110%) rotate(6deg)',opacity:0},{transform:'translateY(0) rotate(0deg)',opacity:1}],{duration:800,delay:Math.min(i*55,380),easing,fill:'backwards'})));
  }else if(el.tagName==='IMG'){
   animations.push(el.animate([{clipPath:'inset(0 0 100% 0)',transform:'scale(1.08)'},{clipPath:'inset(0 0 0 0)',transform:'scale(1)'}],{duration:1400,easing,fill:'backwards'}));
  }else{
   const siblings=el.parentElement?[...el.parentElement.children].filter(n=>n.matches?.('p,blockquote,figcaption,.text-link,.button,.theme-trigger,.hero-proof')):[];
   const delay=Math.min(Math.max(0,siblings.indexOf(el))*90,270);
   animations.push(el.animate([{transform:'translateY(32px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:850,delay,easing,fill:'backwards'}));
  }
  running.set(el,animations);finished.add(el);
  Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>{if(running.get(el)===animations)running.delete(el)});
 }
 const observer=new IntersectionObserver(entries=>{for(const item of entries){if(!item.target.isConnected)observer.unobserve(item.target);else if(item.isIntersecting)enter(item.target)}},{threshold:0,rootMargin:'0px 0px -7% 0px'});
 function scan(){
  if(!allowed())return;
  mutations.disconnect();
  document.querySelectorAll(selector).forEach(el=>{
   if(el.closest('.hero-image,.hero-video,.brand-name,.brand-symbol,#ageGate')||el.classList.contains('brand-symbol')||el.classList.contains('hero-image'))return;
   if(!visible(el))return;
   // A parent text unit owns its descendants; avoid double transforms in buttons/quotes.
   if(el.parentElement?.closest(selector))return;
   if(finished.has(el))return;
   // Language renderers replace word spans while retaining the heading node.
   if(/^H[1-4]$/.test(el.tagName))words(el);
   if(!prepared.has(el)){prepared.add(el);if(!reduced.matches)el.classList.add('editorial-pending');observer.observe(el)}
  });
  mutations.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','open','aria-hidden']});
 }
 let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()})}
 const mutations=new MutationObserver(records=>{records.forEach(r=>{if(r.type==='childList'&&r.target instanceof Element){finished.delete(r.target);prepared.delete(r.target)}});schedule()});
 window.addEventListener('wa:age-state',schedule);
 window.addEventListener('wa:language',()=>{document.querySelectorAll(selector).forEach(el=>{finish(el);finished.delete(el);prepared.delete(el)});schedule()});
 document.addEventListener('toggle',schedule,true);
 document.addEventListener('focusin',e=>{let el=e.target;while(el instanceof Element){if(prepared.has(el))finish(el);el=el.parentElement}});
 reduced.addEventListener('change',()=>{if(reduced.matches){document.querySelectorAll('.editorial-pending').forEach(finish);for(const el of running.keys())finish(el)}else schedule()});
 document.fonts?.ready.then(schedule);schedule();
})();
