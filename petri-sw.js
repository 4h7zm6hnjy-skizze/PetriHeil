/* Petri Heil Pro 3.7.0 – compatible cache-first offline worker.
   No user-data deletion, no remote tiles, no cache cleanup. */
'use strict';
const VERSION='3.7.0', CORE_CACHE='petri-core-3.7.0', IMAGE_CACHE='petri-media-2.2.0';
const ROOT=new URL('./',self.location.href), file=n=>new URL(n,ROOT).href;
const DELTA=[
 'petri370.html','petri370.css?v=3.7.0','petri370.js?v=3.7.0',
 'index.html','zentrale.html','angelbegleiter.html','offline-check.html',
 'petri-offline-v3.7.0.js?v=3.7.0','version.json','petri-core-v3.7.0.json','sw.js','petri-sw.js?v=3.7.0'
];
const CHANGED=new Set(['petri370.html','petri370.css','petri370.js','index.html','zentrale.html','angelbegleiter.html','offline-check.html','petri-offline-v3.7.0.js','version.json','petri-core-v3.7.0.json','sw.js','petri-sw.js']);
const ROUTES=new Set(['index.html','offline-check.html','update-rettung.html','installieren.html','datenschutz.html','praxis.html','erweiterungen.html','werkzeuge.html','karte.html','premium.html','angelwerkzeuge.html','montagen.html','gezeiten.html','kinderwelt.html','angelschule.html','angelstudio.html','karten-detail.html','lernspiele.html','zentrale.html','gewaesser.html','angelbegleiter.html','petri370.html']);
self.addEventListener('message',e=>{
 const t=e.data?.type;
 if(t==='PETRI_GET_WORKER_VERSION'){try{e.ports?.[0]?.postMessage({version:VERSION,cache:CORE_CACHE,ready:true})}catch{}}
 if(t==='SKIP_WAITING')void self.skipWaiting();
 if(t==='PREFETCH_IMAGES')e.waitUntil(prefetchImages());
});
async function prefetchImages(){const c=await caches.open(IMAGE_CACHE);for(const name of ['petri-fisch-v2.0.29.webp','petri-marke-v2.0.29.webp','icon-192.png','icon-512.png','petri-hero-uebersicht-v2.1.6.webp']){try{const u=file(name);if(await c.match(u)||await caches.match(u))continue;const r=await fetch(u);if(r.ok&&r.type!=='opaque')await c.put(u,r)}catch{}}}
async function getCoreFiles(){const r=await fetch(file('petri-core-v3.6.0.json'),{cache:'reload'});if(!r.ok)throw Error('Vorversion-Medienliste fehlt (HTTP '+r.status+')');const j=await r.json();if(j.version!=='3.6.0'||!Array.isArray(j.files)||j.files.length<100)throw Error('Unplausible Liste der bisherigen Offline-App');return [...new Set([...j.files,...DELTA])];}
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const names=await getCoreFiles();const cache=await caches.open(CORE_CACHE);
 for(let i=0;i<names.length;i+=8){await Promise.all(names.slice(i,i+8).map(async name=>{
 const u=file(name);let resp=null;const base=name.split('?')[0];
 if(!CHANGED.has(base))resp=await caches.match(u,{ignoreSearch:true});
 if(!resp){const r=await fetch(u,{cache:'reload'});if(!r.ok||r.type==='opaque')throw Error('Pflichtdatei fehlt: '+name+' HTTP '+r.status);resp=r;}
 if(base==='index.html'){const body=await resp.clone().text();if(!body.includes('name="petri-app-version" content="3.7.0"'))throw Error('Startseite ist noch nicht 3.7.0');}
 if(base==='petri370.html'){const body=await resp.clone().text();if(!body.includes('name="petri-app-version" content="3.7.0"'))throw Error('Angelzentrale ist noch nicht 3.7.0');}
 await cache.put(u,resp.clone());
 }));}
 await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{await self.clients.claim();/* old versions and photo caches remain */})()));
async function networkFirst(req,key){const c=await caches.open(CORE_CACHE);try{const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),8500);let resp;try{resp=await fetch(req,{cache:'no-store',signal:ctl.signal})}finally{clearTimeout(timer)}if(!resp.ok||resp.type==='opaque')throw Error('HTTP '+resp.status);await c.put(key||req,resp.clone()).catch(()=>{});return resp}catch{return await c.match(key||req,{ignoreSearch:true})||await caches.match(key||req,{ignoreSearch:true})||Response.error()}}
async function staticFirst(req){const c=await caches.open(CORE_CACHE);const found=await c.match(req,{ignoreSearch:true})||await caches.match(req,{ignoreSearch:true});return found||await networkFirst(req,req)}
async function imageFirst(req){const c=await caches.open(IMAGE_CACHE);const found=await c.match(req,{ignoreSearch:true})||await caches.match(req,{ignoreSearch:true});if(found)return found;try{const r=await fetch(req);if(r.ok&&r.type!=='opaque')await c.put(req,r.clone()).catch(()=>{});return r}catch{return Response.error()}}
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
 if(e.request.mode==='navigate'){
  const name=u.pathname.slice(ROOT.pathname.length),key=file(ROUTES.has(name)?name:'index.html');
  if(name==='update-rettung.html')e.respondWith(networkFirst(e.request,key));
  else e.respondWith((async()=>{const c=await caches.open(CORE_CACHE);return await c.match(key,{ignoreSearch:true})||await caches.match(key,{ignoreSearch:true})||await networkFirst(e.request,key)})());
  return;
 }
 if(/\.(?:webp|png|jpe?g|gif|svg)$/i.test(u.pathname)){e.respondWith(imageFirst(e.request));return}
 if(/\.(?:js|css|json|html|webmanifest)$/i.test(u.pathname)){e.respondWith(u.pathname.endsWith('/version.json')?networkFirst(e.request):staticFirst(e.request));return}
});
