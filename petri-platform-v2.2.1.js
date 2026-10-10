/* Petri Heil Pro 2.2.1 – iPhone and Android PWA installation help.
   Does not modify app state, navigation, localStorage or IndexedDB. */
(()=>{
'use strict';
if(window.__petriPlatform221)return;
window.__petriPlatform221=true;
const $=id=>document.getElementById(id);
const root=new URL('./',document.currentScript?.src||document.baseURI);
const ua=navigator.userAgent||'';
const isIOS=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);
const isAndroid=/Android/i.test(ua);
const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
let installEvent=null;
const label=()=>isIOS?'iPhone / iPad':isAndroid?'Android':'Browser / Computer';
function create(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;}
function installInfo(){
 if(isStandalone())return 'Die App ist im eigenständigen App-Modus geöffnet.';
 if(isIOS)return 'Safari öffnen → Teilen → Zum Home-Bildschirm → Hinzufügen. Die Installation erfolgt über iOS, nicht über einen Download-Button.';
 if(isAndroid)return installEvent?'Installation ist über die Schaltfläche unten möglich.':'In Chrome das Menü ⋮ öffnen → App installieren oder Zum Startbildschirm hinzufügen. Die Option erscheint nur, wenn Chrome die App als installierbar erkennt.';
 return 'Petri Heil kann in einem unterstützten Browser als Web-App installiert werden. Auf Android Chrome, auf dem iPhone Safari verwenden.';
}
function render(){
 let card=$('petri221-device-card');
 if(!card){
   card=create('section','petri221-device-card');card.id='petri221-device-card';
   const h=create('h3','', 'Petri Heil auf iPhone & Android');
   const platform=create('p','petri221-platform');platform.id='petri221-platform';
   const info=create('p','petri221-install-text');info.id='petri221-info';
   const controls=create('div','petri221-actions');
   const install=create('button','button button-primary petri221-install','App installieren');install.type='button';install.id='petri221-install';install.hidden=true;
   const guide=create('a','button button-outline petri221-guide','Installationsanleitung');guide.href=new URL('installieren.html',root).href;
   const offline=create('a','button button-outline petri221-guide','Offline prüfen');offline.href=new URL('offline-check.html',root).href;
   controls.append(install,guide,offline);
   const note=create('p','petri221-note','Wichtig: Fänge, Fotos und Einstellungen werden auf jedem Gerät getrennt gespeichert. Für einen Gerätewechsel bitte die Sicherungs-/Exportfunktionen der App nutzen. Die 228 Bilder müssen auf jedem Gerät einzeln offline vorbereitet werden.');
   card.append(h,platform,info,controls,note);
 }
 const platform=$('petri221-platform')||card.querySelector('#petri221-platform');
 const info=$('petri221-info')||card.querySelector('#petri221-info');
 const button=$('petri221-install')||card.querySelector('#petri221-install');
 if(platform)platform.textContent='Gerät: '+label()+' · '+(isStandalone()?'App installiert/geöffnet':'Browseransicht');
 if(info)info.textContent=installInfo();
 if(button)button.hidden=!(isAndroid&&installEvent&&!isStandalone());
 const installPage=$('petri221-install-page');
 if(installPage){if(!installPage.contains(card))installPage.append(card);return;}
 const settings=$('app-update-card');
 if(settings){if(settings.nextElementSibling!==card)settings.after(card);return;}
 // When not on the settings page, do not alter the original navigation or dashboard.
 if(card.parentElement)card.remove();
}
window.addEventListener('beforeinstallprompt',event=>{
 if(!isAndroid)return;
 event.preventDefault();installEvent=event;render();
});
window.addEventListener('appinstalled',()=>{installEvent=null;render();});
window.addEventListener('pageshow',render);
document.addEventListener('click',async event=>{
 const button=event.target instanceof Element?event.target.closest('#petri221-install'):null;
 if(!button||!installEvent)return;
 event.preventDefault();
 const prompt=installEvent;installEvent=null;
 try{await prompt.prompt();await prompt.userChoice;}catch(e){console.warn('Petri Heil: Installation nur über Browser möglich.',e);}
 render();
});
function registerForFirstInstall(){
 // Register only when no worker exists. Never replace an already installed
 // worker automatically, which caused update loops in older releases.
 if(!('serviceWorker' in navigator))return;
 if(location.protocol!=='https:'&&location.hostname!=='localhost')return;
 navigator.serviceWorker.getRegistration(root.href).then(reg=>{
   if(!reg)return navigator.serviceWorker.register(new URL('sw.js',root).href,{scope:root.href,updateViaCache:'none'});
 }).catch(err=>console.warn('Petri Heil: Offline-Worker kann noch nicht eingerichtet werden.',err));
}
function start(){
 registerForFirstInstall();
 render();const main=$('main');
 if(main){let scheduled=false;new MutationObserver(()=>{
   if(scheduled)return;scheduled=true;
   requestAnimationFrame(()=>{scheduled=false;render();});
 }).observe(main,{childList:true,subtree:true});}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
