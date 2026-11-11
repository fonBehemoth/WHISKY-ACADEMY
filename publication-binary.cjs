const fs=require('node:fs'),path=require('node:path');
const name=process.argv[2];if(!/^(?:(?:collection-new-\d{2}|author-moment-(?:20261109-)?0[1-4]|author-slide-20261110-0[1-5]|tasting-20261110-0[1-5]|philosophy-om-001)\.webp|linkwood-promo\.mp4)$/.test(name))throw Error('Unexpected asset name');
const b=fs.readFileSync(path.join(__dirname,'github-pages',name));
const start=Number(process.argv[3]||0),size=Number(process.argv[4]||b.length);
process.stdout.write(b.subarray(start,start+size).toString('base64'));
