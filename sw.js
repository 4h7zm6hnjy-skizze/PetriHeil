/* Petri Heil Pro 2.0.34: compatible update for the existing 2.0.4 app.
   This worker precaches 172 fish WebPs and the new local gear WebPs asynchronously.
   It injects the photo loader during HTML navigation without changing user data.
*/
const CACHE='petri-heil-pro-v2-0-34';
const PHOTO_CACHE='petri-heil-real-photos-v1';
const CORE=[
  './index.html','./style.css?v=2.0.4','./app.js?v=2.0.4','./data.js?v=2.0.4',
  './species-images-v2.0.5.js?v=2.0.34','./petri-ocean-theme.css?v=2.0.34','./petri-gear-media-v2.0.28.js?v=2.0.34','./petri-update-install-v2.0.28.js?v=2.0.34','./petri-logos-v2.0.29.css?v=2.0.34','./petri-logos-v2.0.29.js?v=2.0.34','./manifest.webmanifest','./petri-anglerclock-pruefung-v2.0.30.js?v=2.0.34','./petri-pro-suite-v2.0.34.js?v=2.0.34','./petri-pro-suite-v2.0.34.css?v=2.0.34','./petri-data-bridge-v2.0.33.js?v=2.0.34','./version.json'
];
const IMAGES=["./aal.webp","./lachs.webp","./mairenke.webp","./ziege.webp","./icon-192.png","./icon-512.png","./petri-logo.webp","./giebel.webp","./goldfisch.webp","./dreistachliger-stichling.webp","./schwarzmundgrundel.webp","./stint.webp","./sterlet.webp","./bachneunauge.webp","./petermaennchen.webp","./europaeischer-hummer.webp","./chinesische-wollhandkrabbe.webp","./neunstachliger-stichling.webp","./kesslergrundel.webp","./flussgrundel.webp","./nackthalsgrundel.webp","./amurgrundel.webp","./flussneunauge.webp","./meerneunauge.webp","./gemeine-strandkrabbe.webp","./nordseegarnele.webp","./taschenkrebs.webp","./meerforelle-neu.webp","./atlantischer-stoer-neu.webp","./europaeischer-stoer.webp","./donau-neunauge.webp","./stintdorsch.webp","./kleines-petermaennchen.webp","./lippfisch-goldmaid.webp","./gefleckter-lippfisch.webp","./meeraesche-dicklippige.webp","./meeraesche-duennlippige.webp","./seehase.webp","./seewolf-gestreifter.webp","./kuckuckslippfisch.webp","./grosser-scheibenbauch.webp","./europaeischer-butterfisch.webp","./aalmutter.webp","./seestichling.webp","./grasnadel.webp","./grosse-seenadel.webp","./seepferdchen-langschnauziges.webp","./kleine-seenadel.webp","./schlangennadel.webp","./seepferdchen-kurzschnauziges.webp","./schwarzgrundel.webp","./sandgrundel.webp","./strandgrundel.webp","./fleckengrundel.webp","./goldstrieme.webp","./meerbrasse.webp","./hai-kleingefleckter-katzenhai.webp","./dornhai.webp","./heringshai.webp","./nagelrochen.webp","./sternrochen.webp","./glattrochen.webp","./zope.webp","./zobel.webp","./zaehrte.webp","./frauennerfling.webp","./stroemer.webp","./perlfisch.webp","./stromgruendling.webp","./donau-steinbeisser.webp","./schwarzer-zwergwels.webp","./schwarzbarsch.webp","./groppe-rheingebiet.webp","./hundsfisch.webp","./ostasiatischer-schlammpeitzger.webp","./schnaepel.webp","./grosse-maraene.webp","./kleine-maraene.webp","./blaufelchen.webp","./gangfisch.webp","./kilch.webp","./ammersee-kaulbarsch.webp","./schraetzer.webp","./streber.webp","./zingel.webp","./wittling.webp","./schellfisch.webp","./seelachs-koehler.webp","./pollack.webp","./seehecht.webp","./leng.webp","./franzosendorsch.webp","./zwergdorsch.webp","./europaeische-sardelle.webp","./stoecker.webp","./seezunge.webp","./glattbutt.webp","./rotzunge.webp","./heilbutt.webp","./doggerscharbe.webp","./zwergzunge.webp","./seeskorpion.webp","./langstacheliger-seeskorpion.webp","./knurrhahn-rot.webp","./grauer-knurrhahn.webp","./lumb.webp","./roter-knurrhahn.webp","./hundshai.webp","./kuckucksrochen.webp","./dohlenkrebs.webp","./steinkrebs.webp","./edelkrebs-ki-weiss.webp","./signalkrebs-ki-weiss.webp","./kamberkrebs-ki-weiss.webp","./roter-amerikanischer-sumpfkrebs.webp","./scholle-ki-weiss.webp","./flunder-ki-weiss.webp","./kliesche-ki-weiss.webp","./steinbutt-ki-weiss.webp","./hering-ki-weiss.webp","./sprotte-ki-weiss.webp","./sardine-ki-weiss.webp","./makrele-ki-weiss.webp","./hornhecht-ki-weiss.webp","./wolfsbarsch-ki-weiss.webp","./marmorkrebs-ki-weiss.webp","./kaisergranat-ki-weiss.webp","./galizischer-sumpfkrebs-ki-weiss.webp","./hecht.webp","./zander.webp","./flussbarsch.webp","./kaulbarsch.webp","./wels.webp","./quappe.webp","./karpfen.webp","./graskarpfen.webp","./silberkarpfen.webp","./marmorkarpfen.webp","./schleie.webp","./brasse.webp","./guester.webp","./rotauge.webp","./rotfeder.webp","./aland.webp","./doebel.webp","./rapfen.webp","./barbe.webp","./nase.webp","./aesche.webp","./bachforelle.webp","./seeforelle.webp","./regenbogenforelle.webp","./bachsaibling.webp","./seesaibling.webp","./huchen.webp","./karausche.webp","./gruendling.webp","./hasel.webp","./laube.webp","./elritze.webp","./moderlieschen.webp","./bitterling.webp","./schneider.webp","./bachschmerle.webp","./steinbeisser.webp","./schlammpeitzger.webp","./koppe.webp","./zwergwels.webp","./sonnenbarsch.webp","./marmorierte-grundel.webp","./maifisch.webp","./finte.webp","./dorsch.webp","./goldbrasse.webp","./seeteufel.webp","./gear-spinnrute.webp","./gear-feederrute.webp","./gear-baitcastrolle.webp","./gear-spinnrolle.webp","./gear-angelschnur.webp","./gear-kescher-zubehoer.webp","./gear-kunstkoeder-sortiment.webp","./gear-vorfach-haken.webp","./gear-jigkoepfe.webp","./gear-korkrute.webp","./gear-fliegenrute.webp","./gear-karpfenrute.webp","./gear-teleskopkescher.webp","./gear-setzkescher.webp","./gear-posen.webp","./gear-haken-und-zubehoer.webp","./gear-wobbler.webp","./gear-gummifische.webp","./gear-koeder-set.webp","./icon-fischkunde-hecht.webp","./gear-abhakmatte.webp","./gear-massband-waage.webp","./gear-hakenloeser-zange.webp","./petri-fisch-v2.0.29.webp","./petri-marke-v2.0.29.webp"];
const PHOTO_HOSTS=['static.inaturalist.org','inaturalist-open-data.s3.amazonaws.com','upload.wikimedia.org'];
let imagePrefetchTask=null;
function scheduleOfflineImagePrefetch(){
  if(imagePrefetchTask)return imagePrefetchTask;
  imagePrefetchTask=(async()=>{
    const cache=await caches.open(CACHE);
    await prefetchImages(cache);
    // Old caches remain as fallback until every mapped image is in the new cache.
    let complete=true;
    for(const path of IMAGES){if(!(await cache.match(path))){complete=false;break;}}
    if(complete){
      for(const key of await caches.keys()){
        if(key.startsWith('petri-heil-pro-')&&key!==CACHE)await caches.delete(key);
      }
    }
  })().finally(()=>{imagePrefetchTask=null});
  return imagePrefetchTask;
}
self.addEventListener('message',e=>{
  if(!e.data)return;
  if(e.data.type==='SKIP_WAITING'){e.waitUntil(self.skipWaiting());return;}
  if(e.data.type==='PREFETCH_IMAGES')e.waitUntil(scheduleOfflineImagePrefetch());
});
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
  // Install the new HTML, CSS and code first. 175 large species images must not
  // keep an iPhone Home Screen app pinned to an older service worker.
  await cache.addAll(CORE);
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  // Keep old image caches until replacement image precache is complete.
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
  const loader='<script src="./species-images-v2.0.5.js?v=2.0.34" defer></script>';
  const theme='<link rel="stylesheet" href="./petri-ocean-theme.css?v=2.0.34"><link rel="stylesheet" href="./petri-logos-v2.0.29.css?v=2.0.34">';
  if(!html.includes('</body>'))return new Response(html,{status:result.status,statusText:result.statusText,headers:result.headers});
  let patched=html.includes('species-images-v2.0.5.js')?html:html.replace('</body>',loader+'\n</body>');
  if(!patched.includes('petri-ocean-theme.css'))patched=patched.replace('</head>',theme+'\n</head>');
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
  if(/\/(?:app|data)\.js$|\/(?:style|petri-ocean-theme)\.css$|\/manifest\.webmanifest$|\/species-images-v2\.0\.5\.js$|\/petri-gear-media-v2\.0\.28\.js$|\/petri-update-install-v2\.0\.28\.js$|\/petri-logos-v2\.0\.29\.(?:js|css)$|\/petri-pro-suite-v2\.0\.34\.(?:js|css)$|\/petri-data-bridge-v2\.0\.33\.js$|\/petri-anglerclock-pruefung-v2\.0\.30\.js$|\/petri-anglerclock-pruefung-v2\.0\.30\.js$|\/petri-pro-suite-v2\.0\.34\.(?:js|css)$|\/petri-data-bridge-v2\.0\.33\.js$/.test(u.pathname)){
    e.respondWith(networkFirst(e.request));return;
  }
  // Precached root image files are therefore available offline.
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||networkFirst(e.request)));
});
