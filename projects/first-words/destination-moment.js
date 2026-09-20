/* Optional Taipei lesson handoffs. Separate storage leaves the longer outing intact. */
addEventListener('DOMContentLoaded',()=>{
 const query=new URLSearchParams(location.search);
 const activities={
  greeting:{title:'A hello in Taipei',context:'You arrive at a neighbourhood counter. Greet the person before you order.',phrase:['你好','nǐ hǎo','Hello'],other:[['再見','zài jiàn','Goodbye'],['晚安','wǎn ān','Good night']]},
  ordering:{title:'At a Taipei counter',context:'You point to the item you want. Make a simple order.',phrase:['我要這個','wǒ yào zhège','I would like this one'],other:[['多少錢','duōshao qián','How much is it?'],['謝謝','xièxie','Thank you']]},
  directions:{title:'Find the metro in Taipei',context:'Before continuing your day, ask someone where the metro station is.',phrase:['捷運站在哪裡','jiéyùn zhàn zài nǎlǐ','Where is the metro station?'],other:[['右邊','yòubiān','Right'],['直走','zhí zǒu','Go straight']]}
 };
 const id=query.get('moment');if(query.get('place')!=='taipei'||!Object.hasOwn(activities,id))return;
 const activity=activities[id],key='first-words-taipei-moment-'+id;
 let step=0,revealed=false,available=true;
 try{const saved=JSON.parse(localStorage.getItem(key));if(Number.isInteger(saved?.step)&&saved.step>=0&&saved.step<=3)step=saved.step;}catch{}
 const main=document.querySelector('main');[...main.children].forEach(el=>el.hidden=true);
 const panel=document.createElement('section');panel.id='destination-moment';main.prepend(panel);
 const make=(tag,text,cls)=>{const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;return el;};
 const button=(label,fn)=>{const b=make('button',label,'rhythm-button');b.type='button';b.onclick=fn;return b;};
 const link=(label,url)=>{const a=make('a',label);a.href=url;return a;};
 function phrase(){const card=make('div','','answer rhythm-phrase');const text=make('span',activity.phrase[0]);text.lang='zh-TW';card.append(text,make('small',activity.phrase[1]),make('p',activity.phrase[2]));return card;}
 function save(){try{localStorage.setItem(key,JSON.stringify({step}));}catch{available=false;}}
 function next(){step++;revealed=false;save();draw();}
 function draw(){
  panel.replaceChildren();panel.append(make('p','Taipei · Optional destination practice','practice-label'));
  const title=make('h1',step===3?'A small moment, complete.':activity.title);title.tabIndex=-1;panel.append(title);
  panel.append(make('p',step===3?'You have tried this phrase in context. This is a good place to stop.':activity.context));
  const card=make('div','','practice-card');card.style.minHeight='0';panel.append(card);
  card.append(make('p',step===3?'Activity complete':['1 of 3 · Meet it','2 of 3 · Try with support','3 of 3 · Bring it back'][step],'practice-label'));
  if(step===0){card.append(phrase(),button('Try this phrase',next));}
  if(step===1){card.append(make('h2','What would you say?'));const feedback=make('p','Take your time.');feedback.setAttribute('role','status');const choices=make('div');choices.style.display='grid';choices.style.gap='10px';const options=[activity.other[0],activity.phrase,activity.other[1]];for(const p of options){const b=button('',()=>{if(p===activity.phrase){next();}else feedback.textContent='That means “'+p[2]+'”. Try another phrase.';});b.classList.add('answer');const text=make('span',p[0]);text.lang='zh-TW';b.append(text,make('small',p[1]));choices.append(b);}card.append(choices,feedback);}
  if(step===2){card.append(make('h2','Try it from memory.'),make('p','Say or think of the phrase. Reveal it whenever you need.'));if(!revealed)card.append(button('Reveal the phrase',()=>{revealed=true;draw();}));else card.append(phrase(),button('Finish this moment',next));}
  if(step===3){card.append(phrase(),link('Finish for now · Return to the foundation','traditional-mandarin.html?resume=1'));}
  const footer=make('footer');if(step<3)footer.append(link('Pause · Return to the foundation','traditional-mandarin.html?resume=1'));else footer.append(button('Revisit this moment',()=>{step=0;save();draw();}));footer.append(link('Open the full Taipei outing','practice.html?place=taipei'));panel.append(footer);
  save();panel.append(make('p',available?'Your place in this activity is saved in this browser. Your lesson completion and longer outing are unchanged.':'This browser cannot save this activity. Your existing lesson completion and outing are unchanged.','reference-note'));
  title.focus({preventScroll:true});
 }
 draw();
});
