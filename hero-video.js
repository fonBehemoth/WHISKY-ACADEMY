// Local media only. No YouTube player, API, cookies or third-party frames.
(()=>{
const video=document.getElementById('heroVideo'),button=document.getElementById('heroMotion');if(!video||!button)return;
const labels={en:{play:'Play video',pause:'Pause video'},de:{play:'Video abspielen',pause:'Video pausieren'},uk:{play:'Відтворити відео',pause:'Призупинити відео'}};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let manualChoice=null,inView=true,failed=false;
const wantsMotion=()=>manualChoice??(!reduced.matches&&!navigator.connection?.saveData);
function label(){const text=(labels[document.documentElement.lang]||labels.en)[video.paused?'play':'pause'];button.setAttribute('aria-label',text);button.querySelector('.motion-label').textContent=text;button.querySelector('.motion-play').hidden=!video.paused;button.querySelector('.motion-pause').hidden=video.paused;button.hidden=failed;}
function allowed(){return document.getElementById('ageGate').hidden&&document.visibilityState==='visible'&&inView}
async function refresh(){if(failed)return;if(!allowed()||!wantsMotion()){video.pause();label();return}const source=video.querySelector('source');if(!source.hasAttribute('src')){source.src=source.dataset.src;video.load()}video.muted=true;try{await video.play()}catch{/* Autoplay may be blocked: leave the poster and offer Play. */}label()}
button.addEventListener('click',()=>{manualChoice=video.paused;refresh()});
video.addEventListener('play',label);video.addEventListener('pause',label);video.addEventListener('error',()=>{failed=true;video.pause();label()});
video.querySelector('source').addEventListener('error',()=>{failed=true;label()});
document.addEventListener('visibilitychange',refresh);window.addEventListener('wa:age-state',refresh);window.addEventListener('wa:language',label);
reduced.addEventListener('change',()=>{manualChoice=null;refresh()});
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;refresh()},{threshold:0}).observe(video);
label();refresh();
})();
