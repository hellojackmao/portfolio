window.FirstWordsExchange={
  open(o){
    const {state,lesson,index,save,openSheet,phraseMarkup,bindListen,esc}=o;
    const korean=o.track==='korean',greeting=o.greeting;
    let rounds;
    if(greeting){
      rounds=korean?[
        {scene:'Someone greets you. Greet them back.',incoming:0,reply:0},
        {scene:'You meet someone for the first time. Return their greeting.',incoming:2,reply:2},
        {scene:'You meet someone you already know. Ask how they have been.',incoming:0,reply:3},
        {scene:'Your visitor is leaving while you stay. Say goodbye to the person leaving.',reply:1,note:lesson.focus}
      ]:[
        {scene:'Someone greets you. Return their hello.',incoming:0,reply:0},
        {scene:'It is morning. Return the greeting.',incoming:1,reply:1},
        {scene:o.track==='japanese'?'It is evening. Return the greeting.':'You are parting for the night. Return the good-night wish.',incoming:2,reply:2},
        {scene:o.track==='japanese'?'At the end of a class, say goodbye.':'The visit is ending. Say goodbye.',incoming:3,reply:3}
      ];
    }else{
      const apology=korean||o.track==='cantonese'?2:1;
      rounds=[
        {scene:o.track==='cantonese'?'Someone has helped you with a service. Thank them.':'Someone has helped you. Say thank you.',reply:0,exclude:korean?[1]:o.track==='cantonese'?[1]:[]},
        {scene:'You accidentally bump into someone. Apologize, then notice their response.',reply:apology,follow:3},
        {scene:'Now switch roles: someone apologizes to you. Reassure them.',incoming:apology,reply:3},
        korean?{scene:'A friend helps you. Use the shorter thanks from this lesson.',reply:1,exclude:[0]}:
        o.track==='cantonese'?{scene:'Someone gives you a gift. Thank them for it.',reply:1,exclude:[0]}:
        o.track==='traditional-mandarin'?{scene:'Before another exchange, meet the word used to introduce a polite request.',reply:2,note:'This is a request word to build with, not a complete request to use alone.'}:
        {scene:'You accept an offer of help. Choose the polite request phrase meaning please.',reply:2}
      ];
    }
    if(!state.exchangePractice||typeof state.exchangePractice!=='object'||Array.isArray(state.exchangePractice))state.exchangePractice={};
    let progress=state.exchangePractice[index];
    if(!progress||!Number.isInteger(progress.round)||progress.round<0||progress.round>rounds.length||typeof progress.answered!=='boolean'||typeof progress.paused!=='boolean')progress=state.exchangePractice[index]={round:0,answered:false,paused:false};
    const $=s=>document.querySelector(s);
    const bubble=(who,p,kind)=>'<div class="exchange-bubble '+kind+'"><span class="exchange-speaker">'+who+'</span>'+phraseMarkup([p])+'</div>';
    function draw(focus=false){
      const finished=progress.round===rounds.length,round=rounds[progress.round],phrase=round?lesson.phrases[round.reply]:null;
      let html='<div class="exchange-meta"><span>'+(greeting?'Greetings':'Courtesy')+'</span><span>'+(finished?'Practice complete':'Exchange '+(progress.round+1)+' of '+rounds.length)+'</span></div>';
      html+='<h3 class="exchange-heading" tabindex="-1">'+(finished?'A few words, shared.':progress.paused?'Your exchange is saved.':'A small exchange.')+'</h3>';
      if(finished){html+='<p>You have practiced all four phrases in context. '+(korean?'Build the sentence next, then practice saying it.':'Read your last exchange again whenever you want another practice.')+'</p>';}
      else{
        html+='<p class="exchange-scene">'+esc(round.scene)+'</p>';
        if(round.note)html+='<p class="exchange-note">'+esc(round.note)+'</p>';
        if(round.incoming!==undefined)html+=bubble('Them',lesson.phrases[round.incoming],'exchange-them');
        if(progress.answered){html+=bubble('You',phrase,'exchange-you');if(round.follow!==undefined)html+=bubble('Them',lesson.phrases[round.follow],'exchange-them');html+='<p class="exchange-feedback" role="status">That fits. Read it aloud or silently before moving on.</p>';}
        else{
          html+='<details class="exchange-hint" '+(progress.round<2&&round.incoming!==round.reply?'open':'')+'><summary>'+(progress.round<2?'Meet your reply':'A little help')+'</summary>'+phraseMarkup([phrase])+'</details><p class="exchange-speaker">Choose your reply</p><div class="exchange-options">';
          const choices=lesson.phrases.map((p,i)=>({p,i})).filter(x=>!(round.exclude||[]).includes(x.i));const offset=(progress.round+1)%choices.length;const ordered=choices.slice(offset).concat(choices.slice(0,offset));
          html+=ordered.map(({p,i})=>'<button type="button" lang="'+o.lang+'" data-exchange-choice="'+i+'">'+esc(p[0])+'</button>').join('')+'</div><p id="exchangeFeedback" role="status">Choose the phrase that fits this moment.</p>';
        }
      }
      html+='<div class="exchange-actions">'+(!finished?'<button type="button" class="btn ghost" id="exchangePause">'+(progress.paused?'Resume exchange':'Pause here')+'</button>':'')+'<button type="button" class="btn" id="exchangeNext" '+(!finished&&(!progress.answered||progress.paused)?'disabled':'')+'>'+(finished?(korean?'Build the sentence':state.done[index]?'Finish practice':'Complete lesson'):'Next exchange')+'</button></div>';
      openSheet('Lesson '+(index+1)+' · '+lesson.title,'<div class="exchange-activity">'+html+'</div>',()=>{if('speechSynthesis'in window)speechSynthesis.cancel();});bindListen($('#sheetBody'));
      document.querySelectorAll('[data-exchange-choice]').forEach(b=>b.addEventListener('click',()=>{if(Number(b.dataset.exchangeChoice)===round.reply){progress.answered=true;save();draw(true);}else $('#exchangeFeedback').textContent='That reply means “'+lesson.phrases[Number(b.dataset.exchangeChoice)][2]+'”. Open the hint if you need another look.';}));
      $('#exchangePause')?.addEventListener('click',()=>{progress.paused=!progress.paused;save();draw(true);});
      $('#exchangeNext').addEventListener('click',()=>{if(finished){o.complete();return;}if(!progress.answered||progress.paused)return;progress.round++;progress.answered=false;save();draw(true);});
      save();if(focus)document.querySelector('.exchange-heading').focus();
    }
    draw();
  }
};
