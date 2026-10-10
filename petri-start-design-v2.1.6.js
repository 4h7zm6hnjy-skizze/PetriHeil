/* Petri Heil Pro 2.1.6 – DOM-only placement of already-existing overview widgets.
 * Never touches localStorage, IndexedDB, data models or navigation handlers.
 * Existing real podium values, Fang buttons and Pro launcher are preserved.
 */
(()=>{
 'use strict';
 const main=document.getElementById('main');
 if(!main)return;
 let scheduled=false;
 let artworkLoaded=false;
 // If the hero background is missing, retain the original text and real buttons.
 const imageProbe=new Image();
 imageProbe.addEventListener('load',()=>{artworkLoaded=true;schedule()});
 imageProbe.addEventListener('error',()=>{artworkLoaded=false;schedule()});
 imageProbe.src=new URL('petri-hero-uebersicht-v2.1.6.webp',document.currentScript?.src||document.baseURI).href;
 function arrange(){
  scheduled=false;
  if(!/übersicht|startseite/i.test(document.getElementById('page-title')?.textContent||''))return;
  const hero=main.querySelector(':scope > .hero');
  const podium=[...main.children].find(el=>el.matches('section')&&el.querySelector('.rank-grid')&&/Fang-Podium/i.test(el.querySelector('h2')?.textContent||''));
  const pro=main.querySelector(':scope > .p31-launch-card');
  const metrics=main.querySelector(':scope > .grid.cards4');
  if(!hero||!podium||!metrics)return;
  hero.classList.toggle('petri216-banner',artworkLoaded);
  podium.classList.add('petri216-podium');
  metrics.classList.add('petri216-metrics');
  for(const rank of podium.querySelectorAll('.rank')){
   const medal=rank.querySelector('.medal');
   if(medal&&medal.textContent!=='🏆')medal.textContent='🏆';
  }
  if(pro)pro.classList.add('petri216-pro');
  // Reorder existing live DOM nodes, not snapshots. Does not interfere with event listeners.
  if(main.firstElementChild!==hero)main.insertBefore(hero,main.firstElementChild);
  if(hero.nextElementSibling!==podium)hero.after(podium);
  if(pro){
   if(podium.nextElementSibling!==pro)podium.after(pro);
   if(pro.nextElementSibling!==metrics)pro.after(metrics);
  }else if(podium.nextElementSibling!==metrics)podium.after(metrics);
 }
 function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(arrange);
 }
 new MutationObserver(schedule).observe(main,{childList:true,subtree:false});
 const title=document.getElementById('page-title');
 if(title)new MutationObserver(schedule).observe(title,{childList:true,characterData:true,subtree:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
 else schedule();
})();
