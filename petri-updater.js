/* Petri Heil Pro – stabiler, versionsunabhängiger Update-Client ab 2.3.0.
   Kein automatischer Austausch vorhandener Worker, keine Speicherlöschung.
   Zielversion und Worker-Datei werden immer frisch von version.json gelesen. */
(() => {
  'use strict';
  if (window.__petriUpdaterInitialized) return;
  window.__petriUpdaterInitialized = true;
  const BASE = new URL('./', document.currentScript?.src || document.baseURI);
  const $ = id => document.getElementById(id);
  const version = v => /^\d+\.\d+\.\d+$/.test(String(v || '')) ? String(v) : null;
  const cmp = (a, b) => {
    const p=version(a)?.split('.').map(Number),q=version(b)?.split('.').map(Number);
    if (!p || !q) return null;
    for(let i=0;i<3;i++)if(p[i]!==q[i])return Math.sign(p[i]-q[i]);
    return 0;
  };
  const loadedVersion = () => {
    const meta=document.querySelector('meta[name="petri-app-version"]')?.content;
    const side=document.querySelector('#sidebar .tiny')?.textContent?.match(/\b\d+\.\d+\.\d+\b/)?.[0];
    return version(meta)||version(side)||'unbekannt';
  };
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  let working=false, latestInfo=null, lastMessage='', lastInstallError='';
  function message(text){
    lastMessage=String(text);
    for(const id of ['petri-update-status','petri-repair-status']){
      const el=$(id);if(el)el.textContent=lastMessage;
    }
  }
  function disable(value){
    working=value;
    for(const id of ['petri-install','petri-refresh','petri-check','petri-repair-install','petri-repair-check']){
      const el=$(id);if(el)el.disabled=value;
    }
  }
  async function fetchLatest(){
    const url=new URL('version.json',BASE);
    url.searchParams.set('nocache',String(Date.now()));
    const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),15000);
    try{
      const resp=await fetch(url,{cache:'no-store',signal:ctrl.signal});
      if(!resp.ok)throw Error('Versionsdatei: HTTP '+resp.status);
      const json=await resp.json();
      if(!version(json.version))throw Error('Die Serverversion ist ungültig.');
      // Allow only relative local worker paths, never arbitrary external URLs.
      const worker=String(json.serviceWorker||'sw.js');
      if(!/^[a-zA-Z0-9._-]+\.js$/.test(worker))throw Error('Ungültiger Update-Pfad.');
      latestInfo={version:json.version,worker};
      return latestInfo;
    }finally{clearTimeout(timer)}
  }
  async function workerVersion(worker,wait=1600){
    if(!worker||typeof MessageChannel==='undefined')return null;
    return new Promise(resolve=>{
      const channel=new MessageChannel();let done=false;
      const finish=v=>{if(done)return;done=true;clearTimeout(timer);channel.port1.close();resolve(version(v)?v:null)};
      const timer=setTimeout(()=>finish(null),wait);
      channel.port1.onmessage=e=>finish(e.data?.version);
      try{worker.postMessage({type:'PETRI_GET_WORKER_VERSION'},[channel.port2])}catch{finish(null)}
    });
  }
  // Fortschritt stammt aus dem NEU installierenden Worker; die vorhandene App bleibt bedienbar.
  function onWorkerMessage(evt){
    const data=evt.data||{};
    if(data.type==='PETRI_INSTALL_PROGRESS' && data.version){
      message('Offline-Dateien '+data.done+'/'+data.total+' geladen (Version '+data.version+').');
    }else if(data.type==='PETRI_INSTALL_FAILURE'){
      lastInstallError=String(data.error||'Unbekannter Fehler');
      message('Offline-Installation fehlgeschlagen: '+lastInstallError);
    }
  }
  async function activeRegistration(){return 'serviceWorker' in navigator ? navigator.serviceWorker.getRegistration(BASE.href) : null}
  async function check(){
    if(working)return;
    if(!navigator.onLine){message('Keine Internetverbindung: Serverversion nicht prüfbar.');return}
    disable(true);message('Prüfe Server, App und Offline-Worker …');
    try{
      const info=await fetchLatest();const r=await activeRegistration();
      const installed=await workerVersion(r?.active||navigator.serviceWorker.controller);
      const newer=cmp(info.version,loadedVersion());
      if(newer>0)message('Geladene App '+loadedVersion()+' · Server '+info.version+' · Offline-Worker '+(installed||'nicht bestätigt')+'. Bitte Update installieren.');
      else if(installed && cmp(installed,info.version)>=0)message('App '+loadedVersion()+' · Offline-Worker '+installed+' · Server '+info.version+'. Aktuell.');
      else message('App '+loadedVersion()+' · Server '+info.version+' · Offline-Worker '+(installed||'nicht verfügbar')+'. Installation prüfen.');
      if($('petri-repair-server'))$('petri-repair-server').textContent=info.version;
    }catch(e){message('Prüfung fehlgeschlagen: '+(e.message||String(e)))}finally{disable(false)}
  }
  async function install(){
    if(working)return;
    if(!navigator.onLine){message('Für die Installation wird Internet benötigt.');return}
    if(!('serviceWorker' in navigator)){message('Dieser Browser unterstützt keine Offline-Installation. Bitte Safari verwenden.');return}
    if(location.protocol!=='https:'&&location.hostname!=='localhost'){
      message('Die Offline-Installation erfordert HTTPS.');return;
    }
    lastInstallError='';
    disable(true);message('Ermittle die aktuelle Serverversion …');
    try{
      const info=await fetchLatest();
      if(!window.confirm('Petri Heil Pro '+info.version+' installieren? Nicht gespeicherte Eingaben vorher sichern. Lokale Fangdaten und Fotos bleiben unangetastet.')){
        message('Installation abgebrochen.');return;
      }
      message('Lade Offline-Dateien für Version '+info.version+' …');
      const swURL=new URL(info.worker,BASE);
      const reg=await navigator.serviceWorker.register(swURL.href,{scope:BASE.href,updateViaCache:'none'});
      // Registration triggers an update check. An additional update may fail
      // transiently during first install; activation is the authoritative result.
      try{await Promise.race([reg.update(),sleep(17000).then(()=>{throw Error('Update-Check zu langsam')})])}catch{}
      const start=Date.now();let installed=null;
      while(Date.now()-start<45000){
        if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});
        installed=await workerVersion(reg.active,1200);
        if(installed&&cmp(installed,info.version)>=0)break;
        if(reg.installing?.state==='redundant')throw Error(lastInstallError||'Offline-Installation abgebrochen. Bitte erneut versuchen.');
        await sleep(450);
      }
      if(!installed||cmp(installed,info.version)<0)throw Error(lastInstallError||'Neuer Offline-Worker noch nicht aktiv. Bitte Reparaturseite benutzen.');
      message('Version '+installed+' installiert. Öffne die neue App …');
      const target=new URL('index.html',BASE);
      target.searchParams.set('petri_refresh',info.version+'-'+Date.now());
      location.replace(target.href);
    }catch(e){message('Installation fehlgeschlagen: '+(e?.message||String(e))+'. Falls nötig die Reparaturseite öffnen.');}
    finally{disable(false)}
  }
  function reload(){
    const url=new URL('index.html',BASE);url.searchParams.set('petri_refresh',Date.now());location.replace(url.href);
  }
  function attachCard(){
    const card=$('app-update-card');if(!card)return;
    const versionText=loadedVersion();
    for(const node of card.querySelectorAll('h2,h3,h4,strong')){
      if(node.children.length===0&&/^Version\s+\d+\.\d+\.\d+$/.test(node.textContent.trim()))node.textContent='Version '+versionText;
    }
    for(const old of card.querySelectorAll('#petri-28-install-tools,#petri-40-update-controls,#petri21-tools'))old.remove();
    let panel=$('petri-stable-update');
    if(!panel){
      panel=document.createElement('section');panel.id='petri-stable-update';
      panel.style.cssText='margin:12px 0;display:flex;flex-wrap:wrap;align-items:center;gap:9px';
      const create=(id,label,cls)=>{const b=document.createElement('button');b.type='button';b.id=id;b.textContent=label;b.className='button '+cls;b.style.minHeight='44px';return b};
      const status=document.createElement('p');status.id='petri-update-status';status.setAttribute('role','status');status.style.cssText='width:100%;font-size:13px;line-height:1.5;color:#245777';status.textContent=lastMessage||'App-Version '+versionText+'. Bitte Version prüfen.';
      const repair=document.createElement('a');repair.href=new URL('update-rettung.html',BASE).href;repair.textContent='Update-Reparatur öffnen';repair.style.cssText='display:block;width:100%;color:#0573b0;font-weight:700';
      panel.append(create('petri-check','Version prüfen','button-outline'),create('petri-install','Update installieren','button-primary'),create('petri-refresh','Neu laden','button-outline'),status,repair);
      const details=card.querySelector('details');
      if(details)details.before(panel);else card.append(panel);
    }
    // Hide previous stale status rows, but retain the release notes.
    for(const node of card.querySelectorAll('button')){
      if(node.closest('#petri-stable-update'))continue;
      if(/^(?:↻|⟳)?\s*(?:updates? suchen|version prüfen)$/i.test(node.textContent.trim())){node.hidden=true;node.style.setProperty('display','none','important');}
    }
    for(const node of card.querySelectorAll('b,strong,span,small')){
      if(node.children.length||node.textContent?.trim()!=='Update-Status'||node.closest('#petri-stable-update'))continue;
      if(node.parentElement&&node.parentElement!==card)node.parentElement.hidden=true;
    }
  }
  function handleClick(ev){
    const button=ev.target instanceof Element?ev.target.closest('button'):null;
    if(!button)return;
    if(['petri-check','petri-install','petri-refresh','petri-repair-install','petri-repair-check'].includes(button.id)){
      ev.preventDefault();ev.stopImmediatePropagation();
      if(button.id.includes('check'))void check();else if(button.id.includes('refresh'))reload();else void install();
    }
  }
  function start(){
    document.addEventListener('click',handleClick,true);
    if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('message',onWorkerMessage);
    attachCard();
    if($('petri-repair-install'))void check();
    const main=$('main');
    if(main){let waiting=false;new MutationObserver(()=>{
      if(waiting)return;waiting=true;requestAnimationFrame(()=>{waiting=false;attachCard()});
    }).observe(main,{childList:true,subtree:true});}
    // No automatic register()/update() when an older version is installed.
    // This avoids continually reinstalling an old worker from a cached client.
  }
  window.PetriUpdater={check,install,workerVersion,loadedVersion};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
