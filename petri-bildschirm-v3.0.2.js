/* Petri Heil Pro 3.0.2: block accidental pinch and double-tap page zoom.
 * One-finger scrolling, buttons, file selection and ordinary inputs remain usable.
 * The browser/operating system can override this for accessibility.
 */
(()=>{
  'use strict';
  if(window.__petriScreenSize302) return;
  window.__petriScreenSize302 = true;
  const stop = e => { if(e.cancelable) e.preventDefault(); };
  for(const eventName of ['gesturestart','gesturechange','gestureend']) {
    document.addEventListener(eventName, stop, {passive:false,capture:true});
  }
  document.addEventListener('touchmove',e=>{
    if(e.touches && e.touches.length>1) stop(e);
  },{passive:false,capture:true});
  document.addEventListener('dblclick',e=>{
    // Prevent mobile double-tap magnification, but preserve mouse double-click.
    if(matchMedia('(pointer:coarse)').matches) stop(e);
  },{passive:false,capture:true});
  document.addEventListener('wheel',e=>{
    // Trackpad pinch is commonly represented as ctrl+wheel on desktop.
    if(e.ctrlKey) stop(e);
  },{passive:false,capture:true});
})();
