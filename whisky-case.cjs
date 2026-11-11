const word=/(?<![\p{L}\p{N}_])(?:whisky|whiskey|whiskies|whiskys|whiskeys|віскі|виски)(?![\p{L}\p{N}_])/giu;
function capitalise(text){return String(text).replace(word,s=>s[0].toUpperCase()+s.slice(1))}
function copyCase(value){
 if(typeof value==='string'){
  // Asset names and destinations are identifiers, not typography.
  if(/^(?:https?:|\/\/|mailto:|tel:|data:)/i.test(value)||/^[\w./-]+\.(?:html|js|css|jpg|jpeg|png|webp|svg|mp4|txt)(?:[?#].*)?$/i.test(value))return value;
  return capitalise(value);
 }
 if(Array.isArray(value))return value.map(copyCase);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,copyCase(v)]));
 return value;
}
module.exports={capitalise,copyCase};
