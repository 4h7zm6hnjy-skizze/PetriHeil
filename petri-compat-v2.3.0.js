/* Non-invasive responsiveness and progressive enhancements for iOS/Android. */
(()=>{'use strict';
 let queued=false;
 const tune=()=>{queued=false;const main=document.getElementById('main');if(!main)return;
  for(const i of main.querySelectorAll('img:not([loading])')){
   if(i.closest('.hero,.petri216-banner,.p31-launch-card'))continue;
   i.loading='lazy';i.decoding='async';
  }
  for(const b of main.querySelectorAll('.hero.petri216-banner button[data-action]')){
   if(!b.hasAttribute('aria-label'))b.setAttribute('aria-label',b.dataset.action==='openCatch'?'Fang eintragen':'Angelschein lernen');
  }
  const text=document.querySelector('#sidebar .tiny');if(text&&/Version\s+\d/.test(text.textContent))text.textContent='Version 2.3.0 · Offline-PWA';
 };
 const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(tune)};
 const start=()=>{const m=document.getElementById('main');if(m)new MutationObserver(schedule).observe(m,{childList:true,subtree:false});schedule()};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
