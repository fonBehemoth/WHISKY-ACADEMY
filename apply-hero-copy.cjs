const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const dir=path.join(__dirname,'github-pages');
const updates={
 en:{heroTitle:'The Art of<br>understanding<br><em>Whisky</em>',heroSub:'Discover the stories, craftsmanship and character behind every glass. Explore the world of Whisky through the knowledge and experience of collector and educator Oleksandr Martynov.',heroFacts:['2,000+ Whiskies from his personal collection — tasted, studied and compared','Over a decade of comparative tasting and research','Exploring Whisky since 2013','Based in Switzerland'],heroCta:'Explore a tasting'},
 de:{heroTitle:'Die Kunst,<br><em>Whisky</em> zu<br>Verstehen',heroSub:'Entdecken Sie die Geschichten, das Handwerk und den Charakter hinter jedem Glas. Erkunden Sie die Welt des Whiskys mit dem Wissen und der Erfahrung des Sammlers und Whiskyvermittlers Oleksandr Martynov.',heroFacts:['2.000+ Whiskys aus seiner privaten Sammlung — verkostet, erforscht und verglichen','Über ein Jahrzehnt vergleichender Degustationen und Forschung','Beschäftigt sich seit 2013 mit Whisky','Lebt in der Schweiz'],heroCta:'Degustationen entdecken'},
 uk:{heroTitle:'Мистецтво<br>розуміти<br><em>Віскі</em>',heroSub:'Відкрийте історії, майстерність і характер, що стоять за кожним келихом. Пізнавайте світ Віскі через знання та досвід колекціонера й викладача Олександра Мартинова.',heroFacts:['2 000+ Віскі з його приватної колекції — продегустовані, досліджені та порівняні','Понад десятиліття порівняльних дегустацій і досліджень','Досліджує Віскі з 2013 року','Живе у Швейцарії'],heroCta:'Обрати дегустацію'}
};
const lp=path.join(dir,'locale-data.js');let locale=fs.readFileSync(lp,'utf8').replace(/\/\/ Approved hero copy start[\s\S]*?\/\/ Approved hero copy end\n?/g,'');
locale+='\n// Approved hero copy start\n'+Object.entries(updates).map(([lang,d])=>'Object.assign(copy.'+lang+','+JSON.stringify(d)+');').join('\n')+'\n// Approved hero copy end\n';
fs.writeFileSync(lp,locale);
const hp=path.join(dir,'index.html');let html=fs.readFileSync(hp,'utf8');
html=html.replace(/<section class="hero" id="home">[\s\S]*?<\/section>/,section=>section
 .replace(/<p class="eyebrow" data-t="heroEyebrow">[\s\S]*?<\/p>/,'')
 .replace(/(<h1 data-t="heroTitle">)[\s\S]*?<\/h1>/,'$1'+updates.en.heroTitle+'</h1>')
 .replace(/(<p class="hero-sub" data-t="heroSub">)[\s\S]*?<\/p>/,'$1'+updates.en.heroSub+'</p>')
 .replace(/<div class="facts(?: hero-facts)?">[\s\S]*?<\/div>/,'<div class="facts hero-facts">'+updates.en.heroFacts.map((s,i)=>`<span data-hero-fact="${i}">${s}</span>`).join('')+'</div>')
 .replace(/<a class="text-link" href="author\.html[^\"]*">[\s\S]*?<\/a>/,'')
 .replace(/(<a class="button solid"[^>]*data-t="heroCta">)[\s\S]*?<\/a>/,'$1'+updates.en.heroCta+'</a>'));
if(!html.includes('href="hero-copy.css'))html=html.replace('</head>','<link rel="stylesheet" href="hero-copy.css"></head>');
fs.writeFileSync(hp,html);
const jp=path.join(dir,'website.js');let js=fs.readFileSync(jp,'utf8');
if(!js.includes("querySelectorAll('[data-hero-fact]')"))js=js.replace("fill('themes',", "document.querySelectorAll('[data-hero-fact]').forEach(el=>el.textContent=(t.heroFacts||n.facts)[el.dataset.heroFact]);\nfill('themes',");
fs.writeFileSync(jp,js);
console.log('Updated hero title, introduction, four translated facts and primary CTA.');
