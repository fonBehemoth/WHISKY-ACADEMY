// First-party Linkwood loop. No YouTube player, branding, SDK or frame.
(()=>{
 const shell=document.getElementById('linkwoodPromoPlayer');if(!shell)return;
 const video=shell.querySelector('video'),source=video.querySelector('source'),cover=shell.querySelector('.project-promo-play'),motion=shell.querySelector('.project-promo-motion');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const words={en:{play:'Play Linkwood video',pause:'Pause Linkwood video',label:'Linkwood · Project film',direct:'Watch on YouTube'},de:{play:'Linkwood-Video abspielen',pause:'Linkwood-Video pausieren',label:'Linkwood · Projektfilm',direct:'Auf YouTube ansehen'},uk:{play:'Відтворити відео Linkwood',pause:'Призупинити відео Linkwood',label:'Linkwood · Відео проєкту',direct:'Дивитися на YouTube'}};
 let manualChoice=null,inView=false,failed=false;
 const wantsMotion=()=>manualChoice??(!reduced.matches&&!navigator.connection?.saveData);
 const allowed=()=>document.getElementById('ageGate')?.hidden!==false&&document.visibilityState==='visible'&&inView;
 function localize(){
  const t=words[document.documentElement.lang]||words.en;
  cover.setAttribute('aria-label',t.play);shell.querySelector('.project-promo-label').textContent=t.play;
  video.setAttribute('aria-label',t.label);
  const label=video.paused?t.play:t.pause;motion.setAttribute('aria-label',label);motion.querySelector('.promo-motion-label').textContent=label;
  motion.querySelector('.promo-motion-play').hidden=!video.paused;motion.querySelector('.promo-motion-pause').hidden=video.paused;
  const loaded=source.hasAttribute('src');cover.hidden=loaded&&!failed;motion.hidden=!loaded||failed;
  const direct=shell.parentElement.querySelector('.project-promo-direct');if(direct)direct.textContent=t.direct;
 }
 async function refresh(){
  if(failed||!allowed()||!wantsMotion()){video.pause();localize();return}
  if(!source.hasAttribute('src')){source.src=source.dataset.src;video.load()}
  video.muted=true;
  try{await video.play();if(!allowed()||!wantsMotion())video.pause()}catch{/* Autoplay blocked: the native poster and our Play control remain available. */}
  localize();
 }
 cover.addEventListener('click',()=>{
  if(document.getElementById('ageGate')?.hidden===false)return;
  if(failed){failed=false;video.load()}manualChoice=true;refresh();
 });
 motion.addEventListener('click',()=>{if(document.getElementById('ageGate')?.hidden===false)return;manualChoice=video.paused;refresh()});
 video.addEventListener('play',localize);video.addEventListener('pause',localize);
 const error=()=>{failed=true;video.pause();localize()};video.addEventListener('error',error);source.addEventListener('error',error);
 document.addEventListener('visibilitychange',refresh);window.addEventListener('wa:age-state',refresh);window.addEventListener('wa:language',localize);
 reduced.addEventListener('change',()=>{manualChoice=null;refresh()});navigator.connection?.addEventListener?.('change',refresh);
 new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;refresh()},{threshold:.1}).observe(shell);
 localize();refresh();
})();
