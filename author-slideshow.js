// Manual stacked slideshow. Ordinary page scrolling never advances a slide.
(()=>{
 const section=document.getElementById('author-moments');if(!section)return;
 const viewport=section.querySelector('.author-gallery-viewport'),cards=Array.from(section.querySelectorAll('.author-gallery-card')),dots=Array.from(section.querySelectorAll('[data-author-index]')),counter=section.querySelector('output');let index=0,touch=null;
 const allowed=()=>document.getElementById('ageGate')?.hidden!==false;
 function show(i){if(!allowed()||!Number.isInteger(i))return;index=(i+cards.length)%cards.length;cards.forEach((c,n)=>{c.classList.toggle('is-active',n===index);c.setAttribute('aria-hidden',String(n!==index))});dots.forEach((d,n)=>d.setAttribute('aria-pressed',String(n===index)));counter.textContent=String(index+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');}
 section.querySelector('.author-gallery-prev').addEventListener('click',()=>show(index-1));section.querySelector('.author-gallery-next').addEventListener('click',()=>show(index+1));dots.forEach(d=>d.addEventListener('click',()=>show(Number(d.dataset.authorIndex))));
 viewport.addEventListener('keydown',e=>{if(e.target!==viewport||e.altKey||e.ctrlKey||e.metaKey||!allowed())return;const keys={ArrowLeft:index-1,ArrowRight:index+1,Home:0,End:cards.length-1};if(Object.hasOwn(keys,e.key)){e.preventDefault();show(keys[e.key])}});
 viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')touch={x:e.clientX,y:e.clientY}});viewport.addEventListener('pointercancel',()=>touch=null);viewport.addEventListener('pointerup',e=>{if(!touch)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1))});
 function language(){const t=authorGalleryCopy[document.documentElement.lang]||authorGalleryCopy.en;section.querySelectorAll('[data-author-text]').forEach(e=>e.textContent=t[e.dataset.authorText]);section.querySelectorAll('[data-author-caption]').forEach(e=>e.textContent=t.captions[Number(e.dataset.authorCaption)]);section.querySelectorAll('[data-author-photo]').forEach(e=>e.alt=t.alts[Number(e.dataset.authorPhoto)]);viewport.setAttribute('aria-label',t.gallery);section.querySelector('.author-gallery-prev').setAttribute('aria-label',t.previous);section.querySelector('.author-gallery-next').setAttribute('aria-label',t.next);dots.forEach((d,i)=>d.setAttribute('aria-label',t.select+' '+(i+1)));}
 window.addEventListener('wa:language',()=>{language();fit()});
 const top=document.querySelector('.back-top'),philosophy=document.getElementById('philosophy'),header=document.querySelector('header');
 const updateTop=()=>top.classList.toggle('is-visible',allowed()&&philosophy.getBoundingClientRect().bottom<=header.getBoundingClientRect().height);
 function fit(){
  const styles=getComputedStyle(section),number=v=>parseFloat(v)||0;
  const heading=section.querySelector('.author-gallery-heading'),footer=section.querySelector('.author-gallery-footer');
  const width=Math.min(900,section.clientWidth-number(styles.paddingLeft)-number(styles.paddingRight));
  const gap=number(getComputedStyle(heading).marginBottom);
  const available=window.innerHeight-header.getBoundingClientRect().height-heading.getBoundingClientRect().height-footer.getBoundingClientRect().height-number(styles.paddingTop)-number(styles.paddingBottom)-44-gap-24;
  const height=Math.max(100,Math.min(460,Math.max(100,available),Math.max(100,width*1536/2752)));
  section.style.setProperty('--author-photo-height',height+'px');
 }
 window.addEventListener('scroll',updateTop,{passive:true});window.addEventListener('resize',()=>{fit();updateTop()});window.addEventListener('wa:age-state',()=>{fit();updateTop()});
 if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(fit);observer.observe(header);observer.observe(section.querySelector('.author-gallery-heading'));observer.observe(section.querySelector('.author-gallery-footer'));}
 document.fonts?.ready.then(fit);language();fit();updateTop();
 top.addEventListener('click',e=>{if(!allowed())return;e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});const main=document.getElementById('main');main.setAttribute('tabindex','-1');main.focus({preventScroll:true})});
})();
