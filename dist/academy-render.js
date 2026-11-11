// Shared safe templates used both for static English output and language switching.
function academyFragments(lang){
 const d=academyContent[lang],t=d.tasting;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ps=items=>items.map(x=>`<p>${esc(x)}</p>`).join('');
 const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
 const button=(i,featured=false)=>{const p=d.programs[i];return `<button type="button" class="theme-trigger${featured?' programme-feature':''}" data-theme="${i}" aria-haspopup="dialog" aria-controls="topicDialog"><span class="theme-number">${String(i+1).padStart(2,'0')}</span><span class="programme-copy"><span class="theme-name">${esc(p[0])}</span><span class="programme-subtitle">${esc(p[1])}</span>${featured?`<span class="programme-excerpt">${esc(p[2])}</span>`:''}</span>${arrow}</button>`};
 return {
  author:d.author.map(a=>`<h2>${esc(a.title)}</h2>${ps(a.paragraphs)}`),authorQuote:esc(d.authorQuote),
  tastingIntro:`<p class="eyebrow">${esc(t.label)}</p><h1>${esc(t.title)}</h1><div class="academy-intro-copy">${ps(t.intro)}</div>`,
  homeTastingIntro:`<p class="eyebrow">${esc(t.label)}</p><h2>${esc(t.title)}</h2><div class="academy-intro-copy">${ps(t.intro)}</div>`,
  programmes:t.groups.map((g,j)=>`<section class="programme-group" id="programme-group-${j+1}" aria-labelledby="programme-heading-${j+1}"><p class="eyebrow">${esc(g.label)}</p><h2 id="programme-heading-${j+1}">${esc(g.title)}</h2><div class="academy-section-intro">${ps(g.paragraphs)}</div><div class="theme-grid">${Array.from({length:[8,2,6][j]},(_,k)=>button([0,8,10][j]+k)).join('')}</div></section>`).join(''),
  method:`<p class="eyebrow">${esc(t.methodLabel)}</p><h2>${esc(t.methodTitle)}</h2><p class="lead">${esc(t.methodIntro)}</p><div class="academy-method-grid">${t.methods.map((m,i)=>`<article><span class="eyebrow">0${i+1}</span><h3>${esc(m[0])}</h3><p>${esc(m[1])}</p></article>`).join('')}</div><blockquote>${esc(t.comparison)}</blockquote>`,
  private:`<p class="eyebrow">${esc(t.privateLabel)}</p><h2>${esc(t.privateTitle)}</h2>${ps(t.privateParagraphs)}<a class="text-link" href="contact.html?lang=${lang}">${esc(t.cta)}${arrow}</a><p class="academy-closing">${esc(t.closing)}</p><p class="eyebrow">OM WHISKY ACADEMY</p><p>${esc(t.tagline)}</p>`
 };
}
if(typeof window!=='undefined')window.renderAcademyContent=lang=>{
 if(!Object.hasOwn(academyContent,lang))return;
 const f=academyFragments(lang),set=(id,html)=>{const el=document.getElementById(id);if(el)el.innerHTML=html};
 f.author.forEach((html,i)=>set('academy-author-'+i,html));set('academy-author-quote',f.authorQuote);
 set('home-tasting-intro',f.homeTastingIntro);set('academy-tasting-intro',f.tastingIntro);set('themes',f.programmes);set('academy-method',f.method);set('academy-private',f.private);
 const page=Number(document.body.dataset.page);
 if(page===1||page===3){const meta=document.querySelector('meta[name=description]');if(meta)meta.content=page===1?academyContent[lang].author[0].paragraphs[0]:academyContent[lang].tasting.intro[0]}
};
