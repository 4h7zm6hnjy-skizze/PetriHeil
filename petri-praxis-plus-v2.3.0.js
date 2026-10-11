/* Offline checkable, per-task Rutenmontage training. No remote requests. */
(()=>{'use strict';const KEY='petri230-praxis-montage';let current=-1,lock=false;
 const $=id=>document.getElementById(id);
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function stored(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
 function show(){lock=false;const root=$('ppr-overlay'),data=window.PetriPraxisData;if(!root||!Array.isArray(data?.tasks))return;
  const place=root.querySelector('.ppr-ruten-grid');if(!place)return;
  const selected=root.querySelector('[data-ppr-task][aria-current="true"], [data-ppr-task].active, [data-ppr-task].selected');
  let n=selected?Number(selected.dataset.pprTask):0;
  if(!Number.isFinite(n)||n<0||n>9){const buttons=[...root.querySelectorAll('[data-ppr-task]')];n=Math.max(0,buttons.findIndex(x=>x.classList.contains('active')))}
  const task=data.tasks[n]||data.tasks[0];if(!task)return;
  if(root.querySelector('#p230-practice'))return;
  const steps=[
   ['Rute auswählen',task.rod],['Rolle passend montieren',task.reel],['Schnur prüfen und einfädeln',task.line],['Montage aufbauen',task.rig],['Vorfach, Haken und Köder',task.hook],['Sicherheit und Zubehör kontrollieren',task.notes+' Kontrolliere auch Kescher, Maßband und geeignetes Gerät zum waidgerechten Umgang.']
  ];const progress=stored(),flags=Array.isArray(progress[task.id])?progress[task.id]:[];
  const box=document.createElement('section');box.className='p230-practice';box.id='p230-practice';box.dataset.p230Task=task.id;
  box.innerHTML=`<h3>Schritt-für-Schritt · ${escape(task.id)}</h3><p class="p230-muted">Jeden Schritt am echten Gerät üben und abhaken. Diese Lernhilfe ersetzt keine praktische Einweisung.</p><div class="p230-check-steps">${steps.map(([name,desc],i)=>`<label><input type="checkbox" data-p230-practice="${i}" ${flags[i]?'checked':''}><span><strong>${escape(name)}</strong><small style="display:block">${escape(desc)}</small></span></label>`).join('')}</div><p id="p230-practice-progress" class="p230-eval-progress">${flags.filter(Boolean).length}/6 geübt</p><img src="./${encodeURIComponent(task.image)}" loading="lazy" alt="Lokales Bild zur Ausrüstung" style="width:100%;max-width:220px;height:130px;object-fit:contain">`;
  place.after(box);
 }
 function schedule(){if(lock)return;lock=true;requestAnimationFrame(show)}
 function start(){const obs=new MutationObserver(schedule);obs.observe(document.body,{childList:true,subtree:true});schedule();document.addEventListener('change',e=>{const n=e.target?.dataset?.p230Practice;if(n===undefined)return;const section=e.target.closest('#p230-practice');if(!section)return;const data=stored(),id=section.dataset.p230Task,arr=Array.isArray(data[id])?data[id]:Array(6).fill(false);arr[Number(n)]=e.target.checked;data[id]=arr;try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}const p=$('p230-practice-progress');if(p)p.textContent=arr.filter(Boolean).length+'/6 geübt'})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
