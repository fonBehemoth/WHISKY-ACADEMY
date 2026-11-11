const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const input = fs.readFileSync(path.join(root,'github-pages/index.html'),'utf8');
const header = input.match(/<header id="header">[\s\S]*?<\/header>/)[0];
const hero = input.match(/<section class="hero" id="home">[\s\S]*?<\/section>/)[0]
  .replace(/<video[\s\S]*?<\/video>/,'<img class="hero-image" src="../github-pages/hero-poster.jpg" alt="">')
  .replace(/<button type="button" class="hero-motion"[\s\S]*?<\/button>/,'');
const out = path.join(root,'logo-preview');
fs.mkdirSync(out,{recursive:true});
for (const variant of ['bold','serif']) {
  const h = header.replace('src="brand-symbol-003.svg"',`src="../assets/omega-m-gold-${variant}-v1.svg"`);
  fs.writeFileSync(path.join(out,`${variant}.html`),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Logo ${variant} — local preview</title><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="../github-pages/style.css"><link rel="stylesheet" href="../github-pages/multipage.css"><style>html,body{overflow:hidden}.hero{min-height:100vh}header .brand-symbol{object-fit:contain} .hero-buttons,.hero-bottom{display:none}</style><body>${h}<main>${hero}</main></body></html>`);
}
console.log('Two isolated homepage fixtures created; public files unchanged.');
