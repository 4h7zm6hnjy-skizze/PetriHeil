/* Petri Heil Pro 2.0.6: compatible update for the existing 2.0.4 app.
   This service worker adds the twenty local GitHub ROOT species images to the offline cache.
   It injects the non-destructive photo loader into index.html when the new worker controls navigation.
*/
const CACHE='petri-heil-pro-v2-0-6';
const PHOTO_CACHE='petri-heil-real-photos-v1';
const CORE=[
  './index.html','./style.css?v=2.0.4','./app.js?v=2.0.4','./data.js?v=2.0.4',
  './species-images-v2.0.5.js?v=2.0.6','./manifest.webmanifest','./version.json'
];
const IMAGES=["./icon-192.png", "./icon-512.png", "./petri-logo.webp", "./giebel.webp", "./goldfisch.webp", "./dreistachliger-stichling.webp", "./schwarzmundgrundel.webp", "./stint.webp", "./sterlet.webp", "./bachneunauge.webp", "./petermaennchen.webp", "./europaeischer-hummer.webp", "./chinesische-wollhandkrabbe.webp", "./neunstachliger-stichling.webp", "./kesslergrundel.webp", "./flussgrundel.webp", "./nackthalsgrundel.webp", "./amurgrundel.webp", "./flussneunauge.webp", "./meerneunauge.webp", "./gemeine-strandkrabbe.webp", "./nordseegarnele.webp", "./taschenkrebs.webp"];
const PHOTO_HOSTS=['static.inaturalist.org','inaturalist-open-data.s3.amazonaws.com','upload.wikimedia.org'];
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
async function prefetchImages(cache){
  let n=0;
  async function work(){
    while(n<IMAGES.length){
      const path=IMAGES[n++];
      try{
        if(await cache.match(path))continue;
        const r=await fetch(path,{cache:'reload'});
        if(r.ok)await cache.put(path,r);
      }catch(err){console.warn('Bild kann nicht offline gespeichert werden',path,err)}
    }
  }
  await Promise.all(Array.from({length:4},work));
}
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(CORE);
  await prefetchImages(cache);
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();
  for(const k of keys){
    if(k.startsWith('petri-heil-pro-')&&k!==CACHE)await caches.delete(k);
  }
  await self.clients.claim();
})()));
async function networkFirst(req,key){
  const cacheKey=key||req;
  try{
    const result=await fetch(req);
    if(!result.ok)throw new Error('HTTP '+result.status);
    const cache=await caches.open(CACHE);
    await cache.put(cacheKey,result.clone()).catch(()=>{});
    return result;
  }catch(err){
    return await caches.match(cacheKey,{ignoreSearch:true})||Response.error();
  }
}
async function withPhotoLoader(result){
  if(!result||!result.ok)return result;
  const html=await result.text();
  const loader='<script src="./species-images-v2.0.5.js?v=2.0.6" defer></script>';
  if(!html.includes('</body>'))return new Response(html,{status:result.status,statusText:result.statusText,headers:result.headers});
  const patched=html.includes('species-images-v2.0.5.js')?html:html.replace('</body>',loader+'\n</body>');
  const headers=new Headers(result.headers);
  headers.set('content-type','text/html; charset=UTF-8');
  headers.delete('content-length');
  headers.delete('content-encoding');
  return new Response(patched,{status:result.status,statusText:result.statusText,headers});
}
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(PHOTO_HOSTS.includes(u.hostname)){
    e.respondWith((async()=>{
      const c=await caches.open(PHOTO_CACHE);
      const old=await c.match(e.request,{ignoreVary:true});
      if(old)return old;
      try{
        const r=await fetch(e.request);
        if(r.ok||r.type==='opaque')e.waitUntil(c.put(e.request,r.clone()).catch(()=>{}));
        return r;
      }catch(err){return new Response('',{status:503})}
    })());return;
  }
  if(u.origin!==self.location.origin)return;
  // Legacy v2.0.4 paths still point to assets/, although GitHub stores
  // these files in the repository root. Redirect transparently and offline.
  const legacy = u.pathname.match(/\/assets\/(petri-logo\.webp|icon-(?:192|512)\.png)$/);
  if(legacy){
    const correct = new URL('../'+legacy[1], u.href);
    e.respondWith((async()=>{
      const cached = await caches.match(correct.href,{ignoreSearch:true});
      if(cached)return cached;
      return networkFirst(new Request(correct.href));
    })());
    return;
  }
  if(u.pathname.endsWith('/version.json')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./version.json')));return;
  }
  if(e.request.mode==='navigate'){
    e.respondWith(networkFirst(e.request,'./index.html').then(withPhotoLoader));return;
  }
  if(/\/(?:app|data)\.js$|\/style\.css$|\/manifest\.webmanifest$|\/species-images-v2\.0\.5\.js$/.test(u.pathname)){
    e.respondWith(networkFirst(e.request));return;
  }
  // Precached root image files are therefore available offline.
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||networkFirst(e.request)));
});
