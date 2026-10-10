/* Petri Heil Pro: stabiler Worker-Pfad, Version 2.1.6.
   Updated in place on future releases. Does not import legacy workers. */
'use strict';
const VERSION='2.1.6';
const ROOT=new URL('./',self.location.href);
const CORE_CACHE='petri-core-2.1.6';
const IMAGE_CACHE='petri-images-2.1.6';
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
 'petri-hero-uebersicht-v2.1.6.webp',
 'species-images-v2.0.5.js?v=2.0.42','petri-anglerclock-pruefung-v2.0.30.js?v=2.0.42',
 'petri-pro-suite-v2.0.42.js?v=2.0.42','petri-data-bridge-v2.0.33.js?v=2.0.42',
 'petri-report-v2.0.36.js?v=2.0.42','petri-next-v2.0.37.js?v=2.0.42',
 'petri-gesamt-v2.0.41.js?v=2.0.42','petri-unified-ui-v2.1.2.js?v=2.1.2',
 'petri-species-regions-v2.1.3.js?v=2.1.3','petri-updater.js?v=2.1.6'
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
self.addEventListener('install',evt=>evt.waitUntil((async()=>{
  const cache=await caches.open(CORE_CACHE);
  // The worker becomes active only if ALL app shell files are cached.
  // Version mismatches and 404s therefore never mark an incomplete release installed.
  const requests=CORE.map(s=>new Request(file(s),{cache:'reload'}));
  await cache.addAll(requests);
  // Never activate a worker advertising a release whose HTML/manifest is still old.
  const cachedPage=await cache.match(essentialKey);
  const html=cachedPage?await cachedPage.text():'';
  if(!html.includes('name="petri-app-version" content="'+VERSION+'"'))
    throw Error('Neue App-Dateien noch nicht vollständig veröffentlicht.');
  const versionResponse=await cache.match(file('version.json'));
  const versionData=versionResponse?await versionResponse.json():{};
  if(versionData.version!==VERSION)throw Error('Versionsdatei und Worker stimmen nicht überein.');
  await self.skipWaiting();
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
    const key=/\/update-rettung\.html$/.test(url.pathname)?file('update-rettung.html'):essentialKey;
    evt.respondWith(networkFirst(evt.request,key));return;
  }
  if(/\.(?:png|webp|jpe?g|gif|svg)$/.test(url.pathname)){
    evt.respondWith(imageCacheFirst(evt.request));return;
  }
  if(/\.(?:css|js|json|webmanifest|html)$/.test(url.pathname)){
    evt.respondWith(networkFirst(evt.request));return;
  }
});
let prefetching=null;
function prefetchImages(){
  if(prefetching)return prefetching;
  prefetching=(async()=>{
    const urls=new Set(IMAGES.map(file));
    // Image names are extracted from the already-deployed species photo map.
    // No downloads from external sites, no data storage changes.
    try{
      const source=await (await fetch(file('species-images-v2.0.5.js'),{cache:'force-cache'})).text();
      const regexp=/\[\s*['"][fsc]\d+['"]\s*,\s*['"][^'"]+['"]\s*,\s*['"]([a-zA-Z0-9-]+)['"]/g;
      for(const match of source.matchAll(regexp))urls.add(file(match[1]+'.webp'));
    }catch{}
    const list=Array.from(urls);const cache=await caches.open(IMAGE_CACHE);let pos=0;
    async function consume(){
      while(pos<list.length){
        const uri=list[pos++];
        if(await cache.match(uri)||await caches.match(uri))continue;
        try{const resp=await fetch(uri,{cache:'reload'});if(resp.ok)await cache.put(uri,resp)}catch{}
      }
    }
    await Promise.all(Array.from({length:4},consume));
  })().finally(()=>{prefetching=null});
  return prefetching;
}
