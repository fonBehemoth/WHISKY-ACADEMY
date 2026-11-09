// Muted, looping Linkwood preview: start on view, pause offscreen. No external scripts.
(()=>{
 const shell=document.getElementById('linkwoodPromoPlayer');if(!shell)return;
 const cover=shell.querySelector('.project-promo-play'),motion=shell.querySelector('.project-promo-motion');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),origin='https://www.youtube-nocookie.com';
 const words={en:{play:'Play Linkwood video',pause:'Pause Linkwood video',label:'Linkwood · Project film',direct:'Watch on YouTube'},de:{play:'Linkwood-Video abspielen',pause:'Linkwood-Video pausieren',label:'Linkwood · Projektfilm',direct:'Auf YouTube ansehen'},uk:{play:'Відтворити відео Linkwood',pause:'Призупинити відео Linkwood',label:'Linkwood · Відео проєкту',direct:'Дивитися на YouTube'}};
 let frame=null,manualChoice=null,inView=false,playing=false,ready=false,handshake=null,failed=false;
 const t=()=>words[document.documentElement.lang]||words.en;
 const wantsMotion=()=>manualChoice??(!reduced.matches&&!navigator.connection?.saveData);
 const allowed=()=>document.getElementById('ageGate')?.hidden!==false&&document.visibilityState==='visible'&&inView;
 function send(data){frame?.contentWindow?.postMessage(JSON.stringify(data),origin)}
 function command(func,args=[]){send({event:'command',func,args})}
 function stopHandshake(){if(handshake!==null){clearInterval(handshake);handshake=null}}
 function localize(){
  cover.setAttribute('aria-label',t().play);shell.querySelector('.project-promo-label').textContent=t().play;
  if(frame)frame.title=t().label;
  const label=playing?t().pause:t().play;motion.setAttribute('aria-label',label);motion.querySelector('.promo-motion-label').textContent=label;
  motion.querySelector('.promo-motion-play').hidden=playing;motion.querySelector('.promo-motion-pause').hidden=!playing;
  const direct=shell.parentElement.querySelector('.project-promo-direct');if(direct)direct.textContent=t().direct;
 }
 function create(){
  frame=document.createElement('iframe');frame.id='linkwoodPromoFrame';
  frame.src=origin+'/embed/vR-8fbn0NhU?autoplay=1&mute=1&playsinline=1&loop=1&playlist=vR-8fbn0NhU&controls=0&disablekb=1&rel=0&enablejsapi=1&origin='+encodeURIComponent(window.location.origin);
  frame.title=t().label;frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';frame.tabIndex=-1;frame.setAttribute('aria-hidden','true');
  frame.addEventListener('load',()=>{
   if(!frame)return;let tries=0;
   const listen=()=>{if(ready||!frame||++tries>40){stopHandshake();return}send({event:'listening',id:frame.id});refresh()};
   listen();handshake=setInterval(listen,250);
  });
  cover.hidden=true;motion.hidden=false;shell.insertBefore(frame,cover);localize();
 }
 function refresh(){
  const active=allowed()&&wantsMotion()&&!failed;
  if(active){if(!frame)create();command('mute');command('playVideo')}
  else if(frame){command('pauseVideo');playing=false;localize()}
 }
 function play(){
  if(document.getElementById('ageGate')?.hidden===false)return;
  if(failed){frame?.remove();frame=null;failed=false;ready=false;stopHandshake()}
  manualChoice=true;refresh();
 }
 cover.addEventListener('click',play);
 motion.addEventListener('click',()=>{if(document.getElementById('ageGate')?.hidden===false)return;manualChoice=!playing;refresh()});
 window.addEventListener('message',e=>{
  if(!frame||e.source!==frame.contentWindow||e.origin!==origin)return;
  let data=e.data;try{if(typeof data==='string')data=JSON.parse(data)}catch{return}
  if(!data||typeof data!=='object')return;
  if(data.event==='onReady'||data.event==='infoDelivery'){
   if(!ready){ready=true;stopHandshake();command('addEventListener',['onStateChange']);command('addEventListener',['onError']);command('addEventListener',['onAutoplayBlocked']);refresh()}
  }
  const state=data.event==='onStateChange'?data.info:data.event==='infoDelivery'?data.info?.playerState:undefined;
  if(typeof state==='number'){playing=state===1;localize()}
  if(data.event==='onAutoplayBlocked'){playing=false;localize()}
  if(data.event==='onError'){failed=true;playing=false;cover.hidden=false;motion.hidden=true;command('pauseVideo');localize()}
 });
 document.addEventListener('visibilitychange',refresh);window.addEventListener('wa:age-state',refresh);window.addEventListener('wa:language',localize);
 reduced.addEventListener('change',()=>{manualChoice=null;refresh()});
 navigator.connection?.addEventListener?.('change',refresh);
 new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;refresh()},{threshold:.2}).observe(shell);
 localize();refresh();
})();
