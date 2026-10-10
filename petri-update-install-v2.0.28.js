/* Petri Heil Pro 2.0.42 – einheitlicher Versions- und Update-Dialog.
 * Die alte App schreibt ihre ursprüngliche Versionsnummer in das Einstellungen-HTML.
 * Dieses Modul zeigt stattdessen die tatsächlich geladene Release-Version an,
 * prüft die veröffentlichte Version und bestätigt einen Worker-Wechsel erst nach
 * Rückmeldung des aktiven Workers. Keine Benutzer-/Fangdaten werden verändert. */
(()=>{
  'use strict';
  const RELEASE='2.0.42';
  const ROOT=new URL('./',document.baseURI);
  let busy=false, queued=false, reported='';
  const $=id=>document.getElementById(id);
  const parse=x=>/^\d+\.\d+\.\d+$/.test(String(x||''))?String(x).split('.').map(Number):null;
  function compare(a,b){
    const aa=parse(a),bb=parse(b);if(!aa||!bb)return null;
    for(let i=0;i<3;i++)if(aa[i]!==bb[i])return aa[i]>bb[i]?1:-1;
    return 0;
  }
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const deadline=(task,ms,message)=>Promise.race([task,sleep(ms).then(()=>{throw Error(message);})]);
  function status(msg){
    reported=String(msg);
    const p=$('petri-40-update-status');if(p&&p.textContent!==reported)p.textContent=reported;
    const card=$('app-update-card');
    if(card){
      for(const node of card.querySelectorAll('span,small,p')){
        if(node.closest('#petri-40-update-controls'))continue;
        if(node.children.length===0&&/^(Noch nicht geprüft|Version nicht geprüft|Update noch nicht geprüft)$/.test((node.textContent||'').trim())){
          node.textContent='Siehe aktuellen Status oben';
        }
      }
    }
  }
  function fixCard(card){
    if(!card)return;
    const title=Array.from(card.querySelectorAll('h2,h3,h4,strong')).find(n=>/^Version\s+\d+\.\d+\.\d+\s*$/.test((n.textContent||'').trim()));
    if(title&&title.textContent!=='Version '+RELEASE)title.textContent='Version '+RELEASE;
    const oldCheck=Array.from(card.querySelectorAll('button')).find(n=>/^(?:↻|⟳)?\s*(?:update[s]? suchen|version prüfen)$/i.test((n.textContent||'').trim())&&!n.closest('#petri-40-update-controls'));
    if(oldCheck){oldCheck.dataset.petri40Check='1';if(oldCheck.textContent!=='Version prüfen')oldCheck.textContent='Version prüfen';}
    if(!$('petri-40-update-controls')){
      const panel=document.createElement('div');panel.id='petri-40-update-controls';panel.className='petri-40-update-controls';
      panel.style.cssText='display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin:12px 0 8px';
      const install=document.createElement('button');install.id='petri-40-install';install.type='button';install.className='button button-primary';install.textContent='Update installieren';install.style.cssText='min-height:44px';
      const refresh=document.createElement('button');refresh.id='petri-40-refresh';refresh.type='button';refresh.className='button button-outline';refresh.textContent='App neu laden';refresh.style.cssText='min-height:44px';
      const state=document.createElement('p');state.id='petri-40-update-status';state.setAttribute('role','status');state.setAttribute('aria-live','polite');state.style.cssText='width:100%;margin:3px 0;font-size:13px;line-height:1.5;color:#245777';state.textContent=reported||'Geladene App-Version: '+RELEASE+'. Offline-Version wird bei der nächsten Prüfung abgefragt.';
      panel.append(install,refresh,state);
      const oldRow=$('petri-28-install-tools');if(oldRow){oldRow.remove();}
      if(oldCheck)oldCheck.insertAdjacentElement('afterend',panel);
      else {const details=card.querySelector('details');if(details)details.before(panel);else card.append(panel);}
    }
    for(const legacy of card.querySelectorAll('#petri-28-install-tools'))legacy.remove();
    // The old update-status row belongs to the old, hard-coded checker.
    // Hide only that row; preserve the release-notes <details> beneath it.
    for(const leaf of card.querySelectorAll('b,strong,span,small')){
      if(leaf.children.length||leaf.closest('#petri-40-update-controls'))continue;
      if((leaf.textContent||'').trim()!=='Update-Status')continue;
      const oldRow=leaf.parentElement;
      if(oldRow&&oldRow!==card&&!oldRow.contains($('petri-40-update-controls')))oldRow.hidden=true;
    }
    // Stale update-information is displayed by the original app.js view, not by the SW.
    const installed=Array.from(card.querySelectorAll('p,small')).find(n=>n.children.length===0&&/Installierte Version auf diesem Gerät/.test(n.textContent||''));
    if(installed){const copy='Geladene App-Version: '+RELEASE+'. Die Offline-Version wird separat geprüft.';if(installed.textContent!==copy)installed.textContent=copy;}
  }
  function render(){fixCard($('app-update-card'));}
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});}
  function setBusy(value){busy=value;for(const id of ['petri-40-install','petri-40-refresh']){const b=$(id);if(b)b.disabled=value;}const btn=$('app-update-card')?.querySelector('[data-petri40-check]');if(btn)btn.disabled=value;}
  async function latestVersion(){
    const url=new URL('version.json',ROOT);url.searchParams.set('petri_check',String(Date.now()));
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await fetch(url.href,{cache:'no-store',signal:controller.signal});
      if(!response.ok)throw Error('HTTP '+response.status);
      const value=(await response.json()).version;
      if(!parse(value))throw Error('Die Versionsdatei enthält keine gültige Nummer.');
      return value;
    }catch(e){if(e?.name==='AbortError')throw Error('Server antwortet nicht innerhalb von 10 Sekunden.');throw e;}
    finally{clearTimeout(timer);}
  }
  async function workerVersion(worker,limit=1900){
    if(!worker||typeof MessageChannel==='undefined')return null;
    return new Promise(resolve=>{
      const channel=new MessageChannel();let done=false;
      const finish=x=>{if(done)return;done=true;clearTimeout(timer);channel.port1.close();resolve(x)};
      const timer=setTimeout(()=>finish(null),limit);
      channel.port1.onmessage=e=>finish(parse(e.data?.version)?e.data.version:null);
      try{worker.postMessage({type:'PETRI_GET_WORKER_VERSION'},[channel.port2]);}catch{finish(null);}
    });
  }
  async function getReg(){
    if(!('serviceWorker' in navigator))return null;
    return navigator.serviceWorker.getRegistration(ROOT.href);
  }
  async function check(){
    if(busy)return;
    if(!navigator.onLine){status('Keine Internetverbindung. Die Serverversion kann gerade nicht geprüft werden.');return;}
    setBusy(true);status('Prüfe die veröffentlichte Version …');
    try{
      const published=await latestVersion();
      const reg=await getReg();const worker=await workerVersion(navigator.serviceWorker?.controller||reg?.active);
      const result=compare(published,RELEASE);
      if(result>0)status('Geladen: '+RELEASE+' · Veröffentlicht: '+published+'. „Update installieren“ zum Aktualisieren verwenden.');
      else if(result<0)status('Geladen: '+RELEASE+' · Server: '+published+'. Veröffentlichung ist älter; kein Downgrade durchführen.');
      else if(worker&&compare(worker,RELEASE)<0)status('App-Dateien: '+RELEASE+' · Offline-Version: '+worker+'. Bitte „Update installieren“ auswählen.');
      else if(worker&&compare(worker,RELEASE)===0)status('Version '+RELEASE+' ist aktuell. App und Offline-Version stimmen überein.');
      else if(!reg)status('Version '+RELEASE+' ist aktuell. Offline-Installation auf dieser Browseransicht nicht nachweisbar.');
      else status('App-Dateien: '+RELEASE+' · Server: '+published+'. Der bisherige Offline-Worker meldet keine Versionsnummer; Aktualisierung ist möglich.');
    }catch(e){status('Prüfung nicht möglich: '+(e?.message||String(e))+'. Bitte Verbindung prüfen.');}
    finally{setBusy(false);}
  }
  async function waitForActivation(reg,target,limit){
    const started=Date.now();
    while(Date.now()-started<limit){
      if(reg.waiting){try{reg.waiting.postMessage({type:'SKIP_WAITING'});}catch{}}
      const active=navigator.serviceWorker?.controller||reg.active;
      const activeVersion=await workerVersion(active,750);
      if(activeVersion&&compare(activeVersion,target)>=0)return activeVersion;
      await sleep(500);
    }
    return null;
  }
  async function install(){
    if(busy)return;
    if(!navigator.onLine){status('Keine Internetverbindung. Bitte online gehen.');return;}
    if(location.protocol!=='https:'&&location.hostname!=='localhost'){status('Die Updateinstallation benötigt HTTPS.');return;}
    setBusy(true);status('Vergleiche App- und Server-Version …');
    try{
      const latest=await latestVersion(),diff=compare(latest,RELEASE);
      if(diff<0){status('Serverversion '+latest+' ist älter als die geladenen Dateien ('+RELEASE+'). Kein Downgrade.');return;}
      if(!('serviceWorker' in navigator)){status('Dieser Browser erlaubt hier keine Service-Worker-Installation. Bitte die App in Safari öffnen.');return;}
      let reg=await getReg();
      let worker=await workerVersion(navigator.serviceWorker.controller||reg?.active,1000);
      if(diff===0&&worker&&compare(worker,latest)===0){status('Version '+latest+' ist bereits installiert und aktiv. Kein Update nötig.');return;}
      const prompt='Version '+latest+(diff===0?' erneut für Offline-Nutzung aktivieren':' installieren')+'? Nicht gespeicherte Eingaben vorher sichern. Anschließend lädt die App neu.';
      if(!window.confirm(prompt)){status('Installation abgebrochen.');return;}
      status('Aktualisiere Offline-Dateien für Version '+latest+' …');
      if(!reg)reg=await deadline(navigator.serviceWorker.register(new URL('sw.js',ROOT).href,{scope:ROOT.href,updateViaCache:'none'}),14000,'Registrierung benötigt zu lange.');
      try{await deadline(reg.update(),15000,'Service-Worker-Aktualisierung benötigt zu lange.');}
      catch(e){const verified=await workerVersion(reg.active,800);if(!verified||compare(verified,latest)<0)throw e;}
      const confirmed=await waitForActivation(reg,latest,12000);
      if(!confirmed){status('Die neue Offline-Version konnte noch nicht bestätigt werden. Bitte in Safari neu öffnen und später erneut prüfen. Es wurden keine Fangdaten gelöscht.');return;}
      status('Offline-Version '+confirmed+' aktiviert. Lade die App neu …');
      const url=new URL(location.href);url.searchParams.set('petri_refresh',confirmed);location.replace(url.href);
    }catch(e){status('Update nicht abgeschlossen: '+(e?.message||String(e))+'. Bitte später erneut versuchen oder die App in Safari neu öffnen.');}
    finally{setBusy(false);}
  }
  function refresh(){
    if(busy)return;
    const url=new URL(location.href);url.searchParams.set('petri_refresh',RELEASE+'-'+Date.now());location.replace(url.href);
  }
  // Capture phase overrides the original delegated "Update suchen" handler.
  // That legacy handler otherwise checks a different hard-coded version.
  document.addEventListener('click',event=>{
    const button=event.target instanceof Element?event.target.closest('button'):null;
    if(!button)return;
    if(button.dataset.petri40Check==='1'&&button.closest('#app-update-card')){event.preventDefault();event.stopImmediatePropagation();void check();}
    else if(button.id==='petri-40-install'){event.preventDefault();event.stopImmediatePropagation();void install();}
    else if(button.id==='petri-40-refresh'){event.preventDefault();event.stopImmediatePropagation();refresh();}
  },true);
  function start(){render();const main=$('main');if(main){new MutationObserver(schedule).observe(main,{childList:true,subtree:true});}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
