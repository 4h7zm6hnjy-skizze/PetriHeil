/* Petri Heil Pro 3.2.0 — offline-only, transparent heuristic, not a catch forecast. */
(()=>{'use strict';
const KEY='petri320-beiss-v1';
const BASE=new URL('./',document.currentScript?.src||document.baseURI);
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&quot;'}[c]));
function saved(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{}}catch{return {}}}
let options={species:'Hecht',latitude:51,longitude:9,water:'',pressure:'normal',wind:'normal',cloud:'wechselnd',...saved()};
function persist(){try{localStorage.setItem(KEY,JSON.stringify(options))}catch{}}
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const degrees=x=>x*Math.PI/180;
function dayOfYear(d){return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/864e5)}
// NOAA-based solar declination and hour-angle approximation, with local timezone correction.
function solarTimes(d,lat,lon){const n=dayOfYear(d),g=2*Math.PI/365*(n-1),dec=.006918-.399912*Math.cos(g)+.070257*Math.sin(g)-.006758*Math.cos(2*g)+.000907*Math.sin(2*g)-.002697*Math.cos(3*g)+.00148*Math.sin(3*g),eq=229.18*(.000075+.001868*Math.cos(g)-.032077*Math.sin(g)-.014615*Math.cos(2*g)-.040849*Math.sin(2*g)),zen=Math.cos(degrees(90.833)),v=(zen/(Math.cos(degrees(lat))*Math.cos(dec)))-Math.tan(degrees(lat))*Math.tan(dec);const hour=Math.acos(clamp(v,-1,1))*180/Math.PI*4; const noon=720-4*lon-eq-d.getTimezoneOffset();return {sunrise:clamp((noon-hour)/60,0,24),sunset:clamp((noon+hour)/60,0,24)};}
function lunar(d){const known=Date.UTC(2000,0,6,18,14),phase=(((d.getTime()-known)/864e5)/29.530588853%1+1)%1;return phase;}
function kind(name){const s=name.toLocaleLowerCase('de-DE');if(/aal|wels|quappe|butt|dorsch/.test(s))return 'night';if(/karpfen|schleie|brasse|rotauge|rotfeder|barbe|graskarpfen/.test(s))return 'warm';if(/forelle|äsche|saibling|lachs/.test(s))return 'cool';return 'predator'}
function score(d,clock,species=options.species){const f=kind(species),{sunrise,sunset}=solarTimes(d,Number(options.latitude)||51,Number(options.longitude)||9);let v=43;
const morning=Math.abs(clock-sunrise),evening=Math.abs(clock-sunset),peak=Math.min(morning,evening);
if(f==='night'){v+=clock<sunrise||clock>sunset?19:0;v+=peak<1.5?12:0;}
else{v+=peak<1.5?22:peak<3?11:0;v-=clock<sunrise-1||clock>sunset+1?12:0;}
const m=d.getMonth()+1;
if(f==='warm'){v+=m>=5&&m<=9?10:-9;}else if(f==='cool'){v+=m>=3&&m<=5||m>=9&&m<=11?10:m>=7&&m<=8?-7:0;}else if(f==='predator'){v+=m>=9&&m<=11?11: m>=4&&m<=7?3:0;}else{v+=m>=5&&m<=9?8:0;}
const l=lunar(d);v+=Math.round(4*Math.cos(4*Math.PI*l));
if(options.pressure==='fallend')v+=5;else if(options.pressure==='steigend')v-=3;
if(options.wind==='stark')v-=5;else if(options.wind==='leicht')v+=2;
if(options.cloud==='bedeckt'&&f==='predator')v+=6;
const temp=Number(String(options.water).replace(',','.'));if(options.water!==''&&Number.isFinite(temp)){
 if(f==='warm')v+=temp>=17&&temp<=24?10:temp<9||temp>29?-11:0;
 else if(f==='cool')v+=temp>=8&&temp<=17?9:temp>22?-10:0;
 else if(f==='predator')v+=temp>=9&&temp<=19?7:temp>25?-8:0;
 else v+=temp>=13&&temp<=23?7:0;
}
return clamp(Math.round(v),5,90)}
function band(n){return n>=67?'Eher günstig':n>=43?'Durchschnittlich':'Eher gering'}
function getOptions(){const x=window.APP_DATA?.fish||[];const all=[...new Set(x.map(f=>String(f.name||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'de'));if(!all.includes('Hecht'))all.unshift('Hecht');return all;}
function formatTime(hour){const minutes=Math.round(hour*60);return String(Math.floor(minutes/60)%24).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0')}
function render(){const host=$('#petri-bissindex');if(!host)return;const wasExpanded=host.querySelector('details')?.open||false;const now=new Date(),hour=now.getHours()+now.getMinutes()/60,n=score(now,hour);const st=solarTimes(now,options.latitude,options.longitude);
const currentHour=now.getHours();const bars=Array.from({length:24},(_,h)=>`<span class="pb-bar ${h===currentHour?'now':''}" style="height:${score(now,h+.5)}%" title="${h}:00 – ${score(now,h+.5)} von 100"></span>`).join('');
const days=Array.from({length:7},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);const vals=Array.from({length:24},(_,h)=>score(d,h+.5));const top=Math.max(...vals);return `<div class="pb-day"><span>${d.toLocaleDateString('de-DE',{weekday:'short'})}</span><strong>${top}</strong><span>max.*</span></div>`}).join('');
host.innerHTML=`<div class="pb-head"><div><span class="pb-eyebrow">MEIN ANGELCOCKPIT</span><h2>Beißindex <span aria-hidden="true">↗</span></h2><p class="pb-sub">Deine lokale Aktivitäts-Orientierung · ohne Internet</p></div><span class="pb-pill">Nur auf deinem Gerät</span></div>
<div class="pb-scoreline"><div class="pb-ring" style="--percent:${n}" role="img" aria-label="Beißindex ${n} von 100"><div class="pb-ring-inner"><strong>${n}</strong><small>von 100</small></div></div><div class="pb-eval"><strong>${band(n)}</strong><p>Für <b>${esc(options.species)}</b> · ${now.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})} Uhr</p><p><b>Heute:</b> Sonnenaufgang ca. ${formatTime(st.sunrise)} · Sonnenuntergang ca. ${formatTime(st.sunset)} Uhr</p></div></div>
<div class="pb-controls"><label>Fischart<select data-pb="species">${getOptions().map(s=>`<option ${s===options.species?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label>Wassertemperatur °C (optional)<input data-pb="water" type="number" min="-2" max="38" step="0.5" inputmode="decimal" placeholder="Nicht bekannt" value="${esc(options.water)}"></label></div>
<div class="pb-chart" aria-label="24-Stunden-Orientierung">${bars}</div><div class="pb-times"><span>00 Uhr</span><span>06 Uhr</span><span>12 Uhr</span><span>18 Uhr</span><span>24 Uhr</span></div>
<div class="pb-days" aria-label="Höchstwerte der nächsten sieben Tage">${days}</div>
<details><summary>Standort und Bedingungen einstellen</summary><div class="pb-detail-grid"><label>Breitengrad<input data-pb="latitude" type="number" min="47" max="56" step=".001" value="${esc(options.latitude)}"></label><label>Längengrad<input data-pb="longitude" type="number" min="5" max="16" step=".001" value="${esc(options.longitude)}"></label><label>Luftdruck-Verlauf<select data-pb="pressure">${[['normal','Unverändert / unbekannt'],['fallend','Fallend'],['steigend','Steigend']].map(([v,t])=>`<option value="${v}" ${options.pressure===v?'selected':''}>${t}</option>`).join('')}</select></label><label>Wind<select data-pb="wind">${[['normal','Unbekannt / mäßig'],['leicht','Leicht'],['stark','Stark']].map(([v,t])=>`<option value="${v}" ${options.wind===v?'selected':''}>${t}</option>`).join('')}</select></label><label>Bewölkung<select data-pb="cloud">${[['wechselnd','Unbekannt / wechselnd'],['bedeckt','Bedeckt'],['klar','Klar']].map(([v,t])=>`<option value="${v}" ${options.cloud===v?'selected':''}>${t}</option>`).join('')}</select></label></div><button type="button" data-pb-action="gps">Eigene GPS-Koordinaten übernehmen</button><p class="pb-sub" id="pb-location-note">Standardstandort Mitte Deutschlands, 51°N / 9°E. Standortabfrage nur nach Tippen.</p></details>
<p class="pb-note">* Die 7-Tage-Werte sind modellierte Tages-Höchstwerte bei gleichbleibenden Eingaben, <b>keine Wettervorhersage</b>. Der Index ist eine eigene Faustregel aus Sonnenstand, Monat, Mondphase und optionalen Angaben. <b>Keine geprüfte Fangwahrscheinlichkeit.</b></p>
<div class="pb-links"><a class="pb-link" href="./montagen.html?tab=montagen">Montagen lernen</a><a class="pb-link" href="./montagen.html?tab=knoten">Knoten lernen</a></div>`;
const detail=host.querySelector("details");if(detail)detail.open=wasExpanded;
}
let scheduled=false;
function mount(){scheduled=false;const main=$('#main');if(!main)return;const title=$('#page-title')?.textContent||'';const overview=/übersicht|startseite/i.test(title);let card=$('#petri-bissindex');if(!overview){if(card)card.remove();return;}const hero=main.querySelector(':scope > .hero');if(!hero)return;
if(!card){card=document.createElement('section');card.id='petri-bissindex';card.setAttribute('aria-label','Beißindex und persönliche Aktivität');hero.after(card);render();}
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(mount)}}
document.addEventListener('change',e=>{const el=e.target.closest?.('#petri-bissindex [data-pb]');if(!el)return;const key=el.dataset.pb;if(key==='latitude'||key==='longitude'){const n=Number(el.value);if(!Number.isFinite(n)||n<(key==='latitude'?47:5)||n>(key==='latitude'?56:16))return;options[key]=n;}else if(key==='water'){if(el.value!==''&&(Number(el.value)<-2||Number(el.value)>38))return;options.water=el.value;}else{options[key]=el.value;}persist();render();});
document.addEventListener('click',e=>{if(e.target.closest?.('[data-pb-action="gps"]')){const status=$('#pb-location-note');if(!navigator.geolocation){if(status)status.textContent='GPS ist auf diesem Gerät nicht verfügbar.';return;}if(status)status.textContent='Standortberechtigung wird angefragt …';navigator.geolocation.getCurrentPosition(p=>{options.latitude=Math.round(p.coords.latitude*1000)/1000;options.longitude=Math.round(p.coords.longitude*1000)/1000;persist();render();const out=$('#pb-location-note');if(out)out.textContent='GPS-Koordinaten lokal übernommen.';},err=>{const out=$('#pb-location-note');if(out)out.textContent='Standort nicht verfügbar: '+err.message;},{enableHighAccuracy:false,timeout:12000,maximumAge:300000});}});
function boot(){const m=$('#main');if(m)new MutationObserver(schedule).observe(m,{childList:true,subtree:false});const t=$('#page-title');if(t)new MutationObserver(schedule).observe(t,{childList:true,subtree:true,characterData:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.PetriBeiss320=Object.freeze({score,solarTimes,lunar});
})();
