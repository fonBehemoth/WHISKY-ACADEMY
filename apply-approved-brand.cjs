const fs=require('node:fs'),path=require('node:path');
const dir=path.join(__dirname,'github-pages');
function approved(text){return text
 .replace(/\b(?:OM )?WHISKY ACADEMY\b/g,'OM WHISKY ACADEMY')
 .replace(/\b(?:OM )?Whisky Academy\b/g,'OM Whisky Academy')
 .replace(/(?:(?:[Oo]ver|[Mm]ore than)\s+)?2,000/g,'over 2,000')
 .replace(/(?:(?:[Üü]ber|[Mm]ehr als)\s+)?2\.000/g,'über 2.000')
 .replace(/(?:[Пп]онад\s+)?2 000/g,'понад 2 000')
 .replace(/(<h1\b[^>]*>)over /g,'$1Over ')
 .replace(/(["'])over 2,000/g,'$1Over 2,000')
 .replace(/(["'])über 2\.000/g,'$1Über 2.000')
 .replace(/(["'])понад 2 000/g,'$1Понад 2 000')
 .replace(/(<div class="brand-name">)(?:OM )?WHISKY /g,'$1WHISKY ');
}
for(const name of [...fs.readdirSync(dir).filter(x=>x.endsWith('.html')), 'locale-data.js','page-data.js','website.js','app.js']){
 const file=path.join(dir,name);fs.writeFileSync(file,approved(fs.readFileSync(file,'utf8')));
}
console.log('Applied approved OM Whisky Academy name and over 2,000 wording in all locales.');
