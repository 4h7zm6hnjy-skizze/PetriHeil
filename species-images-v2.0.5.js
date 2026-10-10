/* Petri Heil Pro 2.0.24: 172 distinct local WebP references, 177 species mappings, modal image and logo-themed design repair.
   Original 70 embedded illustrations and local user data remain unchanged.
   Images are illustrative, NOT validated for species identification. */
(()=>{
  'use strict';
  const VERSION='2.0.24';
  // Apply the brand palette independent of ServiceWorker-injected HTML.
  // In particular, iOS Safari may keep an older navigation response cached.
  (function installOceanTheme(){
    const tag=document.getElementById('petri-ocean-theme-inline');
    if(tag) return;
    const style=document.createElement('style');
    style.id='petri-ocean-theme-inline';
    style.textContent="/* PetriHeil Pro 2.0.21 — helles Ozean-Design passend zum Petri-Heil-Logo.\n   Nur Farben, Oberflaechen und Kontraste; keine Positions- oder Funktionsaenderungen. */\n:root {\n  --bg:#e8f4fc;\n  --nav:#093760;\n  --panel:#ffffff;\n  --panel2:#f0f8fd;\n  --edge:#cadfec;\n  --sub:#56748a;\n  --white:#16344e;\n  --muted:#5c7487;\n  --accent:#087fbe;\n  --a2:#0573b0;\n  --gold:#b67e18;\n  --silver:#4f7489;\n  --bronze:#a56b3e;\n  --red:#b94947;\n  --card:#ffffff;\n  --shadow:0 10px 30px rgba(5,47,83,.10);\n  color-scheme:light;\n}\nhtml { background:#e8f4fc; }\nbody { background:linear-gradient(155deg,#e9f7ff 0%,#f7fbff 54%,#e8f3fb 100%); color:#173850; }\n::selection { background:#b8e6fb;color:#09385d; }\nbutton:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:3px solid #128ccd;outline-offset:2px}\n/* Existing navigation structure retained */\n.sidebar { background:linear-gradient(180deg,#063254 0%,#0a4673 100%);color:#edf9ff;border-right:1px solid #1d6592; }\n.brand strong,.brand strong span {color:#f9fdff}\n.brand small {color:#b9e3f8}\n.brand-mark {background:#f6fcff;color:#006ba9;box-shadow:0 3px 13px #003e6b33}\n.sidebar-meta {background:#0c537f;border:1px solid #397baa;color:#d6f4ff}\n.status-dot {background:#7bd6ff;box-shadow:0 0 9px #52d1ff}\n.side-heading,.tiny {color:#b9d9ec}\n.nav button {color:#d7ecf9}\n.nav button:hover {background:#206391;color:#fff}\n.nav button.active {color:#fff;background:#147db6;border-left:3px solid #f4c954}\n.side-bottom {border-color:#2b6b96;background:#f7fbff;color:#15344b}\n.side-bottom p {color:#123c5b}\n.side-bottom small {color:#54738a}\n.side-bottom img {background:#fff}\n.side-cta {border:1px solid #69b9e7;color:#eefaff;background:#07578c}\n.topbar {background:rgba(255,255,255,.78);border-bottom:1px solid #d1e4ef}\n.topbar h1,h1,h2,h3,h4 {color:#173951}\n.eyebrow {color:#0679bd}\n.network-tag {background:#e5f8ee;border:1px solid #b6dec7;color:#176449}\n.foot-note {border-top:1px solid #c9dce9;color:#627f90}\n/* Bright, recognizable brand surfaces */\n.hero {background:linear-gradient(115deg,#d9f2ff 0%,#eefaff 54%,#f3f9ff 100%);border:1px solid #add5ec;box-shadow:0 8px 24px #0b5e9320}\n.hero:before {border-color:#1690d31e}\n.hero h2 {color:#0d3554}\n.hero p {color:#46687c}\n.hero .hero-label,.hero strong {color:#0076b5}\n.hero img {background:#fff;border:5px solid #fff;box-shadow:0 10px 35px #1365992e}\n.card,.metric,.rank,.trophy,.gear-card,.fish-card {background:#ffffff;color:#193b53;border-color:#c9dfea;box-shadow:0 4px 16px #125b7b0c}\n.card:hover,.fish-card:hover,.trophy:hover {border-color:#70b7da}\n.metric .label,.metric .sub,.mini-label,.muted,.small,.soft,.rank .place,.rank .foot,.section-head p {color:#56738a!important}\n.metric.highlight {background:linear-gradient(145deg,#dcf4ff,#b8e5f8);color:#123c59;border-color:#8bc8e8}\n.metric.highlight .label,.metric.highlight .sub,.metric.highlight .value em {color:#285b73}\n.notice {background:#e4f5fc;border:1px solid #b6dcec;color:#244d67}\n.warning {background:#fff7e3;border:1px solid #e0c58c;color:#6d4a1a}\n.danger-notice {background:#fff0ec;border-color:#e4a9a1;color:#913f37}\n.pill {background:#e7f3fa;border:1px solid #b5d6e9;color:#285a75}\n.pill-lime {background:#e9f5dd;border-color:#b9d5a4;color:#446421}\n.pill-gold {background:#fff3d8;border-color:#e8d08d;color:#7d560f}\n.pill-red {background:#fff0eb;border-color:#e8c1b4;color:#9a4840}\n/* Buttons remain where they are, but get consistent bright-blue affordances */\n.button {border-color:#b1cfdf;box-shadow:0 2px 5px #074b790a}\n.button-primary {background:linear-gradient(135deg,#0688c9,#04699e);color:white;border-color:#0675b2}\n.button-primary:hover {filter:brightness(1.07)}\n.button-outline {background:#f3faff;color:#056da8;border-color:#83b9d5}\n.button-ghost,.icon-button {background:#ecf6fc;color:#195378;border-color:#bdd7e7}\n.button-danger {background:#fff0ee;color:#a9423d;border-color:#dcaaa4}\n.text-button,.accent {color:#0576b7}\n/* Forms, filters, tables */\n.field label {color:#31566d}\n.control,.searchbar {background:#fff;color:#16374f;border:1px solid #bfd8e7}\n.control::placeholder {color:#7792a4}\n.control:focus,.searchbar:focus-within {border-color:#128dcc;box-shadow:0 0 0 3px #64bfea26}\n.control[type=date],.control[type=datetime-local] {color-scheme:light}\n.searchbar span {color:#52788d}\n.filter-pills button {background:#ecf6fb;color:#45687e;border:1px solid #c2dcea}\n.filter-pills button.active {background:#067db9;color:white;border-color:#067db9}\n.table th {background:#e7f4fb;color:#3b6178}\n.table td {border-bottom:1px solid #dae8f1;color:#23475e}\n.divider {background:#cce0ec}\n/* Fish knowledge overview & gallery */\n.fish-card {background:#fff;color:#16344d;border:1px solid #bbd8e8}\n.fish-card h3,.fish-card-top h3 {color:#173a53}\n.fish-card em,.fish-card-top em {color:#56758a}\n.fish-icon {background:linear-gradient(145deg,#e9f8ff,#d5effc);border-color:#b2d9ec;color:#0b7ebd}\n.fish-card-footer {background:#f0f8fd;border-top:1px solid #d0e6f1;color:#537184}\n.fish-card-footer strong {color:#006da9}\n.photo-host {background:#fff;border-color:#d0e2ed}\n.photo-content,.photo-content img,.fish-card .photo-content img,.species-detail-image .photo-content img,.gear-card .photo-content img {background:#fff!important}\n.photo-placeholder {color:#577a8e;background:#f4faff}\n.photo-camera {color:#77a9c9}\n.photo-info {background:#f6fbff;color:#547185;border-top:1px solid #e2edf4}\n.photo-credit {color:#4f7188}\n.photo-source {color:#0875b2}\n.fish-art {background:#fff}\n.species-detail-image img {background:#fff;border-color:#c4deec}\n.species-detail-image figcaption {color:#537285}\n/* Detail modal: light, spacious surfaces, preserved sizes and positioning */\n.modal-overlay {background:rgba(6,41,68,.56);backdrop-filter:blur(6px)}\n.modal {background:#fff;color:#173a52;border:1px solid #b4d5e5;box-shadow:0 20px 80px #03304b48}\n.modal-head {background:linear-gradient(110deg,#e4f6ff,#f8fcff);border-bottom:1px solid #c8e2ef}\n.modal-head h2 {color:#113d5d}\n.modal-body {color:#264c64}\n.modal-actions {background:#f8fcff}\n.modal .card,.modal .notice {box-shadow:none}\n/* Trophy, statistics and secondary surfaces */\n.trophy {background:#fff;color:#1a3a51}\n.trophy-cover {background:#e7f4fc}\n.trophy .numbers {color:#0672b0}\n.rank {background:linear-gradient(135deg,#ffffff,#eff8fd)}\n.rank.gold {border-color:#dfc582}\n.rank.silver {border-color:#b6d1dc}\n.rank.bronze {border-color:#d4b49a}\n.clock-circle {background:radial-gradient(circle,#e1f7ff 0%,#f5fbff 65%);border-color:#68b8dd;box-shadow:0 0 60px #8ad6ff30}\n.time-clock {color:#123c5b}\n/* Phone bottom menu: recognizable logo blue, strong active contrast */\n.bottom-nav {background:linear-gradient(110deg,#08365c,#0b517c);border-top:1px solid #2b729b;box-shadow:0 -4px 18px #0b3a5428}\n.bottom-nav button {color:#d1e5f3}\n.bottom-nav button.active {color:#fff;background:#116da4}\n.bottom-nav button .ico {color:inherit}\n/* Misc controls */\n.versions-detail summary {color:#086fa9}\n#toast {background:#0a79b9;color:#fff}\n#app-update-card .petri-additional-images-notice,#petri214-update-status {color:#096ea7!important}\n@media (max-width:850px) {\n  .mobile-shade.open {background:#0a2b4d99}\n  .sidebar {background:linear-gradient(180deg,#093459,#0c537c)}\n  .bottom-nav button.active {background:#0e70a9;color:#fff}\n}\n\n\n/* PetriHeil 2.0.23 - iPhone: obere Navigation immer erreichbar.\n   Viewport-fit=cover wird durch iOS safe area Insets beruecksichtigt.\n   Desktop-Layout und untere Navigation unveraendert. */\n@media screen and (max-width: 850px) {\n  .workspace { overflow: visible; }\n  .workspace > .topbar {\n    position: sticky;\n    top: 0;\n    z-index: 42;\n    min-height: 76px;\n    width: 100%;\n    padding: calc(10px + env(safe-area-inset-top, 0px)) 14px 11px;\n    gap: 9px;\n    display: flex;\n    align-items: center;\n    background: rgba(247, 252, 255, .98);\n    border-bottom: 1px solid #b7d8ea;\n    box-shadow: 0 4px 20px rgba(12, 71, 109, .16);\n    -webkit-backdrop-filter: blur(12px);\n    backdrop-filter: blur(12px);\n  }\n  .workspace > .topbar #menu-toggle {\n    display: inline-flex !important;\n    align-items: center;\n    justify-content: center;\n    position: relative;\n    z-index: 2;\n    flex: 0 0 48px;\n    width: 48px;\n    height: 48px;\n    min-width: 48px;\n    min-height: 48px;\n    padding: 0;\n    font-size: 22px;\n    pointer-events: auto !important;\n    touch-action: manipulation;\n    -webkit-tap-highlight-color: transparent;\n  }\n  .workspace > .topbar .header-title {\n    flex: 1 1 auto;\n    min-width: 0;\n    overflow: hidden;\n    pointer-events: none;\n  }\n  .workspace > .topbar #crumb {\n    display: block;\n    font-size: 9px;\n    letter-spacing: .9px;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n  }\n  .workspace > .topbar #page-title {\n    font-size: clamp(18px, 5vw, 23px);\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n  }\n  .workspace > .topbar .header-actions {\n    flex: 0 0 auto;\n    gap: 6px;\n    min-width: 0;\n    position: relative;\n    z-index: 2;\n  }\n  .workspace > .topbar .network-tag { display: none; }\n  .workspace > .topbar .top-add {\n    min-height: 46px;\n    padding: 10px 11px;\n    font-size: 12px;\n    line-height: 1.15;\n    white-space: nowrap;\n    pointer-events: auto !important;\n    touch-action: manipulation;\n    -webkit-tap-highlight-color: transparent;\n  }\n  .sidebar {\n    padding-top: calc(24px + env(safe-area-inset-top, 0px));\n    max-height: 100dvh;\n    overflow-y: auto;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n@media screen and (max-width: 365px) {\n  .workspace > .topbar { padding-left: 9px; padding-right: 9px; gap: 6px; }\n  .workspace > .topbar .top-add { padding: 9px 8px; font-size: 11px; }\n  .workspace > .topbar #crumb { letter-spacing: .2px; font-size: 8px; }\n}\n";
    document.head.appendChild(style);
    document.documentElement.dataset.petriTheme='ocean-2.0.24';
  })();

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
    ['c13','Taschenkrebs','taschenkrebs'],
    ['f25','Meerforelle','meerforelle-neu'],
    ['f71','Atlantischer Stör','atlantischer-stoer-neu'],
    ['f72','Europäischer Stör','europaeischer-stoer'],
    ['f89','Donau-Neunauge','donau-neunauge'],
    ['s19','Stintdorsch','stintdorsch'],
    ['s36','Kleines Petermännchen','kleines-petermaennchen'],
    ['s39','Lippfisch (Goldmaid)','lippfisch-goldmaid'],
    ['s41','Gefleckter Lippfisch','gefleckter-lippfisch'],
    ['s56','Meeräsche (Dicklippige)','meeraesche-dicklippige'],
    ['s57','Meeräsche (Dünnlippige)','meeraesche-duennlippige'],
    ['s37','Seehase','seehase'],
    ['s38','Seewolf (Gestreifter)','seewolf-gestreifter'],
    ['s40','Kuckuckslippfisch','kuckuckslippfisch'],
    ['s42','Großer Scheibenbauch','grosser-scheibenbauch'],
    ['s43','Europäischer Butterfisch','europaeischer-butterfisch'],
    ['s44','Aalmutter','aalmutter'],
    ['s45','Seestichling','seestichling'],
    ['s46','Grasnadel','grasnadel'],
    ['s47','Große Seenadel','grosse-seenadel'],
    ['s50','Seepferdchen (Langschnäuziges)','seepferdchen-langschnauziges'],
    ['s48','Kleine Seenadel','kleine-seenadel'],
    ['s49','Schlangennadel','schlangennadel'],
    ['s51','Seepferdchen (Kurzschnäuziges)','seepferdchen-kurzschnauziges'],
    ['s52','Schwarzgrundel','schwarzgrundel'],
    ['s53','Sandgrundel','sandgrundel'],
    ['s54','Strandgrundel','strandgrundel'],
    ['s55','Fleckengrundel','fleckengrundel'],
    ['s58','Goldstrieme','goldstrieme'],
    ['s59','Meerbrasse','meerbrasse'],
    ['s61','Hai (Kleingefleckter Katzenhai)','hai-kleingefleckter-katzenhai'],
    ['s62','Dornhai','dornhai'],
    ['s64','Heringshai','heringshai'],
    ['s65','Nagelrochen','nagelrochen'],
    ['s66','Sternrochen','sternrochen'],
    ['s67','Glattrochen','glattrochen'],
    ['f41','Zope','zope'],
    ['f42','Zobel','zobel'],
    ['f43','Zährte','zaehrte'],
    ['f44','Frauennerfling','frauennerfling'],
    ['f45','Strömer','stroemer'],
    ['f46','Perlfisch','perlfisch'],
    ['f47','Stromgründling','stromgruendling'],
    ['f50','Donau-Steinbeißer','donau-steinbeisser'],
    ['f56','Schwarzer Zwergwels','schwarzer-zwergwels'],
    ['f58','Schwarzbarsch','schwarzbarsch'],
    ['f59','Groppe (Rheingebiet)','groppe-rheingebiet'],
    ['f66','Hundsfisch','hundsfisch'],
    ['f67','Ostasiatischer Schlammpeitzger','ostasiatischer-schlammpeitzger'],
    ['f74','Schnäpel','schnaepel'],
    ['f75','Große Maräne','grosse-maraene'],
    ['f76','Kleine Maräne','kleine-maraene'],
    ['f77','Blaufelchen','blaufelchen'],
    ['f78','Gangfisch','gangfisch'],
    ['f79','Kilch','kilch'],
    ['f80','Ammersee-Kaulbarsch','ammersee-kaulbarsch'],
    ['f81','Schrätzer','schraetzer'],
    ['f82','Streber','streber'],
    ['f83','Zingel','zingel'],
    ['f84','Ziege','ziege'],
    ['f85','Mairenke','mairenke'],
    ['s69','Meerforelle (Küste)','meerforelle-neu'],
    ['s70','Atlantischer Lachs (Küste)','lachs'],
    ['s71','Aal (Küste)','aal'],
    ['s72','Flussneunauge (Küste)','flussneunauge'],
    ['s73','Meerneunauge (Küste)','meerneunauge'],
    ['s10','Wittling','wittling'],
    ['s11','Schellfisch','schellfisch'],
    ['s12','Seelachs / Köhler','seelachs-koehler'],
    ['s13','Pollack','pollack'],
    ['s14','Seehecht','seehecht'],
    ['s15','Leng','leng'],
    ['s17','Franzosendorsch','franzosendorsch'],
    ['s18','Zwergdorsch','zwergdorsch'],
    ['s4','Europäische Sardelle','europaeische-sardelle'],
    ['s6','Stöcker','stoecker'],
    ['s23','Seezunge','seezunge'],
    ['s25','Glattbutt','glattbutt'],
    ['s27','Rotzunge','rotzunge'],
    ['s26','Heilbutt','heilbutt'],
    ['s28','Doggerscharbe','doggerscharbe'],
    ['s29','Zwergzunge','zwergzunge'],
    ['s30','Seeskorpion','seeskorpion'],
    ['s31','Langstacheliger Seeskorpion','langstacheliger-seeskorpion'],
    ['s32','Knurrhahn rot','knurrhahn-rot'],
    ['s33','Grauer Knurrhahn','grauer-knurrhahn'],
    ['s16','Lumb','lumb'],
    ['s34','Roter Knurrhahn','roter-knurrhahn'],
    ['s63','Hundshai','hundshai'],
    ['s68','Kuckucksrochen','kuckucksrochen'],
    ['c3','Dohlenkrebs','dohlenkrebs'],
    ['c2','Steinkrebs','steinkrebs'],
    ['c1','Edelkrebs','edelkrebs-ki-weiss'],
    ['c5','Signalkrebs','signalkrebs-ki-weiss'],
    ['c4','Kamberkrebs','kamberkrebs-ki-weiss'],
    ['c6','Roter Amerikanischer Sumpfkrebs','roter-amerikanischer-sumpfkrebs'],
    ['s20','Plattfisch Scholle','scholle-ki-weiss'],
    ['s21','Flunder','flunder-ki-weiss'],
    ['s22','Kliesche','kliesche-ki-weiss'],
    ['s24','Steinbutt','steinbutt-ki-weiss'],
    ['s1','Atlantischer Hering','hering-ki-weiss'],
    ['s2','Sprotte','sprotte-ki-weiss'],
    ['s3','Europäische Sardine','sardine-ki-weiss'],
    ['s5','Makrele','makrele-ki-weiss'],
    ['s7','Hornhecht','hornhecht-ki-weiss'],
    ['s8','Wolfsbarsch','wolfsbarsch-ki-weiss'],
    ['c7','Marmorkrebs','marmorkrebs-ki-weiss'],
    ['c8','Kaisergranat','kaisergranat-ki-weiss'],
    ['c14','Galizischer Sumpfkrebs','galizischer-sumpfkrebs-ki-weiss'],
    ['f1','Hecht','hecht'],
    ['f2','Zander','zander'],
    ['f3','Flussbarsch','flussbarsch'],
    ['f4','Kaulbarsch','kaulbarsch'],
    ['f5','Wels','wels'],
    ['f6','Europäischer Aal','aal'],
    ['f7','Quappe','quappe'],
    ['f8','Karpfen','karpfen'],
    ['f9','Graskarpfen','graskarpfen'],
    ['f10','Silberkarpfen','silberkarpfen'],
    ['f11','Marmorkarpfen','marmorkarpfen'],
    ['f12','Schleie','schleie'],
    ['f13','Brasse','brasse'],
    ['f14','Güster','guester'],
    ['f15','Rotauge','rotauge'],
    ['f16','Rotfeder','rotfeder'],
    ['f17','Aland','aland'],
    ['f18','Döbel','doebel'],
    ['f19','Rapfen','rapfen'],
    ['f20','Barbe','barbe'],
    ['f21','Nase','nase'],
    ['f22','Äsche','aesche'],
    ['f23','Bachforelle','bachforelle'],
    ['f24','Seeforelle','seeforelle'],
    ['f26','Regenbogenforelle','regenbogenforelle'],
    ['f27','Bachsaibling','bachsaibling'],
    ['f28','Seesaibling','seesaibling'],
    ['f29','Huchen','huchen'],
    ['f30','Atlantischer Lachs','lachs'],
    ['f31','Karausche','karausche'],
    ['f34','Gründling','gruendling'],
    ['f35','Hasel','hasel'],
    ['f36','Laube','laube'],
    ['f37','Elritze','elritze'],
    ['f38','Moderlieschen','moderlieschen'],
    ['f39','Bitterling','bitterling'],
    ['f40','Schneider','schneider'],
    ['f48','Bachschmerle','bachschmerle'],
    ['f49','Steinbeißer','steinbeisser'],
    ['f51','Schlammpeitzger','schlammpeitzger'],
    ['f52','Koppe / Groppe','koppe'],
    ['f55','Zwergwels','zwergwels'],
    ['f57','Sonnenbarsch','sonnenbarsch'],
    ['f60','Marmorierte Grundel','marmorierte-grundel'],
    ['f69','Maifisch','maifisch'],
    ['f70','Finte','finte'],
    ['s9','Dorsch / Kabeljau','dorsch'],
    ['s60','Goldbrasse','goldbrasse'],
    ['s74','Europäischer Seeteufel','seeteufel'],
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
    if(!host){
      host=makeHost();
      if(place.classList.contains('fish-card'))place.prepend(host);
      else place.replaceChildren(host);
    }
    if(place.classList.contains('species-detail-image')){
      // No old external photograph may precede the species-specific local image.
      for(const n of Array.from(place.children))if(n!==host)n.remove();
    }
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
    // Species detail overlays live under #modal-root, NOT inside #main.
    // Resolve the exact scientific species card title from the active modal,
    // then use the same local WebP path as the overview card.
    const modalRoot=document.getElementById('modal-root');
    if(modalRoot){
      for(const modal of modalRoot.querySelectorAll('.modal')){
        const detail=modal.querySelector('.species-detail-image');
        if(!detail)continue;
        const heading=modal.querySelector('.modal-head h2') || modal.querySelector('h2');
        const item=identify(heading?.textContent);
        if(item)void apply(detail,item);
      }
    }
    // Dynamic app.js 2.0.4 is preserved; show 2.0.21 accurately in the visible UI.
    for (const el of document.querySelectorAll('.sidebar .tiny,#app-update-card')) {
      if(!el.dataset.petri214VersionChecked){
        el.dataset.petri214VersionChecked='yes';
        if(el.classList.contains('tiny')) el.textContent=el.textContent.replace(/2\.0\.(?:[4-9]|1[0-9]|20)\b/g,'2.0.21');
        if(el.id==='app-update-card'){
          for(const node of el.querySelectorAll('h1,h2,h3,strong,span')){
            if(node.children.length===0 && /Version 2\.0\.(?:[4-9]|1[0-9]|20)\b/.test(node.textContent))
              node.textContent=node.textContent.replace(/2\.0\.(?:[4-9]|1[0-9]|20)\b/g,'2.0.21');
          }
        }
      }
    }
    // The info text refers to 70 images embedded in app.js. Distinguish the
    // additional 92 distinct local WebP references rather than calling them embedded.
    const box=main.querySelector('#real-photo-settings');
    if(box && !box.querySelector('.petri-additional-images-notice')){
      const note=document.createElement('p');note.className='petri-additional-images-notice';
      note.textContent='Zusätzlich zu den 70 eingebetteten Bildern sind 172 unterschiedliche lokale WebP-Bilder verfügbar. Alle 177 Arteinträge besitzen eine eigene Bildzuordnung (Küstenvarianten verwenden teilweise dieselbe Artdatei). Nach dem ersten vollständigen Laden stehen sie offline bereit.';
      note.style.cssText='font-size:13px;line-height:1.55;color:var(--accent)';
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
    let own=card.querySelector('#petri214-update-status');
    if(!own){own=document.createElement('p');own.id='petri214-update-status';own.setAttribute('role','status');
      own.style.cssText='margin:10px 0;color:var(--accent);font-size:13px;line-height:1.5;white-space:normal';
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
      else if(result===0)showUpdateStatus(button,'Version '+VERSION+' ist aktuell. 70 eingebettete Bilder, 172 unterschiedliche lokale WebP-Bilder und 177 Artzuordnungen.');
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
    const observer=new MutationObserver(schedule);
    observer.observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
    const modalRoot=document.getElementById('modal-root');
    if(modalRoot)observer.observe(modalRoot,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
