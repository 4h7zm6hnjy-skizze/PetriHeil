/* Petri Heil Pro 2.0.29 – controlled transparent logo placement.
   Preserves existing fish images, fishing log, navigation and user data. */
(()=>{
  'use strict';
  const pike=new URL('petri-fisch-v2.0.29.webp',document.baseURI).href;
  const mark=new URL('petri-marke-v2.0.29.webp',document.baseURI).href;
  function brand(){
    const container=document.querySelector('#sidebar .brand');
    if(!container)return;
    if(!container.classList.contains('petri-marke29')){
      container.replaceChildren();
      container.classList.add('petri-marke29');
    }
    let img=container.querySelector('img.petri-marke29-bild');
    if(!img){
      img=document.createElement('img');
      img.className='petri-marke29-bild';
      img.alt='Petri Heil Pro – by Marcel Hentschel';
      img.width=300;img.height=125;
      container.append(img);
    }
    if(img.src!==mark)img.src=mark;
  }
  function hero(){
    const logo=document.querySelector('#main .hero > img');
    if(logo){
      if(logo.src!==pike)logo.src=pike;
      logo.classList.add('petri-fisch29-hero');
      logo.alt='Petri Heil – freistehender Hecht mit Köder';
    }
    const sidebarLogo=document.querySelector('#sidebar .side-bottom > img');
    if(sidebarLogo){
      if(sidebarLogo.src!==pike)sidebarLogo.src=pike;
      sidebarLogo.classList.add('petri-fisch29-promo');
      sidebarLogo.alt='Petri Heil – freistehender Hecht';
    }
  }
  function fishkunde(el){
    if(!el)return;
    if(!el.classList.contains('petri-fisch29-icon')){
      el.classList.add('petri-fisch29-icon');
      // Keep the navigation button itself intact; change only its decorative glyph.
      el.textContent='';
      el.setAttribute('aria-hidden','true');
      el.removeAttribute('aria-label');
    }
  }
  function icons(scope){
    if(!scope)return;
    // Former Fischkunde icon inserted by previous media patch.
    for(const el of scope.querySelectorAll('.petri-gear27-icon,.petri-hecht-icon'))fishkunde(el);
    // Real Pisces characters – NOT text-only navigation labels or unrelated icons.
    for(const el of scope.querySelectorAll('span,i,em,b,strong,div')){
      if(el.children.length || el.classList.contains('petri-fisch29-icon'))continue;
      const val=(el.textContent||'').replace(/\uFE0F/g,'').trim();
      if(val==='♓' || val==='🐟')fishkunde(el);
    }
    // Existing navigation may use an SVG/text combination. Match only the Fishkunde button.
    for(const nav of scope.querySelectorAll('#nav-bottom,#nav-desktop,.bottom-nav,.nav')){
      for(const button of nav.querySelectorAll('button')){
        if(!/fischkunde/i.test(button.textContent||''))continue;
        const ic=button.querySelector('.ico, .petri-gear27-icon, .petri-fisch29-icon');
        if(ic)fishkunde(ic);
      }
    }
  }
  let queued=false;
  function scan(){brand();hero();icons(document)}
  function schedule(){
    if(queued)return;
    queued=true;requestAnimationFrame(()=>{queued=false;scan()});
  }
  function start(){
    scan();
    const ob=new MutationObserver(schedule);
    for(const element of ['sidebar','main','nav-bottom','nav-desktop'].map(id=>document.getElementById(id)).filter(Boolean)){
      ob.observe(element,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
