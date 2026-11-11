const fs=require('node:fs'),path=require('node:path');
const target=path.resolve(__dirname,'../home-copy.cjs'),d=require(target);
Object.assign(d.en,{collectionCaptions:['Bottles and their stories','Distilleries and releases','Whisky and tasting'],collectionAlts:['Johnnie Walker Swing with its presentation box','Four Whisky bottles from the personal collection','Haig Dimple with a tasting glass']});
Object.assign(d.de,{collectionCaptions:['Flaschen und ihre Geschichten','Brennereien und Abfüllungen','Whisky und Degustation'],collectionAlts:['Johnnie Walker Swing mit Präsentationsbox','Vier Whiskyflaschen aus der privaten Sammlung','Haig Dimple mit einem Degustationsglas']});
Object.assign(d.uk,{collectionCaptions:['Пляшки та їхні історії','Дистилерії та релізи','Віскі й дегустація'],collectionAlts:['Johnnie Walker Swing з презентаційною коробкою','Чотири пляшки Віскі з особистої колекції','Haig Dimple з дегустаційним келихом']});
fs.writeFileSync(target,'// Homepage copy and captions for the provided replacement photographs.\nmodule.exports='+JSON.stringify(d,null,2)+';\n');
