const fs=require('node:fs');
const path=require('node:path');
const screenshot=fs.readFileSync(path.join(__dirname,'home-logo-comparison-source.png')).toString('base64');
for(const variant of ['bold','serif']){
  const logo=fs.readFileSync(path.join(__dirname,`omega-m-gold-${variant}-v1.svg`),'utf8')
    .replace(/<\?xml[^>]*>\s*/,'')
    .replace(/width="900" height="\d+"/,'x="92" y="42" width="82" height="82"');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1821" height="906" viewBox="0 0 1821 906"><image width="1821" height="906" xlink:href="data:image/png;base64,${screenshot}"/><rect x="90" y="40" width="87" height="86" fill="#11130f"/>${logo}</svg>`;
  fs.writeFileSync(path.join(__dirname,`home-logo-${variant}-exact-v1.svg`),svg);
}
console.log('Exact SVG composition boards created.');
