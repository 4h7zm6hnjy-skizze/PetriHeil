/* Petri Heil Pro 3.2.0 — original SVG learning illustrations, entirely offline. */
(()=>{'use strict';
const D=window.PetriMontageData320;if(!D)return;
const STORE='petri320-lern-v1';const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=id=>document.getElementById(id);
let saved={favorites:[],progress:{}};try{saved={...saved,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{}
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(saved))}catch{}};
let tab=new URLSearchParams(location.search).get('tab')==='knoten'?'knoten':'montagen',selection=null;
function palette(){return {blue:'#70cafa',gold:'#e6a358',white:'#e8f6ff',fade:'#547b95'}}
function svgWrap(contents,desc='Schematische Lernzeichnung',view='0 0 540 300'){
return `<svg class="pm320-illustration" viewBox="${view}" role="img" aria-label="${esc(desc)}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x2="0" y2="1"><stop stop-color="#213e58"/><stop offset="1" stop-color="#0e2236"/></linearGradient><linearGradient id="water" x2="0" y2="1"><stop stop-color="#427d95"/><stop offset="1" stop-color="#244758"/></linearGradient></defs><rect width="540" height="300" fill="url(#bg)"/><rect x="0" y="176" width="540" height="124" fill="url(#water)" opacity=".49"/><path d="M0 176 Q35 169 70 176 T140 176 T210 176 T280 176 T350 176 T420 176 T490 176 T560 176" fill="none" stroke="#93bed0" opacity=".6" stroke-width="2"/>${contents}</svg>`}
const line=(d,color='#70cafa',width=4)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const lead=(x,y)=>`<path d="M${x} ${y} l-13 18 q-7 15 13 20 q20 -5 13 -20 z" fill="#cfdbdf" stroke="#ecf9ff" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4" fill="none" stroke="#e8f6ff" stroke-width="2"/>`;
const hook=(x,y)=>line(`M${x} ${y} v27 q2 25 18 22 q18 -3 15 -17 l-6 8`, '#e8f6ff',4);
const swivel=(x,y)=>`<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#f9ba6b" stroke-width="3"/><circle cx="${x}" cy="${y+19}" r="7" fill="none" stroke="#f9ba6b" stroke-width="3"/>`;
const bait=(x,y,type='fish')=> type==='fish'?`<path d="M${x-44} ${y}q33 -25 69 0 q-25 25 -69 0 l-20 -15 v30z" fill="#bedb72" stroke="#78bead" stroke-width="3"/><circle cx="${x+7}" cy="${y-4}" r="4" fill="#183348"/>`:`<ellipse cx="${x}" cy="${y}" rx="13" ry="9" fill="#d59c65" stroke="#f2c99a" stroke-width="2"/>`;
const pose=(x,y)=>`<path d="M${x} ${y+29}V${y-55}" stroke="#f5c36a" stroke-width="4"/><ellipse cx="${x}" cy="${y}" rx="11" ry="27" fill="#e45b4b" stroke="#fff3cc" stroke-width="2"/><path d="M${x-11} ${y}a11 27 0 0 1 22 0" fill="#fff"/>`;
function montageDrawing(id){const baseline=line('M28 55 H507'); const base=line('M265 56 Q280 111 295 165 Q305 212 340 241'); let draw='';
switch(id){
case 'laufblei':draw=baseline+line('M265 56 V109 Q268 153 300 190 V209')+lead(266,105)+swivel(300,194)+line('M300 220 Q323 235 339 226')+hook(339,226);break;
case 'lot':draw=baseline+line('M250 56 V260')+pose(250,161)+hook(250,212)+lead(250,252);break;
case 'hecht':draw=baseline+line('M265 55 Q298 88 317 119')+line('M317 119 L379 187','#c6d5dd',6)+swivel(317,118)+bait(418,194);break;
case 'nymphe':draw=line('M45 60 Q140 6 255 90 T380 168')+line('M380 168Q391 215 420 242')+bait(436,251,'nymph');break;
case 'pose':draw=baseline+line('M245 55 V274')+pose(245,161)+`<circle cx="245" cy="221" r="6" fill="#dce5e8"/><circle cx="245" cy="238" r="5" fill="#dce5e8"/>`+hook(245,243);break;
case 'feeder':draw=baseline+line('M215 55L265 175L316 198')+swivel(316,196)+line('M316 218 L364 220')+hook(364,221)+`<path d="M236 166 l20 -8 l14 41 l-20 8z" fill="#99784e" stroke="#edca8b" stroke-width="3"/>`+line('M240 168L267 200','#fee6c4',2);break;
case 'dropshot':draw=baseline+line('M265 55 V251')+hook(265,131)+bait(325,141,'fish')+lead(265,250);break;
case 'texas':draw=baseline+line('M190 55Q225 107 286 161')+lead(285,161)+line('M286 164 L335 206')+hook(335,205)+bait(378,209);break;
case 'carolina':draw=baseline+line('M195 55L252 147')+lead(252,147)+swivel(255,172)+line('M255 193 Q306 225 359 212')+hook(359,210)+bait(402,217);break;
case 'jig':draw=baseline+line('M265 55Q289 125 346 185')+`<circle cx="346" cy="185" r="16" fill="#b9ccd5" stroke="#e9faff" stroke-width="2"/>`+bait(401,190)+hook(401,181);break;
default:draw=base+lead(285,159)+hook(340,210)
}
return svgWrap(draw,`Illustration: ${id}`);}
function knotDrawing(id,step=4){const blue='#6bc3f7',orange='#f7ad65';const display=step||4;let seg='';
// These are simplified, instructional line diagrams and cannot replace practicing the described steps.
if(id==='palomar'){
 seg=line('M35 123 H245 Q265 123 265 151 Q264 175 245 175 H35',blue,5)+line('M245 123 Q326 84 363 132 Q373 151 360 180 Q339 202 280 174',orange,5)+`<ellipse cx="390" cy="149" rx="18" ry="30" stroke="#f4f6fa" stroke-width="5" fill="none"/>`;
 if(display>=3)seg+=line('M287 140 Q305 100 334 145 Q357 185 293 189',orange,4);
}else if(id==='achter'||id==='rapala'||id==='seitenarm'){
 seg=line('M20 150 H230 C290 88 329 205 372 154 C422 93 284 67 269 151 C264 215 415 221 470 153',blue,5);
 if(display>=3)seg+=line('M250 152 Q335 250 395 177',orange,4);
}else{
 seg=line('M20 145 H498',orange,5)+line('M23 169 H498',blue,5);
 const count=display===1?0:display===2?3:display===3?6:9;
 for(let i=0;i<count;i++){const x=198+i*15;seg+=line(`M${x} 145 q-8 -24 0 -24 q8 0 8 22 q2 18 -6 26`,i%2?blue:orange,4);}
 if(display>=3)seg+=line('M330 143 Q340 192 384 204',blue,4);
}
seg+=`<text x="22" y="39" fill="#8bc8e9" font-family="system-ui" font-size="19">SCHRITT ${display} VON 4</text>`;
return svgWrap(seg,`Knotenskizze ${id}, Schritt ${display}`);}
function selectedData(){return (D[tab]||[]).find(x=>x.id===selection)||D[tab][0]}
function renderDetail(){const t=$('pm320-detail'),x=selectedData();if(!t||!x)return;
const id=tab+':'+x.id,isFav=saved.favorites.includes(id);
const pic=tab==='montagen'?montageDrawing(x.id):knotDrawing(x.id,4);
const texts=x.steps.map((s,i)=>`<div class="pm320-step">${tab==='knoten'?knotDrawing(x.id,i+1):montageDrawing(x.id)}<b>Schritt ${i+1}</b><p>${esc(s)}</p></div>`).join('');
t.innerHTML=`<small style="color:#527e97;font-weight:750">${esc(x.difficulty)} · ${tab==='montagen'?esc(x.category):'Knotenkunde'}</small><h2>${esc(x.name)}</h2><p>${esc(x.desc||x.purpose)}</p><div class="pm320-hero-svg">${pic}</div><button type="button" class="pm320-btn ${isFav?'primary':''}" data-pm-fav="${esc(id)}" aria-pressed="${isFav}">${isFav?'★ Aus Favoriten entfernen':'☆ Als Favorit speichern'}</button>${x.parts?`<h3>Benötigte Teile</h3><ul class="pm320-list">${x.parts.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}<h3>Schritt-für-Schritt-Anleitung</h3><div class="pm320-steps">${texts}</div><p class="pm320-note"><strong>Hinweis:</strong> ${esc(x.note)} Die Grafiken sind vereinfachte, eigene Lernzeichnungen, keine maßstabsgetreuen amtlichen Darstellungen.</p>`;
}
function render(){const list=D[tab]||[],$grid=$('pm320-grid');if(!$grid)return;document.querySelectorAll('[data-pm-tab]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.pmTab===tab))});const q=($('pm320-search')?.value||'').trim().toLocaleLowerCase('de-DE'),filter=$('pm320-filter')?.value||'all';const filtered=list.filter(x=>(x.name+' '+(x.desc||x.purpose)+' '+(x.category||'')).toLocaleLowerCase('de-DE').includes(q)&&(filter==='all'||filter==='favorites'&&saved.favorites.includes(tab+':'+x.id)||filter===x.difficulty));
$('pm320-count').textContent=`${filtered.length} von ${list.length} ${tab==='montagen'?'Montagen':'Knoten'} · Zeichnungen und Anleitungen vollständig offline`;
$grid.innerHTML=filtered.map(x=>`<button type="button" class="pm320-item" data-pm-id="${esc(x.id)}" data-selected="${x.id===selection}">${tab==='montagen'?montageDrawing(x.id):knotDrawing(x.id)}<span class="pm320-item-content"><strong>${esc(x.name)}</strong><small>${esc(x.difficulty)}${x.category?' · '+esc(x.category):''}</small><span class="pm320-favorite">${saved.favorites.includes(tab+':'+x.id)?'★ Favorit':'☆ Merken'}</span></span></button>`).join('')||'<p>Keine Treffer. Suchwort oder Filter ändern.</p>';
if(!filtered.length){const panel=$('pm320-detail');if(panel)panel.innerHTML='<p>Bitte Suchwort oder Filter anpassen.</p>';return;}
if(!filtered.some(x=>x.id===selection))selection=filtered[0].id;
renderDetail();}
function boot(){document.addEventListener('click',e=>{const tabButton=e.target.closest?.('[data-pm-tab]');if(tabButton){tab=tabButton.dataset.pmTab;selection=null;const search=$('pm320-search');if(search)search.value='';const filter=$('pm320-filter');if(filter)filter.value='all';try{history.replaceState(null,'','montagen.html?tab='+tab)}catch{}render();return;}const pick=e.target.closest?.('[data-pm-id]');if(pick){selection=pick.dataset.pmId;render();document.getElementById('pm320-detail')?.scrollIntoView({behavior:'smooth',block:'start'});return;}const fav=e.target.closest?.('[data-pm-fav]');if(fav){const id=fav.dataset.pmFav;const i=saved.favorites.indexOf(id);if(i>=0)saved.favorites.splice(i,1);else saved.favorites.push(id);save();render();}});$('pm320-search')?.addEventListener('input',render);$('pm320-filter')?.addEventListener('change',render);render();window.PetriMontagen320=Object.freeze({montages:D.montagen.length,knots:D.knoten.length});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
