/* Petri Heil Pro – existing hero/podium layout with early Beißindex insertion. */
(()=>{'use strict';
const main=document.getElementById('main');if(!main)return;let scheduled=false,artworkLoaded=false;
const probe=new Image();probe.addEventListener('load',()=>{artworkLoaded=true;schedule()});probe.addEventListener('error',()=>{artworkLoaded=false;schedule()});probe.src=new URL('petri-hero-uebersicht-v2.1.6.webp',document.currentScript?.src||document.baseURI).href;
function arrange(){scheduled=false;if(!/übersicht|startseite/i.test(document.getElementById('page-title')?.textContent||''))return;
 const hero=main.querySelector(':scope > .hero'),podium=[...main.children].find(el=>el.matches('section')&&el.querySelector('.rank-grid')&&/Fang-Podium/i.test(el.querySelector('h2')?.textContent||'')),pro=main.querySelector(':scope > .p31-launch-card'),metrics=main.querySelector(':scope > .grid.cards4');
 if(!hero||!podium||!metrics)return;
 hero.classList.toggle('petri216-banner',artworkLoaded);podium.classList.add('petri216-podium');metrics.classList.add('petri216-metrics');
 for(const rank of podium.querySelectorAll('.rank')){const medal=rank.querySelector('.medal');if(medal&&medal.textContent!=='🏆')medal.textContent='🏆';}
 if(pro)pro.classList.add('petri216-pro');
 if(main.firstElementChild!==hero)main.insertBefore(hero,main.firstElementChild);
 // New 3.2 Beißindex goes directly below hero, followed by the existing podium.
 const bite=main.querySelector(':scope > #petri-bissindex');
 if(bite){if(hero.nextElementSibling!==bite)hero.after(bite);if(bite.nextElementSibling!==podium)bite.after(podium);}
 else if(hero.nextElementSibling!==podium)hero.after(podium);
 if(pro){if(podium.nextElementSibling!==pro)podium.after(pro);if(pro.nextElementSibling!==metrics)pro.after(metrics);}
 else if(podium.nextElementSibling!==metrics)podium.after(metrics);
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(arrange)}
new MutationObserver(schedule).observe(main,{childList:true,subtree:false});const title=document.getElementById('page-title');if(title)new MutationObserver(schedule).observe(title,{childList:true,characterData:true,subtree:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
