(()=>{
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const counters=[...document.querySelectorAll('.city-number')];
 const completed=new WeakSet();let visible=false;
 // Preserve inline emphasis and reveal spans when removing terminal punctuation.
 function headings(){document.querySelectorAll('h1,h2,h3,h4,h5,h6,.eyebrow,.hero-sub,.page-intro>p,.home-collection-intro,.home-invitation-closing').forEach(el=>{
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node,last;
  while(node=walker.nextNode()){
   if(node.textContent.trim())last=node;
   node.textContent=node.textContent.replace(/(?<!\d)\.(?=\s|$)/g,'');
  }
 })}
 function start(){
  if(!visible||document.hidden||document.getElementById('ageGate')?.hidden===false)return;
  counters.forEach(el=>{
   if(completed.has(el)||reduced.matches)return;
   completed.add(el);const value=el.textContent.trim();if(!/^\d+$/.test(value))return;
   el.setAttribute('aria-label',value);el.classList.add('counter-ready');el.textContent='';
   [...value].forEach((digit,i)=>{
    const mask=document.createElement('span'),reel=document.createElement('span');
    mask.className='counter-digit';mask.setAttribute('aria-hidden','true');reel.className='counter-reel';
    const steps=10+Number(digit);
    for(let n=0;n<=steps;n++){const row=document.createElement('span');row.textContent=String(n%10);reel.append(row)}
    mask.append(reel);el.append(mask);
    const target=`translateY(-${steps/(steps+1)*100}%)`;
    const animation=reel.animate([{transform:'translateY(0)'},{transform:target}],{duration:1450+i*220,easing:'cubic-bezier(.2,.65,.25,1)',fill:'forwards'});
    // Retire the reel after settling: adjacent glyph overhangs must not remain visible.
    const settle=()=>{animation.cancel();reel.textContent=digit;reel.style.transform='none'};
    animation.onfinish=settle;
    reduced.addEventListener('change',()=>{if(reduced.matches)settle()},{once:true});
   });
  });
 }
 const section=document.querySelector('#community');
 if(section&&counters.length)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start()},{threshold:.25}).observe(section);
 window.addEventListener('wa:age-state',start);document.addEventListener('visibilitychange',start);
 window.addEventListener('wa:language',headings);headings();
})();
