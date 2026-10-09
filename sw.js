const CACHE='petri-heil-pro-v1-3-0';
const PHOTO_CACHE='petri-heil-real-photos-v1';
const SHELL=['./','./index.html','./style.css','./app.js','./data.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png','./assets/petri-logo.webp','./version.json'];
const PHOTO_HOSTS=['static.inaturalist.org','inaturalist-open-data.s3.amazonaws.com','upload.wikimedia.org'];
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(SHELL);await self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('petri-heil-pro-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const url=new URL(e.request.url);
 if(PHOTO_HOSTS.includes(url.hostname)){
  e.respondWith((async()=>{const c=await caches.open(PHOTO_CACHE);const old=await c.match(e.request,{ignoreVary:true});if(old)return old;
   try{const res=await fetch(e.request);if(res.ok||res.type==='opaque')e.waitUntil(c.put(e.request,res.clone()).catch(()=>{}));return res}catch(err){return new Response('',{status:503})}
  })());return;
 }
 if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/version.json')){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./version.json')));return}
 if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{if(r.ok)e.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',r.clone())));return r}).catch(()=>caches.match('./index.html')));return}
 e.respondWith(caches.match(e.request).then(old=>old||fetch(e.request).then(r=>{if(r.ok)e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,r.clone())));return r})))
});
