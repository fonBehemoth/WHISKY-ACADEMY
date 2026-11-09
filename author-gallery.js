/* Four photographs, driven by ordinary document scroll. 9 November 2026. */
(()=>{
 'use strict';
 const section=document.getElementById('author-moments');if(!section)return;
 const viewport=section.querySelector('.author-gallery-viewport'),track=section.querySelector('.author-gallery-track');
 const cards=Array.from(track.children),prev=section.querySelector('.author-gallery-prev'),next=section.querySelector('.author-gallery-next');
 const progress=section.querySelector('progress'),counter=section.querySelector('output'),header=document.querySelector('header'),topLink=document.querySelector('.back-top'),philosophy=document.getElementById('philosophy');
 const desktop=matchMedia('(min-width:960px) and (hover:hover) and (pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let pinned=false,distance=0,hold=0,pinTop=0,start=0,index=0,targets=[],pending=false;
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 const allowed=()=>document.getElementById('ageGate')?.hidden!==false;
 const behavior=()=>reduced.matches?'instant':'smooth';
 function update(){
  pending=false;
  if(pinned)start=section.getBoundingClientRect().top+window.scrollY-pinTop;
  const x=pinned?clamp(window.scrollY-start-hold,0,distance):viewport.scrollLeft;
  if(pinned)track.style.transform=`translate3d(${-x}px,0,0)`;
  let nearest=0;for(let i=1;i<targets.length;i++)if(Math.abs(targets[i]-x)<Math.abs(targets[nearest]-x))nearest=i;
  index=nearest;counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  prev.disabled=index===0;next.disabled=index===cards.length-1;progress.value=distance?clamp(x/distance,0,1):0;
  const passed=philosophy.getBoundingClientRect().bottom<=header.getBoundingClientRect().height+1;
  topLink.classList.toggle('is-visible',passed&&allowed());
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}
 function measure(){
  // Use the actual fixed-header height, including its compact scrolled state.
  pinTop=Math.ceil(header.getBoundingClientRect().height)+8;
  distance=Math.max(0,track.scrollWidth-viewport.clientWidth);
  pinned=desktop.matches&&!reduced.matches&&window.innerHeight>=600&&distance>0;
  section.classList.toggle('is-pinned',pinned);
  if(pinned){
   const pinHeight=window.innerHeight-pinTop;
   const heading=section.querySelector('.author-gallery-heading').getBoundingClientRect().height;
   const footer=section.querySelector('.author-gallery-footer').getBoundingClientRect().height;
   const imageHeight=Math.max(180,Math.min(560,pinHeight-heading-footer-137));
   hold=Math.min(140,pinHeight*.18);
   section.style.setProperty('--author-gallery-top',pinTop+'px');
   section.style.setProperty('--author-gallery-pin-height',pinHeight+'px');
   section.style.setProperty('--author-gallery-image-height',imageHeight+'px');
   section.style.setProperty('--author-gallery-height',(pinHeight+distance+2*hold)+'px');
   viewport.scrollLeft=0;
  }else{
   track.style.removeProperty('transform');
   for(const prop of ['--author-gallery-height','--author-gallery-top','--author-gallery-pin-height','--author-gallery-image-height'])section.style.removeProperty(prop);
  }
  const first=cards[0].offsetLeft;targets=cards.map(card=>clamp(card.offsetLeft-first,0,distance));
  update();
 }
 function go(to){
  if(!allowed())return;
  to=clamp(to,0,cards.length-1);
  if(pinned){start=section.getBoundingClientRect().top+window.scrollY-pinTop;window.scrollTo({top:start+hold+targets[to],behavior:behavior()});}
  else viewport.scrollTo({left:targets[to],behavior:behavior()});
 }
 prev.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));
 viewport.addEventListener('keydown',e=>{
  if(e.target!==viewport||e.altKey||e.ctrlKey||e.metaKey)return;
  const moves={ArrowLeft:index-1,ArrowRight:index+1,Home:0,End:cards.length-1};
  if(Object.hasOwn(moves,e.key)){e.preventDefault();go(moves[e.key]);}
 });
 // The skip link is always available, including when the animation is active.
 section.querySelector('.author-gallery-skip').addEventListener('click',e=>{
  if(!allowed())return;e.preventDefault();
  window.scrollTo({top:philosophy.getBoundingClientRect().top+window.scrollY-header.getBoundingClientRect().height-12,behavior:behavior()});
  philosophy.setAttribute('tabindex','-1');philosophy.focus({preventScroll:true});
 });
 topLink.addEventListener('click',e=>{
  if(!allowed())return;e.preventDefault();window.scrollTo({top:0,behavior:behavior()});
  const main=document.getElementById('main');main.setAttribute('tabindex','-1');main.focus({preventScroll:true});
 });
 function language(){
  const lang=document.documentElement.lang,t=Object.hasOwn(authorGalleryCopy,lang)?authorGalleryCopy[lang]:authorGalleryCopy.en;
  section.querySelectorAll('[data-author-text]').forEach(el=>el.textContent=t[el.dataset.authorText]);
  section.querySelectorAll('[data-author-photo]').forEach(el=>el.alt=t.alts[Number(el.dataset.authorPhoto)]);
  section.querySelectorAll('[data-author-caption]').forEach(el=>el.textContent=t.captions[Number(el.dataset.authorCaption)]);
  viewport.setAttribute('aria-label',t.gallery);progress.setAttribute('aria-label',t.progress);
  prev.setAttribute('aria-label',t.previous);next.setAttribute('aria-label',t.next);
  topLink.title=topLink.getAttribute('aria-label')||'';measure();
 }
 section.classList.add('is-ready');
 window.addEventListener('scroll',schedule,{passive:true});viewport.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',measure);window.addEventListener('wa:language',language);window.addEventListener('wa:age-state',measure);
 desktop.addEventListener('change',measure);reduced.addEventListener('change',measure);
 if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(measure);observer.observe(header);observer.observe(viewport);}
 document.fonts?.ready.then(measure);language();
})();
