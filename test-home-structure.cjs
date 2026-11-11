const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync('github-pages/'+f,'utf8');
const html=read('index.html'),main=html.match(/<main id="main">([\s\S]*?)<\/main>/)[1];
assert.deepEqual([...main.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]),['home','author-moments','philosophy','experiences','collection','founder','community','signature-project','invitation']);
assert.equal((main.match(/2,000/g)||[]).length,2);
assert.ok(main.indexOf('id="homeCredentials"')>main.indexOf('</section>'));assert.ok(main.includes('id="heroCollectionLine"'));assert.ok(main.includes('src="philosophy-om-001.webp"'));assert.ok(!main.includes('id="experienceGrid"'));assert.ok(!main.includes('home-tasting-intro'));
assert.equal((main.match(/class="hero-proof"/g)||[]).length,3);
assert.equal((main.match(/class="home-format"/g)||[]).length,4);
assert.ok(main.indexOf('homeFormats')<main.indexOf('id="founder"'));
assert.ok(html.indexOf('home-data.js')<html.indexOf('website.js'));assert.ok(!html.includes('academy-data.js'));
const c={};vm.runInNewContext(read('locale-data.js')+read('page-data.js')+read('home-data.js')+read('home-render.js')+';globalThis.data=homeCopy;globalThis.frag=homeFragments;',c);
const keys=Object.keys(c.data.en).sort();
for(const lang of ['en','de','uk']){
 const d=c.data[lang],f=c.frag(lang);assert.deepEqual(Object.keys(d).sort(),keys);assert.equal(d.proofs.length,4);assert.equal(d.formats.length,4);assert.equal(d.collectionCaptions.length,3);assert.equal(d.collectionAlts.length,3);
 assert.ok(f.invitation.includes('href="contact.html"'));assert.ok(f.formats.includes('tastings.html#academy-private'));assert.ok(f.formats.includes('tastings.html#themes'));assert.ok(f.formats.includes('tastings.html#academy-method'));
 assert.equal((f.proofs.match(/class="hero-proof"/g)||[]).length,3);
 assert.ok(!JSON.stringify(d).includes('3,000'));
}
const js=read('website.js');assert.ok(js.indexOf('window.renderHomePage?.(lang)')<js.indexOf("document.querySelectorAll('a[href]')"));
c.data.en.invitationTitle='<img onerror="bad">';assert.ok(c.frag('en').invitation.includes('&lt;img onerror=&quot;bad&quot;&gt;'));
assert.ok(main.includes('id="linkwoodPromoPlayer"'));assert.ok(!main.includes('<iframe'));
console.log('PASS: nine sections including the author gallery, limited repetition, gold collection line, three facts below the hero and four formats in EN/DE/UK, safe templates, current navigation and deferred Linkwood film.');
