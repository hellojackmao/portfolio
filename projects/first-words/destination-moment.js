/* Optional destination lesson handoffs. Separate storage leaves the longer outing intact. */
addEventListener('DOMContentLoaded',()=>{
 const query=new URLSearchParams(location.search);
 const activities={
  greeting:{title:'A hello in Taipei',context:'You arrive at a neighbourhood counter. Greet the person before you order.',phrase:['你好','nǐ hǎo','Hello'],other:[['再見','zài jiàn','Goodbye'],['晚安','wǎn ān','Good night']]},
  ordering:{title:'At a Taipei counter',context:'You point to the item you want. Make a simple order.',phrase:['我要這個','wǒ yào zhège','I would like this one'],other:[['多少錢','duōshao qián','How much is it?'],['謝謝','xièxie','Thank you']]},
  directions:{title:'Find the metro in Taipei',context:'Before continuing your day, ask someone where the metro station is.',phrase:['捷運站在哪裡','jiéyùn zhàn zài nǎlǐ','Where is the metro station?'],other:[['右邊','yòubiān','Right'],['直走','zhí zǒu','Go straight']]}
 };
 const destinations={"hongkong": {"name": "Hong Kong", "lang": "zh-HK", "file": "cantonese", "activities": {"greeting": {"title": "A hello in Hong Kong", "context": "You arrive at a neighbourhood counter. Greet the person before you order.", "phrase": ["你好", "nei5 hou2", "Hello"], "other": [["晚安", "maan5 on1", "Good night"], ["拜拜", "baai1 baai3", "Goodbye"]]}, "ordering": {"title": "At a Hong Kong counter", "context": "You point to the item you want. Make a simple order.", "phrase": ["我要呢個", "ngo5 jiu3 ni1 go3", "I would like this one"], "other": [["唔該畀杯水我", "m4 goi1 bei2 bui1 seoi2 ngo5", "A glass of water, please"], ["唔該埋單", "m4 goi1 maai4 daan1", "The bill, please"]]}, "directions": {"title": "Find the station in Hong Kong", "context": "Before continuing your day, ask someone where the station is.", "phrase": ["地鐵站喺邊度", "dei6 tit3 zaam6 hai2 bin1 dou6", "Where is the MTR station?"], "other": [["右邊", "jau6 bin1", "Right"], ["左邊", "zo2 bin1", "Left"]]}}}, "seoul": {"name": "Seoul", "lang": "ko-KR", "file": "korean", "activities": {"greeting": {"title": "A hello in Seoul", "context": "You arrive at a neighbourhood counter. Greet the person before you order.", "phrase": ["안녕하세요", "annyeonghaseyo", "Hello"], "other": [["만나서 반가워요", "mannaseo bangawoyo", "Nice to meet you"], ["잘 지냈어요?", "jal jinaesseoyo?", "Have you been well?"]]}, "ordering": {"title": "At a Seoul counter", "context": "You have taken a seat at a Seoul café. Ask for water.", "phrase": ["물 주세요", "mul juseyo", "Water please"], "other": [["커피 주세요", "keopi juseyo", "Coffee please"], ["얼마예요?", "eolmayeyo?", "How much is it?"]]}, "directions": {"title": "Find the station in Seoul", "context": "Before continuing your day, ask someone where the station is.", "phrase": ["지하철역이 어디예요?", "jihacheollyeogi eodiyeyo?", "Where is the subway station?"], "other": [["왼쪽", "oenjjok", "left"], ["오른쪽", "oreunjjok", "right"]]}}}, "tokyo": {"name": "Tokyo", "lang": "ja-JP", "file": "japanese", "activities": {"greeting": {"title": "A hello in Tokyo", "context": "You arrive at a neighbourhood counter. Greet the person before you order.", "phrase": ["こんにちは", "konnichiwa", "Hello"], "other": [["こんばんは", "konbanwa", "Good evening"], ["さようなら", "sayounara", "Goodbye"]]}, "ordering": {"title": "At a Tokyo counter", "context": "You point to the item you want. Make a simple order.", "phrase": ["これをください", "kore o kudasai", "This one, please"], "other": [["みずをください", "mizu o kudasai", "Water, please"], ["お会計をおねがいします", "okaikei o onegaishimasu", "The bill, please"]]}, "directions": {"title": "Find the station in Tokyo", "context": "Before continuing your day, ask someone where the station is.", "phrase": ["駅はどこですか", "eki wa doko desu ka", "Where is the station?"], "other": [["みぎ", "migi", "Right"], ["ひだり", "hidari", "Left"]]}}}};
 destinations.taipei={name:'Taipei',lang:'zh-TW',file:'traditional-mandarin',activities};
 const city=query.get('place'),id=query.get('moment');
 if(!Object.hasOwn(destinations,city)||!Object.hasOwn(destinations[city].activities,id))return;
 const destination=destinations[city],activity=destination.activities[id],key='first-words-'+city+'-moment-'+id;
 let step=0,revealed=false,available=true;
 try{const saved=JSON.parse(localStorage.getItem(key));if(Number.isInteger(saved?.step)&&saved.step>=0&&saved.step<=3)step=saved.step;}catch{}
 const main=document.querySelector('main');[...main.children].forEach(el=>el.hidden=true);
 const panel=document.createElement('section');panel.id='destination-moment';main.prepend(panel);
 const make=(tag,text,cls)=>{const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;return el;};
 const button=(label,fn)=>{const b=make('button',label,'rhythm-button');b.type='button';b.onclick=fn;return b;};
 const link=(label,url)=>{const a=make('a',label);a.href=url;return a;};
 function phrase(){const card=make('div','','answer rhythm-phrase');const text=make('span',activity.phrase[0]);text.lang=destination.lang;card.append(text,make('small',activity.phrase[1]),make('p',activity.phrase[2]));return card;}
 function save(){try{localStorage.setItem(key,JSON.stringify({step}));}catch{available=false;}}
 function next(){step++;revealed=false;save();draw();}
 function draw(){
  panel.replaceChildren();panel.append(make('p',destination.name+' · Optional destination practice','practice-label'));
  const title=make('h1',step===3?'A small moment, complete.':activity.title);title.tabIndex=-1;panel.append(title);
  panel.append(make('p',step===3?'You have tried this phrase in context. This is a good place to stop.':activity.context));
  const card=make('div','','practice-card');card.style.minHeight='0';panel.append(card);
  card.append(make('p',step===3?'Activity complete':['1 of 3 · Meet it','2 of 3 · Try with support','3 of 3 · Bring it back'][step],'practice-label'));
  if(step===0){card.append(phrase(),button('Try this phrase',next));}
  if(step===1){card.append(make('h2','What would you say?'));const feedback=make('p','Take your time.');feedback.setAttribute('role','status');const choices=make('div');choices.style.display='grid';choices.style.gap='10px';const options=[activity.other[0],activity.phrase,activity.other[1]];for(const p of options){const b=button('',()=>{if(p===activity.phrase){next();}else feedback.textContent='That means “'+p[2]+'”. Try another phrase.';});b.classList.add('answer');const text=make('span',p[0]);text.lang=destination.lang;b.append(text,make('small',p[1]));choices.append(b);}card.append(choices,feedback);}
  if(step===2){card.append(make('h2','Try it from memory.'),make('p','Say or think of the phrase. Reveal it whenever you need.'));if(!revealed)card.append(button('Reveal the phrase',()=>{revealed=true;draw();}));else card.append(phrase(),button('Finish this moment',next));}
  if(step===3){card.append(phrase(),link('Finish for now · Return to the foundation',destination.file+'.html?resume=1'));}
  const footer=make('footer');if(step<3)footer.append(link('Pause · Return to the foundation',destination.file+'.html?resume=1'));else footer.append(button('Revisit this moment',()=>{step=0;save();draw();}));footer.append(link('Open the full '+destination.name+' outing','practice.html?place='+city));panel.append(footer);
  save();panel.append(make('p',available?'Your place in this activity is saved in this browser. Your lesson completion and longer outing are unchanged.':'This browser cannot save this activity. Your existing lesson completion and outing are unchanged.','reference-note'));
  title.focus({preventScroll:true});
 }
 draw();
});
