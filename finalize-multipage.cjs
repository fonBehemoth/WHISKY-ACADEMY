const fs=require('fs'),vm=require('vm'),path=require('path');const dir=path.join(__dirname,'github-pages');const c={};vm.runInNewContext(fs.readFileSync(path.join(dir,'locale-data.js'),'utf8')+fs.readFileSync(path.join(dir,'page-data.js'),'utf8')+';globalThis.data={copy,pagesCopy}',c);const t=c.data.copy.en,n=c.data.pagesCopy.en;
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.html'))){let h=fs.readFileSync(path.join(dir,file),'utf8');const page=Number(h.match(/data-page="(\d)"/)[1]);
for(const [attr,lookup] of [['data-t',t],['data-n',n],['data-nav',n.nav],['data-fact',n.facts]])h=h.replace(new RegExp('<([a-z][a-z0-9]*)\\b([^>]*'+attr+'="([^" ]+)"[^>]*)>[\\s\\S]*?<\\/\\1>','g'),(all,tag,attrs,key)=>`<${tag}${attrs}>${lookup[key]??''}</${tag}>`);
h=h.replace(/<([a-z][a-z0-9]*)\b([^>]*data-name[^>]*)>[\s\S]*?<\/\1>/g,(_,tag,a)=>`<${tag}${a}>${t.personName}</${tag}>`).replaceAll('<span data-page-title></span>',`<span data-page-title>${n.pageNames[page]}</span>`).replace(/<title>[\s\S]*?<\/title>/,`<title>${n.pageNames[page]} | WHISKY ACADEMY</title>`);
h=h.replace('<script src="website.js" defer></script>','<script src="website.js" defer></script><noscript><style>.age-content:after{content:"Please enable JavaScript to confirm your age and browse this website."}</style></noscript>');fs.writeFileSync(path.join(dir,file),h)}
for(const file of fs.readdirSync(dir)){if(fs.statSync(path.join(dir,file)).isFile())fs.copyFileSync(path.join(dir,file),path.join(__dirname,'site','dist',file))}
console.log('English HTML pre-rendered; local dist synchronised.');
require('./add-hero-video.cjs');
require('./add-linkwood-media.cjs');
require('./apply-home-updates.cjs');
require('./remove-bottle-prototype.cjs');
require('./apply-security.cjs');
require('./add-collection-photos.cjs');
require('./apply-approved-brand.cjs');
require('./add-brand-symbol.cjs');
require('./add-topic-modals.cjs');
require('./add-project-promo-video.cjs');
require('./apply-hero-copy.cjs');
require('./apply-whisky-capitals.cjs');
require('./apply-academy-content.cjs');
require('./apply-home-structure.cjs');
require('./apply-author-slideshow.cjs');
require('./apply-new-collection.cjs');
require('./apply-tasting-gallery.cjs');
require('./apply-five-languages.cjs');
require('./apply-nov11-interactions.cjs');
require('./version-site.cjs');
