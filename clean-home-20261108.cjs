// One-time source and existing-check updates for the approved simplification.
const fs=require('node:fs');
const data=require('./home-copy.cjs');
const lines={
 en:'2,000+ Whiskies from the private collection — tasted, studied and compared',
 de:'2.000+ Whiskys aus der privaten Sammlung — verkostet, erforscht und verglichen',
 uk:'2 000+ Віскі з приватної колекції — продегустовані, досліджені та порівняні'
};
const alts={en:'The Famous Grouse 30-year-old Malt Whisky bottle and presentation tube',de:'The Famous Grouse 30 Jahre Malt Whisky: Flasche und Präsentationsdose',uk:'Пляшка The Famous Grouse Malt Whisky 30 років і подарунковий тубус'};
for(const lang of ['en','de','uk']){
 const d=data[lang],cut=lang==='en'?'Explore the world':lang==='de'?'Erkunden Sie':'Пізнавайте світ';
 const i=d.heroSub.indexOf(cut);if(i<0)throw Error('Missing second hero sentence: '+lang);
 d.heroSub=d.heroSub.slice(i);d.heroCollectionLine=lines[lang];d.philosophyAlt=alts[lang];
}
fs.writeFileSync('home-copy.cjs','// Homepage copy and captions approved 8 November 2026.\nmodule.exports='+JSON.stringify(data,null,2)+';\n');
let css=fs.readFileSync('github-pages/home-layout.css','utf8');
css=css.replace(/#home \.hero-content\{[^}]+\}\.hero-proofs\{[^}]+\}/,'#home .hero-content{padding-bottom:110px}#home .hero-collection-line{color:var(--gold);font-size:16px;line-height:1.8;max-width:650px;margin:26px 0}.home-credentials{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px;padding:35px max(7%,calc((100vw - 1600px)/2));border-bottom:1px solid var(--line);background:var(--bg,#111410)}');
css=css.replace('.hero-proof{border-top:1px solid #7b70494f;padding-top:14px}', '.hero-proof{min-width:0}');
css=css.replace('.hero-proof span{display:block;color:#c9c8bb;font-size:11px;', '.hero-proof span{display:block;color:#c9c8bb;font-size:13px;');
css=css.replace('.home-philosophy>img{width:100%;height:550px;object-fit:cover}', '.home-philosophy>img{display:block;width:100%;height:600px;object-fit:contain}');
css=css.replace('.hero-proofs{gap:18px 20px}', '.home-credentials{grid-template-columns:1fr;gap:26px;padding:30px 7%}#home .hero-collection-line{font-size:14px}');
css=css.replace('.hero-proof span{font-size:10px}', '.hero-proof span{font-size:13px}');
css=css.replace('.home-philosophy>img{height:330px}', '.home-philosophy>img{height:auto;max-height:640px}');
fs.writeFileSync('github-pages/home-layout.css',css);
let test=fs.readFileSync('test-home-structure.cjs','utf8').replaceAll('length,4);\nassert.equal((main.match(/class="home-format"','length,3);\nassert.equal((main.match(/class="home-format"').replace('(f.proofs.match(/class="hero-proof"/g)||[]).length,4)', '(f.proofs.match(/class="hero-proof"/g)||[]).length,3)');
test=test.replace("assert.ok(!main.includes('id=\"experienceGrid\"'));", "assert.ok(main.indexOf('id=\"homeCredentials\"')>main.indexOf('</section>'));assert.ok(main.includes('id=\"heroCollectionLine\"'));assert.ok(main.includes('src=\"collection-new-06.webp\"'));assert.ok(!main.includes('id=\"experienceGrid\"'));");
test=test.replace('four proof cards and formats', 'gold collection line, three facts below the hero and four formats');fs.writeFileSync('test-home-structure.cjs',test);
let academy=fs.readFileSync('test-academy-content.cjs','utf8').replace('assert.deepEqual(indices.slice(0,4),[7,8,2,9]);','assert.deepEqual(indices,Array.from({length:16},(_,i)=>i));assert.ok(!f.programmes.includes(\'programme-spotlight\'));').replace('featured order','sequential order without spotlight');fs.writeFileSync('test-academy-content.cjs',academy);
let v=fs.readFileSync('version-site.cjs','utf8').replace("const release='20261108-home-story-collection'", "const release='20261108-clean-hero'");fs.writeFileSync('version-site.cjs',v);
