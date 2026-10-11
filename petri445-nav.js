/* Petri Heil Pro 4.4.5: universal, local navigation, no data access. */
(()=>{'use strict';
if(window.__petri445NavReady)return;window.__petri445NavReady=true;
const script=document.currentScript;
const base=new URL('./',script?.src||location.href);
const id='petri445-back-button';
const localUrl=file=>new URL(file,base).href;
const pageName=()=>location.pathname.split('/').pop()||'index.html';
const backFallback=()=>pageName()==='petri440.html'?'index.html':'petri440.html';
function validReferrer(){
 try {const previous=new URL(document.referrer);
  return previous.origin===location.origin && previous.pathname.startsWith(base.pathname) && previous.pathname!==location.pathname;
 }catch{return false}
}
function goBack(){
 if(validReferrer()&&history.length>1){history.back();return;}
 location.assign(localUrl(backFallback()));
}
function mount(){
 if(document.getElementById(id)||!document.body)return;
 const nav=document.createElement('nav');nav.id='petri445-nav';nav.setAttribute('aria-label','Zurück-Navigation');
 const btn=document.createElement('button');btn.id=id;btn.type='button';btn.className='petri445-back';
 btn.textContent='← Zurück';btn.setAttribute('aria-label','Zurück zur vorherigen App-Seite oder zur Angelzentrale');
 btn.addEventListener('click',goBack);nav.appendChild(btn);document.body.appendChild(nav);
}
const link=document.createElement('link');link.rel='stylesheet';link.href=localUrl('petri445-nav.css?v=4.4.5');
(document.head||document.documentElement).appendChild(link);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
