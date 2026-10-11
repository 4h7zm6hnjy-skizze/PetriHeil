/* Petri Heil Pro 2.4.0 – nachweisbare Offline-Vorbereitung (2.5.0). */
(()=>{
'use strict';
const ROOT=new URL('./',document.currentScript?.src||document.baseURI);
const url=name=>new URL(name,ROOT).href;
const CACHE='petri-media-2.2.0';
const EXPECTED='3.2.0';
const qs=id=>document.getElementById(id);
let busy=false,manifest=null,statusMessage='';
const button=(id,label)=>{const b=document.createElement('button');b.type='button';b.id=id;b.className='button '+(id==='petri-offline-prepare'?'button-primary':'button-outline');b.textContent=label;b.style.minHeight='44px';return b};
function announce(text,progress){
 statusMessage=text;
 const el=qs('petri-offline-status');if(el)el.textContent=text;
 const bar=qs('petri-offline-progress');if(bar&&Number.isFinite(progress))bar.value=Math.max(0,Math.min(100,progress));
}
function offlineCard(){
 let card=qs('petri-offline-panel');if(card)return card;
 card=document.createElement('section');card.id='petri-offline-panel';
 card.style.cssText='border:1px solid #b6d8e9;border-radius:13px;padding:16px;margin:14px 0;background:#f1f9fe;color:#173e58;max-width:100%;min-width:0';
 const title=document.createElement('h3');title.textContent='Offline-Paket · Fischbilder und Ausrüstung';title.style.margin='0 0 8px';
 const desc=document.createElement('p');desc.textContent='Prüft und speichert alle 228 lokalen Bilder (ca. 27 MB), ohne Fangdaten oder Einstellungen zu verändern. Bei Unterbrechungen kann die Vorbereitung fortgesetzt werden.';desc.style.lineHeight='1.5';
 const line=document.createElement('div');line.style.cssText='display:flex;flex-wrap:wrap;gap:9px;margin:10px 0';
 line.append(button('petri-offline-check','Offline prüfen'),button('petri-offline-prepare','Alle Bilder offline vorbereiten'));
 const prog=document.createElement('progress');prog.id='petri-offline-progress';prog.max=100;prog.value=0;prog.style.cssText='width:100%;height:14px;display:block';
 const msg=document.createElement('p');msg.id='petri-offline-status';msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');msg.style.cssText='overflow-wrap:anywhere;font-size:13px;line-height:1.5';msg.textContent=statusMessage||'Offline-Status noch nicht geprüft.';
 const small=document.createElement('p');small.textContent='Hinweis: Live-Wetter, aktuelle Online-Karten und externe Webseiten benötigen weiterhin Internet. Die lokal gespeicherten Fänge und Notizen bleiben offline verfügbar.';small.style.cssText='font-size:12px;color:#45667a;line-height:1.5';
 card.append(title,desc,line,prog,msg,small);
 return card;
}
function mount(){
 if(qs('petri-offline-page')){const host=qs('petri-offline-page');if(!host.contains(qs('petri-offline-panel')))host.append(offlineCard());return}
 const main=qs('main');if(!main)return;
 // The image settings section lives on the settings page and is re-rendered by app.js.
 const headings=[...main.querySelectorAll('h1,h2,h3,h4')];
 const anchor=headings.find(h=>/KI-Bilder,? Fotos\s*&\s*Offline/i.test(h.textContent||''));
 const target=anchor?.closest('section,.card,.panel,article')||main.querySelector('#app-update-card');
 if(target&&target!==qs('petri-offline-panel')){
   const card=offlineCard();
   if(!main.contains(card))target.insertAdjacentElement('afterend',card);
 }
}
async function getManifest(){
 if(manifest)return manifest;
 const r=await fetch(url('petri-media-v2.2.0.json'),{cache:'no-store'});
 if(!r.ok)throw Error('Medienliste nicht erreichbar: HTTP '+r.status);
 const d=await r.json();
 if(d.version!=='2.2.0'||!Array.isArray(d.files)||d.files.length!==228||new Set(d.files).size!==228)throw Error('Medienliste ist unvollständig oder fehlerhaft.');
 if(d.files.some(f=>!/^[a-z0-9.-]+\.(webp|png)$/i.test(f)))throw Error('Ungültiger Bilddateiname in der Medienliste.');
 manifest=d.files;return manifest;
}
async function coreWorkerVersion(){
 if(!('serviceWorker' in navigator)||typeof MessageChannel==='undefined')return null;
 try{
  const r=await navigator.serviceWorker.getRegistration(ROOT.href);
  const w=r?.active||navigator.serviceWorker.controller;
  if(!w)return null;
  return await new Promise(resolve=>{
   const channel=new MessageChannel();let settled=false;
   const finish=v=>{if(settled)return;settled=true;clearTimeout(timer);try{channel.port1.close()}catch{}resolve(v)};
   const timer=setTimeout(()=>finish(null),2400);
   channel.port1.onmessage=e=>finish(e.data?.version||null);
   try{w.postMessage({type:'PETRI_GET_WORKER_VERSION'},[channel.port2])}catch{finish(null)}
  });
 }catch{return null}
}
async function inspect(files,cache){
 let ok=0,missing=[];
 for(const f of files){
  const uri=url(f);
  try{
   const own=await cache.match(uri);
   const old=own||await caches.match(uri,{ignoreSearch:true});
   if(old&&old.ok){ok++;continue}
  }catch{}
  missing.push(f);
 }
 return {ok,missing};
}
async function check(){
 if(busy)return;busy=true;toggle(true);announce('Prüfe gespeicherte Bilder …',0);
 try{
  if(!('caches' in window))throw Error('Offline-Speicher wird von diesem Browser nicht unterstützt.');
  const files=await getManifest(),cache=await caches.open(CACHE);
  const {ok,missing}=await inspect(files,cache);
  const pct=Math.round(ok/files.length*100);
  const installed=await coreWorkerVersion();
  const msg=missing.length===0 ? (installed===EXPECTED ? `Vollständig: App ${EXPECTED} und ${ok}/${files.length} lokale Bilder offline vorhanden.` : `Bilder ${ok}/${files.length} vorhanden, aber Offline-App-Version ${installed||'nicht bestätigt'}. Bitte zunächst 3.2.0 installieren.`) : `Unvollständig: ${ok}/${files.length} Bilder vorhanden. ${missing.length} fehlen noch. „Alle Bilder offline vorbereiten“ starten.`;
  announce(msg,pct);
 }catch(e){announce('Prüfung fehlgeschlagen: '+(e.message||e),0)}finally{busy=false;toggle(false)}
}
async function retryFetch(name){
 const src=url(name);let err=null;
 for(let tryNo=0;tryNo<2;tryNo++){
  const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),25000);
  try{
   const resp=await fetch(src,{cache:'reload',signal:ctrl.signal});
   if(!resp.ok||resp.type==='opaque')throw Error('HTTP '+resp.status);
   const mime=resp.headers.get('content-type')||'';
   if(!mime.startsWith('image/'))throw Error('Keine Bilddatei empfangen ('+mime+')');
   return resp;
  }catch(e){err=e}finally{clearTimeout(timer)}
 }
 throw Error(name+': '+(err?.message||err));
}
function toggle(v){for(const id of ['petri-offline-prepare','petri-offline-check']){const b=qs(id);if(b)b.disabled=v}}
async function prepare(){
 if(busy)return;busy=true;toggle(true);
 try{
  if(!('caches' in window))throw Error('Cache Storage nicht verfügbar.');
  if(!navigator.onLine)throw Error('Zur ersten Vorbereitung Internet aktivieren.');
  const files=await getManifest();const cache=await caches.open(CACHE);
  let good=0,lastErrors=[];announce('Starte Prüfung von 228 Bildern …',0);
  let next=0;
  // Limited parallelism limits iPhone RAM spikes and network pressure.
  async function worker(){
   while(next<files.length){const name=files[next++],uri=url(name);
    try{
     let r=await cache.match(uri);
     if(!r||!r.ok){
      const fromOld=await caches.match(uri,{ignoreSearch:true});
      if(fromOld&&fromOld.ok&&String(fromOld.headers.get('content-type')||'').startsWith('image/'))r=fromOld;
      else r=await retryFetch(name);
      await cache.put(uri,r.clone());
     }
     good++;
    }catch(e){lastErrors.push(name+': '+String(e.message||e))}
    const progress=Math.round((good+lastErrors.length)/files.length*100);
    announce('Bearbeitet '+(good+lastErrors.length)+'/'+files.length+' · gespeichert '+good+' · Fehler '+lastErrors.length,progress);
   }
  }
  await Promise.all([worker(),worker(),worker()]);
  const result=await inspect(files,cache);
  if(result.missing.length){
    const snippet=lastErrors.slice(0,3).join(' | ');
    announce('Noch nicht vollständig: '+result.ok+'/228 Bilder vorhanden; '+result.missing.length+' fehlen. '+snippet+'. Du kannst den Vorgang erneut starten.',Math.round(result.ok/files.length*100));
  }else{
    const installed=await coreWorkerVersion();
    announce(installed===EXPECTED?'Vollständig: App '+EXPECTED+' und 228/228 lokale Bilder offline geprüft. Live-Daten benötigen weiterhin Internet.':'228/228 Bilder gespeichert. Für vollständige Offline-Bereitschaft zunächst App-Version '+EXPECTED+' installieren (aktiver Worker: '+(installed||'nicht bestätigt')+').',100);
  }
 }catch(e){announce('Offline-Vorbereitung fehlgeschlagen: '+(e.message||e),0)}finally{busy=false;toggle(false)}
}
document.addEventListener('click',e=>{
 const el=e.target instanceof Element?e.target.closest('button'):null;
 if(el?.id==='petri-offline-prepare'){e.preventDefault();void prepare()}
 if(el?.id==='petri-offline-check'){e.preventDefault();void check()}
},true);
function start(){mount();const main=qs('main');if(main){let busyMount=false;new MutationObserver(()=>{if(busyMount)return;busyMount=true;requestAnimationFrame(()=>{busyMount=false;mount()})}).observe(main,{childList:true,subtree:false});}if(qs('petri-offline-page'))void check()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
