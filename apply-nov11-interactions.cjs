const fs=require('node:fs');
const dir='github-pages/';
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.html'))){
 let h=fs.readFileSync(dir+file,'utf8');
 h=h.replace(/<(?:script|link)[^>]*(?:nov11-interactions\.js|nov11-effects\.css)[^>]*>(?:<\/script>)?/g,'');
 h=h.replace('</head>','<link rel="stylesheet" href="nov11-effects.css"><script src="nov11-interactions.js" defer></script></head>');
 fs.writeFileSync(dir+file,h);
}
console.log('Installed five-language interaction and amber background enhancements.');
