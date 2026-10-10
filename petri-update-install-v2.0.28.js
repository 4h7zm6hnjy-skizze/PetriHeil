/* Petri Heil Pro 2.0.28: Sichere PWA-Updateinstallation.
 * Aktualisiert ausschließlich App-Dateien per Service Worker nach GitHub-Veröffentlichung.
 * Bearbeitet weder Repository noch Nutzerfangdaten oder lokale Speicherung.
 */
(()=>{
  'use strict';
  const CURRENT='2.0.35';
  const compare=(a,b)=>{
    const parse=s=>String(s||'').match(/^\d+\.\d+\.\d+$/)?s.split('.').map(Number):null;
    const x=parse(a),y=parse(b);if(!x||!y)return null;
    for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]>y[i]?1:-1;
    return 0;
  };
  const siteRoot=new URL('./',document.baseURI);
  let busy=false;
  let availableVersion=null;
  let lastChecked=0;
  const timeout=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
  const getLatest=async()=>{
    const url=new URL('version.json',siteRoot);
    url.searchParams.set('check',String(Date.now()));
    const response=await fetch(url,{cache:'no-store'});
    if(!response.ok)throw Error('Serverantwort HTTP '+response.status);
    const data=await response.json();
    if(compare(data.version,CURRENT)===null)throw Error('Versionsdatei ist ungültig');
    availableVersion=data.version;lastChecked=Date.now();
    return data;
  };
  const area=()=>document.getElementById('petri-28-update-status');
  const show=(msg)=>{const el=area();if(el)el.textContent=msg;};
  function isSecure(){return location.protocol==='https:'||location.hostname==='localhost';}
  async function install(){
    if(busy)return;
    if(!navigator.onLine){show('Keine Internetverbindung. Für Updates muss die App online sein.');return;}
    if(!isSecure()){show('Für Updates ist eine HTTPS-Verbindung erforderlich.');return;}
    busy=true;
    const btn=document.getElementById('petri-28-install-button');
    if(btn)btn.disabled=true;
    try{
      show('Prüfe die veröffentlichte Version …');
      const latest=await getLatest();
      const newer=compare(latest.version,CURRENT);
      if(newer<=0){
        show(newer===0?'Version '+CURRENT+' ist bereits aktuell.':'Der Server meldet eine ältere Version. Kein Update installiert.');
        return;
      }
      if(!('serviceWorker' in navigator)){
        show('Diese Browseransicht unterstützt keine automatische Installation. Bitte die App in Safari neu öffnen.');
        return;
      }
      if(!window.confirm('Version '+latest.version+' installieren? Die App wird anschließend neu geladen. Bitte vorher ungespeicherte Eingaben sichern.')){
        show('Installation abgebrochen.');return;
      }
      show('Installiere Version '+latest.version+' …');
      // Only the published site assets may be installed. No GitHub write credentials required.
      const scope=new URL('./',siteRoot).href;
      let reg=await navigator.serviceWorker.getRegistration(scope);
      if(!reg){reg=await navigator.serviceWorker.register(new URL('sw.js',siteRoot).href,{scope,updateViaCache:'none'});}
      let changed=false;
      const controllerChange=new Promise(resolve=>{
        const handler=()=>{changed=true;navigator.serviceWorker.removeEventListener('controllerchange',handler);resolve(true)};
        navigator.serviceWorker.addEventListener('controllerchange',handler,{once:true});
        setTimeout(()=>{navigator.serviceWorker.removeEventListener('controllerchange',handler);resolve(false)},22000);
      });
      await reg.update();
      if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});
      if(reg.installing){
        await Promise.race([new Promise(resolve=>{
          const w=reg.installing;
          if(!w || w.state==='activated'||w.state==='redundant')return resolve();
          w.addEventListener('statechange',()=>{if(w.state==='activated'||w.state==='redundant')resolve();});
        }),timeout(17000)]);
      }
      if(!changed){await Promise.race([controllerChange,timeout(5000)]);}
      // Navigation is network-first under the service worker and refreshes the
      // app shell without clearing app data or the user's catch log.
      show('Aktualisierung angefordert. Die App wird neu geladen …');
      const destination=new URL(location.href);
      destination.searchParams.set('petri_aktualisierung',latest.version);
      location.replace(destination.href);
    }catch(err){
      show('Installation nicht abgeschlossen: '+(err&&err.message||String(err))+'. Internetverbindung und GitHub-Veröffentlichung prüfen.');
    }finally{busy=false;if(btn)btn.disabled=false;}
  }
  async function check(){
    if(busy)return;
    busy=true;
    const btn=document.getElementById('petri-28-install-button');
    try{
      show('Prüfe die neueste veröffentlichte Version …');
      const info=await getLatest();
      const state=compare(info.version,CURRENT);
      if(state>0){show('Version '+info.version+' ist verfügbar. Mit „Update installieren“ übernehmen.');if(btn)btn.disabled=false;}
      else if(state===0){show('Version '+CURRENT+' ist aktuell.');}
      else show('Die veröffentlichte Version '+info.version+' ist älter als '+CURRENT+'.');
    }catch(err){show('Updateprüfung fehlgeschlagen: '+(err&&err.message||String(err)));}
    finally{busy=false;}
  }
  function ensure(){
    const parent=document.getElementById('app-update-card');
    if(!parent || parent.querySelector('#petri-28-install-button'))return;
    const row=document.createElement('div');
    row.id='petri-28-install-tools';
    row.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:12px 0 2px';
    const installBtn=document.createElement('button');
    installBtn.id='petri-28-install-button';
    installBtn.className='button button-primary';
    installBtn.type='button';
    installBtn.textContent='Update installieren';
    installBtn.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();void install();});
    const checkBtn=document.createElement('button');
    checkBtn.className='button button-outline';
    checkBtn.type='button';
    checkBtn.textContent='Version prüfen';
    checkBtn.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();void check();});
    const status=document.createElement('p');status.id='petri-28-update-status';
    status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    status.style.cssText='font-size:13px;line-height:1.45;color:#265a76;width:100%;margin:0';
    status.textContent='Updates werden nach Veröffentlichung auf GitHub direkt in die Web-App geladen. Deine Fangdaten bleiben erhalten.';
    row.append(installBtn,checkBtn,status);
    const old=parent.querySelector('button');
    if(old)old.insertAdjacentElement('afterend',row);else parent.append(row);
  }
  let waiting=false;
  function schedule(){if(waiting)return;waiting=true;requestAnimationFrame(()=>{waiting=false;ensure();});}
  function start(){ensure();const main=document.getElementById('main');
    if(main){const observer=new MutationObserver(schedule);observer.observe(main,{childList:true,subtree:true});}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
