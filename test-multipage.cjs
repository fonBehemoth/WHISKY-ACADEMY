const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const dir=path.join(__dirname,'github-pages');const files=fs.readdirSync(dir).filter(f=>f.endsWith('.html'));
const ctx={};vm.runInNewContext(fs.readFileSync(path.join(dir,'locale-data.js'),'utf8')+fs.readFileSync(path.join(dir,'page-data.js'),'utf8')+';globalThis.data={copy,pagesCopy}',ctx);
for(const file of files){const html=fs.readFileSync(path.join(dir,file),'utf8');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length,file+' duplicate IDs');
for(const lang of ['en','de','uk','fr','it']){for(const m of html.matchAll(/data-t="([^"]+)"/g))assert.ok(ctx.data.copy[lang][m[1]],file+' missing '+lang+' '+m[1]);for(const m of html.matchAll(/data-n="([^"]+)"/g))assert.ok(ctx.data.pagesCopy[lang][m[1]],file+' missing '+lang+' '+m[1]);}
for(const m of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)){if(!m[1].startsWith('http'))assert.ok(fs.existsSync(path.join(dir,m[1])),file+' broken asset/link '+m[1])}}
assert.equal(files.length,7);
console.log('PASS: seven pages, unique IDs, all translation references in five languages, all local links and assets.');
