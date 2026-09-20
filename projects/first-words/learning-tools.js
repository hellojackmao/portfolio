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
      config.openSheet('Kana, at a glance','<div class="kana-reference"><p>Hiragana and katakana share the same basic readings. Start with one row; there is no need to memorize the whole chart at once.</p><div class="reference-actions" role="group" aria-label="Choose script"><button class="btn ghost" data-kana-script="Hiragana" aria-pressed="'+(script==='Hiragana')+'">Hiragana</button><button class="btn ghost" data-kana-script="Katakana" aria-pressed="'+(script==='Katakana')+'">Katakana</button></div><button class="btn" data-recognition="'+script+'">Try five letters</button><h3>46 basic '+script.toLowerCase()+' characters</h3>'+kanaTable(kanaRows,script)+'<p class="reference-note">を is shown as wo to identify the character; as a particle it is pronounced o. は and へ are pronounced wa and e when used as particles. ん has its own sound and is not part of the five vowel columns.</p><details><summary>Voiced sounds and small kana</summary><h3>Voiced and p sounds</h3>'+kanaTable(voicedRows,script)+'<p>Small ゃ / ャ, ゅ / ュ and ょ / ョ combine with an i-row character: きゃ / キャ (kya), しゅ / シュ (shu), ちょ / チョ (cho). Small っ / ッ marks a consonant pause, as in きって (kitte). The katakana mark ー lengthens the vowel.</p></details><p class="reference-note">Romanization is a reading aid. Listening and context will help you move beyond it.</p><a href="https://a1.marugotoweb.jp/en/hiragana.php" target="_blank" rel="noopener noreferrer">Japan Foundation · Kana reference ↗</a></div>');
    }
  }
  function recognition(group){
    const korean=config.track==='korean';
    const tables=korean?document.getElementById('hangulReference').content.querySelectorAll('.hangul-grid'):null;
    const pool=korean?[...tables[group==='vowels'?1:0].children].map(el=>[el.querySelector('dt').textContent,el.querySelector('dd').textContent]):pairs(kanaRows).map(([c,r])=>[group==='Katakana'?katakana(c):c,r]);
    const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
    const cards=shuffle(pool).slice(0,5);let index=0,answered=false,options=[];
    function draw(){
      const done=index===cards.length,card=cards[index];
      if(!done)options=shuffle([card[1],...shuffle([...new Set(pool.map(x=>x[1]))].filter(x=>x!==card[1])).slice(0,3)]);
      config.openSheet('A little letter practice','<div class="recognition" data-script="'+(korean?'ko':'ja')+'"><p class="learning-progress">'+(done?'Five letters revisited':'Letter '+(index+1)+' of 5')+' · Optional practice</p><h3 tabindex="-1" id="recognitionTitle">'+(done?'A good place to stop.':'Which reading matches?')+'</h3>'+(done?'<p>Return to the chart or try another small set. This practice does not change lesson completion.</p>':'<div class="recognition-glyph" lang="'+(korean?'ko':'ja')+'">'+card[0]+'</div><details><summary>A little help</summary><p>The chart pairs <span lang="'+(korean?'ko':'ja')+'">'+card[0]+'</span> with <strong>'+card[1]+'</strong>.</p></details><div class="recognition-options">'+options.map(x=>'<button type="button" class="btn ghost" data-letter-answer="'+esc(x)+'">'+esc(x)+'</button>').join('')+'</div><p role="status" id="letterFeedback">Take your time. You can check the hint.</p>')+'<div class="reference-actions"><button class="btn ghost" id="returnChart">Back to chart</button><button class="btn" id="letterNext" '+(!done?'disabled':'')+'>'+(done?'Try another five':'Continue')+'</button></div></div>');
      document.querySelectorAll('[data-letter-answer]').forEach(btn=>btn.onclick=()=>{if(answered)return;if(btn.dataset.letterAnswer===card[1]){answered=true;document.getElementById('letterFeedback').textContent='That matches. Notice the shape once more before continuing.';document.getElementById('letterNext').disabled=false;document.querySelectorAll('[data-letter-answer]').forEach(b=>b.disabled=true);document.getElementById('letterNext').focus();}else{document.getElementById('letterFeedback').textContent='Look at the shape again, or open the hint. There is no penalty for another try.';}});
      document.getElementById('returnChart').onclick=()=>chart(config.script);
      document.getElementById('letterNext').onclick=()=>{if(done){recognition(group);return;}if(!answered)return;index++;answered=false;draw();document.getElementById('recognitionTitle').focus();};
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
    document.addEventListener('click',e=>{const chartButton=e.target.closest('[data-hangul-chart],[data-kana-chart]');if(chartButton)chart();const script=e.target.closest('[data-kana-script]');if(script){chart(script.dataset.kanaScript);document.querySelector('[data-kana-script="'+script.dataset.kanaScript+'"]').focus();}const quiz=e.target.closest('[data-recognition]');if(quiz)recognition(quiz.dataset.recognition);});
    new MutationObserver(panels).observe(document.querySelector('body'),{childList:true,subtree:true});panels();
    if('speechSynthesis'in window)speechSynthesis.addEventListener('voiceschanged',()=>{audioMessage='';notice(voiceText());});
    addEventListener('pagehide',()=>{if('speechSynthesis'in window)speechSynthesis.cancel();config.stop?.();});
  }
  return {init,notice,remember,voiceText,chart,resetAudio};
})();
