// Petri Heil Pro 2.0.4 – cache-busting, network-first code and fault-tolerant offline image cache.
const CACHE='petri-heil-pro-v2-0-4';
const PHOTO_CACHE='petri-heil-real-photos-v1';
const CORE=["./index.html", "./style.css?v=2.0.4", "./app.js?v=2.0.4", "./data.js?v=2.0.4", "./manifest.webmanifest", "./version.json"];
const IMAGES=["./assets/icon-192.png","./assets/icon-512.png","./assets/petri-logo.webp"]; // AI-Bilder sind in app.js eingebettet.
const PHOTO_HOSTS=['static.inaturalist.org','inaturalist-open-data.s3.amazonaws.com','upload.wikimedia.org'];
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
async function prefetchImages(cache){
 // Each image is independent: a missing resource cannot abort the update.
 let i=0;
 async function worker(){while(i<IMAGES.length){const file=IMAGES[i++];try{
  const found=await cache.match(file);if(found)continue;
  const r=await fetch(file);if(r.ok)await cache.put(file,r);
 }catch(err){console.warn('Offline image skipped:',file,String(err))}}}
 await Promise.all(Array.from({length:6},worker));
}
self.addEventListener('install',e=>{e.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await cache.addAll(CORE);
 // A failed image may not block the essential app or update activation.
 await prefetchImages(cache);
 await self.skipWaiting();
})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
 const keys=await caches.keys();
 for(const key of keys){
  if(key.startsWith('petri-heil-pro-')&&key!==CACHE){
   const from=await caches.open(key),to=await caches.open(CACHE);
   // Image cache no longer needed for embedded illustrations.
   for(const asset of IMAGES){if(!(await to.match(asset))){const response=await from.match(asset);if(response)await to.put(asset,response)}}
   await caches.delete(key);
  }
 }
 await self.clients.claim();
})())});
async function fetchOrCache(req,key){
 const cacheKey=key||req;
 try{
  const res=await fetch(req);
  if(!res.ok)throw new Error('HTTP '+res.status);
  const c=await caches.open(CACHE);
  await c.put(cacheKey,res.clone()).catch(()=>{});
  return res;
 }catch(err){
  const old=await caches.match(cacheKey,{ignoreSearch:true});
  if(old)return old;
  return Response.error();
 }
}
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 if(PHOTO_HOSTS.includes(url.hostname)){e.respondWith((async()=>{
  const c=await caches.open(PHOTO_CACHE),old=await c.match(e.request,{ignoreVary:true});
  if(old)return old;
  try{const r=await fetch(e.request);if(r.ok||r.type==='opaque')e.waitUntil(c.put(e.request,r.clone()).catch(()=>{}));return r}
  catch(err){return new Response('',{status:503})}
 })());return}
 if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/version.json')){
  e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./version.json')));return;
 }
 if(e.request.mode==='navigate'){
  e.respondWith(fetchOrCache(e.request,'./index.html'));return;
 }
 // Never serve stale JS/CSS/data when online. Offline falls back to the latest core.
 if(/\/(?:app|data)\.js$|\/style\.css$|\/manifest\.webmanifest$/.test(url.pathname)){
  e.respondWith(fetchOrCache(e.request).then(r=>r||caches.match(e.request,{ignoreSearch:true})));return;
 }
 e.respondWith(caches.match(e.request).then(old=>old||fetchOrCache(e.request)));
});
