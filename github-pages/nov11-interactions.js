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
  if(pause)pause.setAttribute('aria-label',t()[stopped?'play':'pause']);
 }
 // Pointer position and focused dots do not silently disable autoplay.
 const gallery=document.getElementById('author-moments');let pause=null,stopped=reduced.matches,visible=false,timer=null;
 if(gallery){
  pause=document.createElement('button');pause.type='button';pause.className='author-autoplay';
  const paint=()=>{pause.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(stopped?'M9 5v14l11-7z':'M8 5v14M16 5v14')+'"/></svg>';pause.setAttribute('aria-label',t()[stopped?'play':'pause'])};
  const stopTimer=()=>{clearTimeout(timer);timer=null};
  const schedule=()=>{stopTimer();if(stopped||!visible||document.hidden||!allowed())return;timer=setTimeout(()=>{const dots=[...gallery.querySelectorAll('[data-author-index]')];const index=dots.findIndex(d=>d.getAttribute('aria-pressed')==='true');dots[(index+1)%dots.length]?.click();schedule()},6000)};
  pause.addEventListener('click',()=>{stopped=!stopped;paint();schedule()});gallery.querySelector('.author-gallery-footer').append(pause);paint();
  gallery.querySelector('output')?.setAttribute('aria-live','off');
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.25});io.observe(gallery);
  gallery.addEventListener('click',schedule);
  document.addEventListener('visibilitychange',schedule);window.addEventListener('wa:age-state',schedule);reduced.addEventListener('change',()=>{stopped=reduced.matches;paint();schedule()});
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
 // Original low-resolution colour field, inspired by flowing silk.
 const fields=[];let previousAnimated=null;
 document.querySelectorAll('main section').forEach(section=>{
  if(section.classList.contains('home-invitation')||previousAnimated?.nextElementSibling===section)return;
  const rgb=getComputedStyle(section).backgroundColor.match(/[\d.]+/g)?.map(Number);
  if(!rgb||rgb[0]<25||rgb[1]<=rgb[0]||rgb[1]<=rgb[2]||rgb[3]===0)return;
  section.classList.add('amber-silk');previousAnimated=section;const canvas=document.createElement('canvas');canvas.className='amber-canvas';canvas.width=192;canvas.height=112;canvas.setAttribute('aria-hidden','true');section.prepend(canvas);const ctx=canvas.getContext('2d');if(!ctx)return;
  const field={section,canvas,ctx,pixels:ctx.createImageData(192,112),visible:false};fields.push(field);
 });
 function draw(f,time){const d=f.pixels.data;let i=0;for(let y=0;y<112;y++)for(let x=0;x<192;x++){
  const u=x/192,v=y/112;
  const bend=u*7+v*3+Math.sin(v*5-time*.17)*1.8+Math.sin(u*4+time*.11);
  const broad=(Math.sin(bend-time*.13)+1)/2;
  const folds=Math.pow((Math.sin(bend*2.6+Math.sin(v*6+time*.09))+1)/2,4);
  const light=.25*broad+.75*folds;
  d[i++]=14+light*66;d[i++]=13+light*37;d[i++]=12+light*12;d[i++]=255;
 }f.ctx.putImageData(f.pixels,0,0)}
 let frame=0,last=0;
 function run(now){frame=0;if(document.hidden||!allowed()||reduced.matches||!fields.some(f=>f.visible))return;if(now-last>65){fields.filter(f=>f.visible).forEach(f=>draw(f,now/1000));last=now}frame=requestAnimationFrame(run)}
 function wake(){if(frame){cancelAnimationFrame(frame);frame=0}if(!document.hidden&&allowed()&&!reduced.matches&&fields.some(f=>f.visible))frame=requestAnimationFrame(run)}
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{const f=fields.find(f=>f.section===e.target);f.visible=e.isIntersecting});wake()});
 fields.forEach(f=>{draw(f,0);observer.observe(f.section)});document.addEventListener('visibilitychange',wake);window.addEventListener('wa:age-state',wake);reduced.addEventListener('change',wake);
})();
