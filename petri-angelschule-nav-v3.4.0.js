/* Petri Heil Pro 3.4.0 – grouped main menu and school entry. No user data touched. */
(()=>{'use strict';
const NAV=document.getElementById('nav-desktop'), MAIN=document.getElementById('main'), TITLE=document.getElementById('page-title');
if(!NAV)return;
let pending=false,opening=false;
const schoolNames=/fischkunde|angelschein|fischerpr[üu]fung|pr[üu]fung|theorie|lernfragen|lernquiz|quiz|artenkunde|fischarten\s+lernen/i;
function ensureMenu(){
 let menu=NAV.querySelector(':scope > #petri-school-mainnav');
 if(!menu){
   menu=document.createElement('details');menu.id='petri-school-mainnav';
   menu.innerHTML='<summary><span class="ps331-school-icon" aria-hidden="true">📖</span><span>Angelschule</span><span class="ps331-arrow" aria-hidden="true">▾</span></summary><div class="ps331-menu-body"><a class="ps331-menu-home" href="./angelschule.html">Alle Lernbereiche ansehen →</a><div class="ps331-original-nav"></div><a href="./praxis.html">Praktische Prüfung NRW</a><a href="./montagen.html?tab=montagen">Montagen</a><a href="./montagen.html?tab=knoten">Knotenkunde</a><a href="./premium.html?tab=academy">Prüfungs-Akademie</a><a href="./kinderwelt.html">Kinder-Angelwelt</a><a href="./angelstudio.html?tab=learn">Geführter Übungstrainer</a><a href="./angelstudio.html?tab=fish">Fischlexikon (177 Arten)</a></div>';
   NAV.insertBefore(menu,NAV.firstChild);
 }
 const slot=menu.querySelector('.ps331-original-nav');
 // Move original navigation buttons rather than duplicating them. Their native
 // click handlers and navigation semantics remain intact.
 for(const b of [...NAV.children]){
   if(b===menu||b.tagName!=='BUTTON')continue;
   const title=String(b.textContent||'').trim();
   if(schoolNames.test(title))slot.append(b);
 }
 if(slot.querySelector('button.active')&&!menu.open)menu.open=true;
 return menu;
}
function shortcut(){
 if(!MAIN)return;
 let card=MAIN.querySelector(':scope > #petri-school-shortcuts');
 if(!/übersicht|startseite/i.test(TITLE?.textContent||'')){if(card)card.remove();return;}
 const anchor=MAIN.querySelector(':scope > .grid.cards4');
 if(!anchor)return;
 if(!card){card=document.createElement('nav');card.id='petri-school-shortcuts';card.setAttribute('aria-label','Angelschule und Gezeiten');card.innerHTML='<a class="ps331-feature" href="./angelschule.html">📖 Angelschule – alle Lernbereiche</a><a href="./gezeiten.html">Gezeiten &amp; Hochwasser</a>';}
 if(anchor.nextElementSibling!==card)anchor.after(card);
}
function reconcile(){pending=false;ensureMenu();shortcut();activateDeepLink();}
function schedule(){if(!pending){pending=true;requestAnimationFrame(reconcile)}}
const params=new URLSearchParams(location.search),dest=params.get('schule');
let schoolTarget=(dest==='theorie'||dest==='fischkunde')?dest:null;
function activateDeepLink(){
 if(!schoolTarget||opening)return;
 let target=null;
 if(schoolTarget==='theorie'){
   target=document.querySelector('#main [data-action="startLearn"]') ||
     [...NAV.querySelectorAll('button')].find(b=>/angelschein|theorie|fragen|lern/i.test(b.textContent||''));
 }else{
   target=[...NAV.querySelectorAll('button')].find(b=>/fischkunde|fischarten/i.test(b.textContent||''));
 }
 if(!target)return;
 opening=true;schoolTarget=null;
 try{history.replaceState(null,'',location.pathname+location.hash)}catch{}
 requestAnimationFrame(()=>{try{target.click()}finally{opening=false}});
}
new MutationObserver(schedule).observe(NAV,{childList:true});
if(MAIN)new MutationObserver(schedule).observe(MAIN,{childList:true});
if(TITLE)new MutationObserver(schedule).observe(TITLE,{childList:true,subtree:true,characterData:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
else schedule();
})();
