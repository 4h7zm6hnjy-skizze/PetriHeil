/* Petri Heil Pro: stabiler Worker-Pfad, Version 2.5.0.
   Updated in place on future releases. Does not import legacy workers. */
'use strict';
const VERSION='2.5.0';
const ROOT=new URL('./',self.location.href);
const CORE_CACHE='petri-core-2.5.0';
const IMAGE_CACHE='petri-media-2.2.0';
const CORE=[
 'index.html','update-rettung.html','version.json','manifest.webmanifest',
 'style.css?v=2.0.4','data.js?v=2.0.4','app.js?v=2.0.4',
 'petri-ocean-theme.css?v=2.0.42','petri-logos-v2.0.29.css?v=2.0.42',
 'petri-pro-suite-v2.0.39.css?v=2.0.42','petri-report-v2.0.36.css?v=2.0.42',
 'petri-next-v2.0.37.css?v=2.0.42','petri-gesamt-v2.0.39.css?v=2.0.42',
 'petri-gps-v2.0.42.css?v=2.0.42','petri-ui-v2.1.2.css?v=2.1.2',
 'petri-species-regions-v2.1.3.css?v=2.1.3','petri-hero-logo-v2.1.4.css?v=2.1.4',
 'petri-start-design-v2.1.6.css?v=2.1.6','petri-start-design-v2.1.6.js?v=2.1.6',
 'petri-hero-uebersicht-v2.1.6.webp',
 'species-images-v2.0.5.js?v=2.0.42','petri-anglerclock-pruefung-v2.0.30.js?v=2.0.42',
 'petri-pro-suite-v2.0.42.js?v=2.0.42','petri-data-bridge-v2.0.33.js?v=2.0.42',
 'petri-report-v2.0.36.js?v=2.0.42','petri-next-v2.0.37.js?v=2.0.42',
 'petri-gesamt-v2.0.41.js?v=2.0.42','petri-unified-ui-v2.1.2.js?v=2.1.2',
 'petri-species-regions-v2.1.3.js?v=2.1.3','petri-updater.js?v=2.4.0',
 'petri-media-v2.2.0.json','petri-offline-v2.5.0.js?v=2.5.0','offline-check.html',
 'petri-platform-v2.2.1.css?v=2.2.1','petri-platform-v2.2.1.js?v=2.2.1','installieren.html',
 'petri-privacy-v2.2.2.js?v=2.2.2','datenschutz.html',
 'petri-praktisch-v2.2.3.css?v=2.2.3','petri-praktisch-data-v2.2.3.js?v=2.2.3',
 'petri-praktisch-v2.2.3.js?v=2.2.3','praxis.html',
 'petri-werkzeuge-v2.3.0.css?v=2.3.0','petri-werkzeuge-v2.5.0.js?v=2.5.0',
 'petri-praxis-plus-v2.3.0.js?v=2.3.0','petri-compat-v2.5.0.js?v=2.5.0',
 'petri-core-v2.5.0.json','werkzeuge.html',
 'petri-erweiterungen-v2.4.0.css?v=2.4.0','petri-erweiterungen-v2.4.0.js?v=2.4.0','erweiterungen.html',
 'petri-angelwerkzeuge-v2.5.0.css?v=2.5.0','petri-angelwerkzeuge-v2.5.0.js?v=2.5.0','angelwerkzeuge.html'
];
const IMAGES=[
 'petri-fisch-v2.0.29.webp','petri-marke-v2.0.29.webp',
 'icon-192.png','icon-512.png','petri-hero-uebersicht-v2.1.6.webp',
 'gear-bissfestes-vorfach.webp','gear-boilie.webp','gear-mais-teig.webp',
 'gear-wuermer-maden.webp','gear-pilker-paternoster.webp','gear-rettungsweste.webp'
];
const file=s=>new URL(s,ROOT).href;
const essentialKey=file('index.html');
self.addEventListener('message',evt=>{
  const type=evt.data?.type;
  if(type==='PETRI_GET_WORKER_VERSION'){
    try{evt.ports?.[0]?.postMessage({version:VERSION,cache:CORE_CACHE,ready:true})}catch{}
  }else if(type==='SKIP_WAITING'){
    void self.skipWaiting();
  }else if(type==='PREFETCH_IMAGES'){
    evt.waitUntil(prefetchImages());
  }
});
// Distinct cache keys are essential: Cache.addAll rejects duplicate requests.
// Each required file is cached only once and its individual failure is reported.
function announceInstall(type, extra={}){
  return self.clients.matchAll({includeUncontrolled:true,type:'window'}).then(list=>{
    for(const client of list){try{client.postMessage({type,version:VERSION,...extra})}catch{}}
  }).catch(()=>{});
}
self.addEventListener('install',evt=>evt.waitUntil((async()=>{
  const cache=await caches.open(CORE_CACHE);
  const paths=[...new Set(CORE)];
  const required=['index.html','version.json'];
  let completed=0;
  async function load(path){
    const uri=file(path);
    let last;
    for(let attempt=1;attempt<=2;attempt++){
      const ctrl=new AbortController();
      const timer=setTimeout(()=>ctrl.abort(),30000);
      try{
        const response=await fetch(uri,{cache:'no-store',signal:ctrl.signal});
        if(!response.ok||response.type==='opaque')throw Error('HTTP '+response.status);
        if(path==='index.html'){
          const text=await response.clone().text();
          if(!text.includes('name="petri-app-version" content="'+VERSION+'"'))
            throw Error('Veröffentlichte Startseite hat nicht Version '+VERSION);
        }
        if(path==='version.json'){
          const data=await response.clone().json();
          if(data.version!==VERSION)throw Error('Veröffentlichte Versionsdatei ist nicht '+VERSION);
        }
        await cache.put(uri,response);
        completed++;
        if(completed===paths.length || completed%3===0)
          await announceInstall('PETRI_INSTALL_PROGRESS',{done:completed,total:paths.length,file:path});
        return;
      }catch(e){last=e}finally{clearTimeout(timer)}
    }
    throw Error('Datei '+path+' konnte nicht offline gespeichert werden: '+(last?.message||last));
  }
  try{
    for(const p of required)await load(p);
    const remaining=paths.filter(p=>!required.includes(p));
    let i=0, firstError=null;
    async function consume(){
      while(!firstError&&i<remaining.length){
        const path=remaining[i++];
        try{await load(path)}catch(e){firstError=e;break}
      }
    }
    await Promise.all([consume(),consume(),consume()]);
    if(firstError)throw firstError;
    if(completed!==paths.length)throw Error('Offline-Paket unvollständig');
    await announceInstall('PETRI_INSTALL_PROGRESS',{done:completed,total:paths.length,complete:true});
    await self.skipWaiting();
  }catch(e){
    await announceInstall('PETRI_INSTALL_FAILURE',{error:String(e?.message||e)});
    await caches.delete(CORE_CACHE);
    throw e;
  }
})()));
self.addEventListener('activate',evt=>evt.waitUntil((async()=>{
  await self.clients.claim();
  // Keep old caches because many fish photos may only exist there.
})()));
async function networkFirst(req,key){
  const cache=await caches.open(CORE_CACHE);
  try{
    const resp=await fetch(req,{cache:'no-store'});
    if(!resp.ok)throw Error('HTTP '+resp.status);
    if(key===essentialKey){
      const body=await resp.clone().text();
      if(!body.includes('name="petri-app-version" content="'+VERSION+'"'))
        throw Error('Server liefert noch veraltete Startseite.');
    }
    if(resp.type!=='opaque')await cache.put(key||req,resp.clone()).catch(()=>{});
    return resp;
  }catch(e){
    return await cache.match(key||req,{ignoreSearch:true})||
      await caches.match(key||req,{ignoreSearch:true})||Response.error();
  }
}
async function staticCacheFirst(req){
 const current=await caches.open(CORE_CACHE);
 const cached=await current.match(req)||await caches.match(req);
 if(cached)return cached;
 return networkFirst(req,req);
}
async function imageCacheFirst(req){
  const cache=await caches.open(IMAGE_CACHE);
  const cached=await cache.match(req,{ignoreSearch:true})||await caches.match(req,{ignoreSearch:true});
  if(cached)return cached;
  try{
    const resp=await fetch(req);
    if(resp.ok&&resp.type!=='opaque')await cache.put(req,resp.clone()).catch(()=>{});
    return resp;
  }catch{ return Response.error() }
}
self.addEventListener('fetch',evt=>{
  const url=new URL(evt.request.url);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(ROOT.pathname))return;
  if(evt.request.method!=='GET')return;
  if(evt.request.mode==='navigate'){
    // Repair page is never replaced by an old cached index.html.
    // Important: each route must use its OWN cached page, never cache a
    // standalone page as index.html. Otherwise offline navigation shows the
    // wrong app after visiting the installation/privacy/practical pages.
    const known=new Set(['index.html','offline-check.html','update-rettung.html',
      'installieren.html','datenschutz.html','praxis.html','erweiterungen.html','werkzeuge.html','angelwerkzeuge.html']);
    const name=url.pathname.slice(ROOT.pathname.length);
    const key=known.has(name)?file(name):essentialKey;
    evt.respondWith(networkFirst(evt.request,key));return;
  }
  if(/\.(?:png|webp|jpe?g|gif|svg)$/.test(url.pathname)){
    evt.respondWith(imageCacheFirst(evt.request));return;
  }
  if(/\.(?:css|js|json|webmanifest|html)$/.test(url.pathname)){
    evt.respondWith(url.pathname.endsWith('/version.json')?networkFirst(evt.request):staticCacheFirst(evt.request));return;
  }
});
// Previously installed app modules request a background prefetch automatically.
// Only cache a few app graphics here. The complete 228-image library is prepared
// and VERIFIED by the foreground Offline-Check, so iOS cannot silently truncate
// a claimed-complete image set when the application is suspended.
let prefetching=null;
function prefetchImages(){
  if(prefetching)return prefetching;
  prefetching=(async()=>{
    const c=await caches.open(IMAGE_CACHE);
    for(const name of IMAGES.slice(0,5)){
      const url=file(name);
      try{
        if(await c.match(url)||await caches.match(url))continue;
        const r=await fetch(url,{cache:'reload'});
        if(r.ok&&r.headers.get('content-type')?.startsWith('image/'))await c.put(url,r);
      }catch{}
    }
  })().finally(()=>{prefetching=null});
  return prefetching;
}
