/* Petri Heil Pro 2.1.0 - Service-Worker-Kompatibilitätsschicht.
   Importiert die bewährte 2.0.42-Fischbild-Offline-Logik und ergaenzt
   ausschliesslich den neuen UI-Kerncache. Die Benutzerdaten bleiben unberuehrt. */
const PETRI_RELEASE='2.1.0';
const PETRI_SHELL_CACHE='petri-shell-2-1-0';
const PETRI_CORE=[
 './index.html','./style.css?v=2.0.4','./app.js?v=2.0.4','./data.js?v=2.0.4',
 './petri-ocean-theme.css?v=2.0.42','./petri-logos-v2.0.29.css?v=2.0.42',
 './petri-unified-ui-v2.1.0.js?v=2.1.0','./petri-ui-v2.1.0.css?v=2.1.0',
 './petri-update-v2.1.0.js?v=2.1.0',
 './petri-pro-suite-v2.0.42.js?v=2.0.42','./petri-pro-suite-v2.0.39.css?v=2.0.42',
 './petri-gps-v2.0.42.css?v=2.0.42',
 './petri-anglerclock-pruefung-v2.0.30.js?v=2.0.42',
 './petri-gesamt-v2.0.41.js?v=2.0.42','./petri-gesamt-v2.0.39.css?v=2.0.42',
 './petri-next-v2.0.37.js?v=2.0.42','./petri-next-v2.0.37.css?v=2.0.42',
 './petri-report-v2.0.36.js?v=2.0.42','./petri-report-v2.0.36.css?v=2.0.42',
 './petri-data-bridge-v2.0.33.js?v=2.0.42',
 './species-images-v2.0.5.js?v=2.0.42', './petri-gear-media-v2.0.28.js?v=2.0.42',
 './petri-gear-missing-v2.0.43.js?v=2.0.43',
 './petri-marke-v2.0.29.webp','./petri-fisch-v2.0.29.webp',
 './petri-gear-media-v2.0.28.js?v=2.0.42',
 './petri-logos-v2.0.29.js?v=2.0.42',
 './manifest.webmanifest','./version.json',
 './gear-bissfestes-vorfach.webp','./gear-boilie.webp','./gear-mais-teig.webp',
 './gear-wuermer-maden.webp','./gear-pilker-paternoster.webp','./gear-rettungsweste.webp'
];
// Der Versionsdialog muss die Version dieses Workers statt der importierten
// alten Version erhalten. Registrierung erfolgt vor importScripts.
self.addEventListener('message',event=>{
 if(event.data?.type!=='PETRI_GET_WORKER_VERSION')return;
 event.stopImmediatePropagation();
 try{event.ports?.[0]?.postMessage({version:PETRI_RELEASE,cache:PETRI_SHELL_CACHE,ready:true})}catch{}
});
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
   const cache=await caches.open(PETRI_SHELL_CACHE);
   // Fehlerhafte Bilddateien duerfen die Kerninstallation nicht blockieren.
   const required=PETRI_CORE.slice(0,9);
   await cache.addAll(required);
   const remaining=PETRI_CORE.slice(9);
   await Promise.allSettled(remaining.map(async path=>{
     const req=new Request(path,{cache:'reload'});
     const response=await fetch(req);
     if(response.ok)await cache.put(req,response);
   }));
   await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
// Navigation bevorzugt bei fehlendem Internet IMMER die neue index.html,
// nicht eine alte Version aus einem früher installierten Offline-Cache.
// Vor dem importierten Legacy-Worker registrieren, um doppelte respondWith
// Handler fuer Navigation zu verhindern.
self.addEventListener('fetch',event=>{
 if(event.request.mode!=='navigate')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 event.stopImmediatePropagation();
 event.respondWith((async()=>{
   const cache=await caches.open(PETRI_SHELL_CACHE);
   try{
     const response=await fetch(event.request);
     if(!response.ok)throw new Error('HTTP '+response.status);
     await cache.put('./index.html',response.clone()).catch(()=>{});
     return response;
   }catch(err){
     return await cache.match('./index.html')||
       await caches.match('./index.html',{ignoreSearch:true})||
       new Response('Offline-Seite nicht verfügbar',{status:503});
   }
 })());
});
// Alte Offline-Fisch-Assets und alte Daten bleiben im bisherigen Cache.
importScripts('./sw.js?legacy=2.0.42');
