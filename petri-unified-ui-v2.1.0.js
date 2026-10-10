/* Petri Heil Pro 2.1.0 - gemeinsame UI-Verwaltung. Kein Datenbankzugriff, kein Loeschen. */
(()=>{
'use strict';
const normal=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/\s+/g,' ').trim().toLowerCase();
const root=new URL('./',document.currentScript?.src||document.baseURI);
const picture=file=>new URL(file,root).href;
const mappings=Object.freeze({"Spinnrute":"gear-spinnrute.webp","Feederrute":"gear-feederrute.webp","Fliegenrute":"gear-fliegenrute.webp","Teleskoprute":"gear-korkrute.webp","Stipprute":"gear-korkrute.webp","Posenrute":"gear-korkrute.webp","Matchrute":"gear-korkrute.webp","Karpfenrute":"gear-karpfenrute.webp","Grundrute":"gear-karpfenrute.webp","Brandungsrute":"gear-karpfenrute.webp","Spinnrolle":"gear-spinnrolle.webp","Stationärrolle":"gear-spinnrolle.webp","Baitcastrolle":"gear-baitcastrolle.webp","Baitcaster":"gear-baitcastrolle.webp","Multirolle":"gear-baitcastrolle.webp","Multi-Rolle":"gear-baitcastrolle.webp","Angelschnur":"gear-angelschnur.webp","Monofile Schnur":"gear-angelschnur.webp","Monofilschnur":"gear-angelschnur.webp","Fluorocarbon":"gear-angelschnur.webp","Geflochtene Schnur":"gear-vorfach-haken.webp","Stahlvorfach":"gear-vorfach-haken.webp","Vorfachmaterial":"gear-vorfach-haken.webp","Vorfach":"gear-vorfach-haken.webp","Gummierter Kescher":"gear-teleskopkescher.webp","Unterfangkescher":"gear-teleskopkescher.webp","Kescher":"gear-teleskopkescher.webp","Klappkescher":"gear-teleskopkescher.webp","Setzkescher":"gear-setzkescher.webp","Pose":"gear-posen.webp","Posen":"gear-posen.webp","Wobbler":"gear-wobbler.webp","Crankbait":"gear-wobbler.webp","Blinker":"gear-kunstkoeder-sortiment.webp","Spinner":"gear-kunstkoeder-sortiment.webp","Kunstköder":"gear-kunstkoeder-sortiment.webp","Gummifisch":"gear-gummifische.webp","Gummiköder":"gear-gummifische.webp","Twister":"gear-gummifische.webp","Softbait":"gear-gummifische.webp","Jigkopf":"gear-jigkoepfe.webp","Jigköpfe":"gear-jigkoepfe.webp","Jighead":"gear-jigkoepfe.webp","Köder-Set":"gear-koeder-set.webp","Köderset":"gear-koeder-set.webp","Abhakmatte":"gear-abhakmatte.webp","Maßband & Waage":"gear-massband-waage.webp","Hakenlöser & Zange":"gear-hakenloeser-zange.webp","Haken":"gear-haken-und-zubehoer.webp","Wirbel":"gear-haken-und-zubehoer.webp","Karabiner":"gear-haken-und-zubehoer.webp","Bissfestes Vorfach":"gear-bissfestes-vorfach.webp","Boilie":"gear-boilie.webp","Mais & Teig":"gear-mais-teig.webp","Würmer & Maden":"gear-wuermer-maden.webp","Pilker & Paternoster":"gear-pilker-paternoster.webp","Rettungsweste":"gear-rettungsweste.webp"});
const byName=new Map(Object.entries(mappings).map(([name,file])=>[normal(name),file]));
const credit='KI-generiertes Beispielbild · weißer Hintergrund';
const pike=picture('petri-fisch-v2.0.29.webp');
const logo=picture('petri-marke-v2.0.29.webp');
  const drawings={
    home:'<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/><path d="M9 21v-8h6v8"/>',
    trophy:'<path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4a2 2 0 0 0 2 6h2M17 6h3a2 2 0 0 1-2 6h-2"/>',
    book:'<path d="M12 7c-2-2-5-2-9-2v14c4 0 7 0 9 2"/><path d="M12 7c2-2 5-2 9-2v14c-4 0-7 0-9 2M12 7v14"/>',
    scale:'<path d="M12 3v18M5 6h14M3 21h18"/><path d="m5 6-3 7h6L5 6Zm14 0-3 7h6l-3-7Z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    chart:'<path d="M3 21h18M6 18v-6h4v6M11 18V6h4v12M16 18v-9h4v9"/>',
    rod:'<path d="m3 21 15-17m-3-1 6 6"/><path d="M16 6c2 3 4 5 4 8v3"/><path d="M17 18c0 2-3 2-3 0"/><circle cx="6" cy="18" r="2"/>',
    map:'<path d="M4 6 10 3l5 3 5-3v15l-5 3-5-3-6 3V6Z"/><path d="M10 3v15m5-12v15"/><circle cx="12.5" cy="10" r="2"/>',
    settings:'<path d="M9.7 2h4.6l.5 2.4 1.6.7 2.1-1.4 3.2 3.2-1.4 2.1.7 1.6 2.4.5v4.6l-2.4.5-.7 1.6 1.4 2.1-3.2 3.2-2.1-1.4-1.6.7-.5 2.4H9.7l-.5-2.4-1.6-.7-2.1 1.4-3.2-3.2 1.4-2.1-.7-1.6L.6 14.3V9.7L3 9.2l.7-1.6-1.4-2.1 3.2-3.2 2.1 1.4 1.6-.7.5-2.4Z" transform="translate(1.4 1.4) scale(.87)"/><circle cx="12" cy="12" r="3"/>',
    more:'<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>'
  };
  const keys=[
    [/backup|einstellungen/i,'settings'],
    [/spots|routen/i,'map'],
    [/ausrüstung|ausruestung|köder/i,'rod'],
    [/schonzeiten|maße|masse/i,'scale'],
    [/angelschein/i,'book'],
    [/trophäen|trophaeen|meine/i,'trophy'],
    [/statistik/i,'chart'],
    [/angelzeit|uhr/i,'clock'],
    [/übersicht|uebersicht/i,'home'],
    [/^mehr$/i,'more']
  ];
function keyFor(label){
  if(/fischkunde|angelzentrale/i.test(label))return null;
  for(const [check,key] of keys)if(check.test(label))return key;
  return null;
}
function updateBrand(){
  const brand=document.querySelector('#sidebar .brand');
  if(brand){
    brand.classList.add('petri-marke29');
    let image=brand.querySelector('img.petri-marke29-bild');
    if(!image){image=document.createElement('img');image.className='petri-marke29-bild';brand.replaceChildren(image)}
    if(image.src!==logo)image.src=logo;
    image.alt='Petri Heil Pro';image.width=300;image.height=125;
  }
  const hero=document.querySelector('#main .hero > img');
  if(hero){hero.classList.add('petri-fisch29-hero');if(hero.src!==pike)hero.src=pike}
  const sidebarFish=document.querySelector('#sidebar .side-bottom > img');
  if(sidebarFish){sidebarFish.classList.add('petri-fisch29-promo');if(sidebarFish.src!==pike)sidebarFish.src=pike}
}
function markFish(el){
  if(!el||el.classList.contains('petri-fisch29-icon'))return;
  el.classList.add('petri-fisch29-icon');
  el.textContent='';el.setAttribute('aria-hidden','true');el.removeAttribute('aria-label');
}
function updateNavigation(){
  for(const id of ['nav-desktop','nav-bottom']){
    const nav=document.getElementById(id);if(!nav)continue;
    for(const button of nav.querySelectorAll('button')){
      const label=(button.textContent||'').replace(/\s+/g,' ').trim();
      let glyph=button.querySelector('.ico,.petri-gear27-icon,.petri-fisch29-icon');
      if(/fischkunde/i.test(label)){
        if(!glyph){glyph=document.createElement('span');glyph.className='ico';button.prepend(glyph)}
        markFish(glyph);continue;
      }
      const key=keyFor(label);if(!key)continue;
      if(!glyph){glyph=document.createElement('span');glyph.className='ico';button.prepend(glyph)}
      if(glyph.dataset.petri21Icon===key&&glyph.querySelector('svg'))continue;
      glyph.classList.remove('petri-fisch29-icon','petri-gear27-icon','petri44-line-icon');
      glyph.classList.add('petri21-icon');
      glyph.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">'+drawings[key]+'</svg>';
      glyph.dataset.petri21Icon=key;glyph.setAttribute('aria-hidden','true');
    }
  }
}
function updateGear(){
 const main=document.getElementById('main');if(!main)return;
 for(const card of main.querySelectorAll('.gear-card')){
   let file=null,name=null;
   for(const h of card.querySelectorAll('h2,h3,h4')){
     const found=byName.get(normal(h.textContent));
     if(found){file=found;name=h.textContent.trim();break}
   }
   if(file)applyPhoto(card,file,name);
 }
 for(const modal of document.querySelectorAll('#modal-root .modal')){
   const h=modal.querySelector('.modal-head h2,.modal-head h3');if(!h)continue;
   const file=byName.get(normal(h.textContent));
   if(!file)continue;
   const host=modal.querySelector('.gear-detail-image,.photo-host,.detail-image,.modal-body');
   if(host)applyPhoto(host,file,h.textContent.trim());
 }
}
function applyPhoto(card,file,title){
 let host=card.classList.contains('photo-host')?card:card.querySelector('.photo-host');
 if(!host){host=document.createElement('div');host.className='photo-host';card.prepend(host)}
 // Vorhandene individuell hochgeladene Bilder nicht ersetzen.
 const img=host.querySelector('.photo-content img');
 const src=picture(file);
 const own=img&&(/^(blob:|data:)/i.test(img.getAttribute('src')||'')||host.dataset.customPhoto==='true');
 if(own)return;
 if(host.dataset.petri21File===file&&img?.src===src&&!host.querySelector('.photo-placeholder,.photo-source'))return;
 const wrapper=document.createElement('div');wrapper.className='photo-content';
 const photo=document.createElement('img');photo.src=src;photo.alt=title+' – KI-generiertes Beispielbild auf weißem Hintergrund';photo.loading='lazy';photo.decoding='async';
 wrapper.append(photo);
 const info=document.createElement('div');info.className='photo-info';
 const caption=document.createElement('span');caption.className='photo-credit';caption.textContent=credit;info.append(caption);
 host.replaceChildren(wrapper,info);host.classList.add('photo-ai','petri21-photo');
 host.dataset.petri21File=file;
}
let pending=false;
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;updateBrand();updateNavigation();updateGear()})}
function begin(){
 schedule();
 const roots=['sidebar','main','modal-root','nav-desktop','nav-bottom'].map(id=>document.getElementById(id)).filter(Boolean);
 const observer=new MutationObserver(schedule);
 for(const node of roots)observer.observe(node,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
 window.addEventListener('load',()=>{
   const supplemental=['gear-bissfestes-vorfach.webp','gear-boilie.webp','gear-mais-teig.webp','gear-wuermer-maden.webp','gear-pilker-paternoster.webp','gear-rettungsweste.webp'];
   if('serviceWorker' in navigator)navigator.serviceWorker.ready.then(reg=>reg.active?.postMessage({type:'PREFETCH_IMAGES'})).catch(()=>{});
   if(navigator.onLine)for(const path of supplemental)fetch(picture(path),{cache:'force-cache'}).catch(()=>{});
 },{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',begin,{once:true});else begin();
})();
