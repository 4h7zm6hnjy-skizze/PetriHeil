/* PetriHeil 2.0.33 - read-only preview of original catches, optional non-destructive copy;
   full local backup of discoverable IndexedDB stores. No network requests. */
(()=>{'use strict';
const VERSION='2.0.33';
const PRO_DB='petri31-media-v1', EXAM_DB='petri-heil-local-exam-attachments-v1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ignoreKeys=/password|secret|credential|auth.?token|api.?key/i;
let sources=[],scanning=false,lastReport=null;
const pick=(obj,keys)=>{for(const key of keys){const k=Object.keys(obj).find(x=>x.toLowerCase()===key.toLowerCase());if(k&&obj[k]!=null&&String(obj[k]).trim()!=='')return obj[k];}return '';};
const text=v=>typeof v==='string'?v:typeof v==='number'?String(v):'';
const saneDate=v=>{if(v==null||v==='')return null;let d;
 if(typeof v==='number')d=new Date(v<1e11?v*1000:v);
 else if(v instanceof Date)d=v;
 else if(typeof v==='string'&&/^\d{2}\.\d{2}\.\d{4}/.test(v)){const [,day,mon,year,hh='00',mm='00']=v.match(/^(\d{2})\.(\d{2})\.(\d{4})(?:\D+(\d{2}):(\d{2}))?/);d=new Date(`${year}-${mon}-${day}T${hh}:${mm}`);}
 else d=new Date(String(v));
 return Number.isFinite(d?.getTime())&&d.getFullYear()>=1990&&d.getTime()<Date.now()+86400000?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`:null;};
function normalize(item){if(!item||typeof item!=='object'||Array.isArray(item)||item instanceof Blob)return null;
 const species=text(pick(item,['species','fischart','fishSpecies','fish_name','fishName','fish','fisch','art','fishType'])).trim();
 const datePart=pick(item,['caughtAt','caught_at','timestamp','datetime','time','fangzeit','catchDate','caughtOn','date','datum','fangdatum','createdAt']);
 const clock=pick(item,['uhrzeit','clock','fangUhrzeit']);
 const dt=saneDate(typeof datePart==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(datePart)&&clock?datePart+'T'+text(clock):datePart);
 if(!species||species.length>120||!dt)return null;
 let length=Number(pick(item,['lengthCm','laengeCm','längeCm','fischlaenge','fischlänge','length','laenge','länge'])||0); if(!Number.isFinite(length)||length<0||length>1000)length=null;
 let weight=null;const weightKg=pick(item,['weightKg','gewichtKg','weight_kg','gewicht_kg']);if(weightKg!==''){weight=Number(weightKg);}else{
 const g=pick(item,['weightGrams','weightG','gewichtGramm','gewichtG']);
 if(g!=='')weight=Number(g)/1000;
 else {const generic=pick(item,['weight','gewicht']);if(generic!==''&&Number(generic)>0&&Number(generic)<=100)weight=Number(generic);}
 } if(weight!=null&&(!Number.isFinite(weight)||weight<0||weight>1000))weight=null;
 const loc=text(pick(item,['location','locationName','gewaesser','gewässer','water','waterName','spot','ort','angelort'])).trim();
 const bait=text(pick(item,['bait','koeder','köder','lure','baitName'])).slice(0,140);
 const notes=text(pick(item,['notes','note','notizen','bemerkung','beschreibung'])).slice(0,500);
 const id=text(pick(item,['id','catchId','uuid','_id'])).slice(0,120);
 return {species,time:dt,length:length||null,weight:weight||null,location:loc.slice(0,140),bait,notes,id};
}
function recordsFrom(value,label){const result=[];if(Array.isArray(value)){for(const x of value){const obj=normalize(x);if(obj)result.push(obj);}return result;}
 if(!value||typeof value!=='object'||value instanceof Blob)return result;
 const direct=normalize(value);if(direct)result.push(direct);
 for(const [k,v] of Object.entries(value)){if(!Array.isArray(v))continue;
  if(/catch|fang|fish|fisch|log|record|entry|eintrag|tagebuch/i.test(k)||/catch|fang|fish|fisch/i.test(label)){
   for(const item of v){const obj=normalize(item);if(obj)result.push(obj);}
  }
 }
 return result;
}
async function discoverDbNames(){if(typeof indexedDB?.databases!=='function')return null;const entries=await indexedDB.databases();return entries.map(x=>x.name).filter(Boolean);}
const req=(store,action,...args)=>new Promise((resolve,reject)=>{const r=store[action](...args);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||new Error('IndexedDB-Lesefehler'));});
const openDb=name=>new Promise((resolve,reject)=>{const r=indexedDB.open(name);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||new Error('IndexedDB nicht verfügbar'));r.onupgradeneeded=()=>{ /* The database must never be modified while scanning. */ };});
async function inspect(){if(scanning)return lastReport;scanning=true;try{sources=[];let ignored=0,issues=[];
 for(let i=0;i<localStorage.length;i++){const name=localStorage.key(i);if(!name||ignoreKeys.test(name)||name==='petri31-pro-data-v1')continue;
  const raw=localStorage.getItem(name);if(!raw||raw.length>7e6){ignored++;continue;}
  try{const v=JSON.parse(raw),arr=recordsFrom(v,'localStorage:'+name);if(arr.length)sources.push({id:'ls:'+name,label:'Lokaler Speicher: '+name,records:arr});}catch{}
 }
 let names;try{names=await discoverDbNames();}catch(e){issues.push('IndexedDB-Liste: '+e.message);names=null;}
 if(names){for(const name of names){if(name===PRO_DB||name===EXAM_DB)continue;let db;
  try{db=await openDb(name);for(const st of Array.from(db.objectStoreNames)){const tx=db.transaction(st,'readonly'),store=tx.objectStore(st);const items=await req(store,'getAll',undefined,2000);let found=[];
   for(const v of items)found.push(...recordsFrom(v,name+'/'+st));
   if(found.length)sources.push({id:'idb:'+name+':'+st,label:'Datenbank: '+name+' / '+st,records:found});
  }}catch(e){issues.push(name+': '+e.message)}finally{db?.close();}
 }}else issues.push('Die Auflistung älterer IndexedDB-Datenbanken wird von diesem Browser nicht unterstützt.');
 const total=sources.reduce((n,s)=>n+s.records.length,0);
 lastReport={sources:sources.length,records:total,issues,ignored};return lastReport;
 }finally{scanning=false;}}
function fingerprint(c){const data=[c.species.trim().toLowerCase(),c.time.slice(0,16),String(c.length||''),String(c.weight||''),c.location.trim().toLowerCase(),c.bait.trim().toLowerCase()];let h=2166136261;for(const s of data.join('|')){h=Math.imul(h^s.charCodeAt(0),16777619)}return 'legacy-'+(h>>>0).toString(16)+'-'+data.join('|').length;}
async function preview(){const status=$('petri33-migration-status');if(status)status.textContent='Suche gespeicherte alte Fänge …';
 const report=await inspect(),box=$('petri33-migration-preview');if(!box)return;
 box.innerHTML=`<div class="p33-preview"><p><strong>${report.records}</strong> mögliche alte Fänge in ${report.sources} Datenquellen gefunden.</p>${sources.map((s,i)=>`<label class="p33-source"><input type="checkbox" class="p33-select" value="${i}"><span><strong>${esc(s.label)}</strong> · ${s.records.length} Einträge<br><small>Beispiel: ${esc(s.records.slice(0,2).map(x=>`${x.species}, ${x.time.slice(0,10)}`).join(' · '))}</small></span></label>`).join('')||'<p>Keine eindeutig erkennbaren Fangdatensätze gefunden. Andere Speicherformate bleiben unberührt.</p>'}${report.issues.length?`<p class="p31-note p31-warn">${esc(report.issues.join(' | '))}</p>`:''}
 <label class="p33-confirm"><input id="p33-understood" type="checkbox">Ich habe die erkannten Fänge geprüft. Die Übernahme erstellt Kopien; sie löscht keine Originaldaten.</label>
 <button class="p31-action p31-primary" type="button" data-bridge="import" ${!report.records?'disabled':''}>Ausgewählte Einträge kopieren</button>
 <p class="p31-note">Dubletten werden anhand von Art, Fangzeit, Länge, Gewicht, Gewässer und Köder geprüft. Fotos und nicht erkannte Sonderfelder bleiben im ursprünglichen Fangbuch. Vorher separat sichern!</p></div>`;
 if(status)status.textContent=`Vorschau erstellt: ${report.records} mögliche Fänge. Noch nichts übernommen.`;
}
function selectedRecords(){const box=$('petri33-migration-preview');const idx=[...box.querySelectorAll('.p33-select:checked')].map(x=>Number(x.value));return idx.flatMap(i=>(sources[i]?.records||[]).map(record=>({...record,legacyFingerprint:fingerprint(record),legacySource:sources[i].label})));}
async function migrate(){const box=$('petri33-migration-preview');if(!box?.querySelector('#p33-understood:checked')){alert('Bitte zuerst die Datenübernahme bestätigen.');return;}
 const chosen=selectedRecords();if(!chosen.length){alert('Bitte mindestens eine Datenquelle auswählen.');return;}
 if(!confirm(`${chosen.length} erkannte Fänge in das Pro-Fangbuch kopieren? Die Originaldaten bleiben erhalten.`))return;
 const result=window.PetriHeilProBridge?.importLegacyCatches(chosen);if(!result){alert('Das Pro-Fangbuch ist noch nicht bereit. App erneut öffnen.');return;}
 const info=`${result.added} Fänge übernommen; ${result.duplicates} Duplikate übersprungen; ${result.invalid} ungültige Datensätze ausgelassen.`;
 const status=$('petri33-migration-status');if(status)status.textContent=info;
 const previewBox=$('petri33-migration-preview');if(previewBox)previewBox.innerHTML='<p>'+esc(info)+'</p>';
}
// No browser-generated data is transmitted to a server by this backup helper.
const bytesToBase64=bytes=>{let out='';for(let i=0;i<bytes.length;i+=32768)out+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(out);};
const base64ToBytes=str=>{const bin=atob(str),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u;};
async function serial(v,depth=0){if(depth>30)throw Error('Verschachtelung im Datensatz zu tief.');if(v===undefined)return {__petri33:'undefined'};
 if(v===null||['string','number','boolean'].includes(typeof v))return v;
 if(v instanceof Date)return {__petri33:'date',value:v.toISOString()};
 if(v instanceof Blob){if(v.size>35*1024*1024)throw Error('Ein einzelner Dateianhang ist größer als 35 MB.');return {__petri33:'blob',mime:v.type,content:bytesToBase64(new Uint8Array(await v.arrayBuffer()))};}
 if(v instanceof ArrayBuffer)return {__petri33:'binary',content:bytesToBase64(new Uint8Array(v))};
 if(ArrayBuffer.isView(v))return {__petri33:'typed',ctor:v.constructor.name,content:bytesToBase64(new Uint8Array(v.buffer,v.byteOffset,v.byteLength))};
 if(Array.isArray(v))return Promise.all(v.map(x=>serial(x,depth+1)));
 if(v instanceof Map)return {__petri33:'map',entries:await Promise.all([...v.entries()].map(async ([k,x])=>[await serial(k,depth+1),await serial(x,depth+1)]))};
 if(v instanceof Set)return {__petri33:'set',entries:await Promise.all([...v].map(x=>serial(x,depth+1)))};
 if(typeof v==='object'){const out={};for(const [k,x] of Object.entries(v)){if(k==='__petri33')throw Error('Reservierter Feldname im Originaldatensatz.');out[k]=await serial(x,depth+1);}return out;}
 throw Error('Nicht unterstützter Datentyp im IndexedDB-Eintrag.');
}
async function unserial(v,depth=0){if(depth>30)throw Error('Zu tief verschachtelte Sicherungsdaten.');if(v===null||typeof v!=='object')return v;
 if(Array.isArray(v))return Promise.all(v.map(x=>unserial(x,depth+1)));
 if(v.__petri33){switch(v.__petri33){case 'undefined':return undefined;case 'date':return new Date(v.value);case 'blob':return new Blob([base64ToBytes(v.content)],{type:v.mime||''});case 'binary':return base64ToBytes(v.content).buffer;case 'typed':{const u=base64ToBytes(v.content);const map={Uint8Array,Int8Array,Uint16Array,Int16Array,Uint32Array,Int32Array,Float32Array,Float64Array};const C=map[v.ctor]||Uint8Array;return new C(u.buffer.slice(0));}case 'map':return new Map(await Promise.all(v.entries.map(async p=>[await unserial(p[0],depth+1),await unserial(p[1],depth+1)])));case 'set':return new Set(await Promise.all(v.entries.map(x=>unserial(x,depth+1))));default:throw Error('Nicht unterstütztes Sicherungsformat.');}}
 const out={};for(const [k,x] of Object.entries(v))out[k]=await unserial(x,depth+1);return out;
}
async function exportLegacyDatabases(){const names=await discoverDbNames();if(names===null)throw Error('Der Browser kann ältere Datenbanken nicht auflisten. Eine vollständige Sicherung ist nicht möglich.');
 const result=[];for(const name of names){if(name===PRO_DB||name===EXAM_DB)continue;let db;
 try{db=await openDb(name);const stores=[];
 for(const storeName of Array.from(db.objectStoreNames)){
  const t=db.transaction(storeName,'readonly'),store=t.objectStore(storeName);
  const [keys,values]=await Promise.all([req(store,'getAllKeys'),req(store,'getAll')]);
  if(values.length!==keys.length)throw Error('Datensätze und Schlüssel stimmen nicht überein in '+name+'/'+storeName);
  if(values.length>60000)throw Error('Mehr als 60.000 Datensätze in '+storeName);
  const items=[];for(let i=0;i<keys.length;i++)items.push({key:await serial(keys[i]),value:await serial(values[i])});
  const indexes=Array.from(store.indexNames).map(indexName=>{const ix=store.index(indexName);return {name:indexName,keyPath:ix.keyPath,unique:ix.unique,multiEntry:ix.multiEntry};});
  stores.push({name:storeName,keyPath:store.keyPath,autoIncrement:store.autoIncrement,indexes,items});
 }result.push({name,version:db.version,stores});
 }finally{db?.close();}}
 return result;
}
async function restoreLegacyDatabases(data){if(!Array.isArray(data))throw Error('Ungültige Datenbankliste.');let n=0;const warnings=[];
 for(const descriptor of data){if(!descriptor||typeof descriptor.name!=='string'||descriptor.name.length>180||!Array.isArray(descriptor.stores)||[PRO_DB,EXAM_DB].includes(descriptor.name))throw Error('Ungültige Datenbank im Backup.');
  let db;try{const open=indexedDB.open(descriptor.name);open.onupgradeneeded=()=>{const d=open.result;for(const s of descriptor.stores){if(!d.objectStoreNames.contains(s.name)){const store=d.createObjectStore(s.name,{keyPath:s.keyPath??undefined,autoIncrement:!!s.autoIncrement});for(const ix of s.indexes||[]){store.createIndex(ix.name,ix.keyPath,{unique:!!ix.unique,multiEntry:!!ix.multiEntry});}}}};db=await new Promise((resolve,reject)=>{open.onsuccess=()=>resolve(open.result);open.onerror=()=>reject(open.error);});
   for(const storeDesc of descriptor.stores){if(!db.objectStoreNames.contains(storeDesc.name)){warnings.push(descriptor.name+'/'+storeDesc.name+' fehlt');continue;}
    if(!Array.isArray(storeDesc.items)||storeDesc.items.length>60000)throw Error('Ungültige Einträge in '+storeDesc.name);
    const decoded=[];for(const record of storeDesc.items)decoded.push({value:await unserial(record.value),key:await unserial(record.key)});
    const tx=db.transaction(storeDesc.name,'readwrite'),s=tx.objectStore(storeDesc.name);
    for(const {value,key} of decoded){
      // Explicit restoration replaces matching keys, but never calls clear() on stores.
      // IndexedDB requires no explicit key if the objectStore uses an inline keyPath.
      if(s.keyPath===null){if(key===undefined)continue;s.put(value,key)}else s.put(value);
      n++;
    }
    await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
   }
  }catch(e){warnings.push(descriptor.name+': '+e.message)}finally{db?.close();}
 }return {records:n,warnings};
}
function fixDashboard(){const main=$('main');if(!main)return;
 const count=(()=>{try{if(typeof DATA!=='undefined'&&Array.isArray(DATA.fish))return DATA.fish.length;}catch{}return null;})();
 const walker=document.createTreeWalker(main,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode()){const n=walker.currentNode;if((n.nodeValue||'').includes('${DATA.fish.length}'))nodes.push(n);}for(const n of nodes)n.nodeValue=n.nodeValue.replaceAll('${DATA.fish.length}',count===null?'Arten':String(count));
}
let queued=false;function scheduleFix(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fixDashboard();});}
function start(){document.addEventListener('click',event=>{const b=event.target.closest('[data-bridge]');if(!b)return;event.preventDefault();event.stopPropagation();
 if(b.dataset.bridge==='scan')void preview().catch(e=>{const st=$('petri33-migration-status');if(st)st.textContent='Prüfung nicht möglich: '+e.message;});
 if(b.dataset.bridge==='import')void migrate().catch(e=>alert('Import nicht möglich: '+e.message));
 },true);
 fixDashboard();const main=$('main');if(main)new MutationObserver(scheduleFix).observe(main,{subtree:true,childList:true,characterData:true});
}
window.PetriDataBridge33={exportLegacyDatabases,restoreLegacyDatabases,inspect,normalize,fingerprint};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
