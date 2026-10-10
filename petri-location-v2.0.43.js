/* PetriHeil Pro 2.0.43 – freiwillige, automatische Standortfreigabe beim Öffnen.
   Koordinaten nur im Arbeitsspeicher, keine dauerhafte Standortüberwachung.
   Standortberechtigungen verwaltet allein iOS/Safari. */
(()=>{
'use strict';
const PREF='petri43-location-mode';
const readPref=()=>{try{return localStorage.getItem(PREF)||'ask';}catch{return 'ask';}};
const writePref=v=>{try{localStorage.setItem(PREF,v);}catch{}};
let data={status:'idle',message:'Standort noch nicht geprüft.',coords:null};
let pending=null, lastAttempt=0, lastForeground=0, noticeDismissed=false, requestCounter=0;
const getState=()=>({...data,coords:data.coords?{...data.coords}:null});
const getPosition=()=>data.status==='granted'&&data.coords?{...data.coords}:null;
const valid=c=>Number.isFinite(c.lat)&&Number.isFinite(c.lon)&&Math.abs(c.lat)<=90&&Math.abs(c.lon)<=180;
const explanation=err=>{
 const code=Number(err?.code||0);
 if(code===1)return ['blocked','Standortzugriff blockiert. Erlaube ihn in Safari unter Website-Einstellungen → Standort bzw. in den iPhone-Ortungsdiensten. Danach „Erneut versuchen“ tippen.'];
 if(code===2)return ['unavailable','Das iPhone konnte keine Position ermitteln. Prüfe WLAN/Mobilfunk, Ortungsdienste und den GPS-Empfang.'];
 if(code===3)return ['timeout','GPS hat zu lange gebraucht. Tippe „Erneut versuchen“ oder gib den Ort selbst ein.'];
 return ['unavailable','Standortabfrage nicht möglich: '+String(err?.message||'Unbekannter Fehler')];
};
function publish(state,reason){data={...state};if(reason) data.message=reason;
 try{window.dispatchEvent(new CustomEvent('petriheil:location',{detail:getState()}));}catch{}
 draw();
}
function draw(){const host=document.getElementById('petri43-location-notice');if(!host)return;
 const ready=data.status==='granted';
 const hide=noticeDismissed&&data.status!=='requesting';
 host.hidden=hide;
 if(hide)return;
 host.setAttribute('data-state',data.status);
 const text=host.querySelector('#petri43-location-text');if(text)text.textContent=data.message;
 const retry=host.querySelector('#petri43-location-retry');if(retry){retry.hidden=data.status==='requesting';retry.textContent=['blocked','denied'].includes(data.status)?'Erneut freigeben':'Standort erlauben';}
 const off=host.querySelector('#petri43-location-off');if(off)off.hidden=data.status==='disabled';
}
function makeBanner(){if(document.getElementById('petri43-location-notice'))return;
 const host=document.createElement('aside');host.id='petri43-location-notice';host.setAttribute('aria-label','Standort-Berechtigung');
 host.innerHTML='<span aria-hidden="true">⌖</span><span id="petri43-location-text" role="status" aria-live="polite">Standort wird geprüft …</span><button type="button" id="petri43-location-retry">Standort erlauben</button><button type="button" id="petri43-location-off">Ausschalten</button><button type="button" id="petri43-location-dismiss" aria-label="Hinweis schließen">×</button>';
 const top=document.querySelector('.workspace > .topbar');
 if(top)top.insertAdjacentElement('afterend',host);else document.body.prepend(host);
 host.querySelector('#petri43-location-retry').addEventListener('click',()=>{noticeDismissed=false;void request(true);});
 host.querySelector('#petri43-location-off').addEventListener('click',disable);
 host.querySelector('#petri43-location-dismiss').addEventListener('click',()=>{noticeDismissed=true;draw();});
 const css=document.createElement('style');css.id='petri43-location-style';css.textContent=`
 #petri43-location-notice{box-sizing:border-box;display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:8px 16px;margin:0;background:#e5f6ff;color:#174e69;border-bottom:1px solid #b8d5e5;font:13px/1.4 system-ui,sans-serif}
 #petri43-location-notice[hidden]{display:none!important}#petri43-location-text{flex:1;min-width:170px}
 #petri43-location-notice button{border:1px solid #82b5cf;border-radius:8px;background:white;color:#1a5578;padding:8px 10px;font:600 12px system-ui;cursor:pointer}
 #petri43-location-notice button[hidden]{display:none}#petri43-location-notice[data-state="blocked"],#petri43-location-notice[data-state="insecure"],#petri43-location-notice[data-state="unsupported"]{background:#fff3e6}
 @media(max-width:500px){#petri43-location-notice{padding:8px 12px;gap:6px}#petri43-location-notice button{padding:7px}}
 `;document.head.append(css);draw();
}
function disable(){writePref('off');requestCounter++;noticeDismissed=false;publish({status:'disabled',message:'Automatische Standortnutzung ausgeschaltet. Bei Bedarf wieder einschalten.',coords:null});}
async function request(userInitiated=false){
 if(pending)return pending;
 if(userInitiated){writePref('ask');noticeDismissed=false;}
 else if(['off','blocked'].includes(readPref())){const blocked=readPref()==='blocked';publish({status:blocked?'blocked':'disabled',message:blocked?'Standort ist bisher nicht freigegeben. Tippe „Erneut freigeben“ oder gib den Ort manuell ein.':'Standortnutzung ist ausgeschaltet.',coords:null});return null;}
 if(!window.isSecureContext){publish({status:'insecure',message:'GPS erfordert eine HTTPS-Verbindung. Öffne PetriHeil direkt in Safari.',coords:null});return null;}
 if(!navigator.geolocation || !navigator.geolocation.getCurrentPosition){publish({status:'unsupported',message:'Dieser Browser unterstützt hier keinen GPS-Zugriff. Öffne PetriHeil direkt in Safari.',coords:null});return null;}
 lastAttempt=Date.now();const id=++requestCounter;
 publish({status:'requesting',message:'PetriHeil fragt nach deinem Standort. Bitte die iPhone-Freigabe bestätigen …',coords:data.coords});
 const locate=opts=>new Promise((resolve,reject)=>{try{navigator.geolocation.getCurrentPosition(resolve,reject,opts);}catch(e){reject(e);}});
 pending=(async()=>{
  try{
   let pos;
   try{pos=await locate({enableHighAccuracy:false,timeout:14000,maximumAge:120000});}
   catch(e){if(Number(e?.code)===1)throw e;pos=await locate({enableHighAccuracy:true,timeout:17000,maximumAge:0});}
   if(id!==requestCounter)return null;
   const c={lat:Number(pos?.coords?.latitude),lon:Number(pos?.coords?.longitude),accuracy:Number(pos?.coords?.accuracy),at:Date.now()};
   if(!valid(c))throw Error('GPS-Koordinaten ungültig');
   writePref('on');
   publish({status:'granted',message:'Standort freigegeben'+(Number.isFinite(c.accuracy)?' · ca. '+Math.round(c.accuracy)+' m Genauigkeit':'')+'. Angelwetter wird automatisch aktualisiert.',coords:c});
   // Hinweis nach erfolgreicher Positionsermittlung automatisch ausblenden.
   setTimeout(()=>{if(data.status==='granted'){noticeDismissed=true;draw();}},10000);
   return c;
  }catch(e){if(id!==requestCounter)return null;
   const [status,message]=explanation(e);
   if(status==='blocked')writePref('blocked');
   publish({status,message,coords:null});return null;
  }finally{pending=null;draw();}
 })();
 return pending;
}
window.PetriHeilLocation={request,getPosition,getState,disable,isEnabled:()=>readPref()!=='off'};
function start(){makeBanner();
 // Der erste Aufruf öffnet die Browser-Abfrage, sofern Safari sie zulässt.
 void request(false);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')return;
   if(Date.now()-lastAttempt>25*60*1000 && readPref()==='on')void request(false);
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
