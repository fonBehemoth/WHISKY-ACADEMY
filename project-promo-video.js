(() => {
 const shell=document.getElementById('linkwoodPromoPlayer');if(!shell)return;
 const words={en:{play:'Play Linkwood video',label:'Linkwood · Project film',direct:'Watch on YouTube'},de:{play:'Linkwood-Video abspielen',label:'Linkwood · Projektfilm',direct:'Auf YouTube ansehen'},uk:{play:'Відтворити відео Linkwood',label:'Linkwood · Відео проєкту',direct:'Дивитися на YouTube'}};
 function localize(){const t=words[document.documentElement.lang]||words.en;shell.querySelector('button')?.setAttribute('aria-label',t.play);const label=shell.querySelector('.project-promo-label');if(label)label.textContent=t.play;shell.querySelector('iframe')?.setAttribute('title',t.label);const direct=shell.parentElement.querySelector('.project-promo-direct');if(direct)direct.textContent=t.direct}
 shell.querySelector('button')?.addEventListener('click',()=>{
  if(document.getElementById('ageGate')?.hidden===false)return;
  const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/vR-8fbn0NhU?autoplay=1&playsinline=1&rel=0&loop=1&playlist=vR-8fbn0NhU';frame.title=(words[document.documentElement.lang]||words.en).label;frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';shell.replaceChildren(frame);frame.focus();
 });
 window.addEventListener('wa:language',localize);localize();
})();
