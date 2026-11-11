const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {capitalise,copyCase}=require('./whisky-case.cjs');
const dir=path.join(__dirname,'github-pages'),read=name=>fs.readFileSync(path.join(dir,name),'utf8');
const c={};
vm.runInNewContext(read('locale-data.js')+read('page-data.js')+read('academy-data.js')+read('topics-data.js')+';globalThis.caseData={copy,sharedLocale,photoTranslations,pagesCopy,academyContent,whiskyTopics};',c);
const data=copyCase(c.caseData);
fs.writeFileSync(path.join(dir,'locale-data.js'),['copy','sharedLocale','photoTranslations'].map(key=>'const '+key+'='+JSON.stringify(data[key])+';').join('\n')+'\n');
fs.writeFileSync(path.join(dir,'page-data.js'),'const pagesCopy='+JSON.stringify(data.pagesCopy)+';\n');
fs.writeFileSync(path.join(dir,'academy-data.js'),'// Approved copy, with Whisky capitalisation requested on 7 November 2026.\nconst academyContent='+JSON.stringify(data.academyContent)+';\nfor(const lang of ["en","de","uk"])pagesCopy[lang].themes=academyContent[lang].programs.map(p=>p[0]);\n');
fs.writeFileSync(path.join(dir,'topics-data.js'),'// Approved programme descriptions.\nconst whiskyTopics='+JSON.stringify(data.whiskyTopics)+';\n');
for(const file of fs.readdirSync(dir).filter(n=>n.endsWith('.html'))){
 let h=read(file);
 h=h.replace(/>([^<>]+)</g,(_,text)=>'>'+capitalise(text)+'<');
 h=h.replace(/\b(alt|title|aria-label)="([^"]*)"/g,(_,attr,value)=>`${attr}="${capitalise(value)}"`);
 h=h.replace(/<meta\b[^>]*name="(?:description|application-name)"[^>]*>/g,meta=>meta.replace(/content="([^"]*)"/,(_,value)=>`content="${capitalise(value)}"`));
 fs.writeFileSync(path.join(dir,file),h);
}
console.log('Capitalised Whisky/Whiskey/Whiskies/Віскі/Виски in copy and HTML; paths and URLs preserved.');
