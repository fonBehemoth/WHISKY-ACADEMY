const fs=require('fs'),vm=require('vm'),files=new Set();
for(const f of fs.readdirSync('github-pages').filter(x=>x.endsWith('.html')))for(const m of fs.readFileSync('github-pages/'+f,'utf8').matchAll(/<script src="([^"?]+)[^"]*"/g))files.add(m[1]);
for(const file of files){try{new vm.Script(fs.readFileSync('github-pages/'+file,'utf8'),{filename:file})}catch(e){throw Error(file+': '+e.message)}}
console.log('PASS: syntax of '+files.size+' scripts loaded by all seven pages.');
