/* Petri Heil Pro 4.1.1 – optional on-device image audit; no user data collected. */
(()=>{'use strict';
const $=id=>document.getElementById(id);const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const root=new URL('./',location.href);let species=[],allFiles=[],group='fish',search='',offset=0;const PAGE=24;
async function json(file){const r=await fetch(new URL(file,root),{cache:'default'});if(!r.ok)throw Error(file+': HTTP '+r.status);return r.json()}
const basename=x=>String(x).replace(/^gear-/,'').replace(/\.webp$/,'').replace(/-/g,' ');
function list(){let items=group==='fish'?species.map(s=>({name:s.name,file:s.bilddatei,id:s.id})):allFiles.filter(f=>f.startsWith('gear-')).map(f=>({name:basename(f),file:f,id:''}));
if(search)items=items.filter(x=>(x.name+' '+x.file+' '+x.id).toLocaleLowerCase('de').includes(search));return items}
function render(){const items=list(),max=Math.min(offset+PAGE,items.length);$('count').textContent=items.length+' Einträge';
$('gallery').innerHTML=items.slice(0,max).map(item=>`<article class="picture"><img src="${esc(new URL(item.file,root).href)}" loading="lazy" decoding="async" alt="${esc(item.name)}"/><p class="status">Bild aus lokalem Archiv</p><strong>${esc(item.name)}</strong><small>${esc(item.id?item.id+' · '+item.file:item.file)}</small></article>`).join('');
$('more').hidden=max>=items.length}
async function load(){const [a,b]=await Promise.all([json('BILDZUORDNUNGEN_177_ARTEN.json'),json('petri-media-v2.2.0.json')]);
if(!Array.isArray(a.arten)||a.arten.length!==177||!Array.isArray(b.files)||b.files.length!==228)throw Error('Arten-/Medienliste ist unvollständig');
species=a.arten;allFiles=b.files;if(new Set(species.map(x=>x.id)).size!==177||new Set(allFiles).size!==228)throw Error('Doppelte Dateizuordnung');
for(const s of species)if(!allFiles.includes(s.bilddatei))throw Error('Artenbild nicht in Medienliste: '+s.name);
$('overview').textContent='177 Arten mit Zuordnung · 228 Bilddateien im Medienmanifest · '+allFiles.filter(f=>f.startsWith('gear-')).length+' Ausrüstungsbilder';
let c8=species.find(s=>s.id==='c8'),c14=species.find(s=>s.id==='c14');if(c8?.name!=='Galizischer Sumpfkrebs'||c14?.name!=='Kaisergranat')throw Error('Krebsbild-Zuordnung noch nicht korrigiert. App aktualisieren!');render()}
function testImage(file){return new Promise(resolve=>{const im=new Image();let done=false;const finish=(ok,why)=>{if(done)return;done=true;clearTimeout(tm);im.onload=im.onerror=null;resolve({file,ok,why})};const tm=setTimeout(()=>finish(false,'Zeitüberschreitung'),12000);im.onload=()=>finish(im.naturalWidth>0&&im.naturalHeight>0,im.naturalWidth?'':'Keine gültigen Bildmaße');im.onerror=()=>finish(false,'Bildladefehler');im.src=new URL(file,root).href;})}
async function audit(){const b=$('scan');b.disabled=true;const failures=[];let checked=0;let q=0;const files=allFiles.slice();const work=async()=>{while(q<files.length){const f=files[q++];const r=await testImage(f);if(!r.ok)failures.push(r);checked++;if(checked%6===0||checked===files.length)$('result').textContent='Tatsächlicher Bild-Ladetest: '+checked+' / '+files.length+' · Fehler '+failures.length}};
try{await Promise.all(Array.from({length:4},()=>work()));$('result').textContent=`${checked}/${files.length} Medienbilder im aktuellen Browser geprüft. Ladefehler: ${failures.length}.`;
$('failures').textContent=failures.length?failures.map(f=>f.file+' – '+f.why).join('\n'):'Keine fehlenden oder nicht dekodierbaren Bilder beim aktuellen Test.';
}catch(e){$('result').textContent='Prüfung unterbrochen: '+e.message}finally{b.disabled=false}}
$('gallery').addEventListener('error',event=>{const img=event.target;if(img?.tagName!=='IMG')return;img.classList.add('broken');const cap=img.nextElementSibling;if(cap)cap.textContent='Bild lässt sich nicht laden';},true);
$('group').addEventListener('change',e=>{group=e.target.value;offset=0;render()});$('search').addEventListener('input',e=>{search=e.target.value.toLocaleLowerCase('de').trim();offset=0;render()});$('more').addEventListener('click',()=>{offset+=PAGE;render()});$('scan').addEventListener('click',audit);
load().catch(e=>{$('overview').textContent='Konnte Bildlisten nicht laden: '+e.message;$('scan').disabled=true});
})();