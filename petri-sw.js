/* Petri Heil Pro 4.4.1: install-safe offline PWA worker. No user-data deletion. */
'use strict';
const VERSION='4.4.1';
const CORE_CACHE='petri-core-4.4.1', STAGE='petri-stage-4.4.1', IMAGES='petri-media-2.2.0';
const ROOT=new URL('./',self.location.href),local=n=>new URL(n,ROOT).href;
const CHANGED=new Set(["angelbegleiter.html", "index.html", "offline-check.html", "petri-core-v4.4.1.json", "petri-offline-v4.4.1.js", "petri-sw.js", "petri410-vault.js", "petri410.html", "petri430-angeltag.html", "petri430-angeltag.js", "petri430-arten.html", "petri430-arten.js", "petri430-ausruestung.html", "petri430-ausruestung.js", "petri430-beissindex.html", "petri430-beissindex.js", "petri430-core.js", "petri430-enhance.js", "petri430-fangbuch.html", "petri430-fangbuch.js", "petri430-pages.css", "petri430-qualitaet.html", "petri430-qualitaet.js", "petri430-quality.js", "petri430-release.json", "petri430-system.js", "petri430.css", "petri430.html", "petri430.js", "petri440-app.js", "petri440-core.js", "petri441-release.json", "petri-offline-v4.4.1.js", "petri-core-v4.4.1.json", "petri440-release.json", "petri440.css", "petri440.html", "sicherung410.html", "species-images-v2.0.5.js", "sw.js", "system410.html", "version.json", "zentrale.html"]);
const ROUTES=new Set(["angelbegleiter.html", "angelschule.html", "angelstudio.html", "angelwerkzeuge.html", "datenschutz.html", "erweiterungen.html", "gewaesser.html", "gezeiten.html", "index.html", "installieren.html", "karte.html", "karten-detail.html", "kinderwelt.html", "lernspiele.html", "montagen.html", "offline-check.html", "petri370.html", "petri400.html", "petri410.html", "petri411-bilderpruefung.html", "petri420-quality.html", "petri420.html", "petri430-angeltag.html", "petri430-arten.html", "petri430-ausruestung.html", "petri430-beissindex.html", "petri430-fangbuch.html", "petri430-qualitaet.html", "petri430.html", "petri440.html", "praxis.html", "premium.html", "sicherung410.html", "system410.html", "update-rettung.html", "werkzeuge.html", "zentrale.html"]);
const fileName=n=>n.split('?')[0];
async function notify(type,props={}){try{const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const c of clients)c.postMessage({type,version:VERSION,...props})}catch{}}
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')void self.skipWaiting();if(e.data?.type==='PETRI_GET_WORKER_VERSION'){try{e.ports[0]?.postMessage({version:VERSION,cache:CORE_CACHE})}catch{}}});
async function coreList(){const response=await fetch(local('petri-core-v4.4.1.json'),{cache:'no-store'});if(!response.ok)throw Error('Manifest HTTP '+response.status);const data=await response.json();if(data.version!==VERSION||!Array.isArray(data.files)||data.files.length<120||new Set(data.files).size!==data.files.length)throw Error('Ungültiges Versionsmanifest');for(const x of data.files)if(typeof x!=='string'||!/^[a-zA-Z0-9._-]+(?:\?v=[0-9.]+)?$/.test(x))throw Error('Unsicherer Offline-Pfad');for(const x of ['index.html','petri410.html','petri430.html','petri430.js?v=4.3.0','petri440.html','petri440-core.js?v=4.4.1','petri440-app.js?v=4.4.1','version.json'])if(!data.files.includes(x))throw Error('Pflichtdatei fehlt in Liste: '+x);return data.files}
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const names=await coreList();const stage=await caches.open(STAGE);
  try{
    let done=0;
    for(let i=0;i<names.length;i+=6){await Promise.all(names.slice(i,i+6).map(async name=>{
      const u=local(name),stem=fileName(name);let response=null;
      if(!CHANGED.has(stem))response=await caches.match(u,{ignoreSearch:true});
      if(!response){const r=await fetch(u,{cache:'reload'});if(!r.ok||r.type==='opaque')throw Error('Offline-Pflichtdatei: '+name+' ('+r.status+')');response=r;}
      if(stem==='index.html'||stem==='petri440.html'){
        const body=await response.clone().text();if(!body.includes('name="petri-app-version" content="4.4.1"'))throw Error('Veraltete Startdatei: '+name);
      }
      if(stem==='version.json'){
        const data=await response.clone().json();if(data.version!==VERSION)throw Error('Veraltete version.json');
      }
      await stage.put(u,response.clone());done++;
    }));await notify('PETRI_INSTALL_PROGRESS',{done,total:names.length})}
    const cache=await caches.open(CORE_CACHE);
    for(const req of await stage.keys()){const response=await stage.match(req);if(response)await cache.put(req,response)}
    await caches.delete(STAGE);
    await self.skipWaiting();
  }catch(e){await caches.delete(STAGE);await caches.delete(CORE_CACHE);await notify('PETRI_INSTALL_FAILURE',{error:String(e?.message||e)});throw e}
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{await self.clients.claim();/* Existing image caches and personal data are retained. */})()));
async function networkFirst(req,key){const cache=await caches.open(CORE_CACHE);try{const controller=new AbortController(),tm=setTimeout(()=>controller.abort(),8000);let r;try{r=await fetch(req,{cache:'no-store',signal:controller.signal})}finally{clearTimeout(tm)}if(!r.ok||r.type==='opaque')throw Error('HTTP '+r.status);if(key)await cache.put(key,r.clone()).catch(()=>{});return r}catch{return await cache.match(key||req,{ignoreSearch:true})||await caches.match(key||req,{ignoreSearch:true})||Response.error()}}
async function staticFirst(req){const cache=await caches.open(CORE_CACHE);return await cache.match(req,{ignoreSearch:true})||await caches.match(req,{ignoreSearch:true})||await networkFirst(req,req)}
async function imageFirst(req){const cache=await caches.open(IMAGES);const found=await cache.match(req,{ignoreSearch:true})||await caches.match(req,{ignoreSearch:true});if(found)return found;try{const r=await fetch(req);if(r.ok&&r.type!=='opaque')await cache.put(req,r.clone()).catch(()=>{});return r}catch{return Response.error()}}
self.addEventListener('fetch',e=>{const req=e.request,u=new URL(req.url);if(req.method!=='GET'||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
 if(req.mode==='navigate'){const path=u.pathname.slice(ROOT.pathname.length),name=path||'index.html';if(!ROUTES.has(name))return;const key=local(name);if(name==='update-rettung.html')e.respondWith(networkFirst(req,key));else e.respondWith((async()=>{const c=await caches.open(CORE_CACHE);return await c.match(key)||await caches.match(key)||await networkFirst(req,key)})());return}
 if(/\.(?:webp|png|jpe?g|gif|svg)$/i.test(u.pathname)){e.respondWith(imageFirst(req));return}
 if(/\.(?:js|css|json|html|webmanifest)$/i.test(u.pathname)){e.respondWith(u.pathname.endsWith('/version.json')?networkFirst(req):staticFirst(req))}
});
