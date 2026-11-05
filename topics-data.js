// Original editorial introductions, based on the linked primary sources. Reviewed 2026-11-05.
const whiskyTopics = [
 {source:['Ohio State University · Medicinal Alcohol','https://prohibition.osu.edu/american-prohibition-1920/medicinal-alcohol'],
 en:[
  'During Prohibition in the United States, physicians could prescribe whisky and other spirits, which patients obtained from pharmacies. These prescriptions reveal how medicine, regulation and everyday life overlapped.',
  'The interesting question is how a drink came to be treated as a remedy, and how those beliefs changed. Old labels and pharmacy records can tell us as much about society as about the liquid inside the bottle.',
  'This is a historical subject, not a recommendation to use whisky as medicine. A discussion can explore the gap between the language of an era, commercial storytelling and evidence.'
 ],
 de:[
  'Während der Prohibition in den USA konnten Ärzte Whisky und andere Spirituosen verschreiben, die Patienten in Apotheken bezogen. Solche Rezepte zeigen, wie eng Medizin, Regulierung und Alltag miteinander verbunden waren.',
  'Spannend ist, wie ein Getränk als Heilmittel verstanden wurde und wie sich diese Vorstellungen veränderten. Alte Etiketten und Apothekenunterlagen erzählen ebenso viel über die Gesellschaft wie über den Inhalt der Flasche.',
  'Hier geht es um Geschichte, nicht um die Empfehlung, Whisky als Arzneimittel zu verwenden. Das Thema lädt dazu ein, die Sprache einer Epoche, Werbegeschichten und Belege auseinanderzuhalten.'
 ],
 uk:[
  'За часів сухого закону у США лікарі могли виписувати рецепти на віскі та інші міцні напої, які пацієнти отримували в аптеках. Ці документи показують, як перепліталися медицина, державні обмеження й повсякденне життя.',
  'Цікаво простежити, чому напій сприймали як ліки та як змінювалися ці уявлення. Старі етикетки й аптечні записи розповідають не лише про вміст пляшки, а й про суспільство свого часу.',
  'Це історична тема, а не рекомендація використовувати віскі для лікування. Вона допомагає розрізняти мову епохи, рекламні історії та докази.'
 ]},
 {source:['Scotch Whisky Association · Scotch Whisky FAQs','https://www.scotch-whisky.org.uk/discover-scotch/faqs/'],
 en:[
  'Here, meditation is a metaphor for paying attention. It is about setting aside distractions and noticing an aroma before trying to name it, rather than treating alcohol as a way to relax or improve wellbeing.',
  'A useful starting point is a simple question: what do I actually notice? Fruit, grain, wood or smoke may suggest different memories to different people. There is no need to match someone else’s tasting vocabulary.',
  'The Scotch Whisky Association notes that there is no single correct way to enjoy Scotch; a little water is one familiar option. This theme explores observation, personal associations and the difference between an expectation and a sensation.'
 ],
 de:[
  'Meditation ist hier ein Bild für Aufmerksamkeit: Ablenkungen beiseitezulegen und einen Duft wahrzunehmen, bevor man ihn benennt. Alkohol wird dabei nicht als Mittel zur Entspannung oder für mehr Wohlbefinden verstanden.',
  'Eine einfache Frage hilft beim Einstieg: Was nehme ich wirklich wahr? Frucht, Getreide, Holz oder Rauch können bei verschiedenen Menschen unterschiedliche Erinnerungen wecken. Niemand muss die Degustationssprache eines anderen übernehmen.',
  'Die Scotch Whisky Association betont, dass es keine einzig richtige Art gibt, Scotch zu geniessen; etwas Wasser ist eine vertraute Möglichkeit. Im Mittelpunkt stehen Beobachtung, persönliche Assoziationen und der Unterschied zwischen Erwartung und Wahrnehmung.'
 ],
 uk:[
  'Медитація тут — метафора уважності: відкласти зайве й помітити аромат ще до того, як намагатися його назвати. Йдеться не про алкоголь як спосіб розслаблення чи покращення самопочуття.',
  'Почати можна з простого запитання: що я насправді відчуваю? Фрукти, зерно, деревина чи дим викликають у різних людей різні спогади. Не обов’язково повторювати чужий словник дегустації.',
  'Scotch Whisky Association зазначає, що єдиного правильного способу насолоджуватися скотчем немає; трохи води — один зі звичних варіантів. Ця тема про спостереження, особисті асоціації та різницю між очікуванням і відчуттям.'
 ]},
 {source:['Scotch Whisky Association · Facts & Figures','https://www.scotch-whisky.org.uk/industry-insights/facts-figures/'],
 en:[
  'Behind a bottle stands a network of growers, maltsters, distillers, coopers, warehouses and distributors. The Scotch Whisky Association’s industry overview shows how production, employment and international trade connect.',
  'This theme looks at the decisions behind that network: what to make, how long to hold stock, how to position a release and how to reach its audience. Time is part of both the product and the business problem.',
  'A collector’s view adds another question: why does one release attract attention while another remains overlooked? Comparing provenance, presentation and reputation can make the market easier to understand without turning a bottle into a promise of financial return.'
 ],
 de:[
  'Hinter einer Flasche steht ein Netzwerk aus Landwirtschaft, Mälzereien, Brennereien, Küfereien, Lagerhäusern und Vertrieb. Der Branchenüberblick der Scotch Whisky Association zeigt die Verbindungen zwischen Herstellung, Beschäftigung und Welthandel.',
  'Dieses Thema betrachtet die Entscheidungen dahinter: Was wird produziert, wie lange werden Bestände gelagert, wie wird eine Abfüllung positioniert und wie erreicht sie ihr Publikum? Zeit gehört zum Produkt und zur unternehmerischen Aufgabe.',
  'Aus Sammlersicht kommt eine weitere Frage hinzu: Warum findet eine Abfüllung Beachtung, während eine andere übersehen wird? Herkunft, Präsentation und Ruf zu vergleichen hilft, den Markt zu verstehen, ohne eine Flasche als Renditeversprechen zu behandeln.'
 ],
 uk:[
  'За пляшкою стоїть ціла мережа: фермери, солодовні, дистилерії, бондарі, склади та дистриб’ютори. Огляд Scotch Whisky Association показує, як пов’язані виробництво, робочі місця й міжнародна торгівля.',
  'Ця тема розглядає рішення всередині цієї мережі: що виробляти, як довго зберігати запаси, як представити реліз і знайти свою аудиторію. Час є частиною і самого продукту, і бізнесового завдання.',
  'Погляд колекціонера додає ще одне запитання: чому один реліз привертає увагу, а інший залишається непоміченим? Порівняння походження, подачі та репутації допомагає зрозуміти ринок, не перетворюючи пляшку на обіцянку прибутку.'
 ]},
 {source:['Malts · Cardhu: 200 Years of Pioneering Spirit','https://www.malts.com/en/articles/cardhu-200-years-of-pioneering-spirit'],
 en:[
  'The history of Cardhu offers a clear starting point: Helen and Elizabeth Cumming are central to the distillery’s own account of its development. Their story brings women’s work into a history often told through men’s names.',
  'Rather than collecting colourful legends, this theme asks whose decisions shaped a distillery, who kept a business going and whose contribution appears on the label. Family histories can reveal the people behind a familiar brand.',
  'The wider conversation is about authorship and recognition: how do we distinguish a documented role from a memorable marketing story, and what changes when we look beyond the usual list of founders?'
 ],
 de:[
  'Die Geschichte von Cardhu bietet einen guten Einstieg: Helen und Elizabeth Cumming stehen im Mittelpunkt der eigenen Darstellung der Brennerei. Ihre Geschichte macht Frauen in einer Erzählung sichtbar, die oft von Männernamen geprägt ist.',
  'Statt nur bunte Legenden zu sammeln, fragt dieses Thema: Wessen Entscheidungen prägten eine Brennerei, wer führte den Betrieb weiter und wessen Beitrag ist auf dem Etikett zu erkennen? Familiengeschichten zeigen die Menschen hinter einer vertrauten Marke.',
  'Daraus entsteht eine Diskussion über Urheberschaft und Anerkennung: Wie unterscheiden wir eine belegte Rolle von einer einprägsamen Werbegeschichte? Und was entdecken wir jenseits der üblichen Liste der Gründer?'
 ],
 uk:[
  'Почати можна з історії Cardhu: Гелен та Елізабет Каммінг посідають центральне місце у власній розповіді дистилерії про її розвиток. Їхня історія повертає увагу до жінок у галузі, яку часто описують через чоловічі імена.',
  'Замість колекціонувати яскраві легенди, ця тема ставить запитання: чиї рішення формували дистилерію, хто продовжував справу та чий внесок відображений на етикетці? Родинні історії допомагають побачити людей за знайомим брендом.',
  'Це також розмова про авторство й визнання: як відрізнити підтверджену роль від вдалої рекламної історії та що відкривається за межами звичного переліку засновників?'
 ]},
 {source:['Lindores Abbey Distillery · 1494','https://lindoresabbeydistillery.com/our-story/lindores-abbey-whisky-1494/'],
 en:[
  'A Scottish Exchequer record from 1494 names Friar John Cor in connection with malt supplied to make aqua vitae for the king. Lindores Abbey uses this record as a starting point for exploring its distilling heritage.',
  'It is a fascinating meeting of religious life, practical knowledge and royal administration. The document is evidence of an activity at a particular time, rather than proof of the moment whisky was invented.',
  'This theme asks how institutions preserve skills and how later generations interpret old records. It also invites a careful distinction between the spirit described centuries ago and the whisky familiar to us today.'
 ],
 de:[
  'Ein schottischer Rechnungsbucheintrag von 1494 nennt Bruder John Cor im Zusammenhang mit Malz zur Herstellung von Aqua Vitae für den König. Lindores Abbey nimmt dieses Dokument als Ausgangspunkt für seine Brennereigeschichte.',
  'Hier begegnen sich religiöses Leben, praktisches Wissen und königliche Verwaltung. Der Eintrag belegt eine Tätigkeit zu einem bestimmten Zeitpunkt; er beweist nicht, wann Whisky erfunden wurde.',
  'Dieses Thema fragt, wie Institutionen Fertigkeiten bewahren und wie spätere Generationen alte Dokumente deuten. Dabei lohnt sich die Unterscheidung zwischen dem vor Jahrhunderten beschriebenen Destillat und dem Whisky, den wir heute kennen.'
 ],
 uk:[
  'У шотландському казначейському записі 1494 року згадується брат Джон Кор і солод для виготовлення aqua vitae для короля. Lindores Abbey використовує цей документ як відправну точку розповіді про свою історію дистиляції.',
  'Це цікаве перетинання релігійного життя, практичних знань і королівського управління. Запис засвідчує певну діяльність у певний час, а не доводить, коли саме винайшли віскі.',
  'Тема пропонує замислитися, як інституції зберігають навички та як наступні покоління тлумачать давні документи. Важливо також розрізняти описаний століття тому дистилят і звичний нам сучасний віскі.'
 ]},
 {source:['U.S. National Archives · Indictment of Daniel Hamilton','https://www.archives.gov/philadelphia/highlights/daniel-hamilton'],
 en:[
  'The American Whiskey Rebellion grew from opposition to the federal excise tax introduced in 1791 and continued through 1794. Records held by the U.S. National Archives show how a familiar product became part of a dispute over government authority.',
  'A bottle can therefore open a discussion much larger than taste: who sets the rules, who bears the cost and how local livelihoods interact with national decisions.',
  'The aim is to read whisky history through the choices around it. Laws, taxes and resistance provide a different lens on a drink usually introduced through geography and production.'
 ],
 de:[
  'Die amerikanische Whiskey-Rebellion entstand aus dem Widerstand gegen die 1791 eingeführte Bundesverbrauchsteuer und dauerte bis 1794. Unterlagen der U.S. National Archives zeigen, wie ein vertrautes Produkt Teil eines Konflikts um staatliche Autorität wurde.',
  'Eine Flasche kann damit ein Gespräch eröffnen, das weit über Geschmack hinausgeht: Wer bestimmt die Regeln, wer trägt die Kosten und wie wirken nationale Entscheidungen auf lokale Lebensgrundlagen?',
  'Das Thema betrachtet Whiskygeschichte durch die Entscheidungen rund um das Getränk. Gesetze, Steuern und Widerstand bieten einen anderen Blick als die vertraute Einführung über Herkunft und Herstellung.'
 ],
 uk:[
  'Американське «Повстання через віскі» виросло з опору федеральному акцизу, запровадженому 1791 року, і тривало до 1794-го. Документи Національного архіву США показують, як знайомий продукт став частиною суперечки про державну владу.',
  'Тож пляшка може відкрити розмову значно ширшу за смак: хто встановлює правила, хто несе витрати та як загальнодержавні рішення впливають на місцеві спільноти?',
  'Ця тема пропонує читати історію віскі через рішення навколо нього. Закони, податки та спротив дають інший погляд на напій, який зазвичай представляють через географію й виробництво.'
 ]},
 {source:['Jack Daniel’s · Sinatra Select fact sheet','https://pressroom.jackdaniels.com/wp-content/uploads/2015/01/Sinatra-Select-Fact-Sheet.pdf'],
 en:[
  'Jack Daniel’s presents Sinatra Select through the story of Frank Sinatra’s connection with the brand. It is a useful example of how a famous name and a particular whiskey become part of the same cultural narrative.',
  'This theme explores what happens when music, cinema and personal image meet a bottle. Is the interest in the spirit, the person, the memory, or the story that links them?',
  'The most rewarding approach is to separate documented connections from advertising and repeated anecdotes. A celebrity association can explain a release’s presentation; it cannot replace our own judgement of its character.'
 ],
 de:[
  'Jack Daniel’s stellt Sinatra Select über die Geschichte von Frank Sinatras Verbindung zur Marke vor. Das zeigt, wie ein berühmter Name und ein bestimmter Whiskey Teil derselben kulturellen Erzählung werden.',
  'Dieses Thema untersucht die Begegnung von Musik, Film, persönlichem Image und Flasche. Gilt unser Interesse dem Destillat, der Person, einer Erinnerung oder der Geschichte, die alles verbindet?',
  'Besonders lohnend ist es, belegte Verbindungen von Werbung und oft wiederholten Anekdoten zu trennen. Ein prominenter Name kann die Präsentation einer Abfüllung erklären, ersetzt aber nicht unser eigenes Urteil über ihren Charakter.'
 ],
 uk:[
  'Jack Daniel’s представляє Sinatra Select через історію зв’язку Френка Сінатри з брендом. Це приклад того, як відоме ім’я та певний віскі стають частинами спільної культурної розповіді.',
  'Тема досліджує зустріч музики, кіно, особистого образу й пляшки. Що саме нас приваблює: напій, людина, спогад чи історія, яка їх поєднує?',
  'Найцікавіше — відокремлювати підтверджені зв’язки від реклами й багаторазово повторених анекдотів. Знамените ім’я може пояснити подачу релізу, але не замінює власного судження про його характер.'
 ]}
];
