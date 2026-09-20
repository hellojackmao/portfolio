/* Optional reference practice and device-audio controls. No curriculum progress is changed. */
window.FirstWordsTools = (() => {
  let config, lastPhrase='', audioMessage='', audioOpen=false;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const kanaRows=[['あいうえお','a i u e o'],['かきくけこ','ka ki ku ke ko'],['さしすせそ','sa shi su se so'],['たちつてと','ta chi tsu te to'],['なにぬねの','na ni nu ne no'],['はひふへほ','ha hi fu he ho'],['まみむめも','ma mi mu me mo'],['や ゆ よ','ya _ yu _ yo'],['らりるれろ','ra ri ru re ro'],['わ   を','wa _ _ _ wo'],['ん','n']];
  const voicedRows=[['がぎぐげご','ga gi gu ge go'],['ざじずぜぞ','za ji zu ze zo'],['だぢづでど','da ji zu de do'],['ばびぶべぼ','ba bi bu be bo'],['ぱぴぷぺぽ','pa pi pu pe po']];
  const pairs=rows=>rows.flatMap(([letters,readings])=>[...letters].map((x,i)=>[x,readings.split(' ')[i]]).filter(x=>x[0]!==' '));
  const katakana=x=>[...x].map(c=>c===' '?c:String.fromCharCode(c.charCodeAt(0)+96)).join('');
  function kanaTable(rows,script){return '<div class="kana-table" role="table" aria-label="'+script+' letters and readings"><div role="row" class="kana-row kana-head">'+['a','i','u','e','o'].map(x=>'<span role="columnheader">'+x+'</span>').join('')+'</div>'+rows.map(([letters,readings])=>'<div role="row" class="kana-row '+(letters==='ん'?'kana-nasal':'')+'">'+[...letters].map((c,i)=>'<div role="cell">'+(c===' '?'':'<span lang="ja" class="kana-glyph">'+(script==='Katakana'?katakana(c):c)+'</span><small>'+readings.split(' ')[i]+'</small>')+'</div>').join('')+'</div>').join('')+'</div>';}
  function chart(script='Hiragana'){
    if(config.track==='korean'){
      config.openSheet('Hangul, at a glance','<div class="reference-actions"><button class="btn ghost" data-recognition="consonants">Practice consonants</button><button class="btn ghost" data-recognition="vowels">Practice vowels</button></div>'+document.getElementById('hangulReference').innerHTML);
    }else{
      config.script=script;
      config.openSheet('Kana, at a glance','<div class="kana-reference"><p>Hiragana and katakana share the same basic readings. Start with one row; there is no need to memorize the whole chart at once.</p><div class="reference-actions" role="group" aria-label="Choose script"><button class="btn ghost" data-kana-script="Hiragana" aria-pressed="'+(script==='Hiragana')+'">Hiragana</button><button class="btn ghost" data-kana-script="Katakana" aria-pressed="'+(script==='Katakana')+'">Katakana</button></div><button class="btn" data-recognition="'+script+'">Choose a practice set</button><h3>46 basic '+script.toLowerCase()+' characters</h3>'+kanaTable(kanaRows,script)+'<p class="reference-note">を is shown as wo to identify the character; as a particle it is pronounced o. は and へ are pronounced wa and e when used as particles. ん has its own sound and is not part of the five vowel columns.</p><details><summary>Voiced sounds and small kana</summary><h3>Voiced and p sounds</h3>'+kanaTable(voicedRows,script)+'<p>Small ゃ / ャ, ゅ / ュ and ょ / ョ combine with an i-row character: きゃ / キャ (kya), しゅ / シュ (shu), ちょ / チョ (cho). Small っ / ッ marks a consonant pause, as in きって (kitte). The katakana mark ー lengthens the vowel.</p></details><p class="reference-note">Romanization is a reading aid. Listening and context will help you move beyond it.</p><a href="https://a1.marugotoweb.jp/en/hiragana.php" target="_blank" rel="noopener noreferrer">Japan Foundation · Kana reference ↗</a></div>');
    }
  }
  function recognitionPool(group){
    if(config.track==='korean'){
      const table=document.getElementById('hangulReference').content.querySelectorAll('.hangul-grid')[group==='vowels'?1:0];
      return [...table.children].map(el=>[el.querySelector('dt').textContent,el.querySelector('dd').textContent]);
    }
    return pairs(kanaRows).map(([c,r])=>[group==='Katakana'?katakana(c):c,r]);
  }
  function focusedSets(group){
    const pool=recognitionPool(group);
    const subset=(id,label,letters)=>({id,label,pool:pool.filter(p=>letters.includes(p[0]))});
    if(config.track==='korean')return group==='vowels'?[
      subset('first','Start with six vowels','ㅏㅓㅗㅜㅡㅣ'),
      subset('vertical','Compare vertical shapes','ㅏㅑㅓㅕ'),
      subset('horizontal','Compare horizontal shapes','ㅗㅛㅜㅠ'),
      {id:'mixed',label:'Mix all basic vowels',pool}
    ]:[
      subset('first','Five familiar consonants','ㄱㄴㄷㅁㅅ'),
      subset('shapes','Compare added strokes','ㄱㅋㄷㅌ'),
      {id:'mixed',label:'Mix all basic consonants',pool}
    ];
    const rows=kanaRows.slice(0,9).map(([letters],i)=>subset('row-'+i,i===0?'Start with vowels':['','K row','S row','T row','N row','H row','M row','Y row','R row'][i],group==='Katakana'?katakana(letters):letters));
    rows.push(subset('last','W row and n',group==='Katakana'?'ワヲン':'わをん'));
    rows.splice(1,0,subset('shapes','Compare similar shapes',group==='Katakana'?'シツソン':'ぬめねれわ'));
    rows.push({id:'mixed',label:'Mix the whole basic chart',pool});
    return rows;
  }
  function chooseSet(group){
    const sets=focusedSets(group),ko=config.track==='korean';
    const button=set=>'<button type="button" class="focus-set" data-focus-set="'+set.id+'"><strong>'+set.label+'</strong><span lang="'+(ko?'ko':'ja')+'">'+set.pool.map(p=>p[0]).slice(0,6).join(' ')+(set.pool.length>6?' …':'')+'</span><small>'+Math.min(5,set.pool.length)+' letters this round</small></button>';
    const primary=ko?sets:sets.filter(x=>['row-0','shapes','mixed'].includes(x.id));
    const more=ko?[]:sets.filter(x=>!primary.includes(x));
    config.openSheet('Choose a small set','<div class="focus-picker" data-script="'+(ko?'ko':'ja')+'"><p class="learning-progress">'+esc(group)+' · Optional recognition</p><h3>One group at a time.</h3><p>Choose what you want to recognize. Answers and hints stay within that set; there is no score or timer.</p><div class="focus-sets">'+primary.map(button).join('')+'</div>'+(more.length?'<details class="focus-more"><summary>Choose a particular kana row</summary><div class="focus-sets">'+more.map(button).join('')+'</div></details>':'')+'<button type="button" class="btn ghost" id="focusBack">Back to chart</button></div>');
    document.querySelectorAll('[data-focus-set]').forEach(b=>b.onclick=()=>recognition(group,b.dataset.focusSet));
    document.getElementById('focusBack').onclick=()=>chart(config.script);
  }
  function greetingIndex(){return config.lessons.findIndex(l=>/greetings/i.test(l.title));}
  function phraseBridge(group, practiced){
    const index=greetingIndex(), lesson=config.lessons[index];
    if(!lesson)return '';
    const ko=config.track==='korean', katakana=group==='Katakana';
    const phrases=katakana?config.lessons.flatMap(l=>l.phrases).filter(p=>/[ァ-ヶ]/.test(p[0])):lesson.phrases;
    const matches=c=>practiced.some(letter=>c.normalize('NFKD').includes(letter.normalize('NFKD')));
    const score=p=>[...p[0]].filter(matches).length;
    const phrase=[...phrases].sort((a,b)=>score(b)-score(a))[0]||lesson.phrases[0];
    const found=score(phrase)>0;
    return '<div class="phrase-bridge"><p class="learning-progress">'+(katakana?'From letters to words':'From letters to a greeting')+'</p><p class="bridge-phrase" lang="'+(ko?'ko':'ja')+'">'+[...phrase[0]].map(c=>found&&matches(c)?'<mark>'+esc(c)+'</mark>':esc(c)).join('')+'</p><p>'+esc(phrase[1])+' · '+esc(phrase[2])+'</p><p class="reference-note">'+(found?(ko?'The highlighted syllables contain letters from this round. Letters combine into blocks; their sounds depend on the word.':'The highlighted characters appeared in this round. Readings can change in a phrase.'):'This phrase is already in the lessons. You do not need to recognize every character before trying a conversation.')+(katakana?' Japanese uses scripts together; Greetings will also introduce hiragana.':'')+'</p></div>';
  }
  function finishLesson(index, onFinish){
    const next=config.lessons.findIndex((l,i)=>i>index&&!config.isDone(i));
    const moment=config.track==='traditional-mandarin'?({4:['greeting','Greet someone in Taipei'],9:['ordering','Order at a Taipei counter'],11:['directions','Find the metro in Taipei']})[index]:null;
    const destination=moment?'<div class="destination-next"><p class="learning-progress">Optional · One moment in Taipei</p><a class="btn ghost" href="practice.html?place=taipei&amp;moment='+moment[0]+'">'+moment[1]+'</a><p class="reference-note">Use a familiar phrase in a short activity. The full outing can wait.</p></div>':'';
    config.openSheet('A good place to pause','<div class="learning-finish"><p class="learning-progress">'+esc(config.lessons[index].title)+' · Complete</p><h3 tabindex="-1" id="finishTitle">Enough for today, if you like.</h3><p>Your lesson completion is saved in this browser. You can stop here and return when you are ready.</p><div class="reference-actions"><button type="button" class="btn" id="finishNow">Finish for now</button>'+(next>=0?'<button type="button" class="btn ghost" id="continueLesson">Next: '+esc(config.lessons[next].title)+'</button>':'')+'</div>'+destination+'</div>');
    document.getElementById('finishNow').onclick=onFinish||config.closeSheet;
    document.getElementById('continueLesson')?.addEventListener('click',()=>config.startLesson(next));
    document.getElementById('finishTitle').focus();
  }
  function recognition(group,setId='mixed'){
    const korean=config.track==='korean';
    const set=focusedSets(group).find(x=>x.id===setId);
    if(!set){chooseSet(group);return;}
    const pool=set.pool;
    const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
    let cards=shuffle(pool).slice(0,5),index=0,answered=false,options=[],review=false;
    const tricky=new Set();
    function draw(){
      const done=index===cards.length,card=cards[index];
      if(!done)options=shuffle([card[1],...shuffle([...new Set(pool.map(x=>x[1]))].filter(x=>x!==card[1])).slice(0,3)]);
      config.openSheet('A little letter practice','<div class="recognition" data-script="'+(korean?'ko':'ja')+'"><p class="learning-progress">'+(done?cards.length+' '+(cards.length===1?'letter':'letters')+' revisited':'Letter '+(index+1)+' of '+cards.length)+' · '+(review?'Tricky-letter review · ':'')+esc(set.label)+'</p><h3 tabindex="-1" id="recognitionTitle">'+(done?(review?'A little more familiar.':'A good place to stop.'):'Which reading matches?')+'</h3>'+(done?'<p>'+(review?'You have revisited the letters you checked or tried again. There is no need for another round.':'This round is complete. Stop here, revisit a difficult letter, or try a greeting. Letter practice does not mark a lesson complete.')+'</p>'+(!review&&tricky.size?'<div class="tricky-invitation"><p>'+tricky.size+' '+(tricky.size===1?'letter could':'letters could')+' use another look. This is optional.</p><button type="button" class="btn" id="reviewTricky">Revisit tricky letters</button></div>':''):'<div class="recognition-glyph" lang="'+(korean?'ko':'ja')+'">'+card[0]+'</div><details id="letterHint"><summary>A little help</summary><p>The chart pairs <span lang="'+(korean?'ko':'ja')+'">'+card[0]+'</span> with <strong>'+card[1]+'</strong>.</p></details><div class="recognition-options">'+options.map(x=>'<button type="button" class="btn ghost" data-letter-answer="'+esc(x)+'">'+esc(x)+'</button>').join('')+'</div><p role="status" id="letterFeedback">Take your time. You can check the hint.</p>')+(done?phraseBridge(group,cards.map(p=>p[0]))+'<div class="reference-actions"><button type="button" class="btn" id="recognitionStop">Finish for now</button><button type="button" class="btn ghost" id="recognitionGreetings">Try Greetings</button></div><p class="reference-note">Your lesson progress stays as it is. This letter round is not saved.</p><details class="practice-again"><summary>More letter practice</summary>':'')+'<div class="reference-actions"><button class="btn ghost" id="returnChart">Back to chart</button><button class="btn ghost" id="changeSet">Choose another set</button><button class="btn" id="letterNext" '+(!done?'disabled':'')+'>'+(done?'Practice this set again':'Continue')+'</button></div>'+(done?'</details>':'')+'</div>');
      document.querySelectorAll('[data-letter-answer]').forEach(btn=>btn.onclick=()=>{if(answered)return;if(btn.dataset.letterAnswer===card[1]){answered=true;document.getElementById('letterFeedback').textContent='That matches. Notice the shape once more before continuing.';document.getElementById('letterNext').disabled=false;document.querySelectorAll('[data-letter-answer]').forEach(b=>b.disabled=true);document.getElementById('letterNext').focus();}else{if(!review)tricky.add(card[0]);document.getElementById('letterFeedback').textContent='Look at the shape again, or open the hint. There is no penalty for another try.';}});
      document.getElementById('letterHint')?.addEventListener('toggle',event=>{if(event.target.open&&!review)tricky.add(card[0]);});
      document.getElementById('reviewTricky')?.addEventListener('click',()=>{cards=cards.filter(p=>tricky.has(p[0]));index=0;answered=false;review=true;draw();document.getElementById('recognitionTitle').focus();});
      document.getElementById('recognitionStop')?.addEventListener('click',config.closeSheet);
      document.getElementById('recognitionGreetings')?.addEventListener('click',()=>config.startLesson(greetingIndex()));
      document.getElementById('returnChart').onclick=()=>chart(config.script);
      document.getElementById('changeSet').onclick=()=>chooseSet(group);
      document.getElementById('letterNext').onclick=()=>{if(done){recognition(group,setId);return;}if(!answered)return;if(!review&&document.getElementById('letterHint')?.open)tricky.add(card[0]);index++;answered=false;draw();document.getElementById('recognitionTitle').focus();};
    }
    draw();
  }
  const names={korean:'Korean',japanese:'Japanese','traditional-mandarin':'Taiwan Mandarin',cantonese:'Cantonese'};
  function currentTrack(){return config.getTrack?config.getTrack():config.track;}
  function available(){if(!('speechSynthesis'in window))return [];const t=currentTrack();return speechSynthesis.getVoices().filter(v=>t==='korean'?/^ko(-|$)/i.test(v.lang):t==='japanese'?/^ja(-|$)/i.test(v.lang):t==='cantonese'?/^yue(-|$)/i.test(v.lang)||(/^zh-HK$/i.test(v.lang)&&/Cantonese/i.test(v.name)):/^(zh-(TW|CN|SG)|cmn(-.*)?)$/i.test(v.lang)&&!/Cantonese/i.test(v.name));}
  function voiceText(){const n=names[currentTrack()];if(!('speechSynthesis'in window))return 'This browser does not provide speech. You can still read and complete every activity.';if(!available().length)return 'No '+n+' voice is currently available. Voices may still be loading. Try Refresh voices, or add this language in your device’s speech settings and reopen the browser. Reading practice still works.';return 'Device-generated '+n+' audio is available. Voice quality and pronunciation vary by device; some voices need an internet connection.';}
  function notice(message){audioMessage=message;document.querySelectorAll('.listening-status').forEach(x=>x.textContent=message);}
  function panels(){
    if(!config)return;
    for(const root of document.querySelectorAll('#sheetBody,#view-library,#view-today,.practice-card')){
      if(!root.querySelector('[data-say],#listen')||root.querySelector('.listening-tools'))continue;
      const d=document.createElement('details');d.className='listening-tools';d.open=audioOpen;
      const rate=Number(config.getRate());
      d.innerHTML='<summary>Listening options</summary><div class="listening-controls"><label>Playback speed <select aria-label="Playback speed"><option value="0.65">Slower</option><option value="0.82">Gentle</option><option value="1">Normal</option></select></label><button type="button" data-replay>Replay last phrase</button><button type="button" data-stop>Stop audio</button><button type="button" data-voices>Refresh voices</button></div><p class="listening-status" role="status"></p><p class="reference-note">No sound? Check media volume and your device’s speech settings. Listening is optional; written readings remain available.</p>';
      const select=d.querySelector('select');if(![.65,.82,1].includes(rate)){const o=document.createElement('option');o.value=rate;o.textContent='Custom ('+rate+'×)';select.append(o);}select.value=String(rate);
      select.onchange=()=>{config.setRate(Number(select.value));document.querySelectorAll('.listening-tools select').forEach(x=>x.value=select.value);};
      d.querySelector('[data-replay]').disabled=!lastPhrase;
      d.querySelector('[data-replay]').onclick=()=>config.speak(lastPhrase);
      d.querySelector('[data-stop]').onclick=()=>{if('speechSynthesis'in window)speechSynthesis.cancel();config.stop?.();notice('Audio stopped. Replay whenever you are ready.');};
      d.querySelector('[data-voices]').onclick=()=>notice(voiceText());
      d.addEventListener('toggle',()=>{audioOpen=d.open;if(d.open)d.querySelector('.listening-status').textContent=audioMessage||voiceText();});
      d.querySelector('.listening-status').textContent=audioMessage||voiceText();root.prepend(d);
    }
  }
  function remember(text){if(!text)return;lastPhrase=text;audioMessage='';document.querySelectorAll('[data-replay]').forEach(x=>x.disabled=false);notice(voiceText());if(!available().length){document.querySelectorAll('.listening-tools').forEach(x=>x.open=true);}}
  function resetAudio(){lastPhrase='';audioMessage='';document.querySelectorAll('[data-replay]').forEach(x=>x.disabled=true);notice(voiceText());}
  function init(o){
    config=o;
    document.addEventListener('click',e=>{const chartButton=e.target.closest('[data-hangul-chart],[data-kana-chart]');if(chartButton)chart();const script=e.target.closest('[data-kana-script]');if(script){chart(script.dataset.kanaScript);document.querySelector('[data-kana-script="'+script.dataset.kanaScript+'"]').focus();}const quiz=e.target.closest('[data-recognition]');if(quiz)chooseSet(quiz.dataset.recognition);});
    new MutationObserver(panels).observe(document.querySelector('body'),{childList:true,subtree:true});panels();
    if('speechSynthesis'in window)speechSynthesis.addEventListener('voiceschanged',()=>{audioMessage='';notice(voiceText());});
    addEventListener('pagehide',()=>{if('speechSynthesis'in window)speechSynthesis.cancel();config.stop?.();});
  }
  return {init,notice,remember,voiceText,chart,resetAudio,finishLesson};
})();
