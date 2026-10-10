/* Petri Heil Pro 2.0.27: corrective local image integration for the gear/tackle page.
   Cards are matched by their own titles, not their section headers. */
(()=>{
  'use strict';
  const assetMap={"Spinnrute":"gear-spinnrute.webp","Feederrute":"gear-feederrute.webp","Fliegenrute":"gear-fliegenrute.webp","Teleskoprute":"gear-korkrute.webp","Stipprute":"gear-korkrute.webp","Posenrute":"gear-korkrute.webp","Matchrute":"gear-korkrute.webp","Karpfenrute":"gear-karpfenrute.webp","Grundrute":"gear-karpfenrute.webp","Brandungsrute":"gear-karpfenrute.webp","Spinnrolle":"gear-spinnrolle.webp","Stationärrolle":"gear-spinnrolle.webp","Baitcastrolle":"gear-baitcastrolle.webp","Baitcaster":"gear-baitcastrolle.webp","Multirolle":"gear-baitcastrolle.webp","Multi-Rolle":"gear-baitcastrolle.webp","Angelschnur":"gear-angelschnur.webp","Monofile Schnur":"gear-angelschnur.webp","Monofilschnur":"gear-angelschnur.webp","Fluorocarbon":"gear-angelschnur.webp","Geflochtene Schnur":"gear-vorfach-haken.webp","Stahlvorfach":"gear-vorfach-haken.webp","Vorfachmaterial":"gear-vorfach-haken.webp","Vorfach":"gear-vorfach-haken.webp","Gummierter Kescher":"gear-teleskopkescher.webp","Unterfangkescher":"gear-teleskopkescher.webp","Kescher":"gear-teleskopkescher.webp","Klappkescher":"gear-teleskopkescher.webp","Setzkescher":"gear-setzkescher.webp","Pose":"gear-posen.webp","Posen":"gear-posen.webp","Wobbler":"gear-wobbler.webp","Crankbait":"gear-wobbler.webp","Blinker":"gear-kunstkoeder-sortiment.webp","Spinner":"gear-kunstkoeder-sortiment.webp","Kunstköder":"gear-kunstkoeder-sortiment.webp","Gummifisch":"gear-gummifische.webp","Gummiköder":"gear-gummifische.webp","Twister":"gear-gummifische.webp","Softbait":"gear-gummifische.webp","Jigkopf":"gear-jigkoepfe.webp","Jigköpfe":"gear-jigkoepfe.webp","Jighead":"gear-jigkoepfe.webp","Köder-Set":"gear-koeder-set.webp","Köderset":"gear-koeder-set.webp","Haken":"gear-haken-und-zubehoer.webp","Wirbel":"gear-haken-und-zubehoer.webp","Karabiner":"gear-haken-und-zubehoer.webp"};
  const normal=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/\s+/g,' ').trim().toLowerCase();
  const exact=new Map(Object.entries(assetMap).map(([name,file])=>[normal(name),file]));
  const base=new URL('./',document.currentScript?.src||document.baseURI);
  const resolveFile=file=>new URL(file,base).href;
  const icon=resolveFile('icon-fischkunde-hecht.webp');
  const prefix='KI-generiertes Beispielbild · weißer Hintergrund';
  function styleOnce(){
    if(document.getElementById('petri-gear27-style'))return;
    const s=document.createElement('style');s.id='petri-gear27-style';
    s.textContent=`
      .gear-card .petri-gear27-photo .photo-content{background:#fff!important;min-height:165px;display:flex;align-items:center;justify-content:center}
      .gear-card .petri-gear27-photo img{display:block!important;width:100%;height:210px;max-height:210px;object-fit:contain!important;background:#fff!important}
      .gear-card .petri-gear27-photo .photo-info{background:#f6fbff!important;color:#56748a!important}
      .petri-gear27-icon{display:inline-block!important;width:25px!important;height:25px!important;min-width:25px!important;min-height:25px!important;background-image:url('${icon}')!important;background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important;text-indent:-9999px!important;overflow:hidden!important;font-size:0!important;line-height:0!important;color:transparent!important}
    `;
    document.head.append(s);
  }
  function getCardHeading(card){
    const candidates=card.querySelectorAll('h3,h4,h2');
    for(const h of candidates){const text=normal(h.textContent); if(exact.has(text))return h;}
    return null;
  }
  function applyImage(root,file,name){
    if(!root||!file)return;
    const src=resolveFile(file);
    let host=root.classList.contains('photo-host')?root:root.querySelector('.photo-host');
    if(!host){host=document.createElement('div');host.className='photo-host';root.prepend(host);}
    // Keep the original photo DOM when correctly mapped; replace it if an external photo service rewrites it.
    let body=host.querySelector('.photo-content');
    let photo=body?.querySelector('img');
    let credit=host.querySelector('.photo-credit');
    const correctlyMapped=host.dataset.petriGear27===file && photo && photo.getAttribute('src')===src && credit?.textContent===prefix && !host.querySelector('.photo-source,.photo-placeholder');
    if(correctlyMapped)return;
    const newBody=document.createElement('div');newBody.className='photo-content';
    const im=document.createElement('img');im.loading='lazy';im.decoding='async';im.src=src;im.alt=name+' – '+prefix;
    newBody.append(im);
    const info=document.createElement('div');info.className='photo-info';
    const span=document.createElement('span');span.className='photo-credit';span.textContent=prefix;info.append(span);
    host.replaceChildren(newBody,info);
    host.classList.add('petri-gear27-photo','photo-ai');
    host.dataset.petriGear27=file;
  }
  function patchGear(){
    const main=document.getElementById('main');if(!main)return;
    const cards=main.querySelectorAll('.gear-card');
    for(const card of cards){const heading=getCardHeading(card);if(!heading)continue;
      applyImage(card,exact.get(normal(heading.textContent)),heading.textContent.trim());
    }
    // Gear modal (when provided by existing app.js).
    const modals=document.querySelectorAll('#modal-root .modal');
    for(const modal of modals){
      const heading=modal.querySelector('.modal-head h2,.modal-head h3');
      if(!heading)continue; const file=exact.get(normal(heading.textContent)); if(!file)continue;
      const section=modal.querySelector('.gear-detail-image,.photo-host,.detail-image,.modal-body');
      if(section)applyImage(section,file,heading.textContent.trim());
    }
  }
  function patchTab(){
    // Only the Fishkunde navigation glyph, never text/content of other tabs.
    for(const nav of document.querySelectorAll('.bottom-nav,#nav-desktop,.nav')){
      for(const btn of nav.querySelectorAll('button')){
        if(!normal(btn.textContent).includes('fischkunde'))continue;
        const el=btn.querySelector('.ico')||[...btn.querySelectorAll('span')].find(x=>/[♓🐟]/.test(x.textContent||''));
        if(!el||el.classList.contains('petri-gear27-icon'))continue;
        el.textContent='';el.classList.add('petri-gear27-icon');el.setAttribute('aria-label','Hecht-Logo');
      }
    }
  }
  let pending=false;
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;patchGear();patchTab();});}
  function start(){styleOnce();schedule();
    const targets=[document.getElementById('main'),document.getElementById('modal-root'),document.getElementById('nav-bottom'),document.getElementById('nav-desktop')].filter(Boolean);
    const mo=new MutationObserver(schedule);
    for(const el of targets)mo.observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
