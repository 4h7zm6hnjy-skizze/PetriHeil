/* Petri Heil Pro 2.1.2 - einheitlicher Versionsdialog und Worker-Migration. */
(()=>{
'use strict';
const RELEASE='2.1.2';
const ROOT=new URL('./',document.baseURI);
const SW=new URL('./sw-v2.1.2.js',ROOT);
const $=id=>document.getElementById(id);
let busy=false,queued=false,last='';
const parse=x=>/^\d+\.\d+\.\d+$/.test(String(x||''))?x.split('.').map(Number):null;
const cmp=(x,y)=>{const a=parse(x),b=parse(y);if(!a||!b)return null;for(let i=0;i<3;i++){if(a[i]!=b[i])return Math.sign(a[i]-b[i])}return 0};
const nap=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const deadline=(promise,ms)=>Promise.race([promise,nap(ms).then(()=>{throw Error('Zeitüberschreitung bei der Installation.')})]);
function tell(str){last=String(str);const p=$('petri21-status');if(p)p.textContent=last}
function draw(){
 const card=$('app-update-card');if(!card)return;
 const title=Array.from(card.querySelectorAll('h2,h3,h4,strong')).find(e=>/^Version\s+\d+\.\d+\.\d+\s*$/.test((e.textContent||'').trim()));
 if(title&&title.textContent!=='Version '+RELEASE)title.textContent='Version '+RELEASE;
 const check=Array.from(card.querySelectorAll('button')).find(e=>/^(?:↻|⟳)?\s*(?:update[s]? suchen|version prüfen)$/i.test((e.textContent||'').trim())&&!e.closest('#petri21-tools'));
 if(check){check.dataset.petri21Check='1';check.textContent='Version prüfen'}
 for(const old of card.querySelectorAll('#petri-28-install-tools,#petri-40-update-controls'))old.remove();
 let panel=$('petri21-tools');if(!panel){
   panel=document.createElement('div');panel.id='petri21-tools';panel.style.cssText='display:flex;flex-wrap:wrap;gap:9px;margin:12px 0';
   const install=document.createElement('button');install.id='petri21-install';install.type='button';install.className='button button-primary';install.textContent='Update installieren';
   const reload=document.createElement('button');reload.id='petri21-refresh';reload.type='button';reload.className='button button-outline';reload.textContent='Neu laden';
   const status=document.createElement('p');status.id='petri21-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.style.cssText='width:100%;margin:0;color:#245777;font-size:13px;line-height:1.5';status.textContent=last||'Geladene App-Version '+RELEASE+'. Offline-Cache kann geprüft werden.';
   panel.append(install,reload,status);if(check)check.insertAdjacentElement('afterend',panel);else card.append(panel);
 }
 for(const tag of card.querySelectorAll('b,strong,span,small')){
   if(tag.children.length||tag.closest('#petri21-tools')||tag.textContent?.trim()!=='Update-Status')continue;
   const p=tag.parentElement;if(p&&!p.contains(panel)&&p!==card)p.hidden=true;
 }
 const oldInfo=Array.from(card.querySelectorAll('p,small')).find(e=>!e.children.length&&/Installierte Version auf diesem Gerät/.test(e.textContent||''));
 if(oldInfo)oldInfo.textContent='Geladene App-Version: '+RELEASE+'. Offline-Version separat prüfen.';
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;draw()})}
function lock(value){busy=value;for(const id of ['petri21-install','petri21-refresh']){const btn=$(id);if(btn)btn.disabled=busy}}
async function latest(){
 const url=new URL('./version.json',ROOT);url.searchParams.set('check',Date.now());
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),11000);
 try{const response=await fetch(url.href,{cache:'no-store',signal:controller.signal});if(!response.ok)throw Error('HTTP '+response.status);
 const v=(await response.json()).version;if(!parse(v))throw Error('Keine gültige Serverversion.');return v}
 finally{clearTimeout(timeout)}
}
async function workerVersion(worker){
 if(!worker||typeof MessageChannel==='undefined')return null;
 return new Promise(resolve=>{const ch=new MessageChannel();let done=false;
   const finish=val=>{if(done)return;done=true;clearTimeout(timer);ch.port1.close();resolve(val)};
   const timer=setTimeout(()=>finish(null),2000);
   ch.port1.onmessage=evt=>finish(parse(evt.data?.version)?evt.data.version:null);
   try{worker.postMessage({type:'PETRI_GET_WORKER_VERSION'},[ch.port2])}catch{finish(null)}
 });
}
async function reg(){return 'serviceWorker' in navigator?await navigator.serviceWorker.getRegistration(ROOT.href):null}
async function status(){
 const published=await latest();const r=await reg();const worker=await workerVersion(r?.active||navigator.serviceWorker?.controller);
 if(cmp(published,RELEASE)>0)return 'Neue Version '+published+' verfügbar. Bitte installieren.';
 if(cmp(published,RELEASE)<0)return 'Veröffentlichte Version '+published+' ist älter als die geladenen Dateien '+RELEASE+'.';
 if(!r)return 'Version '+RELEASE+' ist online geladen. Offline-Worker noch nicht installiert.';
 if(!worker)return 'Version '+RELEASE+' geladen; Offline-Worker antwortet nicht. Bitte neu öffnen.';
 if(cmp(worker,RELEASE)<0)return 'Version '+RELEASE+' geladen, Offline-Version '+worker+' noch nicht aktualisiert.';
 return 'Version '+RELEASE+' ist aktuell. Offline-Worker '+worker+' aktiv.';
}
async function check(){if(busy)return;if(!navigator.onLine){tell('Offline: Versionsprüfung benötigt Internet.');return}
 lock(true);tell('Prüfe die veröffentlichte und installierte Version …');
 try{tell(await status())}catch(e){tell('Versionsprüfung fehlgeschlagen: '+(e.message||e))}finally{lock(false)}
}
async function registerNew(){
 if(!('serviceWorker' in navigator))throw Error('Service Worker nicht verfügbar.');
 if(location.protocol!=='https:'&&location.hostname!=='localhost')throw Error('Für die Installation ist HTTPS erforderlich.');
 const r=await deadline(navigator.serviceWorker.register(SW.href,{scope:ROOT.href,updateViaCache:'none'}),18000);
 await deadline(r.update(),18000);
 return r;
}
async function awaitWorker(r,target){
 const begun=Date.now();while(Date.now()-begun<24000){
   if(r.waiting)r.waiting.postMessage({type:'SKIP_WAITING'});
   const version=await workerVersion(r.active||navigator.serviceWorker.controller);
   if(version&&cmp(version,target)>=0)return version;
   await nap(650);
 }return null;
}
async function install(){if(busy)return;if(!navigator.onLine){tell('Für die Installation wird Internet benötigt.');return}
 if(!confirm('Petri Heil Pro aktualisieren? Bitte nicht gespeicherte Eingaben vorher sichern. Fangdaten und Fotos werden nicht gelöscht.'))return;
 lock(true);tell('Installiere die neue Offline-Version …');
 try{
   const online=await latest();if(cmp(online,RELEASE)<0)throw Error('Der Server ist noch nicht auf '+RELEASE+' aktualisiert.');
   const r=await registerNew();const v=await awaitWorker(r,RELEASE);
   if(!v)throw Error('Der neue Worker konnte nicht bestätigt werden. Bitte in Safari erneut öffnen.');
   tell('Version '+v+' aktiviert. Lade App neu …');
   const uri=new URL(location.href);uri.searchParams.set('petri_refresh',RELEASE);location.replace(uri.href);
 }catch(e){tell('Installation unvollständig: '+(e.message||e))}finally{lock(false)}
}
function refresh(){const uri=new URL(location.href);uri.searchParams.set('petri_refresh',RELEASE+'-'+Date.now());location.replace(uri.href)}
document.addEventListener('click',e=>{
 const el=e.target instanceof Element?e.target.closest('button'):null;if(!el)return;
 if(el.dataset.petri21Check==='1'&&el.closest('#app-update-card')){e.preventDefault();e.stopImmediatePropagation();void check()}
 else if(el.id==='petri21-install'){e.preventDefault();e.stopImmediatePropagation();void install()}
 else if(el.id==='petri21-refresh'){e.preventDefault();e.stopImmediatePropagation();refresh()}
},true);
function start(){draw();const main=$('main');if(main)new MutationObserver(schedule).observe(main,{childList:true,subtree:true});
 // Aktualisierung auch beim normalen Start anbieten, ohne die aktuell laufende
 // Ansicht oder nicht gespeicherte Felder durch einen Reload zu verlieren.
 if('serviceWorker' in navigator&&navigator.onLine&&location.protocol==='https:'){
   const loaded=()=>registerNew().catch(()=>{});
   if(document.readyState==='complete')loaded();else window.addEventListener('load',loaded,{once:true});
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
