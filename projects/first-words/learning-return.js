/* Read existing local progress without changing it. */
window.FirstWordsReturn = {
  info(key, orderingIndex) {
    let state;
    try { state = JSON.parse(localStorage.getItem(key)); } catch (_) {}
    if (!state || typeof state !== 'object' || Array.isArray(state)) state = {};
    const done = Array.from({length:15}, (_,i) => Boolean(Array.isArray(state.done) && state.done[i]));
    const count = done.filter(Boolean).length;
    const active = Number.isInteger(state.activeLesson) && state.activeLesson >= 0 && state.activeLesson < 15 && !done[state.activeLesson] ? state.activeLesson : -1;
    const pilot = state.orderingPilot;
    const ordering = pilot && Number.isInteger(pilot.step) && pilot.step >= 0 && pilot.step <= 11 && ['passed','revealed','paused'].every(k=>typeof pilot[k]==='boolean') && !done[orderingIndex];
    return {count, started:count>0 || active>=0 || Boolean(ordering), index:active>=0?active:ordering?orderingIndex:done.findIndex(value=>!value)};
  },
  card(card, key, orderingIndex) {
    const info = this.info(key, orderingIndex);
    if (!info.started) return;
    const link = new URL(card.href);
    link.searchParams.set('resume','1');
    card.href = link.href;
    card.querySelector('.track-foot span:last-child').textContent = info.count===15 ? 'Review lessons →' : 'Continue learning →';
  }
};

/* A skippable recall moment on a deliberate return; never alters lesson progress. */
window.FirstWordsReturn.offer = function(o) {
  const {state,lessons,openSheet,esc,proceed,lang}=o;
  let index=Number.isInteger(state.lastLesson)&&state.done[state.lastLesson]?state.lastLesson:-1;
  if(index<0) index=lessons.findLastIndex((_,i)=>state.done[i]);
  if(index<0){proceed();return;}
  const phrase=lessons[index].phrases[0];
  openSheet('Welcome back', '<div class="return-recap"><p class="kicker">A small reminder · Optional</p><h3>Bring one phrase back.</h3><p>From '+esc(lessons[index].title)+': can you recall the sound or phrase for “'+esc(phrase[2])+'”?</p><details><summary>Reveal the phrase</summary><p lang="'+lang+'" class="return-phrase">'+esc(phrase[0])+'</p><p>'+esc(phrase[1])+'</p></details><p>Say it aloud or silently. There is no score, and you can go straight to your lesson.</p><div class="sheet-actions"><button type="button" class="btn" id="returnContinue">Continue to my lesson</button></div></div>');
  document.querySelector('#returnContinue').addEventListener('click',proceed,{once:true});
};
