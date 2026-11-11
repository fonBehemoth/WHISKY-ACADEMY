const fs=require('node:fs'),vm=require('node:vm');
const read=n=>fs.readFileSync('github-pages/'+n,'utf8'),write=(n,s)=>fs.writeFileSync('github-pages/'+n,s);
const strings=require('./localization/en-strings.json'),pairs={};
for(const f of ['fr-it-01.txt','fr-it-02.txt'])for(const line of fs.readFileSync('localization/'+f,'utf8').trim().split(/\r?\n/).filter(s=>s.trim())){const [id,fr,it,...rest]=line.split('|');if(rest.length||!fr||!it||pairs[id])throw Error('Invalid translation row '+id);pairs[id]=[fr,it]}
// Proper names, product names, cask identifiers, years, file names and internal route keys remain unchanged.
const identical=new Set([39,40,41,70,71,74,75,79,80,84,85,90,119,120,200,202,205,208,223,240,245,248,393,420,421,422,423,426,427,431,432,434]);
const dict={fr:{},it:{}};
strings.forEach((s,i)=>{if(!pairs[i]&&!identical.has(i))throw Error('Missing translation '+i+': '+s);dict.fr[s]=pairs[i]?.[0]??s;dict.it[s]=pairs[i]?.[1]??s});
fs.writeFileSync('localization/fr-it-dictionary.json',JSON.stringify(dict,null,2));
function translate(x,lang){if(typeof x==='string'){if(!Object.hasOwn(dict[lang],x))throw Error('Uncatalogued text: '+x);return dict[lang][x]}if(Array.isArray(x))return x.map(y=>translate(y,lang));if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,translate(v,lang)]));return x}
const catalog=require('./localization/en-content.json');
const live={};vm.runInNewContext(['locale-data.js','page-data.js','home-data.js','academy-data.js','author-gallery-data.js'].map(read).join('\n')+';globalThis.content={copy:copy.en,pagesCopy:pagesCopy.en,homeCopy:homeCopy.en,academyContent:academyContent.en,authorGalleryCopy:authorGalleryCopy.en,photoTranslations:photoTranslations.en};',live);
for(const [name,en] of Object.entries(live.content))if(JSON.stringify(en)!==JSON.stringify(catalog[name]))throw Error('English content changed; review FR/IT translations before building: '+name);
const clean=s=>s.replace(/\n?\/\/ Five-language translations start[\s\S]*?\/\/ Five-language translations end\n?/g,'\n');
const assignment=(name,en)=>['fr','it'].map(lang=>`${name}.${lang}=${JSON.stringify(translate(en,lang))};`).join('\n');
function add(file,code,before){let s=clean(read(file));const chunk='\n// Five-language translations start\n'+code+'\n// Five-language translations end\n';s=before?s.replace(before,chunk+before):s+chunk;write(file,s)}
add('locale-data.js',assignment('copy',catalog.copy)+'\n'+assignment('photoTranslations',catalog.photoTranslations));
add('page-data.js',assignment('pagesCopy',catalog.pagesCopy));
add('home-data.js',assignment('homeCopy',catalog.homeCopy)+'\nfor(const lang of ["fr","it"]){Object.assign(copy[lang],{heroTitle:homeCopy[lang].heroTitle,heroSub:homeCopy[lang].heroSub,heroCta:homeCopy[lang].heroCta});pagesCopy[lang].pageNames[0]=homeCopy[lang].heroTitle.replace(/<br>/g," ").replace(/<\\/?em>/g,"");}');
add('academy-data.js',assignment('academyContent',catalog.academyContent)+'\nfor(const lang of ["fr","it"])pagesCopy[lang].themes=academyContent[lang].programs.map(p=>p[0]);');
add('author-gallery-data.js',assignment('authorGalleryCopy',catalog.authorGalleryCopy));
for(const [file,name,before] of [['new-collection.js','newCollectionCaptions','(()=>'],['tasting-gallery.js','tastingGalleryCopy','(()=>'],['linkwood-media.js','linkwoodMediaCopy','function localizeLinkwoodMedia']])add(file,assignment(name,catalog[name]),before);
// The modal paragraphs come from the same approved programme data as the page.
let topics=clean(read('topics-data.js'));topics+='\n// Five-language translations start\n'+catalog.academyContent.programs.map((_,i)=>['fr','it'].map(lang=>`whiskyTopics[${i}].${lang}=${JSON.stringify(translate(catalog.academyContent.programs[i].slice(1),lang))};`).join('\n')).join('\n')+'\n// Five-language translations end\n';write('topics-data.js',topics);
for(const [file,name] of [['hero-video.js','labels'],['project-promo-video.js','words'],['topics-modal.js','ui']]){let s=read(file);const rx=new RegExp('(const '+name+'=)(\\{[^\\n]+?\\})(;)');s=s.replace(rx,(_,a,json,z)=>{const d=vm.runInNewContext('('+json+')');for(const lang of ['fr','it'])d[lang]=translate(catalog[file],lang);return a+JSON.stringify(d)+z});write(file,s)}
let js=read('website.js').replace("const supportedLanguages=['en','de','uk'];","const supportedLanguages=['en','de','uk','fr','it'];");
// Localise browser validation independently of the visitor's operating-system language.
js=js.replace(/\n\/\/ Local validation start[\s\S]*?\/\/ Local validation end\n?/g,'\n');
js+='\n// Local validation start\n'+`function localValidation(){const t=copy[document.documentElement.lang]||copy.en;document.querySelectorAll('#enquiry input,#enquiry textarea').forEach(el=>{el.setCustomValidity('');if(el.validity.valueMissing)el.setCustomValidity(t.requiredMessage);else if(el.validity.typeMismatch)el.setCustomValidity(t.emailMessage)})}document.getElementById('enquiry')?.addEventListener('input',localValidation);document.getElementById('enquiry')?.addEventListener('invalid',localValidation,true);window.addEventListener('wa:language',localValidation);\n`+'// Local validation end\n';write('website.js',js);
const buttons=['en','de','fr','it','uk'].map((l,i)=>(i?'<span>/</span>':'')+`<button type="button" data-lang="${l}" aria-pressed="${l==='en'}">${l==='uk'?'UA':l.toUpperCase()}</button>`).join('');
for(const file of fs.readdirSync('github-pages').filter(x=>x.endsWith('.html'))){let s=read(file);s=s.replace(/(<div class="languages(?: gate-languages)?"[^>]*>)[\s\S]*?<\/div>/g,'$1'+buttons+'</div>');s=s.replace(/<p class="no-script-notice">[\s\S]*?<\/p>/g,'<p class="no-script-notice">Please enable JavaScript to browse this website. · Bitte aktivieren Sie JavaScript. · Увімкніть JavaScript. · Veuillez activer JavaScript. · Attivate JavaScript.</p>');write(file,s)}
for(const file of fs.readdirSync('github-pages').filter(x=>x.endsWith('.html'))){let s=read(file).replace(/<link rel="stylesheet" href="five-languages\.css(?:\?[^" ]*)?">/g,'');write(file,s.replace('</head>','<link rel="stylesheet" href="five-languages.css"></head>'));}
console.log('Applied complete French and Italian content to all data sets, controls and language selectors.');
