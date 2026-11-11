const fs=require('node:fs'),vm=require('node:vm');const ctx={};
vm.runInNewContext(fs.readFileSync('github-pages/page-data.js','utf8')+fs.readFileSync('github-pages/topics-data.js','utf8')+';globalThis.data={pagesCopy,whiskyTopics}',ctx);
let md='# OM Whisky Academy — вводные тексты семи тем\n\n5 ноября 2026 года. Оригинальные редакционные тексты на основе указанных источников, не скопированные статьи и не утверждённые программы Александра. Исторические факты отделены от предлагаемых вопросов для обсуждения. Формат — три коротких абзаца и источник.\n\n';
ctx.data.whiskyTopics.forEach((topic,i)=>{md+=`## ${i+1}. ${ctx.data.pagesCopy.uk.themes[i]}\n\n`;for(const lang of ['en','de','uk'])md+=`### ${lang.toUpperCase()}\n\n${topic[lang].join('\n\n')}\n\n`;md+=`Источник: [${topic.source[0]}](${topic.source[1]}).\n\n`});
fs.writeFileSync('TOPIC_TEXTS.md',md);
