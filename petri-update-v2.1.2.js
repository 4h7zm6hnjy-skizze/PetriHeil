/* Compatibility bridge for cached Petri Heil 2.1.2 pages.
   Do not auto-install or re-register the old versioned worker. */
(()=>{if(window.__petriUpdaterInitialized)return;
 const tag=document.createElement('script');tag.src=new URL('./petri-updater.js?v=2.1.5',document.currentScript?.src||document.baseURI).href;
 tag.defer=true;document.head.append(tag);
})();
