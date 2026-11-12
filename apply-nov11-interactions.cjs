const fs=require('node:fs');
const dir='github-pages/';
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.html'))){
 let h=fs.readFileSync(dir+file,'utf8');
 h=h.replace(/<nav class="footer-nav"[\s\S]*?<\/nav>/g,'').replace(/<a[^>]*data-home-link[^>]*>[\s\S]*?<\/a>/g,'');
 const menu=h.match(/<nav id="nav"[^>]*>([\s\S]*?)<\/nav>/);
 if(!menu)throw Error('Missing header navigation: '+file);
 h=h.replace(/<(header|footer)\b[\s\S]*?<\/\1>/g,part=>part.replace(/<span class="logo-sheen" aria-hidden="true">(<img[^>]+>)<\/span>/g,'$1').replace(/<img class="brand-symbol"[^>]*>/g,img=>'<span class="logo-sheen" aria-hidden="true">'+img+'</span>'));
 const home='<a href="index.html" data-home-link'+(file==='index.html'?' aria-current="page"':'')+'>Home</a>';
 const footer='<nav class="footer-nav" aria-label="Footer navigation">'+home+menu[1]+'</nav>';
 if(file!=='index.html')h=h.replace(/(<nav id="nav"[^>]*>)/,'$1'+home);
 h=h.replace(/(<p data-t="footerLine">[\s\S]*?<\/p>)/,'$1'+footer);
 h=h.replace(/<(?:script|link)[^>]*(?:nov11-interactions\.js|nov11-effects\.css|silk-field\.js)[^>]*>(?:<\/script>)?/g,'');
 h=h.replace(/<(?:script|link)[^>]*(?:editorial-reveal\.js|editorial-reveal\.css)[^>]*>(?:<\/script>)?/g,'');
 h=h.replace('</head>','<link rel="stylesheet" href="nov11-effects.css"><script src="silk-field.js" defer></script><script src="nov11-interactions.js" defer></script><link rel="stylesheet" href="editorial-reveal.css"><script src="editorial-reveal.js" defer></script></head>');
 fs.writeFileSync(dir+file,h);
}
console.log('Installed five-language interaction and amber background enhancements.');
