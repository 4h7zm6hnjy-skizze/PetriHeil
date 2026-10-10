/* Petri Heil Pro · menu icons 2.0.44.
   Replaces only decorative icons in existing nav buttons; preserves all click actions.
   Fischkunde's pike logo and the Angelzentrale button remain untouched. */
(()=>{
  'use strict';
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
  function resolve(label){
    if(/fischkunde|angelzentrale/i.test(label))return null;
    for(const [test,key] of keys)if(test.test(label))return key;
    return null;
  }
  function iconMarkup(key){
    return '<svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">'+drawings[key]+'</svg>';
  }
  function patch(){
    for(const nav of [document.getElementById('nav-desktop'),document.getElementById('nav-bottom')]){
      if(!nav)continue;
      for(const button of nav.querySelectorAll('button')){
        const label=(button.textContent||'').replace(/\s+/g,' ').trim();
        const key=resolve(label);
        if(!key)continue;
        let glyph=button.querySelector('.ico');
        if(!glyph){ // Fallback for future app versions: add a separate icon without removing the label.
          glyph=document.createElement('span');glyph.className='ico';
          button.prepend(glyph);
        }
        if(glyph.dataset.petri44Icon===key&&glyph.querySelector('svg'))continue;
        glyph.innerHTML=iconMarkup(key);
        glyph.classList.add('petri44-line-icon');
        glyph.dataset.petri44Icon=key;
        glyph.setAttribute('aria-hidden','true');
      }
    }
  }
  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;patch();});
  }
  function init(){
    patch();
    const navs=[document.getElementById('nav-desktop'),document.getElementById('nav-bottom')].filter(Boolean);
    const observer=new MutationObserver(schedule);
    navs.forEach(el=>observer.observe(el,{childList:true,subtree:true}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
