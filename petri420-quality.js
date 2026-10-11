/* Offline diagnostic: read-only, local-only, with anonymous export. */
(()=>{'use strict';const el=id=>document.getElementById(id),ROOT=new URL('./',location.href),file=x=>new URL(x,ROOT).href;
let latest=null,busy=false;
const json=async name=>{let resp;try{resp=await fetch(file(name),{cache:'no-store'})}catch{}if(!resp?.ok&&'caches' in window)resp=await caches.match(file(name),{ignoreSearch:true});if(!resp?.ok)throw Error('Dateiliste nicht geladen: '+name);return resp.json()};
async function cached(name,core){const url=file(name);const local=await core.match(url)||await caches.match(url,{ignoreSearch:true});return Boolean(local?.ok)}
async function run(){if(busy)return;busy=true;el('run').disabled=true;el('save').disabled=true;el('message').textContent='Prüfung gestartet …';try{
 if(!('caches' in window))throw Error('Cache Storage nicht verfügbar');
 const m=await json('petri-core-v4.2.0.json'),med=await json('petri-media-v2.2.0.json');
 if(m.version!=='4.2.0'||!Array.isArray(m.files)||m.files.length<145||new Set(m.files).size!==m.files.length)throw Error('Kernmanifest nicht gültig');
 if(!Array.isArray(med.files)||med.files.length!==228||new Set(med.files).size!==228)throw Error('Medienliste nicht vollständig');
 const core=await caches.open('petri-core-4.2.0');let n=0,images=0,missing=[],mediaMissing=[];
 for(const x of m.files){if(await cached(x,core))n++;else missing.push(x)}
 for(const x of med.files){if(await caches.match(file(x),{ignoreSearch:true}))images++;else mediaMissing.push(x)}
 latest={version:'4.2.0',tested:new Date().toISOString(),manifest:m.files.length,coreCached:n,images:med.files.length,mediaCached:images,missingCore:missing.slice(0,30),missingMedia:mediaMissing.slice(0,30),note:'Nur Dateiprüfung im aktuellen Browser. Kein Backup, keine Prüfung rechtlicher/biologischer Richtigkeit. Keine persönlichen Einträge enthalten.'};
 el('message').textContent=`Offline-Kern: ${n}/${m.files.length}\nMedien: ${images}/${med.files.length}\nFehlende Kern-Dateien: ${missing.length}\nFehlende Medien: ${mediaMissing.length}\n${missing.length?missing.slice(0,8).join('\n'):'Kern-Paket vollständig vorbereitet.'}\n\nNicht enthalten: vollständige Details/Karten, private Benutzerdateien, tatsächlicher Flugmodustest.`;
 el('save').disabled=false;
 }catch(e){latest=null;el('message').textContent='Prüfung nicht abgeschlossen: '+e.message}finally{el('run').disabled=false;busy=false}}
function download(){if(!latest)return;const b=new Blob([JSON.stringify(latest,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='PetriHeil_Offline_Pruefung_4.2.0.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),20000)}
function start(){el('run').addEventListener('click',()=>void run());el('save').addEventListener('click',download)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
/* v4.4.5: add universal back navigation without changing existing modules. */
;(()=>{'use strict';
 if(typeof window==='undefined'||window.__petri445NavRequested)return;
 window.__petri445NavRequested=true;
 const root=new URL('./',document.currentScript?.src||document.baseURI);
 const script=document.createElement('script');script.src=new URL('petri445-nav.js?v=4.4.5',root).href;
 script.addEventListener('error',()=>{window.__petri445NavRequested=false;});
 (document.head||document.documentElement).appendChild(script);
})();
