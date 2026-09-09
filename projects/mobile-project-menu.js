(() => {
 const menu=document.getElementById('mobileWorkMenu'),bar=document.getElementById('mobileTabbar');
 if(!menu||!bar)return;
 const trigger=bar.querySelector('[data-mobile-menu]');if(!trigger)return;
 const names={'light-and-form.html':'Light & Form','special-editions.html':'Special Editions','so-good.html':'Zara Larsson','after-hours.html':'The Weeknd','toronto-in-bloom.html':'Toronto in Bloom','chronicles-of-elysium.html':'Chronicles of Elysium','tend-habit-tracker.html':'Tend','coffee-nearby.html':'Coffee Nearby'};
 const file=location.pathname.split('/').pop();
 const header=document.createElement('div');header.className='mpm-header';header.innerHTML='<strong id="mpm-title">Projects</strong><button type="button" class="mpm-close" aria-label="Close projects menu">×</button>';menu.prepend(header);
 menu.setAttribute('role','region');menu.setAttribute('aria-labelledby','mpm-title');
 let current=[...menu.querySelectorAll('a')].find(a=>new URL(a.href).pathname===location.pathname);
 if(!current){current=document.createElement('a');current.href=file;current.textContent=names[file]||document.title.split('|')[0].trim();const groups=[...menu.children].filter(e=>e.tagName==='SPAN');const group=groups.find(g=>g.textContent.includes(['chronicles-of-elysium.html','tend-habit-tracker.html','coffee-nearby.html'].includes(file)?'Design Systems':'Editorial'));(group||header).after(current)}
 current.setAttribute('aria-current','page');const badge=document.createElement('span');badge.textContent='You are here';current.querySelector('span')?.remove();current.append(badge);
 const home=bar.querySelector('.mobile-home-btn');
 trigger.querySelector('.mobile-tab-label')?.remove();trigger.setAttribute('aria-label','Projects');trigger.title='Projects';
 trigger.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="14" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="4" y="14" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="14" y="14" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
 const top=document.createElement('button');top.type='button';top.className='mpm-top';top.setAttribute('aria-label','Back to top');top.title='Back to top';top.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path d="M6 13l6-6 6 6M12 7v13M5 3h14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';top.onclick=()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 bar.replaceChildren(trigger,home,top);
 let idleTimer,hasScrolled=false,userIntent=false,lastY=scrollY;const mobile=matchMedia('(max-width:768px)');
 const reveal=()=>{clearTimeout(idleTimer);bar.classList.add('mpm-visible');bar.classList.remove('is-hidden')};
 const reset=()=>{clearTimeout(idleTimer);hasScrolled=false;userIntent=false;lastY=scrollY;bar.classList.remove('mpm-visible');bar.classList.add('is-hidden')};
 ['wheel','touchmove','pointerdown'].forEach(type=>addEventListener(type,()=>{userIntent=true},{passive:true}));
 addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))userIntent=true});
 addEventListener('scroll',()=>{const moved=Math.abs(scrollY-lastY)>2;lastY=scrollY;if(!mobile.matches||!moved||(!userIntent&&!hasScrolled))return;hasScrolled=true;clearTimeout(idleTimer);if(menu.classList.contains('is-open')||bar.querySelector(':focus-visible')||menu.querySelector(':focus-visible')){reveal();return}bar.classList.remove('mpm-visible');bar.classList.add('is-hidden');idleTimer=setTimeout(reveal,300)},{passive:true});
 bar.addEventListener('focusin',()=>{if(bar.querySelector(':focus-visible'))reveal()});menu.addEventListener('focusin',reveal);
 mobile.addEventListener('change',reset);addEventListener('pageshow',reset);reset();
 const close=(restore=false)=>{menu.classList.remove('is-open');bar.classList.remove('is-open');menu.inert=true;menu.setAttribute('aria-hidden','true');trigger.setAttribute('aria-expanded','false');if(restore)trigger.focus({preventScroll:true})};
 const open=()=>{reveal();menu.inert=false;menu.removeAttribute('aria-hidden');menu.classList.add('is-open');bar.classList.add('is-open');trigger.setAttribute('aria-expanded','true');menu.querySelector('button').focus({preventScroll:true})};
 trigger.addEventListener('click',()=>menu.classList.contains('is-open')?close(true):open());
 header.querySelector('button').onclick=()=>close(true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('is-open')){e.preventDefault();close(true)}});
 document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!bar.contains(e.target))close()});
 document.addEventListener('focusin',e=>{if(!menu.contains(e.target)&&!bar.contains(e.target))close()});
 menu.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 matchMedia('(min-width:769px)').addEventListener('change',e=>{if(e.matches)close()});
 addEventListener('pagehide',()=>{clearTimeout(idleTimer);close()});close();
})();

