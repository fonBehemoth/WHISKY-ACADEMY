// Progressive enhancements, shared by all seven pages.
(()=>{
 const words={
  en:{collection:'Explore selected Whiskies from the collection',prev:'Previous photograph',next:'Next photograph',pause:'Pause automatic photo changes',play:'Resume automatic photo changes'},
  de:{collection:'Ausgewählte Whiskys der Sammlung entdecken',prev:'Vorheriges Foto',next:'Nächstes Foto',pause:'Automatischen Fotowechsel pausieren',play:'Automatischen Fotowechsel fortsetzen'},
  uk:{collection:'Познайомитися зі зразками колекції',prev:'Попереднє фото',next:'Наступне фото',pause:'Призупинити автоматичну зміну фото',play:'Відновити автоматичну зміну фото'},
  fr:{collection:'Découvrir une sélection de Whiskies de la collection',prev:'Photo précédente',next:'Photo suivante',pause:'Suspendre le défilement automatique des photos',play:'Reprendre le défilement automatique des photos'},
  it:{collection:'Scopri una selezione di Whisky della collezione',prev:'Foto precedente',next:'Foto successiva',pause:'Sospendi il cambio automatico delle foto',play:'Riprendi il cambio automatico delle foto'}
 };
 const navigationWords={en:['Home','Footer navigation'],de:['Startseite','Navigation im Seitenfuss'],uk:['Головна','Навігація внизу сторінки'],fr:['Accueil','Navigation de pied de page'],it:['Home','Navigazione a piè di pagina']};
 const t=()=>words[document.documentElement.lang]||words.en;
 const icon=direction=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(direction==='prev'?'M20 12H4m6-6-6 6 6 6':'M4 12h16m-6-6 6 6-6 6')+'"/></svg>';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const allowed=()=>document.getElementById('ageGate')?.hidden!==false;
 function localize(){
  const labels=navigationWords[document.documentElement.lang]||navigationWords.en;
  document.querySelectorAll('[data-home-link]').forEach(a=>a.textContent=labels[0]);
  document.querySelector('.footer-nav')?.setAttribute('aria-label',labels[1]);
  document.querySelectorAll('.languages').forEach(group=>{const ua=group.querySelector('[data-lang="uk"]');if(!ua||ua===group.lastElementChild)return;const separator=ua.previousElementSibling;group.append(separator,ua)});
  const link=document.querySelector('#homeCollectionCta a');if(link){const svg=link.querySelector('svg');link.textContent=t().collection;if(svg)link.append(svg)}
  const educational=document.querySelectorAll('#homeFormats a')[3];if(educational){const u=new URL(educational.href);u.hash='main';educational.href=u.href}
  document.querySelectorAll('[data-lightbox-direction]').forEach(b=>b.setAttribute('aria-label',t()[b.dataset.lightboxDirection]));
  document.querySelectorAll('[data-author-step]').forEach(b=>b.setAttribute('aria-label',t()[Number(b.dataset.authorStep)<0?'prev':'next']));
 }
 // Pointer position and focused dots do not silently disable autoplay.
 const gallery=document.getElementById('author-moments');let stopped=reduced.matches,visible=false,timer=null;
 if(gallery){
  const stopTimer=()=>{clearTimeout(timer);timer=null};
  const schedule=()=>{stopTimer();if(stopped||!visible||document.hidden||!allowed())return;timer=setTimeout(()=>{const dots=[...gallery.querySelectorAll('[data-author-index]')];const index=dots.findIndex(d=>d.getAttribute('aria-pressed')==='true');dots[(index+1)%dots.length]?.click();schedule()},6000)};
  gallery.querySelector('output')?.setAttribute('aria-live','off');
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.25});io.observe(gallery);
  gallery.addEventListener('click',schedule);
  document.addEventListener('visibilitychange',schedule);window.addEventListener('wa:age-state',schedule);window.addEventListener('pageshow',schedule);reduced.addEventListener('change',()=>{stopped=reduced.matches;schedule()});
 }
 // Reuse the existing native dialog; keep its close button and focus restoration.
 const dialog=document.getElementById('lightbox');
 if(dialog){
  let photos=[],current=0,start=null;
  function show(index){if(!photos.length)return;current=(index+photos.length)%photos.length;const source=photos[current];const image=dialog.querySelector('img');image.src=source.dataset.photo;image.alt=source.querySelector('img')?.alt||''}
  const controls=['prev','next'].map(direction=>{const b=document.createElement('button');b.type='button';b.className='lightbox-nav lightbox-'+direction;b.dataset.lightboxDirection=direction;b.innerHTML=icon(direction);b.addEventListener('click',()=>show(current+(direction==='next'?1:-1)));dialog.append(b);return b});
  document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{const group=b.closest('.tasting-photo-grid,.new-collection-grid,.gallery-grid,.linkwood-gallery');photos=[...(group||document).querySelectorAll('[data-photo]')];current=photos.indexOf(b);controls.forEach(c=>c.hidden=photos.length<2)}));
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1))}});
  dialog.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')start={x:e.clientX,y:e.clientY}});dialog.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)show(current+(dx<0?1:-1))});dialog.addEventListener('pointercancel',()=>start=null);
 }
 window.addEventListener('wa:language',localize);localize();
 // Compositor-driven soft colour movement: no canvas loop or viewport observer needed.
 let previousAnimated=null;
 document.querySelectorAll('main section').forEach(section=>{
  if(section.classList.contains('home-invitation')||previousAnimated?.nextElementSibling===section)return;
  const rgb=getComputedStyle(section).backgroundColor.match(/[\d.]+/g)?.map(Number);
  if(!rgb||rgb[0]<25||rgb[1]<=rgb[0]||rgb[1]<=rgb[2]||rgb[3]===0)return;
  section.classList.add('amber-silk');previousAnimated=section;
  const field=document.createElement('div');field.className='amber-canvas';field.setAttribute('aria-hidden','true');section.prepend(field);
 });
 function backgroundState(){document.querySelectorAll('.amber-silk').forEach(s=>s.classList.toggle('silk-paused',document.hidden||!allowed()))}
 document.addEventListener('visibilitychange',backgroundState);window.addEventListener('wa:age-state',backgroundState);window.addEventListener('pageshow',backgroundState);backgroundState();
})();
