const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {copyCase}=require('./whisky-case.cjs');
const data=copyCase(require('./home-copy.cjs'));
const dir=path.join(__dirname,'github-pages'),file=name=>path.join(dir,name);
const ds='// Homepage sequence approved 8 November 2026.\nconst homeCopy='+JSON.stringify(data)+';\nfor(const lang of ["en","de","uk"]){Object.assign(copy[lang],{heroTitle:homeCopy[lang].heroTitle,heroSub:homeCopy[lang].heroSub,heroCta:homeCopy[lang].heroCta});pagesCopy[lang].pageNames[0]=homeCopy[lang].heroTitle.replace(/<br>/g," ").replace(/<\\/?em>/g,"");}\n';
fs.writeFileSync(file('home-data.js'),ds);
const c={};vm.runInNewContext('const homeCopy='+JSON.stringify(data)+';'+fs.readFileSync(file('home-render.js'),'utf8')+';globalThis.fragments=homeFragments("en")',c);
const f=c.fragments;
let h=fs.readFileSync(file('index.html'),'utf8');
const section=id=>[...h.matchAll(/<section\b[\s\S]*?<\/section>/g)].map(x=>x[0]).find(s=>new RegExp(`\\bid="${id}"`).test(s));
let hero=section('home');if(!hero)throw Error('Hero missing');
hero=hero.replace(/<h1 data-t="heroTitle">[\s\S]*?<\/h1>/,`<h1 data-t="heroTitle">${data.en.heroTitle}</h1>`).replace(/<p class="hero-sub" data-t="heroSub">[\s\S]*?<\/p>/,`<p class="hero-sub" data-t="heroSub">${data.en.heroSub}</p>`).replace(/(<a class="button solid"[^>]*data-t="heroCta">)[\s\S]*?<\/a>/,'$1'+data.en.heroCta+'</a>');
const collectionLine=`<p class="hero-collection-line" id="heroCollectionLine">${f.collectionLine}</p>`;
if(hero.includes('id="heroProofs"'))hero=hero.replace(/<div class="hero-proofs" id="heroProofs">[\s\S]*?<\/div><!-- hero-proofs-end -->/,collectionLine);
else if(hero.includes('id="heroCollectionLine"'))hero=hero.replace(/<p class="hero-collection-line" id="heroCollectionLine">[\s\S]*?<\/p>/,collectionLine);
else hero=hero.replace(/<div class="facts hero-facts">[\s\S]*?<\/div>/,collectionLine);
const founder=section('founder'),community=section('community');
const photo=founder?.match(/<div class="founder-photo[^>]*>[\s\S]*?<\/div>/)?.[0];
const cities=community?.match(/<div class="cities[^>]*>[\s\S]*?<\/div><\/div>/)?.[0];
const promo=h.match(/<div class="project-promo-wrap">[\s\S]*?<\/div><\/section>/)?.[0].replace(/<\/section>$/,'');
if(!photo||!cities||!promo)throw Error('Existing homepage media or club counts missing');
const images=['collection-new-03.webp','collection-new-18.webp','collection-new-04.webp'];
const gallery=images.map((src,i)=>`<figure><img src="${src}" data-home-collection-image="${i}" alt="${data.en.collectionAlts[i]}" loading="lazy"><figcaption data-home-collection-caption="${i}">${data.en.collectionCaptions[i]}</figcaption></figure>`).join('');
const main='<main id="main">'+hero+
 `<div class="home-credentials" id="homeCredentials">${f.proofs}</div>`+
 `<section class="section home-philosophy" id="philosophy"><div id="homePhilosophyCopy">${f.philosophy}</div><img src="philosophy-20261112.webp" data-home-image="philosophy" alt="${data.en.philosophyAlt}" loading="lazy" width="1200" height="1200"></section>`+
 `<section class="section home-tastings" id="experiences"><div class="home-section-intro" id="homeTastingCopy">${f.tastings}</div><div class="home-format-grid" id="homeFormats">${f.formats}</div><div id="homeTastingCta">${f.tastingCta}</div></section>`+
 `<section class="section home-collection" id="collection"><div class="home-section-intro" id="homeCollectionCopy">${f.collection}</div><div class="home-collection-grid">${gallery}</div><div id="homeCollectionCta">${f.collectionCta}</div></section>`+
 `<section class="section founder home-founder" id="founder">${photo}<div class="founder-copy" id="homeFounderCopy">${f.founder}</div></section>`+
 `<section class="section community home-community" id="community"><div class="home-section-intro" id="homeCommunityCopy">${f.community}</div>${cities}<div class="community-bottom" id="homeCommunityFoot">${f.communityFoot}</div></section>`+
 `<section class="section project-feature home-project" id="signature-project"><div id="homeProjectCopy">${f.project}</div>${promo}</section>`+
 `<section class="section home-invitation" id="invitation"><div id="homeInvitationCopy">${f.invitation}</div></section></main>`;
h=h.replace(/<main id="main">[\s\S]*?<\/main>/,main);
h=h.replace(/<script src="(?:academy-data|academy-render|home-data|home-render)\.js(?:\?[^"]*)?" defer><\/script>/g,'').replace(/<link rel="stylesheet" href="(?:academy-content|home-layout)\.css(?:\?[^"]*)?">/g,'');
h=h.replace(/(<script src="website\.js(?:\?[^"]*)?" defer><\/script>)/,'<script src="home-data.js" defer></script><script src="home-render.js" defer></script>$1').replace('</head>','<link rel="stylesheet" href="home-layout.css"></head>');
h=h.replace(/(<meta name="description" content=")[^"]*/, '$1'+data.en.heroSub);
h=h.replace(/<title>[\s\S]*?<\/title>/,'<title>The Art of Understanding Whisky | OM WHISKY ACADEMY</title>');
fs.writeFileSync(file('index.html'),h);
let js=fs.readFileSync(file('website.js'),'utf8');if(!js.includes('window.renderHomePage?.(lang)'))js=js.replace('window.renderAcademyContent?.(lang);','window.renderAcademyContent?.(lang);\nwindow.renderHomePage?.(lang);');fs.writeFileSync(file('website.js'),js);
console.log('Homepage rebuilt: Hero, Philosophy, Tastings, Collection, Founder, Community, Linkwood, Invitation.');
