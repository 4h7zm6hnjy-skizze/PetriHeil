/* Petri Heil Pro 4.4.8: universal back navigation in document flow, no overlay. */
(()=>{'use strict';
if(window.__petri445NavReady)return;
window.__petri445NavReady=true;
const script=document.currentScript;
const base=new URL('./',script?.src||location.href);
const id='petri445-back-button';
const localUrl=file=>new URL(file,base).href;
const pageName=()=>location.pathname.split('/').pop()||'index.html';
const fallback=()=>pageName()==='petri440.html'?'index.html':'petri440.html';
function validReferrer(){try{const prev=new URL(document.referrer);return prev.origin===location.origin&&prev.pathname.startsWith(base.pathname)&&prev.pathname!==location.pathname;}catch{return false}}
function goBack(){if(pageName()==='petri440.html'&&location.hash&&location.hash!=='#start'){location.hash='#start';return}if(validReferrer()&&history.length>1){history.back();return}location.assign(localUrl(fallback()))}
function insertInFlow(nav){
 const workspace=document.querySelector('.app-shell .workspace');
 if(workspace){const bar=workspace.querySelector(':scope > .topbar, :scope > header');if(bar){bar.before(nav);return;}workspace.prepend(nav);return;}
 const shell=document.querySelector('body > .shell');
 if(shell){const head=shell.querySelector(':scope > header, :scope > .top');if(head){head.before(nav);return;}shell.prepend(nav);return;}
 const header=document.querySelector('body > header, body > .mast');
 if(header){header.before(nav);return;}
 const main=document.querySelector('body > main');
 if(main){const head=main.querySelector(':scope > header');if(head){head.before(nav);return;}main.prepend(nav);return;}
 const first=document.body.querySelector(':scope > :not(script):not(style):not(.skip)');
 if(first)first.before(nav);else document.body.prepend(nav);
}
function mount(){
 if(document.getElementById(id)||!document.body)return;
 const nav=document.createElement('nav');nav.id='petri445-nav';nav.setAttribute('aria-label','Zurück-Navigation');
 const btn=document.createElement('button');btn.id=id;btn.type='button';btn.className='petri445-back';
 btn.textContent='← Zurück';btn.setAttribute('aria-label','Zurück zur vorherigen App-Seite oder zur Angelzentrale');
 btn.addEventListener('click',goBack);nav.append(btn);insertInFlow(nav);
}
const link=document.createElement('link');link.rel='stylesheet';link.href=localUrl('petri445-nav.css?v=4.4.8');(document.head||document.documentElement).append(link);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
