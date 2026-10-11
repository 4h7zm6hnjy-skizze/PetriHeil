/* Petri Heil Pro 2.4.0 – local-only diagnostics, encrypted vault, Pro catch gallery.
   No external hosts, no background upload, no changes to existing app data on load. */
(()=>{
'use strict';
const ROOT=new URL('./',document.currentScript?.src||document.baseURI);
const $=id=>document.getElementById(id);
const APP='3.3.0', MEDIA='petri-media-2.2.0', PHOTO_DB='petri230-extra-photos';
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const link=s=>new URL(s,ROOT).href;
const bytes=n=>n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(1)} MB`;
let active='status', caught=[], images=[], working=false;
const msg=(m,err=false)=>{const t=$('p230-notice');if(t){t.textContent=m;t.className=err?'p230-message error':'p230-message';}};
const sleep=()=>new Promise(r=>setTimeout(r,0));
const b64=u=>{let s='';for(let i=0;i<u.length;i+=16384)s+=String.fromCharCode(...u.subarray(i,i+16384));return btoa(s)};
const ub64=s=>{const x=atob(s),r=new Uint8Array(x.length);for(let i=0;i<x.length;i++)r[i]=x.charCodeAt(i);return r};
async function packValue(v){
 if(v instanceof Blob)return {__petriType:'blob',type:v.type,name:v.name||'',value:await new Promise((ok,fail)=>{const r=new FileReader();r.onload=()=>ok(String(r.result).split(',')[1]||'');r.onerror=()=>fail(r.error);r.readAsDataURL(v)})};
 if(v instanceof ArrayBuffer)return {__petriType:'arraybuffer',value:b64(new Uint8Array(v))};
 if(ArrayBuffer.isView(v))return {__petriType:'arraybuffer',value:b64(new Uint8Array(v.buffer,v.byteOffset,v.byteLength))};
 if(v instanceof Date)return {__petriType:'date',value:v.toISOString()};
 if(v===null||typeof v!=='object')return v;
 if(Array.isArray(v))return Promise.all(v.map(packValue));
 const o={};for(const [k,x] of Object.entries(v))o[k]=await packValue(x);return o;
}
function unpackValue(v){
 if(v===null||typeof v!=='object')return v;
 if(Array.isArray(v))return v.map(unpackValue);
 if(v.__petriType==='date')return new Date(v.value);
 if(v.__petriType==='arraybuffer')return ub64(v.value).buffer;
 if(v.__petriType==='blob')return new Blob([ub64(v.value)],{type:v.type||'application/octet-stream'});
 const o={};for(const [k,x] of Object.entries(v))o[k]=unpackValue(x);return o;
}
function dbOpen(name,version){return new Promise((resolve,reject)=>{
 const req=version?indexedDB.open(name,version):indexedDB.open(name);
 req.onerror=()=>reject(req.error||Error('Datenbank nicht verfügbar'));
 req.onupgradeneeded=()=>{};
 req.onsuccess=()=>resolve(req.result);
 req.onblocked=()=>reject(Error('Datenbank wird noch verwendet: '+name));
});}
function galleryDB(){return new Promise((resolve,reject)=>{
 const q=indexedDB.open(PHOTO_DB,1);
 q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('photos')){const s=q.result.createObjectStore('photos',{keyPath:'id'});s.createIndex('catchId','catchId',{unique:false});}};
 q.onerror=()=>reject(q.error);
 q.onsuccess=()=>resolve(q.result);
});}
function txWait(tx){return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||Error('Datenbank-Schreibfehler'));tx.onabort=()=>reject(tx.error||Error('Datenbank abgebrochen'))})}
async function databaseNames(){
 let known=[];if(typeof indexedDB.databases==='function'){
  try{known=(await indexedDB.databases()).map(x=>x.name).filter(Boolean).filter(x=>x!=='petri230-diagnostic')}catch{}
 }else known=['petri31-media-v1',PHOTO_DB,'petri240-offline-map-v1','petri250-album-v1'];
 return [...new Set(known)];
}
async function collectDB(name){
 const db=await dbOpen(name);const stores=[];
 try{for(const storeName of [...db.objectStoreNames]){
  const tx=db.transaction(storeName,'readonly'),s=tx.objectStore(storeName),items=[];
  const info={name:storeName,keyPath:s.keyPath,autoIncrement:s.autoIncrement,indexes:[],records:items};
  for(const ix of [...s.indexNames]){const idx=s.index(ix);info.indexes.push({name:ix,keyPath:idx.keyPath,unique:idx.unique,multiEntry:idx.multiEntry});}
  await new Promise((resolve,reject)=>{const q=s.openCursor();q.onsuccess=()=>{const c=q.result;if(!c){resolve();return}items.push({key:c.key,value:c.value});c.continue()};q.onerror=()=>reject(q.error)});
  await txWait(tx);
  for(const item of items){item.key=await packValue(item.key);item.value=await packValue(item.value)}
  stores.push(info);
 }}finally{db.close()}
 return {name,version:db.version,stores};
}
async function createSnapshot(){
 const ls={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k!==null)ls[k]=localStorage.getItem(k)}
 const databases=[];if('indexedDB' in window)for(const name of await databaseNames()){
  // Browser-internal/test databases are excluded; only this application's databases are saved.
  if(!/^(petri|Petri)/.test(name))continue;
  databases.push(await collectDB(name));
 }
 return {format:'petri-private-backup',schema:1,date:new Date().toISOString(),appVersion:APP,localStorage:ls,databases};
}
async function encryptionKey(pass,salt){const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
function download(name,blob){const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),45000)}
async function exportVault(){
 if(working)return;const pass=$('p230-password')?.value||'',again=$('p230-password2')?.value||'';
 if(pass.length<12||pass!==again){msg('Das Passwort muss mindestens 12 Zeichen lang sein und zweimal identisch eingegeben werden.',true);return}
 if(!crypto?.subtle){msg('Verschlüsselung ist nur in einer sicheren HTTPS-App verfügbar.',true);return}
 working=true;msg('Lokale Daten werden gesammelt. Bei vielen Fotos bitte warten …');
 try{const snapshot=await createSnapshot();msg('Backup wird auf diesem Gerät verschlüsselt …');await sleep();const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await encryptionKey(pass,salt);const clear=new TextEncoder().encode(JSON.stringify(snapshot));const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,clear);
  const envelope={format:'petri-private-vault',schema:1,kdf:'PBKDF2-SHA256',iterations:210000,salt:b64(salt),cipher:'AES-256-GCM',iv:b64(iv),data:b64(new Uint8Array(cipher))};
  const stamp=new Date().toISOString().slice(0,10);
  download(`PetriHeil_Privatbackup_${stamp}.petri`,new Blob([JSON.stringify(envelope)],{type:'application/octet-stream'}));
  msg(`Verschlüsseltes Backup bereit: ${Object.keys(snapshot.localStorage).length} lokale Speichereinträge und ${snapshot.databases.length} App-Datenbanken. Passwort sicher aufbewahren.`);
 }catch(e){msg('Backup fehlgeschlagen: '+(e.message||e),true)}finally{working=false;if($('p230-password'))$('p230-password').value='';if($('p230-password2'))$('p230-password2').value=''}
}
async function restoreDB(data){
 // Import into a newer installed schema without attempting to downgrade IndexedDB.
 let db=await dbOpen(data.name);
 const missing=data.stores.some(s=>!db.objectStoreNames.contains(s.name));
 if(missing){
  const nextVersion=Math.max(db.version,Number(data.version)||1)+1;
  db.close();
  db=await new Promise((resolve,reject)=>{
   const req=indexedDB.open(data.name,nextVersion);
   req.onupgradeneeded=()=>{const d=req.result;for(const store of data.stores){
    if(d.objectStoreNames.contains(store.name))continue;
    const opt={autoIncrement:!!store.autoIncrement};
    if(store.keyPath!==null&&store.keyPath!==undefined)opt.keyPath=store.keyPath;
    const item=d.createObjectStore(store.name,opt);
    for(const ix of store.indexes||[])item.createIndex(ix.name,ix.keyPath,{unique:!!ix.unique,multiEntry:!!ix.multiEntry});
   }};
   req.onerror=()=>reject(req.error||Error('Datenbank-Upgrade fehlgeschlagen'));
   req.onsuccess=()=>resolve(req.result);
   req.onblocked=()=>reject(Error('Bitte andere Petri-Heil-Tabs schließen und Import erneut starten.'));
  });
 }
 try{for(const store of data.stores){
  if(!db.objectStoreNames.contains(store.name))throw Error('Datenbank-Speicher fehlt: '+store.name);
  const tx=db.transaction(store.name,'readwrite'),s=tx.objectStore(store.name);
  for(const row of store.records){const key=unpackValue(row.key),value=unpackValue(row.value);if(s.keyPath!==null)s.put(value);else s.put(value,key)}
  await txWait(tx);
 }}finally{db.close()}
}

async function importVault(){
 if(working)return;const f=$('p230-importfile')?.files?.[0],pass=$('p230-import-password')?.value||'';
 if(!f||!pass){msg('Bitte Backup-Datei und zugehöriges Passwort auswählen.',true);return}
 if(f.size>250*1048576){msg('Datei ist größer als 250 MB. Bitte auf einem Gerät mit ausreichend freiem Speicher importieren.',true);return}
 working=true;msg('Lokales Backup wird entschlüsselt und geprüft …');
 try{const env=JSON.parse(await f.text());if(env.format!=='petri-private-vault'||env.schema!==1||env.kdf!=='PBKDF2-SHA256'||env.cipher!=='AES-256-GCM'||env.iterations!==210000)throw Error('Backup-Format nicht unterstützt');
  const key=await encryptionKey(pass,ub64(env.salt));const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:ub64(env.iv)},key,ub64(env.data));const snap=JSON.parse(new TextDecoder().decode(clear));
  if(snap.format!=='petri-private-backup'||snap.schema!==1||typeof snap.localStorage!=='object'||!Array.isArray(snap.databases))throw Error('Ungültiger Backup-Inhalt');
  const ks=Object.keys(snap.localStorage);if(ks.length>10000||snap.databases.length>50||snap.databases.some(d=>!/^petri/i.test(d.name)))throw Error('Ungewöhnliche Datensicherung abgewiesen');
  const count=snap.databases.reduce((a,d)=>a+d.stores.reduce((n,s)=>n+s.records.length,0),0);
  if(!confirm(`Backup vom ${new Date(snap.date).toLocaleString('de-DE')} mit ${ks.length} lokalen Werten und ${count} Datenbankeinträgen importieren? Gleichnamige Werte werden überschrieben; andere Daten bleiben erhalten. Vorher eigene Sicherung erstellen.`)){msg('Import abgebrochen, es wurden keine Daten verändert.');return}
  const before=new Map(ks.map(k=>[k,localStorage.getItem(k)]));
  try{for(const [k,v] of Object.entries(snap.localStorage))localStorage.setItem(k,String(v));
   for(const d of snap.databases)await restoreDB(d);
  }catch(e){for(const [k,v] of before){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch{}}throw Error('Import nicht vollständig: '+e.message+'; lokale Werte wurden zurückgesetzt. Datenbankeinträge könnten teilweise importiert worden sein.')}
  msg(`Import abgeschlossen: ${ks.length} Werte und ${count} Datenbankeinträge. Bitte jetzt die App neu starten.`);
 }catch(e){msg(e.name==='OperationError'?'Entschlüsselung fehlgeschlagen: Passwort oder Datei stimmt nicht.':'Import fehlgeschlagen: '+(e.message||e),true)}finally{working=false;if($('p230-import-password'))$('p230-import-password').value=''}
}
async function photoRows(id){const db=await galleryDB();try{const tx=db.transaction('photos','readonly'),s=tx.objectStore('photos');const q=s.index('catchId').getAll(id);const rows=await new Promise((ok,fail)=>{q.onsuccess=()=>ok(q.result||[]);q.onerror=()=>fail(q.error)});await txWait(tx);return rows.sort((a,b)=>b.added.localeCompare(a.added))}finally{db.close()}}
function catches(){try{const p=JSON.parse(localStorage.getItem('petri31-pro-data-v1')||'{}');return Array.isArray(p.catches)?p.catches:[]}catch{return []}}
function catchesSummary(data){const o={};for(const c of data){const name=String(c.species||'Unbekannt').trim();o[name]=(o[name]||0)+1}return Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,7)}
async function renderGallery(){const host=$('p230-gallery');if(!host)return;caught=catches();const pick=$('p230-catch');const sel=pick?.value||'';
 if(pick){pick.replaceChildren();pick.add(new Option('Fang auswählen', ''));for(const c of caught){const id=String(c.id||'');if(!id)continue;pick.add(new Option(`${c.species||'Fang'} · ${String(c.time||c.date||'').slice(0,16)} · ${c.length||'?'} cm`,id))}pick.value=[...pick.options].some(o=>o.value===sel)?sel:''}
 const rows=catchesSummary(caught);$('p230-stats').innerHTML=`<strong>${caught.length} Pro-Fänge erfasst</strong><p>Häufigste Arten:</p><ol>${rows.map(([k,n])=>`<li>${escapeHTML(k)}: ${n}</li>`).join('')||'<li>Noch keine Pro-Fänge vorhanden.</li>'}</ol>`;
 await drawPhotos();
}
async function drawPhotos(){const host=$('p230-gallery'),id=$('p230-catch')?.value||'';if(!host)return;for(const u of images)URL.revokeObjectURL(u);images=[];if(!id){host.innerHTML='<p>Wähle einen Pro-Fang, um seine zusätzlichen Fotos zu sehen.</p>';return}
 try{const rows=await photoRows(id);host.innerHTML=rows.length?'':'<p>Für diesen Fang sind noch keine Zusatzfotos gespeichert.</p>';
  for(const x of rows){const card=document.createElement('article');card.className='p230-photo';const img=document.createElement('img');const u=URL.createObjectURL(x.photo);images.push(u);img.src=u;img.alt='Zusätzliches Fangfoto';img.loading='lazy';const note=document.createElement('span');note.textContent=x.note||'Ohne Notiz';const button=document.createElement('button');button.textContent='Foto löschen';button.dataset.photoRemove=x.id;card.append(img,note,button);host.append(card)}
 }catch(e){host.textContent='Fotos konnten nicht geladen werden: '+e.message}}
async function savePhoto(){const id=$('p230-catch')?.value,f=$('p230-photofile')?.files?.[0];if(!id||!f){msg('Bitte einen Fang und ein Foto auswählen.',true);return}if(!f.type.startsWith('image/')||f.size>12*1048576){msg('Bitte ein Bild bis 12 MB auswählen.',true);return}
 try{const rows=await photoRows(id);if(rows.length>=8){msg('Maximal acht Zusatzfotos je Fang.',true);return}const db=await galleryDB();try{const tx=db.transaction('photos','readwrite');tx.objectStore('photos').put({id:crypto.randomUUID?.()||String(Date.now())+'-'+Math.random(),catchId:id,note:($('p230-photonote')?.value||'').slice(0,180),added:new Date().toISOString(),photo:f});await txWait(tx)}finally{db.close()}$('p230-photofile').value='';$('p230-photonote').value='';msg('Zusatzfoto ausschließlich lokal gespeichert.');await drawPhotos()}catch(e){msg('Foto konnte nicht gespeichert werden: '+e.message,true)}
}
async function deletePhoto(id){if(!confirm('Dieses lokale Zusatzfoto wirklich löschen?'))return;const db=await galleryDB();try{const tx=db.transaction('photos','readwrite');tx.objectStore('photos').delete(id);await txWait(tx)}finally{db.close()}await drawPhotos();msg('Zusatzfoto gelöscht.')}
async function diagnostics(){
 const host=$('p230-diagnostics');if(!host)return;host.textContent='Prüfung läuft …';const out=[];const push=(name,ok,details)=>out.push({name,ok,details});
 push('App-Version',document.querySelector('meta[name="petri-app-version"]')?.content===APP,'HTML-Version '+(document.querySelector('meta[name="petri-app-version"]')?.content||'Seite ohne Versionsangabe'));
 push('HTTPS',location.protocol==='https:'||location.hostname==='localhost',location.protocol);
 push('Privatmodus',!!window.PetriPrivatmodus?.enabled,window.PetriPrivatmodus?.enabled?'Aktiv':'Sperre nicht bestätigt');
 try{const k='petri230-check-'+Date.now();localStorage.setItem(k,'test');const ok=localStorage.getItem(k)==='test';localStorage.removeItem(k);push('Lokaler Speicher',ok,ok?'Schreib-/Lesetest erfolgreich':'Kein Lesezugriff')}catch(e){push('Lokaler Speicher',false,e.message)}
 try{const db=await galleryDB();db.close();push('Foto-Datenbank',true,'IndexedDB verfügbar')}catch(e){push('Foto-Datenbank',false,e.message)}
 if('serviceWorker' in navigator){try{const r=await navigator.serviceWorker.getRegistration(ROOT.href);const worker=r?.active;let v=null;if(worker){v=await new Promise(resolve=>{const c=new MessageChannel();const timer=setTimeout(()=>resolve(null),1800);c.port1.onmessage=e=>{clearTimeout(timer);resolve(e.data.version)};worker.postMessage({type:'PETRI_GET_WORKER_VERSION'},[c.port2])})}push('Offline-Worker',v===APP,`Aktiv: ${v||'nicht bestätigt'}`)}catch(e){push('Offline-Worker',false,e.message)}}else push('Offline-Worker',false,'Nicht unterstützt');
 try{const cache=await caches.open('petri-core-'+APP);const rs=await fetch(link('petri-core-v3.3.0.json'),{cache:'force-cache'});if(!rs.ok)throw Error('Dateiliste fehlt');const data=await rs.json();let ok=0;const missing=[];for(const p of data.files){const h=await cache.match(link(p));if(h?.ok)ok++;else missing.push(p)}push('Offline-Programmdateien',ok===data.files.length,`${ok}/${data.files.length} Dateien`+(missing.length?' · fehlt: '+missing.slice(0,3).join(', '):''))}catch(e){push('Offline-Programmdateien',false,e.message)}
 try{const r=await fetch(link('petri-media-v2.2.0.json'),{cache:'force-cache'});if(!r.ok)throw Error('Bildliste nicht gefunden');const manifest=await r.json();const cache=await caches.open(MEDIA);let n=0;for(const p of manifest.files)if((await cache.match(link(p)))?.ok||(await caches.match(link(p),{ignoreSearch:true}))?.ok)n++;push('Offline-Bildarchiv',n===manifest.files.length,`${n}/${manifest.files.length} Bilder`)}catch(e){push('Offline-Bildarchiv',false,e.message)}
 const sw=window.screen?.width||0;push('Mobil-Darstellung',document.documentElement.scrollWidth<=document.documentElement.clientWidth+3,`${document.documentElement.clientWidth}px sichtbare Breite; ${document.documentElement.scrollWidth}px Dokumentbreite`);
 let usage='nicht verfügbar';try{const v=await navigator.storage?.estimate?.();if(v)usage=`${bytes(v.usage||0)} belegt von geschätzt ${bytes(v.quota||0)}`}catch{};
 push('Gerätespeicher',true,usage);
 const allOk=out.filter(x=>x.ok).length;host.innerHTML=`<h3>${allOk}/${out.length} Prüfungen erfolgreich</h3>${out.map(x=>`<div class="p230-test ${x.ok?'ok':'warn'}"><b>${x.ok?'✓':'!'} ${escapeHTML(x.name)}</b><small>${escapeHTML(x.details)}</small></div>`).join('')}<p class="p230-small">Ein technischer Check ersetzt keine Funktionsprüfung von Fangbuch, Kamera und GPS auf einem echten Gerät.</p>`;
 $('p230-diagnostic-save').disabled=false;
 $('p230-diagnostic-save').onclick=()=>download('PetriHeil_Systembericht_'+new Date().toISOString().slice(0,10)+'.json',new Blob([JSON.stringify({created:new Date().toISOString(),version:APP,checks:out},null,2)],{type:'application/json'}));
}
function tabs(){return `<nav class="p230-tabs" aria-label="Werkzeuge"><button data-p230-tab="status">Systemcheck</button><button data-p230-tab="backup">Privat-Backup</button><button data-p230-tab="gallery">Fangfotos & Statistik</button><button data-p230-tab="learn">Lernfortschritt</button></nav>`}
function view(){const target=$('p230-app');if(!target)return;
 target.innerHTML=`${tabs()}<div id="p230-notice" role="status" class="p230-message"></div><section id="p230-view"></section>`;
 for(const b of target.querySelectorAll('[data-p230-tab]')){b.classList.toggle('active',b.dataset.p230Tab===active);b.setAttribute('aria-current',b.dataset.p230Tab===active?'page':'false')}
 const h=$('p230-view');if(active==='status'){
 h.innerHTML=`<h2>App-Diagnose und Offline-Status</h2><p>Kontrolliert Versionsstand, gespeicherte Programmdateien, 228 Bilder, lokalen Datenspeicher und Mobil-Darstellung. Keine persönlichen Angaben werden übertragen.</p><p><button id="p230-diagnostic-run">Gesamtprüfung starten</button> <button id="p230-diagnostic-save" disabled>Bericht lokal speichern</button></p><div id="p230-diagnostics">Noch nicht geprüft.</div><p><a href="./offline-check.html">Offline-Bilder vorbereiten</a> · <a href="./update-rettung.html">Update-Reparatur</a></p>`;
 }else if(active==='backup'){
 h.innerHTML=`<h2>Verschlüsseltes Privat-Backup</h2><p>Exportiert lokale App-Daten einschließlich verfügbarer Foto-Datenbanken in eine mit AES-256-GCM verschlüsselte Datei. Es erfolgt kein Server-Upload.</p><div class="p230-form"><label>Neues Backup-Passwort (mindestens 12 Zeichen)<input id="p230-password" type="password" autocomplete="new-password"></label><label>Passwort wiederholen<input id="p230-password2" type="password" autocomplete="new-password"></label><button id="p230-backup">Verschlüsseltes Backup erstellen</button></div><p class="p230-small">Passwort gut aufbewahren: Ohne Passwort kann niemand das Backup entschlüsseln. Der Download muss anschließend außerhalb des Geräts gesichert werden.</p><h3>Backup bewusst wiederherstellen</h3><div class="p230-form"><label>Backup-Datei (.petri)<input id="p230-importfile" type="file" accept=".petri,application/octet-stream,application/json"></label><label>Backup-Passwort<input id="p230-import-password" type="password" autocomplete="off"></label><button id="p230-import">Backup lokal importieren</button></div><p class="p230-small">Der Import fragt ausdrücklich nach Bestätigung. Gleichnamige Daten werden überschrieben; vorhandene andere Daten bleiben erhalten. Vorher eine Sicherung anlegen. Beide Geräte besitzen getrennte lokale Speicher.</p>`;
 }else if(active==='gallery'){
 h.innerHTML=`<h2>Zusatzfotos und Fangstatistik</h2><p>Bis zu acht zusätzliche Fotos je Fang aus dem Pro-Fangbuch. Fotos werden nur auf diesem Gerät gespeichert und im privaten Backup erfasst.</p><div id="p230-stats"></div><div class="p230-form"><label>Fang auswählen<select id="p230-catch"></select></label><label>Weiteres Fangfoto<input id="p230-photofile" type="file" accept="image/*"></label><label>Fotonotiz (optional)<input id="p230-photonote" maxlength="180" placeholder="z. B. Köder, Angelstelle, Fangmoment"></label><button id="p230-addphoto">Zusatzfoto speichern</button></div><div class="p230-gallery" id="p230-gallery"></div>`;void renderGallery();
 }else{
 let praxis={},steps={};try{praxis=JSON.parse(localStorage.getItem('petri-nrw-praktisch-223')||'{}');steps=JSON.parse(localStorage.getItem('petri230-praxis-montage')||'{}')}catch{};
 const done=Object.values(steps).filter(v=>Array.isArray(v)&&v.length>=6&&v.every(Boolean)).length;
 h.innerHTML=`<h2>Prüfungsvorbereitung</h2><p>Übe den tatsächlichen Rutenaufbau mit der bereits vorhandenen NRW-Prüfungssimulation und dem Schritt-für-Schritt-Trainer. Lernfortschritte bleiben auf dem Gerät.</p><p><strong>${done}/10 Rutenaufgaben vollständig geübt</strong> · ${Number(praxis.exams||0)} Artenprüfungen · letzter Arten-Test: ${praxis.lastScore??'–'}/6</p><button id="p230-openpraxis">Praktische Prüfung starten</button> <a href="./praxis.html">Eigene Praxis-Seite</a><p>Der Simulator bewertet die Artenkenntnis; die Gerätemontage wird am echten Gerät geübt.</p>`;
 }
}
document.addEventListener('click',e=>{const el=e.target instanceof Element?e.target.closest('button'):null;if(!el)return;
 if(el.dataset.p230Tab){active=el.dataset.p230Tab;view();return}
 switch(el.id){case 'p230-diagnostic-run':void diagnostics();break;case 'p230-backup':void exportVault();break;case 'p230-import':void importVault();break;case 'p230-addphoto':void savePhoto();break;case 'p230-openpraxis':if(window.PetriPraxisNRW)window.PetriPraxisNRW.open();else location.href='./praxis.html';break;default:if(el.dataset.photoRemove)void deletePhoto(el.dataset.photoRemove)}
});
document.addEventListener('change',e=>{if(e.target?.id==='p230-catch')void drawPhotos()});
function start(){if($('p230-app'))view();const main=$('main');if(main){let next=false;new MutationObserver(()=>{if(next)return;next=true;requestAnimationFrame(()=>{next=false;const title=$('page-title')?.textContent||'';if(!/mehr|einstellung|backup|übersicht/i.test(title))return;if(main.querySelector('#p230-quicklink'))return;const bar=document.createElement('div');bar.id='p230-quicklink';bar.className='p230-quicklink';bar.innerHTML='<a href="./werkzeuge.html">Systemcheck · Privat-Backup · Fangfotos öffnen →</a>';main.append(bar);});}).observe(main,{childList:true,subtree:false});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
