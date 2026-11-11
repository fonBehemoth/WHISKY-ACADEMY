const fs=require('node:fs'),path=require('node:path');
const dir=path.join(__dirname,'github-pages');
const photos=[
 ['collection-photo-01.webp','Caol Ila · Glenfarclas 1997'],
 ['collection-photo-02.webp','The Famous Grouse'],
 ['collection-photo-03.webp','Ben Nevis · The Single Malts of Scotland'],
 ['collection-photo-04.webp','Talisker · That Boutique-y Whisky Company · Sierra',true],
 ['collection-photo-05.webp','Glenfarclas 25'],
 ['collection-photo-06.webp',"Beam’s Choice · The Irishman"],
 ['collection-photo-07.webp','Hart Brothers · Lagavulin'],
 ['collection-photo-08.webp',"Berry’s Linkwood · Glenkinchie"],
 ['collection-photo-09.webp','Martell Cognac · The Glenlivet'],
 ['collection-photo-10.webp','Teeling Renaissance · 18 Years']
];
const section=`<section class="section collection-archive" id="collectionPhotos"><div class="gallery-heading"><div><p class="eyebrow" data-n="archiveLabel">A private collection</p><h2 data-n="archiveTitle">Bottles and details</h2></div><span data-t="galleryHint">SELECT A PHOTOGRAPH TO EXPLORE</span></div><div class="collection-photo-grid">${photos.map(([file,alt,wide])=>`<figure${wide?' class="landscape"':''}><button type="button" class="gallery-item" data-photo="${file}" aria-label="Open photograph"><img src="${file}" alt="${alt}" loading="lazy" decoding="async" width="${wide?1280:720}" height="${wide?720:1280}"></button><figcaption>${alt}</figcaption></figure>`).join('')}</div></section>`;
let html=fs.readFileSync(path.join(dir,'collection.html'),'utf8');
html=html.replace(/<section class="section collection-archive"[\s\S]*?<\/section>/,'');
html=html.replace('<section class="section gallery"',section+'<section class="section gallery"');
fs.writeFileSync(path.join(dir,'collection.html'),html);
const translations={en:{archiveLabel:'A private collection',archiveTitle:'Bottles and details'},de:{archiveLabel:'Eine private Sammlung',archiveTitle:'Flaschen und Details'},uk:{archiveLabel:'Приватна колекція',archiveTitle:'Пляшки та деталі'}};
const dataPath=path.join(dir,'page-data.js');let data=fs.readFileSync(dataPath,'utf8').split('// Collection photo archive')[0];
data+='\n// Collection photo archive\n'+Object.entries(translations).map(([lang,words])=>`Object.assign(pagesCopy.${lang},${JSON.stringify(words)});`).join('\n')+'\n';
fs.writeFileSync(dataPath,data);
const cssPath=path.join(dir,'multipage.css');let css=fs.readFileSync(cssPath,'utf8');
if(!css.includes('/* Collection photo archive */'))css+=`\n/* Collection photo archive */
.collection-archive{border-top:1px solid var(--line)}.collection-photo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:38px 24px}.collection-photo-grid figure{margin:0;min-width:0}.collection-photo-grid .gallery-item{display:block;width:100%;aspect-ratio:9/16;background:#0c0e0b}.collection-photo-grid img{object-fit:contain}.collection-photo-grid figcaption{font-size:11px;color:var(--muted);line-height:1.6;padding-top:14px}.collection-photo-grid .landscape{grid-column:1/-1}.collection-photo-grid .landscape .gallery-item{aspect-ratio:16/9}
@media(max-width:900px){.collection-photo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.collection-photo-grid{grid-template-columns:1fr;gap:28px}.collection-photo-grid .gallery-item{max-height:75svh;aspect-ratio:auto}.collection-photo-grid img{height:auto;max-height:75svh}}
`;
fs.writeFileSync(cssPath,css);
console.log('Added ten collection photos, translations and responsive gallery.');
