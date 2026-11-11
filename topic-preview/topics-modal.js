(() => {
 const dialog=document.getElementById('topicDialog'),grid=document.getElementById('themes');
 if(!dialog||!grid)return;
 const title=dialog.querySelector('h2'),body=dialog.querySelector('.topic-body'),close=dialog.querySelector('.topic-close'),sources=dialog.querySelector('.topic-sources');
 const ui={en:{label:'BEYOND THE GLASS',source:'Read the source',close:'Close topic'},de:{label:'BEYOND THE GLASS',source:'Quelle lesen',close:'Thema schliessen'},uk:{label:'BEYOND THE GLASS',source:'Переглянути джерело',close:'Закрити тему'}};
 let active=-1,opener=null;
 function localize(){
  const lang=Object.hasOwn(ui,document.documentElement.lang)?document.documentElement.lang:'en',words=ui[lang];
  close.setAttribute('aria-label',words.close);dialog.querySelector('.eyebrow').textContent=words.label;
  if(active<0)return;
  const topic=whiskyTopics[active];title.textContent=pagesCopy[lang].themes[active];
  body.replaceChildren(...topic[lang].map(text=>{const p=document.createElement('p');p.textContent=text;return p}));
  const link=document.createElement('a');link.href=topic.source[1];link.target='_blank';link.rel='noopener noreferrer';link.textContent=words.source+' · '+topic.source[0];sources.replaceChildren(link);
 }
 grid.addEventListener('click',event=>{
  const button=event.target.closest('[data-theme]');if(!button||!grid.contains(button)||document.getElementById('ageGate')?.hidden===false)return;
  const i=Number(button.dataset.theme);if(!Number.isInteger(i)||i<0||i>=whiskyTopics.length)return;
  active=i;opener=button;localize();dialog.showModal();document.body.classList.add('topic-open');close.focus();
 });
 close.addEventListener('click',()=>dialog.close());
 // Native dialog provides Escape dismissal, focus containment and inert background.
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});
 dialog.addEventListener('close',()=>{document.body.classList.remove('topic-open');if(!opener?.isConnected&&active>=0)opener=grid.querySelector(`[data-theme="${active}"]`);opener?.focus();active=-1});
 window.addEventListener('wa:language',localize);localize();
})();
