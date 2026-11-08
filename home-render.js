function homeFragments(lang){
 const d=homeCopy[lang],esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ps=items=>items.map(s=>`<p>${esc(s)}</p>`).join('');
 const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
 const link=(href,label)=>`<a class="text-link" href="${href}">${esc(label)}${arrow}</a>`;
 const heading=(label,title)=>`<p class="eyebrow">${esc(label)}</p><h2>${esc(title)}</h2>`;
 return {
  collectionLine:esc(d.heroCollectionLine),
  proofs:d.proofs.slice(1).map(p=>`<div class="hero-proof"><strong>${esc(p[0])}</strong><span>${esc(p[1])}</span></div>`).join(''),
  philosophy:heading(d.philosophyLabel,d.philosophyTitle)+ps(d.philosophyParagraphs),
  tastings:heading(d.tastingLabel,d.tastingTitle)+ps(d.tastingParagraphs),
  formats:d.formats.map((f,i)=>`<a class="home-format" href="tastings.html#${esc(f[2])}"><span class="eyebrow">0${i+1}</span><h3>${esc(f[0])}</h3><p>${esc(f[1])}</p>${arrow}</a>`).join(''),
  tastingCta:link('tastings.html',d.tastingCta),
  collection:heading(d.collectionLabel,d.collectionTitle)+ps(d.collectionParagraphs),
  collectionCta:link('collection.html',d.collectionCta),
  founder:heading(d.founderLabel,d.founderTitle)+ps(d.founderParagraphs)+link('author.html',d.founderCta),
  community:heading(d.communityLabel,d.communityTitle)+ps(d.communityParagraphs),
  communityFoot:`<p>${esc(d.communityRole)}</p>`+link('contact.html',d.communityCta),
  project:heading(d.projectLabel,d.projectTitle)+ps(d.projectParagraphs)+`<div class="home-project-facts">${d.projectFacts.map(s=>`<span>${esc(s)}</span>`).join('')}</div>`+link('project-linkwood.html',d.projectCta),
  invitation:`<h2>${esc(d.invitationTitle)}</h2><p>${esc(d.invitationText)}</p><p class="home-invitation-closing">${esc(d.invitationClosing)}</p><a class="button solid" href="contact.html">${esc(d.invitationCta)}${arrow}</a>`
 };
}
if(typeof window!=='undefined')window.renderHomePage=lang=>{
 if(document.body.dataset.page!=='0'||!Object.hasOwn(homeCopy,lang))return;
 const d=homeCopy[lang],f=homeFragments(lang);
 for(const [key,id] of Object.entries({collectionLine:'heroCollectionLine',proofs:'homeCredentials',philosophy:'homePhilosophyCopy',tastings:'homeTastingCopy',formats:'homeFormats',tastingCta:'homeTastingCta',collection:'homeCollectionCopy',collectionCta:'homeCollectionCta',founder:'homeFounderCopy',community:'homeCommunityCopy',communityFoot:'homeCommunityFoot',project:'homeProjectCopy',invitation:'homeInvitationCopy'})){
  const el=document.getElementById(id);if(el)el.innerHTML=f[key];
 }
 document.querySelector('[data-home-image="philosophy"]')?.setAttribute('alt',d.philosophyAlt);
 document.querySelectorAll('[data-home-collection-caption]').forEach(el=>el.textContent=d.collectionCaptions[Number(el.dataset.homeCollectionCaption)]);
 document.querySelectorAll('[data-home-collection-image]').forEach(el=>el.alt=d.collectionAlts[Number(el.dataset.homeCollectionImage)]);
 const meta=document.querySelector('meta[name=description]');if(meta)meta.content=d.heroSub;
};
