const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const dir='D:/WHISKEY/Академия_Виски_№2_9_8_24_20261031T152920Z_1_001 (2)/Академия Виски №2 9.8.24/АВТОР';
const photos=[
 ...['Dressing_person_in_blazer_42060164_2K.jpg','Новая папка/IMG_3011_1_01.jpg','Новая папка/IMG_3026_1_01.jpg','Новая папка/IMG_3032_1_01.jpg','ротари_1.jpg'].map((source,i)=>({source,file:`author-slide-20261110-0${i+1}.webp`})).filter(p=>!p.source.includes('IMG_3032'))
];
const magick='C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe',manifest=[];
for(const {source,file} of photos){
 const dest=path.join('github-pages',file);
 const result=spawnSync(magick,[path.join(dir,source),'-auto-orient','-resize','1600x1200>','-strip','-quality','83',dest],{encoding:'utf8'});if(result.status)throw Error(result.stderr);
 const size=spawnSync(magick,['identify','-format','%w %h',dest],{encoding:'utf8'}).stdout.trim().split(' ').map(Number);
 manifest.push({source:path.basename(source),file,width:size[0],height:size[1],bytes:fs.statSync(dest).size});
}
fs.writeFileSync('assets/author-gallery-manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(manifest);
