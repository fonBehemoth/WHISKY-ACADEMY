const fs=require('node:fs'),path=require('node:path');
const translations=require('./academy-translations.cjs');
const read=p=>fs.readFileSync(p,'utf8').replace(/\r/g,'');
const clean=s=>s.replaceAll('Whisky Academy','OM Whisky Academy').replace(/more than 2,000/gi,m=>m===m.toUpperCase()?'OVER 2,000':'over 2,000');
const paragraphs=s=>s.trim().split('\n').map(x=>x.trim()).filter(Boolean);
const rawAuthor=clean(read('D:/WHISKEY/НА СТРАНИЦУ АВТОРА УИСКИ.txt').split('Мой главный совет:')[0]);
const authorBlocks=rawAuthor.trim().split(/\n\s*\n/);
const author=[];
for(const block of authorBlocks){if(/^[A-Z0-9 ,.—]+$/.test(block)||/^over 2,000 WHISKIES/.test(block)){author.push({title:block,paragraphs:[]})}else author.at(-1).paragraphs.push(block.trim())}
const authorQuote=author.at(-1).paragraphs.pop();
const raw=clean(read('D:/WHISKEY/ДЕГУСТАЦИИ.txt').split('Мои стратегические замечания')[0].split('Текст\n')[1]);
const groupLabels=["AUTHOR'S TASTING COLLECTION","HISTORIC & COLLECTOR'S TASTINGS",'WHISKY WITHOUT BORDERS'];
const methodLabel='HOW OUR TASTINGS WORK',privateLabel='PRIVATE & CORPORATE TASTINGS';
const between=(start,end)=>raw.slice(raw.indexOf(start)+start.length,raw.indexOf(end)).trim();
const introLines=paragraphs(raw.slice(0,raw.indexOf(groupLabels[0])));
const groups=groupLabels.map((label,i)=>{const lines=paragraphs(between(label,`${i===0?'01':i===1?'09':'11'}.`));return {label,title:lines.shift(),paragraphs:lines}});
const starts=[...raw.matchAll(/^(\d{2})\. (.+)$/gm)];
const programs=starts.filter(m=>Number(m[1])<=16&&raw.indexOf(methodLabel)>m.index).map((m,i,all)=>{
 const next=all[i+1]?.index??raw.indexOf(methodLabel);
 const chunk=raw.slice(m.index+m[0].length,next).split(/AUTHOR'S TASTING COLLECTION|HISTORIC & COLLECTOR'S TASTINGS|WHISKY WITHOUT BORDERS|HOW OUR TASTINGS WORK/)[0];
 const lines=paragraphs(chunk);return [m[2],lines.shift(),...lines];
});
if(programs.length!==16||author.length!==4)throw Error('Source structure has changed');
const methodText=between(methodLabel,privateLabel);
const methodLines=paragraphs(methodText);
const methods=[...methodText.matchAll(/^0[123]\. (.+)\n([^\n]+)/gm)].map(m=>[m[1],m[2]]);
const privateLines=paragraphs(raw.slice(raw.indexOf(privateLabel)+privateLabel.length));
const closingIndex=privateLines.indexOf('Open a Bottle. Discover a Story.');
const en={author,authorQuote,programs,tasting:{label:introLines.shift(),title:introLines.shift(),intro:introLines,
 featured:'A different perspective on whisky',featuredIntro:'Selected programmes with distinctive historical and comparative perspectives.',groups,
 methodLabel,methodTitle:methodLines[0],methodIntro:methodLines[1],methods,
 comparison:methodLines.at(-1),privateLabel,privateTitle:privateLines[0],privateParagraphs:privateLines.slice(1,closingIndex),
 cta:'Discuss a tasting',closing:privateLines[closingIndex],tagline:'The Art of understanding Whisky'}};
const data={en,...translations};
for(const [lang,d] of Object.entries(data)){
 if(d.programs.length!==16||d.author.length!==4||d.tasting.groups.length!==3||d.tasting.methods.length!==3)throw Error('Incomplete '+lang);
 for(let i=0;i<16;i++)if(d.programs[i].length!==en.programs[i].length)throw Error(`Paragraph mismatch ${lang} ${i+1}: ${d.programs[i].length}/${en.programs[i].length}`);
 for(let i=0;i<4;i++)if(d.author[i].paragraphs.length!==en.author[i].paragraphs.length)throw Error('Author paragraph mismatch '+lang);
}
fs.writeFileSync('github-pages/academy-data.js','// Approved source copy and translations, 7 November 2026.\nconst academyContent='+JSON.stringify(data)+';\nfor(const lang of ["en","de","uk"])pagesCopy[lang].themes=academyContent[lang].programs.map(p=>p[0]);\n');
fs.writeFileSync('github-pages/topics-data.js','// Author-approved programme descriptions replace the former editorial introductions.\nconst whiskyTopics='+JSON.stringify(en.programs.map((_,i)=>Object.fromEntries(Object.entries(data).map(([lang,d])=>[lang,d.programs[i].slice(1)]))))+';\n');
let md='# Тексты автора и дегустаций — 7 ноября 2026\n\nИсточник: документы пользователя. Редакторские комментарии не опубликованы; рекомендации по структуре дегустаций реализованы по прямому указанию пользователя. Название нормализовано до OM Whisky Academy, масштаб — over 2,000. Немецкий — письменный вариант для Швейцарии.\n';
for(const [lang,d] of Object.entries(data)){
 md+=`\n## ${lang.toUpperCase()}\n\n`;
 for(const a of d.author)md+=`### ${a.title}\n\n${a.paragraphs.join('\n\n')}\n\n`;
 md+=d.authorQuote+'\n\n### '+d.tasting.title+'\n\n'+d.tasting.intro.join('\n\n')+'\n\n';
 d.tasting.groups.forEach((g,i)=>{md+=`### ${g.label} — ${g.title}\n\n${g.paragraphs.join('\n\n')}\n\n`;d.programs.slice(...[[0,8],[8,10],[10,16]][i]).forEach(p=>md+=`#### ${p[0]}\n\n${p.slice(1).join('\n\n')}\n\n`)});
 md+=`### ${d.tasting.methodTitle}\n\n${d.tasting.methodIntro}\n\n${d.tasting.methods.map(p=>p.join('\n\n')).join('\n\n')}\n\n${d.tasting.comparison}\n\n### ${d.tasting.privateTitle}\n\n${d.tasting.privateParagraphs.join('\n\n')}\n\n${d.tasting.closing}\n`;
}
fs.writeFileSync('APPROVED_PAGE_TEXTS.md',md);
console.log('Prepared four author sections and 16 complete programmes in EN/DE/UK.');
