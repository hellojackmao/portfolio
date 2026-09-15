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
