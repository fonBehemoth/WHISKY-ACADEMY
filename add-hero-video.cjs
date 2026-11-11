const fs=require('fs'),path=require('path');const dir=path.join(__dirname,'github-pages');const file=path.join(dir,'index.html');let html=fs.readFileSync(file,'utf8');
const video='<video id="heroVideo" class="hero-image hero-video" muted loop playsinline preload="none" poster="hero-poster.jpg" aria-hidden="true" tabindex="-1"><source data-src="hero.mp4" type="video/mp4"></video>';
if(!html.includes('id="heroVideo"'))html=html.replace(/<img class="hero-image"[^>]*>/,video);
if(!html.includes('hero-video.js'))html=html.replace(/(<script src="website\.js(?:\?[^"]*)?" defer><\/script>)/,'$1<script src="hero-video.js" defer></script>');
if(!html.includes('id="heroMotion"'))html=html.replace('<div class="hero-bottom">','<button type="button" class="hero-motion" id="heroMotion" aria-label="Play background video"><svg class="motion-play" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7Z"/></svg><svg class="motion-pause" viewBox="0 0 24 24" aria-hidden="true" hidden><path d="M8 5v14M16 5v14"/></svg><span class="motion-label">Play video</span></button><div class="hero-bottom">');
html=html.replace(/src="website\.js(?:\?[^"]*)?"/,'src="website.js?v=20261104-video1"').replace(/href="multipage\.css(?:\?[^"]*)?"/,'href="multipage.css?v=20261104-video1"');
fs.writeFileSync(file,html);console.log('Hero video installed.');
