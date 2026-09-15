window.FirstWordsDirections={
  open(o){
    const {state,lesson,index,save,openSheet,closeSheet,phraseMarkup,bindListen,esc}=o;
    const korean=o.korean;
    const stages=korean?[['learn',[1]],['learn',[0]],['check',0],['learn',[2,3]],['check',2],['check',3],['pause'],['recall',1],['connect',0],['connect',3]]:[['learn',[0]],['check',0],['learn',[2,1]],['check',2],['check',1],['pause'],['learn',[3,4]],['check',3],['recall',0],['connect',4],['connect',1]];
    const prior=state.directionsPractice;
    if(!prior||!Number.isInteger(prior.step)||prior.step<0||prior.step>stages.length||['passed','revealed','paused'].some(k=>typeof prior[k]!=='boolean'))state.directionsPractice={step:0,passed:false,revealed:false,paused:false};
    const progress=state.directionsPractice;
    const $=s=>document.querySelector(s);
    const left=korean?2:2,right=korean?3:1;
    function draw(focus=false){
      const finished=progress.step===stages.length;
      const [kind,value]=stages[progress.step]||['finish',0];
      const phrase=lesson.phrases[typeof value==='number'?value:0];
      let html='<div class="kicker">Directions / '+(progress.step<3?'Ask':kind==='pause'?'A natural pause':'Find your way')+'</div>';
      let title=kind==='learn'?'Meet the words.':kind==='pause'?'A good place to pause.':kind==='recall'?'Bring it back.':kind==='finish'?'Ready for a small exchange.':'Your turn.';
      html+='<h3 class="directions-heading" tabindex="-1">'+title+'</h3>';
      if(finished)html+='<p>You have practiced asking and recognizing directions. '+(korean?'Now build your question and practice saying it.':'Return whenever you want another practice.')+'</p>';
      else if(kind==='pause')html+='<p>'+(progress.paused?'Your place is saved.':'You have met the question and both directions. Take a pause, or continue with a short exchange.')+'</p>'+(progress.paused?'':'<button type="button" class="btn ghost" id="directionPause">Pause here</button>');
      else if(kind==='learn')html+=phraseMarkup(value.map(i=>lesson.phrases[i]));
      else if(kind==='recall'){
        html+='<p>'+esc(korean?'Recall the word for restroom.':'Recall how to ask where the station is.')+'</p>';
        html+=progress.revealed?phraseMarkup([phrase])+'<p>Say it aloud or silently, then compare.</p>':'<button class="btn" type="button" id="directionReveal">Reveal the phrase</button>';
      }else{
        const direction=value===left?'left':value===right?'right':!korean&&value===3?'straight ahead':null;
        const prompt=direction?'Someone points '+direction+'. Which phrase fits?':value===0?'Ask where to go.':korean?'Recognize the place.':'Ask whether it is nearby.';
        html+='<p>'+prompt+'</p>';
        if(direction)html+='<svg class="direction-cue" aria-hidden="true" viewBox="0 0 80 64"><path d="M12 32 H65 M47 14 L65 32 L47 50" transform="rotate('+(direction==='left'?180:direction==='straight ahead'?-90:0)+' 40 32)"/></svg>';
        if(progress.passed)html+=phraseMarkup([phrase])+'<p role="status">That fits this moment.</p>';
        else{
          if(kind==='check')html+='<details class="direction-hint"><summary>Look at the phrase again</summary>'+phraseMarkup([phrase])+'</details>';
          const choices=lesson.phrases.map(p=>p[0]);const offset=progress.step%choices.length;const ordered=choices.slice(offset).concat(choices.slice(0,offset));
          html+='<div class="direction-options">'+ordered.map(text=>'<button type="button" lang="'+o.lang+'" data-direction-choice="'+esc(text)+'">'+esc(text)+'</button>').join('')+'</div><p id="directionFeedback" role="status">Choose one answer.</p>';
        }
      }
      const ready=finished||kind==='learn'||kind==='pause'||kind==='recall'&&progress.revealed||progress.passed;
      html+='<div class="sheet-actions"><button class="btn" type="button" id="directionNext" '+(ready?'':'disabled')+'>'+(finished?(korean?'Build the question':state.done[index]?'Finish practice':'Complete lesson'):progress.paused?'Resume lesson':'Continue')+'</button></div><p class="direction-note">Your place is saved when you close this lesson.</p>';
      openSheet('Lesson '+(index+1)+' · '+lesson.title,'<div class="directions-activity">'+html+'</div>',()=>{if('speechSynthesis'in window)speechSynthesis.cancel();});bindListen($('#sheetBody'));
      document.querySelectorAll('[data-direction-choice]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.directionChoice===phrase[0]){progress.passed=true;save();draw(true);}else $('#directionFeedback').textContent='Not quite. Look again and try another.';}));
      $('#directionReveal')?.addEventListener('click',()=>{progress.revealed=true;save();draw(true);});
      $('#directionPause')?.addEventListener('click',()=>{progress.paused=true;save();draw(true);});
      $('#directionNext').addEventListener('click',()=>{if(!ready)return;if(finished){o.complete();return;}progress.step++;progress.passed=false;progress.revealed=false;progress.paused=false;save();draw(true);});
      save();if(focus)document.querySelector('.directions-heading').focus();
    }
    draw();
  }
};
