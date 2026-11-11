const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const read=f=>fs.readFileSync('github-pages/'+f,'utf8');
const c={pagesCopy:{en:{},de:{},uk:{},fr:{},it:{}}};
vm.runInNewContext(read('academy-data.js')+read('academy-render.js')+';globalThis.data=academyContent;globalThis.fragments=academyFragments;',c);
for(const lang of ['en','de','uk','fr','it']){
 const d=c.data[lang],f=c.fragments(lang);
 assert.equal(d.author.length,4);assert.equal(d.programs.length,16);assert.equal(d.tasting.groups.length,3);
 const indices=[...f.programmes.matchAll(/data-theme="(\d+)"/g)].map(m=>Number(m[1]));
 assert.deepEqual(indices,Array.from({length:16},(_,i)=>i));assert.ok(!f.programmes.includes('programme-spotlight'));assert.equal(new Set(indices).size,16);
 assert.equal((f.programmes.match(/class="programme-group"/g)||[]).length,3);
 for(let i=0;i<16;i++)assert.equal(d.programs[i].length,c.data.en.programs[i].length);
 for(let i=0;i<4;i++)assert.equal(d.author[i].paragraphs.length,c.data.en.author[i].paragraphs.length);
 assert.ok(f.private.includes('contact.html?lang='+lang));assert.ok(f.method.includes('academy-method-grid'));
}
const source=fs.readFileSync('D:/WHISKEY/НА СТРАНИЦУ АВТОРА УИСКИ.txt','utf8').replace(/\r/g,'').split('Мой главный совет:')[0].trim().split(/\n\s*\n/).map(s=>require('./whisky-case.cjs').capitalise(s.replaceAll('Whisky Academy','OM Whisky Academy').replace(/more than 2,000/gi,m=>m===m.toUpperCase()?'OVER 2,000':'over 2,000')));
const authorTexts=c.data.en.author.flatMap(s=>[s.title,...s.paragraphs]).concat(c.data.en.authorQuote);
assert.deepEqual(Array.from(authorTexts),source);
for(const page of ['author.html','tastings.html']){
 const h=read(page);assert.ok(h.indexOf('academy-data.js')<h.indexOf('website.js'));assert.ok(h.indexOf('academy-render.js')<h.indexOf('website.js'));
 assert.ok(h.includes('academy-content.css'));assert.ok(!h.includes('Мой главный совет'));assert.ok(!h.includes('Мои стратегические замечания'));
}
const tasting=read('tastings.html');assert.ok(tasting.includes('id="academy-method"'));assert.ok(tasting.includes('id="academy-private"'));
assert.equal((tasting.match(/class="programme-group"/g)||[]).length,3);
const home=read('index.html');assert.ok(home.includes('id="philosophy"'));assert.ok(!home.includes('id="home-tasting-intro"'));
for(const name of fs.readdirSync('github-pages').filter(f=>f.endsWith('.html'))){
 const h=read(name);for(const tag of ['header','footer']){const section=h.match(new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}>`))[0];assert.ok(section.includes('src="brand-symbol-008.svg"'));assert.ok(!section.includes('<div class="brand-name">OM '))}
 assert.ok(h.includes('class="age-brand wordmark" role="img" aria-label="WHISKY ACADEMY"'));
}
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');assert.equal(hash('assets/brand-symbol-008.svg'),hash('github-pages/brand-symbol-008.svg'));
// Switching language must insert new CTA links before the existing version/language URL pass.
assert.ok(read('website.js').indexOf('window.renderAcademyContent?.(lang)')<read('website.js').indexOf("document.querySelectorAll('a[href]')"));
// HTML is escaped even if future copy contains markup.
c.data.en.programs[0][0]='<img onerror="x">';assert.ok(c.fragments('en').programmes.includes('&lt;img onerror=&quot;x&quot;&gt;'));
console.log('PASS: complete approved author text, translation parity, 16 grouped programmes, sequential order without spotlight, safe templates, current CTA navigation, LOGO008 and wordmarks without OM.');
