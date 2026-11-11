const fs=require('node:fs'),path=require('node:path');const dir=path.join(__dirname,'github-pages');
const markup='<div class="project-promo-wrap"><div class="project-promo" id="linkwoodPromoPlayer"><video id="linkwoodPromoVideo" class="project-promo-video" muted loop playsinline preload="none" poster="linkwood-promo-poster.jpg" aria-label="Linkwood · Project film" tabindex="-1" disablepictureinpicture disableremoteplayback><source data-src="linkwood-promo.mp4" type="video/mp4"></video><button type="button" class="project-promo-play" aria-label="Play Linkwood video"><img src="linkwood-promo-poster.jpg" alt="" width="536" height="720" loading="lazy"><span class="project-promo-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7Z"/></svg></span><span class="project-promo-label">Play Linkwood video</span></button><button type="button" class="project-promo-motion" aria-label="Pause Linkwood video" hidden><svg class="promo-motion-play" viewBox="0 0 24 24" aria-hidden="true" hidden><path d="m9 5 10 7-10 7Z"/></svg><svg class="promo-motion-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg><span class="promo-motion-label">Pause Linkwood video</span></button></div><a class="project-promo-direct" href="https://www.youtube.com/shorts/vR-8fbn0NhU" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></div>';
const cleanMarkup=markup.replace(/<a class="project-promo-direct"[^>]*>[\s\S]*?<\/a>/,'');
for(const name of ['index.html','projects.html']){
 const file=path.join(dir,name);let html=fs.readFileSync(file,'utf8');
 if(html.includes('class="project-promo-wrap"'))html=html.replace(/<div class="project-promo-wrap">[\s\S]*?<\/button><\/div>(?:\s*<a class="project-promo-direct"[^>]*>[\s\S]*?<\/a>)?\s*<\/div>/,cleanMarkup);
 else html=html.replace(/<a class="project-preview"[\s\S]*?<\/a>/g,cleanMarkup);
 if(!html.includes('project-promo-video.js'))html=html.replace('</head>','<script src="project-promo-video.js" defer></script></head>');
 fs.writeFileSync(file,html);
}
const file=path.join(dir,'multipage.css');let css=fs.readFileSync(file,'utf8').replace(/\.project-promo iframe\{[^}]*\}/g,'');
if(!css.includes('/* First-party Linkwood media */'))css+='\n/* First-party Linkwood media */\n.project-promo-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}.project-promo-play{z-index:1}\n';
fs.writeFileSync(file,css);
console.log('Installed the first-party muted Linkwood loop without a YouTube caption or link.');
