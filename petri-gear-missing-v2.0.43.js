/* Petri Heil Pro: targeted gear image completion, display hotfix 2.0.43.
 * Only six specified gear cards are changed. No local/user data is read or written.
 */
(()=>{
  'use strict';
  const files=Object.freeze({
    'Bissfestes Vorfach':'gear-bissfestes-vorfach.webp',
    'Boilie':'gear-boilie.webp',
    'Mais & Teig':'gear-mais-teig.webp',
    'Würmer & Maden':'gear-wuermer-maden.webp',
    'Pilker & Paternoster':'gear-pilker-paternoster.webp',
    'Rettungsweste':'gear-rettungsweste.webp'
  });
  const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/\s+/g,' ').trim().toLowerCase();
  const byName=new Map(Object.entries(files).map(([title,file])=>[norm(title),file]));
  const root=new URL('./',document.currentScript?.src||document.baseURI);
  const imageURL=file=>new URL(file,root).href;
  const credit='KI-generiertes Beispielbild · weißer Hintergrund';
  function addStyle(){
    if(document.getElementById('petri-gear43-style'))return;
    const style=document.createElement('style');style.id='petri-gear43-style';
    style.textContent=`
      .gear-card .petri-gear43-photo .photo-content{background:#fff!important;display:flex;align-items:center;justify-content:center;min-height:165px}
      .gear-card .petri-gear43-photo .photo-content img{display:block!important;width:100%;height:210px;max-height:210px;object-fit:contain!important;object-position:center;background:#fff!important}
      .gear-card .petri-gear43-photo .photo-info{background:#f6fbff!important;color:#46657d!important}
      .gear-card .petri-gear43-photo .photo-credit{color:#46657d!important;font-size:11px!important;line-height:1.4}
      .gear-card > p, .gear-card .gear-description {color:#47667b!important;}
      @media(max-width:600px){.gear-card .petri-gear43-photo .photo-content img{height:160px;max-height:160px}}
    `;
    document.head.append(style);
  }
  function titleOf(card){
    for(const h of card.querySelectorAll('h3,h4,h2')){
      const key=norm(h.textContent);
      if(byName.has(key))return {file:byName.get(key),name:h.textContent.trim()};
    }
    return null;
  }
  function replacePhoto(card, match){
    const {file,name}=match;
    const url=imageURL(file);
    let host=card.querySelector('.photo-host');
    if(!host){host=document.createElement('div');host.className='photo-host';card.prepend(host);}
    const current=host.querySelector('.photo-content img');
    if(host.dataset.petriGear43===file && current?.getAttribute('src')===url &&
       host.querySelector('.photo-credit')?.textContent===credit &&
       !host.querySelector('.photo-placeholder,.photo-source'))return;
    const body=document.createElement('div');body.className='photo-content';
    const img=document.createElement('img');img.src=url;img.loading='lazy';img.decoding='async';
    img.alt=name+' – KI-generiertes Beispielbild auf weißem Hintergrund';
    body.append(img);
    const info=document.createElement('div');info.className='photo-info';
    const caption=document.createElement('span');caption.className='photo-credit';caption.textContent=credit;
    info.append(caption);
    host.replaceChildren(body,info);
    host.classList.add('petri-gear43-photo','photo-ai');
    host.dataset.petriGear43=file;
  }
  let queued=false;
  function update(){
    queued=false;
    const main=document.getElementById('main');if(!main)return;
    for(const card of main.querySelectorAll('.gear-card')){
      const match=titleOf(card);
      if(match)replacePhoto(card,match);
    }
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(update);}
  function start(){
    addStyle();schedule();
    const main=document.getElementById('main');if(!main)return;
    const observer=new MutationObserver(schedule);
    observer.observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
    // Fetch each asset once while online: the existing service worker caches
    // same-origin requests, allowing all six images to work after going offline.
    window.addEventListener('load',()=>{
      if(navigator.onLine===false)return;
      for(const file of Object.values(files)){
        fetch(imageURL(file),{cache:'reload'}).catch(()=>{});
      }
    },{once:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
