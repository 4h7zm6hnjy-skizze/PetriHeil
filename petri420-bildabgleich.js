/* Petri Heil 4.2: name/id catalog consistency checker and non-destructive image repair. */
(()=>{'use strict';
const dir=new URL('./',document.currentScript?.src||location.href);
const fixes=new Map([['c8',{name:'Galizischer Sumpfkrebs',file:'galizischer-sumpfkrebs-ki-weiss.webp'}],['c14',{name:'Kaisergranat',file:'kaisergranat-ki-weiss.webp'}]]);
function ensure(){const root=document.getElementById('main');if(!root)return;
  for(const box of root.querySelectorAll('.fish-card')){
    const heading=box.querySelector('.fish-card-top h3,h3')?.textContent?.trim();
    const spec=[...fixes.values()].find(x=>x.name===heading);if(!spec)continue;
    const img=box.querySelector('.photo-content img');if(!img||img.dataset.customPhoto==='true')continue;
    if(/^(blob:|data:)/i.test(img.getAttribute('src')||''))continue;
    const should=new URL(spec.file,dir).href;
    if(img.src!==should){img.src=should;img.alt=spec.name+' – KI-Lernbild, keine geprüfte Bestimmungsaufnahme';}
  }
}
let busy=false;function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;ensure()})}
function start(){const root=document.getElementById('main');if(!root)return;new MutationObserver(schedule).observe(root,{subtree:true,childList:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
