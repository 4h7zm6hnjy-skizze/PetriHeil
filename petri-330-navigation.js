/* Petri Heil Pro 3.3.0 – safe supplementary navigation. Does not change user data. */
(()=>{'use strict';
 const main=document.getElementById('main'),title=document.getElementById('page-title');
 if(!main)return;
 let pending=false;
 function reconcile(){pending=false;
  const overview=/übersicht|startseite/i.test(title?.textContent||'');
  let card=main.querySelector(':scope > #petri330-shortcuts');
  if(!overview){if(card)card.remove();return;}
  const anchor=main.querySelector(':scope > .grid.cards4');
  if(!anchor)return;
  if(!card){card=document.createElement('nav');card.id='petri330-shortcuts';card.setAttribute('aria-label','Weitere Angelbereiche');card.innerHTML='<a href="./gezeiten.html">Gezeiten &amp; Hochwasser</a><a href="./kinderwelt.html">Kinder-Angelwelt</a>';}
  if(anchor.nextElementSibling!==card)anchor.after(card);
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(reconcile)}}
 new MutationObserver(schedule).observe(main,{childList:true,subtree:false});
 if(title)new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
