/* PetriHeil Pro 2.0.36: Lokal erstellter PDF-Jahresbericht, CSV und Pro-Fangfotoübersicht.
 * Es werden KEINE Datenbanken geändert. Originales Fangbuch bleibt unangetastet.
 * Keine externen Bibliotheken / Netzwerkanfragen; alle PDFs offline generiert.
 */
(()=>{
'use strict';
const PRO_KEY='petri31-pro-data-v1', MANUAL_KEY='petri-heil-manual-sessions-v1', PHOTO_DB='petri31-media-v1';
const byId=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,f)=>{try{const x=JSON.parse(localStorage.getItem(k));return x??f;}catch{return f;}};
const de=(v,d=1)=>Number(v||0).toLocaleString('de-DE',{minimumFractionDigits:0,maximumFractionDigits:d});
const validDate=x=>{const n=Date.parse(x);return Number.isFinite(n)?n:null;};
const ownKey=x=>String(x||'').trim().slice(0,160);
let photos=[], imageUrls=[], viewData=null, status='';
const currentYear=()=>new Date().getFullYear();
function parseData(year,privatePlaces){
 const raw=read(PRO_KEY,{}), manual=read(MANUAL_KEY,[]);
 const db={catches:Array.isArray(raw.catches)?raw.catches:[], trips:Array.isArray(raw.trips)?raw.trips:[], places:Array.isArray(raw.places)?raw.places:[]};
 const from=new Date(year,0,1).getTime(), to=new Date(year+1,0,1).getTime();
 const catches=db.catches.filter(c=>{const x=validDate(c?.time);return x!==null&&x>=from&&x<to;}).sort((a,b)=>String(a.time).localeCompare(String(b.time)));
 const records=[];
 for(const t of db.trips)if(t?.status==='Durchgeführt')records.push({start:t.start,end:t.end,location:t.placeText||db.places.find(p=>p.id===t.place)?.name||'',source:'Pro'});
 if(Array.isArray(manual))for(const m of manual)records.push({start:m.start,end:m.end,location:m.location||'',source:'Manuell'});
 const clipped=records.map(r=>({start:validDate(r.start),end:validDate(r.end),location:r.location,source:r.source})).filter(r=>r.start!==null&&r.end!==null&&r.end>r.start&&r.start<to&&r.end>from).map(r=>({...r,start:Math.max(from,r.start),end:Math.min(to,r.end)}));
 function totalHours(a){let end=0,sum=0;for(const t of a.slice().sort((x,y)=>x.start-y.start)){const begin=Math.max(end,t.start);if(t.end>begin)sum+=t.end-begin;end=Math.max(end,t.end);}return sum/3600000;}
 function group(items,get){const counter=new Map();for(const x of items){const v=ownKey(get(x)||'Unbekannt')||'Unbekannt';counter.set(v,(counter.get(v)||0)+1);}return [...counter].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'de'));}
 function placeOf(c){if(privatePlaces)return 'Privates Gewässer';return c.placeText||db.places.find(p=>p.id===c.place)?.name||c.legacyLocation||'Nicht angegeben';}
 const months=Array.from({length:12},(_,i)=>{const start=new Date(year,i,1).getTime(),end=new Date(year,i+1,1).getTime();const slices=clipped.filter(s=>s.end>start&&s.start<end).map(s=>({start:Math.max(start,s.start),end:Math.min(end,s.end)}));return {name:new Date(year,i,1).toLocaleDateString('de-DE',{month:'long'}),count:catches.filter(c=>{const time=validDate(c.time);return time!==null&&time>=start&&time<end;}).length,hours:totalHours(slices)};});
 const dated=catches.filter(c=>validDate(c.time)!==null);
 const species=group(catches,c=>c.species),lures=group(catches,c=>c.bait),waters=privatePlaces?[]:group(catches,placeOf);
 const longest=catches.filter(c=>Number(c.length)>0).sort((a,b)=>Number(b.length)-Number(a.length))[0]||null;
 const heaviest=catches.filter(c=>Number(c.weight)>0).sort((a,b)=>Number(b.weight)-Number(a.weight))[0]||null;
 const hours=totalHours(clipped),photos=catches.filter(c=>typeof c.photoKey==='string'&&c.photoKey).length;
 return {year,catches:dated,months,species,lures,waters,longest,heaviest,hours,sessionCount:clipped.length,photoCount:photos,privatePlaces,placeOf,rate:hours>0?catches.length/hours*10:null,generated:new Date().toLocaleString('de-DE'),total:catches.length};
}
const optYear=()=>{const y=Number(byId('p36-year')?.value||currentYear());return Number.isInteger(y)&&y>=2000&&y<=2100?y:currentYear()};
const hidePlaces=()=>byId('p36-private')?.checked!==false;
function options(){const y=currentYear(),d=read(PRO_KEY,{}),years=new Set([y]);if(Array.isArray(d.catches))for(const c of d.catches){const dt=String(c?.time||'').slice(0,4);if(/^\d{4}$/.test(dt)){const n=Number(dt);if(n>=2000&&n<=2100)years.add(n);}}
 return [...years].sort((a,b)=>b-a).map(n=>`<option value="${n}">${n}</option>`).join('');}
function miniBars(months){const max=Math.max(1,...months.map(x=>x.count));return `<div class="p36-months">${months.map(x=>`<div class="p36-month"><span>${esc(x.name.slice(0,3))}</span><i style="height:${Math.max(2,Math.round(x.count/max*76))}px" title="${x.count} Fänge"></i><strong>${x.count}</strong></div>`).join('')}</div>`;}
function renderOverview(){const d=parseData(optYear(),hidePlaces());viewData=d;const host=byId('p36-overview');if(!host)return;
 host.innerHTML=`<div class="p36-grid"><div><b>${d.total}</b><small>Pro-Fänge ${d.year}</small></div><div><b>${de(d.hours,2)} h</b><small>Angelstunden</small></div><div><b>${d.rate===null?'–':de(d.rate,2)}</b><small>Fänge je 10 h</small></div><div><b>${d.photoCount}</b><small>mit Fangfoto</small></div></div><h3>Fänge nach Monat</h3>${miniBars(d.months)}<div class="p36-lists"><section><h4>Häufigste Fischarten</h4>${d.species.slice(0,7).map(([v,n])=>`<p>${esc(v)} <strong>${n}</strong></p>`).join('')||'<p>Keine Fänge</p>'}</section><section><h4>Häufigste Köder</h4>${d.lures.slice(0,7).map(([v,n])=>`<p>${esc(v)} <strong>${n}</strong></p>`).join('')||'<p>Keine Köderangaben</p>'}</section></div><p class="p36-note">Gezählt werden Pro-Fänge einschließlich ausdrücklich übernommener alter Fänge. Ursprüngliche, nicht übernommene Fangbucheinträge bleiben unberücksichtigt. Überlappende Angelzeiten werden pro Kalendermonat nur einmal gezählt.</p>`;
}
function layout(){return `<div class="p36-window" role="dialog" aria-modal="true" aria-labelledby="p36-heading"><div class="p36-top"><div><h2 id="p36-heading">Jahresbericht & Fangfotos</h2><small>PetriHeil Pro 2.0.36 · Alle Daten bleiben auf dem Gerät</small></div><button type="button" data-p36="close" aria-label="Fenster schließen">Schließen ×</button></div><div class="p36-scroll"><section class="p36-card"><div class="p36-filters"><label>Jahr<select id="p36-year">${options()}</select></label><label class="p36-check"><input type="checkbox" id="p36-private" checked> Gewässernamen und Freitextnotizen im Export ausblenden</label></div><div id="p36-overview"></div><div class="p36-buttons"><button type="button" class="p36-primary" data-p36="pdf">Jahresbericht als PDF speichern</button><button type="button" data-p36="csv">Fänge als CSV exportieren</button></div><p class="p36-note">Der PDF-Bericht wird offline direkt auf dem iPhone erzeugt. Die Datei enthält Statistik und Fänge, keine Fotoanhänge. Das Originalfangbuch wird nicht verändert.</p></section><section class="p36-card"><h3>Meine Fangfotos</h3><p>Fotogalerie aller Fänge aus dem Pro-Fangbuch. Ein Foto kann im Fangbuch über „Bearbeiten“ nachträglich hinzugefügt werden. Die Bilder werden nicht hochgeladen.</p><div id="p36-gallery" class="p36-gallery"></div></section></div><div class="p36-status" id="p36-status" role="status">${esc(status||'Bericht bereit – keine Internetverbindung erforderlich.')}</div></div>`;}
function close(){const el=byId('p36-overlay');if(el)el.remove();imageUrls.forEach(x=>URL.revokeObjectURL(x));imageUrls=[];}
function open(){close();const box=document.createElement('div');box.id='p36-overlay';box.innerHTML=layout();document.body.append(box);renderOverview();void fillGallery();}
function inform(msg){status=msg;const el=byId('p36-status');if(el)el.textContent=msg;}
async function fileFromId(key){return await new Promise((resolve,reject)=>{const request=indexedDB.open(PHOTO_DB);request.onupgradeneeded=()=>{ /* only existing user photos expected */};request.onerror=()=>reject(request.error||Error('Fotos nicht lesbar'));request.onsuccess=()=>{const db=request.result;if(!db.objectStoreNames.contains('files')){db.close();resolve(null);return;}const tx=db.transaction('files','readonly'),q=tx.objectStore('files').get(key);q.onsuccess=()=>{resolve(q.result||null)};q.onerror=()=>reject(q.error);tx.oncomplete=()=>db.close();tx.onerror=()=>db.close();};});}
async function fillGallery(){const host=byId('p36-gallery'),d=viewData;if(!host||!d)return;imageUrls.forEach(x=>URL.revokeObjectURL(x));imageUrls=[];
 const photographed=d.catches.filter(c=>typeof c.photoKey==='string'&&c.photoKey).slice().reverse();
 if(!photographed.length){host.innerHTML='<p>Für dieses Jahr sind noch keine Pro-Fangfotos gespeichert.</p>';return;}
 host.innerHTML='<p>Fangfotos werden lokal geladen …</p>';const fragment=document.createDocumentFragment();let count=0;
 for(const c of photographed.slice(0,80)){
   if(!host.isConnected)return;
   try{const blob=await fileFromId(c.photoKey);if(!(blob instanceof Blob)||!blob.type.startsWith('image/'))continue;
     const src=URL.createObjectURL(blob);imageUrls.push(src);const card=document.createElement('div');card.className='p36-photo';const img=document.createElement('img');img.src=src;img.alt='Foto: '+String(c.species||'Fang');img.loading='lazy';const note=document.createElement('div');note.textContent=String(c.species||'Fang')+' · '+new Date(c.time).toLocaleDateString('de-DE');card.append(img,note);fragment.append(card);count++;
   }catch(e){console.warn('PetriHeil Foto',e)}
 }
 if(host.isConnected)host.replaceChildren(fragment);if(!count&&host.isConnected)host.textContent='Keine lesbaren Pro-Fotos vorhanden.';
 if(photographed.length>80&&host.isConnected)host.insertAdjacentHTML('beforeend','<p class="p36-note">Es werden die 80 neuesten Fangfotos angezeigt.</p>');
}
function saveBlob(blob,filename){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),20000);}
function csv(){const d=viewData||parseData(optYear(),hidePlaces());const q=v=>{let x=String(v??'').replace(/[\r\n\t]+/g,' ').trim();if(/^[=+\-@]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"';};
 const data=[['Zeit','Art','Länge cm','Gewicht kg','Köder','Gewässer','Status','Notiz'],...d.catches.map(c=>[c.time,c.species,c.length,c.weight,c.bait,d.placeOf(c),c.status,d.privatePlaces?'':c.notes])];
 const content='\ufeff'+data.map(row=>row.map(q).join(';')).join('\r\n');saveBlob(new Blob([content],{type:'text/csv;charset=utf-8'}),`PetriHeil_Faenge_${d.year}.csv`);inform('CSV für '+d.year+' gespeichert.');}
// Minimaler eigenständiger A4-PDF-Schreiber (Helvetica / WinAnsi); funktioniert offline auch auf Safari.
const mapWin={'€':128,'‚':130,'ƒ':131,'„':132,'…':133,'†':134,'‡':135,'ˆ':136,'‰':137,'Š':138,'‹':139,'Œ':140,'Ž':142,'‘':145,'’':146,'“':147,'”':148,'•':149,'–':150,'—':151,'˜':152,'™':153,'š':154,'›':155,'œ':156,'ž':158,'Ÿ':159};
function binary(s){let out='';for(const char of String(s??'')){const cp=char.codePointAt(0);out+=String.fromCharCode(cp<=255?cp:mapWin[char]??63);}return out;}
function pt(s){return '('+binary(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/[\r\n]/g,' ')+')';}
function wrap(str,max=94){const result=[];let line='';for(const word of String(str??'').replace(/\s+/g,' ').split(' ')){if((line+' '+word).length>max&&line){result.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)result.push(line);return result.length?result:[''];}
function createPdf(d){const pages=[];let stream=[],y=750;
 const push=s=>stream.push(s);const newPage=()=>{if(stream.length)pages.push(stream.join('\n'));stream=[];y=750;push('0.95 0.98 1 rg 0 778 595 64 re f');push('0.04 0.26 0.40 rg');push(`BT /F2 18 Tf 42 801 Td ${pt('PETRIHEIL PRO')} Tj ET`);push(`BT /F1 9 Tf 42 785 Td ${pt('Jahresbericht '+d.year+'  |  erstellt '+d.generated)} Tj ET`);push('0.32 0.46 0.55 rg');push(`BT /F1 8 Tf 42 27 Td ${pt('PetriHeil Pro  |  Lokaler Bericht  |  Keine amtliche Fangmeldung')} Tj ET`);};
 const ensure=h=>{if(y-h<60)newPage();};
 const text=(s,size=10,bold=false,indent=0)=>{ensure(size+9);push('0.07 0.20 0.30 rg');push(`BT /${bold?'F2':'F1'} ${size} Tf ${42+indent} ${Math.round(y)} Td ${pt(s)} Tj ET`);y-=size+6;};
 const lines=(s,size=10,indent=0,max=96)=>{for(const row of wrap(s,max))text(row,size,false,indent);};
 const section=s=>{ensure(42);y-=12;push('0.05 0.47 0.70 rg');push(`BT /F2 13 Tf 42 ${Math.round(y)} Td ${pt(s)} Tj ET`);y-=22;};
 const row=(left,right)=>{ensure(20);text(left+'   '+right,9);};
 newPage();section('Überblick');
 row('Fänge insgesamt:',String(d.total));row('Angelstunden (ohne Zeitüberschneidung):',de(d.hours,2)+' h');row('Fänge je 10 Angelstunden:',d.rate===null?'nicht berechenbar':de(d.rate,2));row('Fänge mit Foto:',String(d.photoCount));row('Gewässerangaben:',d.privatePlaces?'ausgeblendet':'im Bericht sichtbar');
 section('Monatsstatistik');for(const m of d.months)row(m.name.padEnd(13,' '),m.count+' Fänge     '+de(m.hours,2)+' h');
 section('Häufigste Fischarten');for(const [name,n] of d.species.slice(0,12))row(name.slice(0,48),n+' Fänge');if(!d.species.length)text('Noch keine Fänge erfasst.',9);
 section('Erfolgreichste Köder (eigene Aufzeichnungen)');for(const [name,n] of d.lures.filter(x=>x[0]!=='Unbekannt').slice(0,12))row(name.slice(0,48),n+' Fänge');
 if(!d.privatePlaces){section('Häufigste Gewässer');for(const [name,n] of d.waters.slice(0,12))row(name.slice(0,48),n+' Fänge');}
 section('Persönliche Rekorde');text('Größter Fisch: '+(d.longest?`${d.longest.species} - ${de(d.longest.length)} cm`:'Keine Angabe'),9);text('Schwerster Fisch: '+(d.heaviest?`${d.heaviest.species} - ${de(d.heaviest.weight,3)} kg`:'Keine Angabe'),9);
 section('Einzelne Fänge');for(let i=0;i<d.catches.length;i++){const c=d.catches[i],when=new Date(c.time).toLocaleDateString('de-DE');ensure(60);
 text(`${i+1}. ${String(c.species||'Unbekannt').slice(0,46)}  -  ${when}`,10,true);
 lines(`Länge ${de(c.length)} cm | Gewicht ${de(c.weight,3)} kg | Köder: ${c.bait||'-'} | Status: ${c.status||'-'}`,8,8,100);
 if(!d.privatePlaces)lines('Gewässer: '+d.placeOf(c),8,8,92);
 if(c.notes&&!d.privatePlaces)lines('Notiz: '+String(c.notes).slice(0,250),8,8,92);
 y-=5;
 }
 if(!d.catches.length)text('Keine Fänge in diesem Jahr.',9);
 section('Hinweise');lines('Dieser Bericht berücksichtigt das Pro-Fangbuch, einschließlich dort ausdrücklich importierter Alt-Fänge. Nicht übernommene Daten des ursprünglichen Fangbuchs fehlen. Die erfassten Zeiten stammen aus abgeschlossenen Pro-Angeltagen und manuellen Zeiteinträgen; Überschneidungen werden nur einmal gezählt.',8,0,111);
 lines('Die Werte stammen aus eigenen Eingaben. Sie ersetzen keine offiziellen Nachweise. Fangfotos werden nicht in diesem PDF eingebettet.',8,0,111);
 pages.push(stream.join('\n'));
 let objects=[null];const reserve=()=>{objects.push('');return objects.length-1;};const obj=x=>{const id=reserve();objects[id]=x;return id;};const root=reserve(),pageTree=reserve();const font=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'),bold=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
 const pageIds=[];for(const content of pages){const data=binary(content+'\n'),contentId=obj(`<< /Length ${data.length} >>\nstream\n${data}endstream`);pageIds.push(obj(`<< /Type /Page /Parent ${pageTree} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R /F2 ${bold} 0 R >> >> /Contents ${contentId} 0 R >>`));}
 objects[pageTree]=`<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map(id=>id+' 0 R').join(' ')}] >>`;
 objects[root]=`<< /Type /Catalog /Pages ${pageTree} 0 R >>`;
 let bin='%PDF-1.4\n%\xE2\xE3\xCF\xD3\n',offsets=[0];for(let i=1;i<objects.length;i++){offsets.push(bin.length);bin+=`${i} 0 obj\n${objects[i]}\nendobj\n`;}
 const start=bin.length;bin+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;for(let i=1;i<objects.length;i++)bin+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';bin+=`trailer\n<< /Size ${objects.length} /Root ${root} 0 R >>\nstartxref\n${start}\n%%EOF\n`;
 const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i)&255;return new Blob([bytes],{type:'application/pdf'});
}
function pdf(){const d=viewData||parseData(optYear(),hidePlaces());const result=createPdf(d);saveBlob(result,`PetriHeil_Jahresbericht_${d.year}.pdf`);inform('PDF für '+d.year+' erstellt ('+Math.round(result.size/1024)+' KB).');}
let attaching=false,attachedNode=null;
function attach(){const content=byId('p31-content');if(!content||!content.isConnected)return;const h=content.querySelector('.p31-section-title h3')?.textContent||'';if(!/Cockpit|Fangbuch|Datensicherung/.test(h))return;
 if(content.querySelector('[data-p36="open"]'))return;
 const block=document.createElement('section');block.className='p36-launch';block.innerHTML='<strong>Jahresbericht & Fangfotos</strong><p>Fangstatistik, Monatsauswertung und Bilder – offline als PDF oder CSV exportieren.</p><button type="button" class="p36-primary" data-p36="open">Jahresbericht öffnen</button>';
 const title=content.querySelector('.p31-section-title');if(title)title.insertAdjacentElement('afterend',block);else content.prepend(block);
}
function init(){document.addEventListener('click',e=>{const b=e.target.closest('[data-p36]');if(!b)return;e.stopPropagation();e.preventDefault();const a=b.dataset.p36;if(a==='open')open();else if(a==='close')close();else if(a==='pdf')pdf();else if(a==='csv')csv();},true);
 document.addEventListener('change',e=>{if(['p36-year','p36-private'].includes(e.target.id)){renderOverview();void fillGallery();}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&byId('p36-overlay')){e.stopPropagation();close();}},true);
 const observer=new MutationObserver(()=>{if(attaching)return;attaching=true;queueMicrotask(()=>{attaching=false;attach();});});observer.observe(document.body,{childList:true,subtree:true});attach();
 window.PetriHeilReport36={parseData,createPdf,open};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
