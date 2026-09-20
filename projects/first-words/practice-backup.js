/* Track-scoped backups include the foundation, destination outing and short moments. */
window.FirstWordsBackup=(()=>{
 const cities={korean:'seoul',japanese:'tokyo','traditional-mandarin':'taipei',cantonese:'hongkong'};
 const STORE='first-words-destination-rhythm-v2',ids=['greeting','ordering','directions'];
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 function read(key){const raw=localStorage.getItem(key);return raw===null?null:JSON.parse(raw);}
 function validOuting(s){return s===null||(object(s)&&Array.isArray(s.steps)&&s.steps.length>0&&s.steps.length<=100&&s.steps.every(x=>Array.isArray(x)&&x.length===3&&['learn','choose','recall','pause','connect'].includes(x[0])&&Number.isInteger(x[1])&&x[1]>=0&&x[1]<6&&Number.isInteger(x[2])&&x[2]>=0&&x[2]<3)&&Number.isInteger(s.cursor)&&s.cursor>=0&&s.cursor<s.steps.length&&['practice','review','summary'].includes(s.mode)&&Array.isArray(s.missed)&&s.missed.every(x=>Number.isInteger(x)&&x>=0&&x<6)&&['answered','wrong','revealed','paused'].every(k=>typeof s[k]==='boolean'));}
 function validate(parsed,track){
  if(!object(parsed)||!Array.isArray(parsed.done)||parsed.done.length>15||parsed.done.some(x=>typeof x!=='boolean')||parsed.v!==(track==='korean'?2:1))throw Error('Invalid foundation backup');
  const extra=parsed.firstWordsBackup;
  if(extra!==undefined){if(!object(extra)||extra.version!==1||extra.track!==track||!object(extra.moments)||!validOuting(extra.outing)||ids.some(id=>{const x=extra.moments[id];return x!==null&&(!object(x)||!Number.isInteger(x.step)||x.step<0||x.step>3);}))throw Error('Wrong language or invalid destination backup');}
  return parsed;
 }
 function create(state,track){const city=cities[track];const all=read(STORE);const result={...state,firstWordsBackup:{version:1,track,outing:all?.[city]||null,moments:Object.fromEntries(ids.map(id=>[id,read('first-words-'+city+'-moment-'+id)]))}};validate(result,track);return result;}
 function replaceDestination(extra,track){
  const city=cities[track],all=read(STORE)||{version:2};if(!object(all)||all.version!==2)throw Error('Unrecognized destination save');
  if(extra.outing===null)delete all[city];else all[city]=extra.outing;
  const writes=[[STORE,JSON.stringify(all)],...ids.map(id=>['first-words-'+city+'-moment-'+id,extra.moments[id]===null?null:JSON.stringify(extra.moments[id])])];
  const before=writes.map(([key])=>[key,localStorage.getItem(key)]);
  try{for(const [key,value]of writes){if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}}
  catch(error){for(const [key,value]of before){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}catch{}}throw error;}
 }
 function restore(parsed,track){validate(parsed,track);const {firstWordsBackup,...state}=parsed;if(firstWordsBackup)replaceDestination(firstWordsBackup,track);return state;}
 function reset(track){replaceDestination({outing:null,moments:Object.fromEntries(ids.map(id=>[id,null]))},track);}
 return {create,restore,reset};
})();
