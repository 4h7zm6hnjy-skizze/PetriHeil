/* Petri Heil Pro 2.0.6: 10 local AI reference images and update-check repair.
   Original 70 embedded illustrations and local user data remain unchanged.
   Images are illustrative, NOT validated for species identification. */
(()=>{
  'use strict';
  const VERSION='2.0.6';
  const SPECIES=[
    ['f32','Giebel','giebel'],
    ['f33','Goldfisch','goldfisch'],
    ['f53','Dreistachliger Stichling','dreistachliger-stichling'],
    ['f61','Schwarzmundgrundel','schwarzmundgrundel'],
    ['f68','Stint','stint'],
    ['f73','Sterlet','sterlet'],
    ['f86','Bachneunauge','bachneunauge'],
    ['s35','Petermännchen','petermaennchen'],
    ['c12','Europäischer Hummer','europaeischer-hummer'],
    ['c9','Chinesische Wollhandkrabbe','chinesische-wollhandkrabbe'],
    ['f54','Neunstachliger Stichling','neunstachliger-stichling'],
    ['f62','Kesslergrundel','kesslergrundel'],
    ['f63','Flussgrundel','flussgrundel'],
    ['f64','Nackthalsgrundel','nackthalsgrundel'],
    ['f65','Amurgrundel','amurgrundel'],
    ['f87','Flussneunauge','flussneunauge'],
    ['f88','Meerneunauge','meerneunauge'],
    ['c10','Gemeine Strandkrabbe','gemeine-strandkrabbe'],
    ['c11','Nordseegarnele','nordseegarnele'],
    ['c13','Taschenkrebs','taschenkrebs']
  ].map(([id,name,file])=>({id,name,url:new URL(file+'.webp',document.baseURI).href}));
  const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('de-DE');
  const identify=s=>SPECIES.find(v=>norm(v.name)===norm(s));
  const checks=new Map();
  const imageOk=item=>{
    if(!checks.has(item.id))checks.set(item.id,new Promise(resolve=>{
      const i=new Image(); i.onload=()=>resolve(true);i.onerror=()=>resolve(false);i.src=item.url;
    }));
    return checks.get(item.id);
  };
  function makeHost(){
    const div=document.createElement('div');
    div.className='photo-host photo-ai petri-local-photo';
    const body=document.createElement('div');body.className='photo-content';
    const image=document.createElement('img'); image.loading='lazy';body.append(image);
    const info=document.createElement('div');info.className='photo-info';
    const credit=document.createElement('span');credit.className='photo-credit';info.append(credit);
    div.append(body,info);
    return div;
  }
  async function apply(place,item){
    if(!place||!item)return;
    const available=await imageOk(item);
    if(!available||!place.isConnected)return;
    let host=place.querySelector('.photo-host');
    if(!host){host=makeHost();if(place.classList.contains('fish-card'))place.prepend(host);else place.append(host);}
    let body=host.querySelector('.photo-content');
    if(!body){body=document.createElement('div');body.className='photo-content';host.prepend(body);}
    let image=body.querySelector('img');
    if(!image){image=document.createElement('img');image.loading='lazy';body.append(image);}
    host.classList.add('photo-ai','petri-local-photo');
    if(image.getAttribute('src')!==item.url){
      image.removeAttribute('srcset');image.src=item.url;
    }
    image.alt=item.name+' – KI-Beispielbild (keine sichere Artbestimmung)';
    const placeholder=host.querySelector('.photo-placeholder');if(placeholder)placeholder.hidden=true;
    for(const oldLink of host.querySelectorAll('.photo-source'))oldLink.remove();
    let credit=host.querySelector('.photo-credit');
    if(!credit){
      let info=host.querySelector('.photo-info');
      if(!info){info=document.createElement('div');info.className='photo-info';host.append(info);}
      credit=document.createElement('span');credit.className='photo-credit';info.prepend(credit);
    }
    const notice='KI-generiertes Beispielbild · nicht zur sicheren Artbestimmung';
    if(credit.textContent!==notice)credit.textContent=notice;
  }
  function scan(){
    const main=document.getElementById('main');if(!main)return;
    // Repair old app.js hero-logo URL without changing any existing layout.
    const logo=main.querySelector('.hero > img');
    if(logo){
      const original=logo.getAttribute('src')||'';
      if(/(?:^|\/)assets\/petri-logo\.webp(?:\?.*)?$/.test(original))
        logo.src=new URL('petri-logo.webp',document.baseURI).href;
    }
    for(const card of main.querySelectorAll('.fish-card')){
      const label=card.querySelector('.fish-card-top h3')||card.querySelector('h3');
      const item=identify(label?.textContent);
      if(item)void apply(card,item);
    }
    const detail=main.querySelector('.species-detail-image');
    if(detail){
      const titles=Array.from(main.querySelectorAll('h1,h2,h3')).map(x=>x.textContent);
      const item=titles.map(identify).find(Boolean);
      if(item)void apply(detail,item);
    }
    // Dynamic app.js 2.0.4 is preserved; show 2.0.6 accurately in the visible UI.
    for (const el of document.querySelectorAll('.sidebar .tiny,#app-update-card')) {
      if(!el.dataset.petri206VersionChecked){
        el.dataset.petri206VersionChecked='yes';
        if(el.classList.contains('tiny')) el.textContent=el.textContent.replace(/2\.0\.[45]/g,'2.0.6');
        if(el.id==='app-update-card'){
          for(const node of el.querySelectorAll('h1,h2,h3,strong,span')){
            if(node.children.length===0 && /Version 2\.0\.[45]/.test(node.textContent))
              node.textContent=node.textContent.replace(/2\.0\.[45]/g,'2.0.6');
          }
        }
      }
    }
    // The info text refers to 70 images embedded in app.js. Distinguish the
    // additional 10 separately bundled WebP files rather than calling them embedded.
    const box=main.querySelector('#real-photo-settings');
    if(box && !box.querySelector('.petri-additional-images-notice')){
      const note=document.createElement('p');note.className='petri-additional-images-notice';
      note.textContent='Zusätzlich zu den 70 eingebetteten Bildern sind 20 zusätzliche KI-Artenbilder als lokale WebP-Dateien verfügbar. Nach dem ersten vollständigen Laden stehen sie über den Offline-Cache bereit.';
      note.style.cssText='font-size:13px;line-height:1.55;color:#bbef69';
      box.append(note);
    }
  }
  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;requestAnimationFrame(()=>{queued=false;scan()});
  }
  function showUpdateStatus(button,message){
    const card=button.closest('#app-update-card')||button.parentElement;
    if(!card)return;
    let own=card.querySelector('#petri206-update-status');
    if(!own){own=document.createElement('p');own.id='petri206-update-status';own.setAttribute('role','status');
      own.style.cssText='margin:10px 0;color:#bbef69;font-size:13px;line-height:1.5;white-space:normal';
      button.insertAdjacentElement('afterend',own);
    }
    own.textContent=message;
    // Remove stale error messages from the previous checker when possible.
    for(const e of card.querySelectorAll('span,small,div,p')){
      if(e===own || e.contains(own) || e.children.length)continue;
      if(/Update nicht bereit:\s*Load failed/i.test(e.textContent||''))e.textContent='Update-Status: siehe Prüfung oben.';
    }
  }
  function cmp(a,b){
    const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);
    if(x.length!==3||y.length!==3||x.some(n=>!Number.isFinite(n))||y.some(n=>!Number.isFinite(n)))return null;
    for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]>y[i]?1:-1;
    return 0;
  }
  async function checkUpdate(button){
    if(location.protocol!=='https:' && location.hostname!=='localhost'){
      showUpdateStatus(button,'Update-Prüfung nur in der online veröffentlichten HTTPS-App möglich.');return;
    }
    showUpdateStatus(button,'Prüfe version.json …');
    try{
      const u=new URL('version.json',document.baseURI);u.searchParams.set('t',String(Date.now()));
      const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),12000);
      let response;
      try{response=await fetch(u.href,{cache:'no-store',signal:ctrl.signal});}
      finally{clearTimeout(timeout);}
      if(!response.ok)throw new Error('HTTP '+response.status);
      const info=await response.json();
      const result=cmp(info.version,VERSION);
      if(result===null)throw new Error('ungültige Versionsangabe');
      if(result>0)showUpdateStatus(button,'Eine neuere Version '+info.version+' ist gemeldet. Vor der Installation die vollständigen Dateien prüfen.');
      else if(result===0)showUpdateStatus(button,'Version '+VERSION+' ist aktuell. 70 integrierte und 20 zusätzliche lokale KI-Bilder.');
      else showUpdateStatus(button,'App '+VERSION+' installiert; Server meldet noch '+info.version+'. Veröffentlichung prüfen.');
    }catch(e){showUpdateStatus(button,'Update-Prüfung fehlgeschlagen ('+(e.name==='AbortError'?'Zeitüberschreitung':e.message)+'). HTTPS-Verbindung und version.json prüfen.');}
  }
  // Capturing prevents an older delegated click handler from re-triggering its
  // expensive/fragile release-file load and overwriting the new status.
  document.addEventListener('click',event=>{
    const btn=event.target instanceof Element?event.target.closest('button'):null;
    if(!btn||!btn.closest('#app-update-card')||!norm(btn.textContent).includes('update suchen'))return;
    event.preventDefault();event.stopImmediatePropagation();
    void checkUpdate(btn);
  },true);
  function start(){
    const main=document.getElementById('main');if(!main)return;
    new MutationObserver(schedule).observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
