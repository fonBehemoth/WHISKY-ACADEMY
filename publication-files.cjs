const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=path.join(__dirname,'github-pages');
const names=process.argv.slice(2);
if(names.length){console.log(JSON.stringify(names.map(name=>({path:name,mode:'100644',type:'blob',content:fs.readFileSync(path.join(dir,name),'utf8')}))))}
else console.log(JSON.stringify(fs.readdirSync(dir).filter(name=>fs.statSync(path.join(dir,name)).isFile()).map(name=>{const b=fs.readFileSync(path.join(dir,name));return {path:name,sha:crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex'),bytes:b.length}})));
