/* Petri Heil Pro 4.4.4 — additive, local-only cross-module data bridge. */
(()=>{'use strict';
const A=window.Petri430;if(!A)throw Error('Petri430-Basisbibliothek fehlt');
const PLACES='petri440-places-v1',SETTINGS='petri440-settings-v1',PHOTOS='petri440-photos';
const esc=A.esc,uid=A.uid,fmt=A.format,now=A.stamp;
const validCoord=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&lat>=-90&&lat<=90&&lon>=-180&&lon<=180;
function placeStore(){const d=A.read(PLACES,{places:[]});if(!Array.isArray(d.places))throw Error('Angelplätze sind nicht lesbar – bitte zuerst sichern');return d}
function places(){return placeStore().places.filter(p=>!p.archivedAt)}
function archivedPlaces(){return placeStore().places.filter(p=>Boolean(p.archivedAt))}
function archivePlace(id){
 const snapshot=localStorage.getItem(PLACES),d=placeStore(),p=d.places.find(x=>x.id===id);
 if(!p)throw Error('Angelplatz nicht gefunden');
 if(p.archivedAt)return p;
 p.archivedAt=now();
 A.write(PLACES,d,snapshot);
 return p;
}
function restorePlace(id){
 const snapshot=localStorage.getItem(PLACES),d=placeStore(),p=d.places.find(x=>x.id===id);
 if(!p||!p.archivedAt)throw Error('Ort ist nicht im Archiv');
 delete p.archivedAt;
 A.write(PLACES,d,snapshot);
 return p;
}
/* Delete permanently only when no catches, days, depth measurements or photos depend on it.
   This avoids orphaned private photos and accidental data loss. */
async function deleteArchivedPlace(id){
 const p=archivedPlaces().find(x=>x.id===id);
 if(!p)throw Error('Ort muss zuerst entfernt und archiviert werden');
 const catches=allCatches().filter(c=>links(c).placeId===id).length;
 const days=A.days().sessions.filter(s=>s.p440PlaceId===id).length;
 let depths=0;
 const raw=localStorage.getItem('petri442-depths-v1');
 if(raw!==null){let d;try{d=JSON.parse(raw)}catch{throw Error('Tiefenpunkt-Speicher beschädigt. Endgültiges Löschen gesperrt.')}
  if(!d||!Array.isArray(d.points))throw Error('Tiefenpunkt-Speicher ungültig. Endgültiges Löschen gesperrt.');
  depths=d.points.filter(x=>x.placeId===id).length;}
 const images=(await photos('place',id)).length;
 if(catches||days||depths||images)throw Error(`Ort bleibt im Archiv: ${catches} Fänge, ${days} Angeltage, ${depths} Tiefenpunkte und ${images} Fotos sind verknüpft. So gehen keine Daten verloren.`);
 const previous=localStorage.getItem(PLACES),d=placeStore();
 if(!d.places.some(x=>x.id===id&&x.archivedAt))throw Error('Angelplatz wurde zwischenzeitlich geändert.');
 d.places=d.places.filter(x=>x.id!==id);
 A.write(PLACES,d,previous);
 return p;
}
function setPlace(p){const snapshot=localStorage.getItem(PLACES),d=placeStore(),idx=d.places.findIndex(x=>x.id===p.id);if(!validCoord(p.lat,p.lon))throw Error('Ungültige GPS-Koordinaten');if(!p.name||p.name.length>90)throw Error('Angelplatz-Name fehlt oder ist zu lang');if(idx>=0)d.places[idx]={...d.places[idx],...p,updatedAt:now()};else{if(d.places.length>=500)throw Error('Maximal 500 private Angelplätze');d.places.unshift({...p,createdAt:now()})}A.write(PLACES,d,snapshot);return p}
function active(){return A.days().sessions.find(s=>!s.stopped)||null}
function attachPlaceToDay(placeId){const p=places().find(x=>x.id===placeId);if(placeId&&!p)throw Error('Angelplatz nicht vorhanden');const d=active();if(!d)throw Error('Kein Angeltag aktiv');A.saveDay({...d,p440PlaceId:placeId,water:d.water||p?.water||p?.name||''});return d.id}
function startDay(water,method,placeId=''){if(active())throw Error('Ein Angeltag läuft bereits');const p=places().find(x=>x.id===placeId);if(placeId&&!p)throw Error('Angelplatz nicht vorhanden');const s={id:uid(),started:now(),stopped:null,water:(water||p?.water||p?.name||'').slice(0,140),method:String(method||'Andere').slice(0,80),entries:[],latitude:p?.lat??null,longitude:p?.lon??null,p440PlaceId:placeId};A.saveDay(s);return s}
function stopDay(){const s=active();if(!s)throw Error('Kein Angeltag aktiv');const next={...s,stopped:now()};A.saveDay(next);return next}
function dayEntry(kind,description){const s=active();if(!s)throw Error('Zuerst Angeltag starten');const t=String(description||'').trim();if(!t||t.length>1400)throw Error('Beschreibung fehlt oder ist zu lang');const next={...s,entries:[...(s.entries||[]),{id:uid(),at:now(),kind,text:t}]};A.saveDay(next);return next}
function createCatch(form){const fish=String(form.fish||'').trim();if(!fish||fish.length>120)throw Error('Fischart erforderlich');const time=new Date(form.time);if(!Number.isFinite(time.getTime())||time.getTime()>Date.now()+86400000)throw Error('Ungültige Fangzeit');const lat=form.length===''?null:Number(form.length),weight=form.weight===''?null:Number(form.weight);if(lat!==null&&(!Number.isFinite(lat)||lat<=0||lat>1000))throw Error('Ungültige Länge');if(weight!==null&&(!Number.isFinite(weight)||weight<=0||weight>1000))throw Error('Ungültiges Gewicht');const liveDay=active(),day=liveDay&&time.getTime()>=new Date(liveDay.started).getTime()-5*60000?liveDay:null,requestedId=form.placeId||'',candidate=requestedId||day?.p440PlaceId||'';const place=places().find(p=>p.id===candidate);if(requestedId&&!place)throw Error('Angelplatz existiert nicht mehr');const plid=place?candidate:'';
const key=A.keys.PRO,old=localStorage.getItem(key),d=A.read(key,{catches:[]});if(d.catches!==undefined&&!Array.isArray(d.catches))throw Error('Fangbuchformat beschädigt');const x={id:uid(),species:fish,time:time.toISOString(),place:'',placeText:String(form.water||place?.water||place?.name||day?.water||'').slice(0,140),bait:String(form.bait||'').slice(0,140),length:lat,weight,status:'Nicht angegeben',notes:String(form.notes||'').slice(0,1000),sessionKey:'',photoKey:'',legacySource:'',legacyFingerprint:'',legacyLocation:'',p440:{dayId:day?.id||null,placeId:plid||null,linkedAt:now()}};
d.catches=[x,...(d.catches||[])];A.write(key,d,old);return x}
function allCatches(){return A.catches()}
function links(c){const z=c.raw?.p440||{};return {dayId:z.dayId||null,placeId:z.placeId||null}}
function byPlace(id){return allCatches().filter(c=>links(c).placeId===id)}
function byDay(id){return allCatches().filter(c=>links(c).dayId===id)}
function readSettings(){return A.read(SETTINGS,{tripDate:'',lastWeather:null,lastPegel:null})}
function settings(patch){const old=localStorage.getItem(SETTINGS),d=readSettings();const data={...d,...patch};A.write(SETTINGS,data,old);return data}
function openDB(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(Error('IndexedDB fehlt'));const r=indexedDB.open(PHOTOS,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('photos'))r.result.createObjectStore('photos',{keyPath:'id'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Fotodatenbank blockiert'))})}
async function photoSave(kind,entity,file){if(!['day','place','catch'].includes(kind))throw Error('Unbekannter Fotozweck');if(!file||file.size<=0||file.size>7*1048576||!/^image\/(?:png|jpeg|webp|heic|heif)$/.test(file.type))throw Error('Foto muss JPG/PNG/WebP/HEIC und maximal 7 MB groß sein');const b=await openDB();const p={id:uid(),kind,entity,blob:file,name:String(file.name).slice(0,150),createdAt:now()};try{await new Promise((ok,bad)=>{const tx=b.transaction('photos','readwrite');tx.oncomplete=ok;tx.onabort=()=>bad(tx.error||Error('Speicher gescheitert'));tx.onerror=()=>bad(tx.error||Error('Foto nicht gespeichert'));tx.objectStore('photos').put(p)})}finally{b.close()}return p}
async function photos(kind,entity){const b=await openDB();try{return await new Promise((ok,bad)=>{const tx=b.transaction('photos','readonly'),q=tx.objectStore('photos').getAll();q.onsuccess=()=>ok(q.result.filter(p=>p.kind===kind&&p.entity===entity));q.onerror=()=>bad(q.error||Error('Fotos nicht lesbar'))})}finally{b.close()}}

/* Optional reassignment for a selected historic Pro/Plus catch. The unchanged legacy record
   stays at its exact original index. No photo references or unknown fields are removed. */
function linkCatch(record,dayId='',placeId=''){
 if(!record||!['pro','plus'].includes(record.source))throw Error('Fangquelle nicht gültig');
 const day=dayId?A.days().sessions.find(x=>x.id===dayId):null;
 if(dayId&&!day)throw Error('Der ausgewählte Angeltag existiert nicht mehr');
 let pid=placeId||'';
 const liveDayPlace=day?.p440PlaceId&&places().some(p=>p.id===day.p440PlaceId)?day.p440PlaceId:'';
 if(liveDayPlace&&!pid)pid=liveDayPlace;
 const place=pid?places().find(x=>x.id===pid):null;
 if(pid&&!place)throw Error('Der Angelplatz existiert nicht mehr');
 if(liveDayPlace&&pid!==liveDayPlace)throw Error('Angeltag und Angelplatz widersprechen sich. Bitte den Angelplatz des Tages wählen.');
 const key=record.source==='pro'?A.keys.PRO:A.keys.PLUS;
 const previous=localStorage.getItem(key);
 if(previous===null)throw Error('Ursprüngliches Fangbuch nicht vorhanden');
 const data=A.read(key,{catches:[]});
 if(!Array.isArray(data.catches))throw Error('Ungültiges ursprüngliches Fangbuch');
 const source=data.catches[record.index];
 if(!source||typeof source!=='object'||Array.isArray(source)||
    (record.id&&String(source.id)!==record.id)||
    JSON.stringify(source)!==JSON.stringify(record.raw))throw Error('Fang wurde zwischenzeitlich verändert. Bitte neu laden.');
 const oldMeta=source.p440&&typeof source.p440==='object'&&!Array.isArray(source.p440)?source.p440:{};
 const updated={...source,p440:{...oldMeta,dayId:dayId||null,placeId:pid||null,linkedAt:now(),manuallyLinked:true}};
 data.catches[record.index]=updated;
 A.write(key,data,previous);
 return {source:record.source,index:record.index,id:String(source.id||''),dayId:dayId||null,placeId:pid||null};
}
function csv(){const rows=[['Fischart','Datum','Gewässer','Köder','Länge (cm)','Gewicht (kg)','Fangbuch','Angeltag-ID','Angelplatz-ID']];for(const c of allCatches()){const l=links(c);rows.push([c.fish,c.time,c.water,c.bait,c.length??'',c.weight??'',c.source,l.dayId||'',l.placeId||''])}return A.csv(rows)}
window.Petri440=Object.freeze({A,keys:{PLACES,SETTINGS,PHOTOS},esc,uid,fmt,now,places,archivedPlaces,setPlace,archivePlace,restorePlace,deleteArchivedPlace,active,attachPlaceToDay,startDay,stopDay,dayEntry,createCatch,linkCatch,allCatches,links,byPlace,byDay,readSettings,settings,photoSave,photos,csv,validCoord});
})();

/* v4.4.5: add universal back navigation without changing existing modules. */
;(()=>{'use strict';
 if(typeof window==='undefined'||window.__petri445NavRequested)return;
 window.__petri445NavRequested=true;
 const root=new URL('./',document.currentScript?.src||document.baseURI);
 const script=document.createElement('script');script.src=new URL('petri445-nav.js?v=4.4.9',root).href;
 script.addEventListener('error',()=>{window.__petri445NavRequested=false;});
 (document.head||document.documentElement).appendChild(script);
})();
