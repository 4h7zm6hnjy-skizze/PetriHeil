/* Petri Heil Pro – Privatmodus ab 2.2.2.
 * Offline-/Sicherheits-Sperre: keine Verbindungen zu externen Domains.
 * CSP in HTML erzwingt Blockierung auch für iframe/fetch/img/WebSocket.
 * Kein Löschen oder Exportieren gespeicherter Daten.
 */
(()=>{
 'use strict';
 const EXTERNAL_ACTIONS=new Set(['fetchWeather','weatherSite','weatherBiggesee','geocodePlace','gpsWeather','map','inlineMap']);
 const EXTERNAL_MAPS=new Set(['mapgps','mapall','mapitem']);
 const notice='Datenschutz: Externe Wetter-, Orts- und Kartendienste sind deaktiviert. Es werden keine Fangdaten, Fotos oder GPS-Koordinaten an diese Dienste gesendet. Lokale GPS-Erfassung bleibt möglich.';
 function isExternal(url){
  try{const x=new URL(String(url),document.baseURI);
   return (x.protocol==='https:'||x.protocol==='http:')&&x.origin!==location.origin;
  }catch{return false;}
 }
 function inform(){
  let region=document.getElementById('petri-private-notice');
  if(!region){
   region=document.createElement('div');region.id='petri-private-notice';
   region.setAttribute('role','status');region.setAttribute('aria-live','polite');
   region.style.cssText='position:fixed;z-index:100000;bottom:calc(90px + env(safe-area-inset-bottom,0px));left:12px;right:12px;margin:auto;max-width:620px;padding:13px 17px;background:#f4faff;color:#16405a;border:1px solid #82bbd7;border-radius:12px;box-shadow:0 10px 35px #1239;font:14px/1.5 system-ui,sans-serif';
   document.body.append(region);
  }
  region.textContent=notice;
  const close=document.createElement('button');close.type='button';close.textContent='Schließen';close.style.cssText='display:block;margin:8px 0 0 auto;padding:7px 11px;border:1px solid #7cb7d3;border-radius:9px;color:#0b557d;background:white;';
  close.onclick=()=>region.remove();region.append(close);
 }
 // Block users from accidentally activating online-only UI actions.
 document.addEventListener('click',e=>{
  const el=e.target instanceof Element?e.target.closest('button,a,[data-action],[data-p37]'):null;
  if(!el)return;
  const a=el.getAttribute('data-action'),p=el.getAttribute('data-p37');
  const href=el.closest('a[href]')?.getAttribute('href');
  if(EXTERNAL_ACTIONS.has(a)||EXTERNAL_MAPS.has(p)||href&&isExternal(href)){
    e.preventDefault();e.stopImmediatePropagation();inform();
  }
 },true);
 // Prevent code paths invoking an external window directly (e.g. mapOpen()).
 try{
  const nativeOpen=window.open.bind(window);
  window.open=function(target,...args){
   if(isExternal(target)){inform();return null;}
   return nativeOpen(target,...args);
  };
 }catch{}
 // Static CSP also blocks third-party CSS, embeds, remote images and network requests.
 window.PetriPrivatmodus=Object.freeze({enabled:true,externalNetworkDisabled:true});
})();
