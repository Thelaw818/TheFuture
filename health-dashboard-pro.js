(function(){
  'use strict';
  const $=(id)=>document.getElementById(id);
  const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
  const store=(k)=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return []}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const n=(v)=>{const x=parseFloat(v);return Number.isFinite(x)?x:null};
  const todayISO=()=>new Date().toISOString().slice(0,10);
  const fmtDate=()=>new Date().toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'});
  const safe=(s)=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const latest=(rows,key)=>{for(const r of rows.slice().reverse()){const v=n(r[key]); if(v!==null)return v;} return null};
  const openTab=(id)=>{const btn=document.querySelector('.tab[data-tab="'+CSS.escape(id)+'"]'), panel=$(id); if(!btn||!panel)return; $$('#app .tab').forEach(b=>b.classList.remove('active')); $$('#app .panel').forEach(p=>p.classList.remove('active')); btn.classList.add('active'); panel.classList.add('active'); history.replaceState(null,'','#'+id); panel.scrollIntoView({behavior:'smooth',block:'start'});};
  function prepSidebar(){
    const labels={overview:'Dashboard',health:'Health Overview',syringe:'Calculators',labs:'Lab Results',costs:'Cost Analysis',journal:'Journal',reports:'Reports',settings:'Settings',privacyPolicy:'Privacy',termsOfUse:'Terms',medicalDisclaimer:'Medical Disclaimer',legalNotice:'Legal Notice',insights:'Insights'};
    Object.entries(labels).forEach(([tab,text])=>{const b=document.querySelector('.tab[data-tab="'+tab+'"]'); if(b)b.textContent=text;});
    // Keep every original working tab visible. Earlier dashboard-only styling hid these tabs,
    // which made it look like the rest of the app was missing.
    const hide=[];
    hide.forEach(t=>$$('.tab[data-tab="'+t+'"]').forEach(b=>b.classList.add('hd-hidden-tab')));
    let medBtn=document.querySelector('.tab[data-tab="medication"]');
    if(!medBtn){const healthBtn=document.querySelector('.tab[data-tab="health"]'); if(healthBtn){medBtn=document.createElement('button'); medBtn.className='tab'; medBtn.type='button'; medBtn.dataset.tab='medication'; medBtn.textContent='Medication'; healthBtn.insertAdjacentElement('afterend',medBtn);}}
    document.addEventListener('click',e=>{const q=e.target.closest('[data-hd-open]'); if(q){e.preventDefault();openTab(q.getAttribute('data-hd-open'));}},true);
  }
  function buildMedicationPanel(){
    if($('medication'))return;
    const health=$('health') || $('overview'); if(!health)return;
    const sec=document.createElement('section'); sec.className='panel'; sec.id='medication';
    sec.innerHTML=`<div class="hd-card"><h2>Medication</h2><p class="muted">Track medication names, schedule, notes, and completion status locally on this device. This does not provide medical advice or dosing guidance.</p>
      <form id="hdMedForm" class="hd-med-form">
        <input name="name" placeholder="Medication / supplement name" required>
        <input name="amount" placeholder="Amount / strength">
        <input name="time" type="time">
        <select name="frequency"><option>Daily</option><option>As needed</option><option>Weekly</option><option>Monthly</option><option>Other</option></select>
        <textarea name="notes" placeholder="Notes, instructions from your licensed clinician, refill notes, or reminders"></textarea>
        <button class="hd-mini-btn hd-primary" type="submit">Save Medication</button>
        <button class="hd-mini-btn" type="button" id="hdMedExport">Export CSV</button>
        <button class="hd-mini-btn" type="button" id="hdMedClear">Clear</button>
      </form>
      <div class="table-wrap"><table class="hd-med-table"><thead><tr><th>Name</th><th>Amount</th><th>Time</th><th>Frequency</th><th>Notes</th><th></th></tr></thead><tbody id="hdMedRows"></tbody></table></div></div>`;
    health.insertAdjacentElement('beforebegin',sec);
  }
  function medRows(){return store('hd_medications')}
  function renderMed(){const rows=medRows(), body=$('hdMedRows'); if(!body)return; body.innerHTML=rows.map((r,i)=>`<tr><td>${safe(r.name)}</td><td>${safe(r.amount)}</td><td>${safe(r.time)}</td><td>${safe(r.frequency)}</td><td>${safe(r.notes)}</td><td><button class="hd-mini-btn" data-hd-del-med="${i}">Delete</button></td></tr>`).join('')||'<tr><td colspan="6">No medication records saved yet.</td></tr>';}
  function bindMed(){const f=$('hdMedForm'); if(f&&!f.dataset.bound){f.dataset.bound='1'; f.addEventListener('submit',e=>{e.preventDefault(); const d=Object.fromEntries(new FormData(f).entries()); const rows=medRows(); rows.push({...d,date:todayISO()}); save('hd_medications',rows); f.reset(); renderMed(); renderDashboard();});}
    document.addEventListener('click',e=>{const b=e.target.closest('[data-hd-del-med]'); if(b){const rows=medRows(); rows.splice(Number(b.dataset.hdDelMed),1); save('hd_medications',rows); renderMed(); renderDashboard();}},true);
    $('hdMedClear')?.addEventListener('click',()=>{if(confirm('Clear medication records from this device?')){save('hd_medications',[]);renderMed();renderDashboard();}});
    $('hdMedExport')?.addEventListener('click',()=>downloadCSV('health-dynamics-medication.csv',[['Name','Amount','Time','Frequency','Notes'],...medRows().map(r=>[r.name,r.amount,r.time,r.frequency,r.notes])]));}
  function downloadCSV(name,rows){const csv=rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500);}
  function linePath(vals,w,h,min,max){if(vals.length<2) vals=[vals[0]||0,vals[0]||0]; const pad=25; return vals.map((v,i)=>{const x=pad+i*((w-pad*2)/(vals.length-1)); const y=h-pad-((v-min)/(max-min||1))*(h-pad*2); return (i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}).join(' ')}
  function chartSVG(weight,bp,hr){const w=720,h=250; const all=[...weight,...bp,...hr].filter(v=>v!==null); if(!all.length)return '<div class="chart-empty">No chart data yet. Add weight, blood pressure, or heart-rate entries to build live trends.</div>'; const min=Math.min(...all)-5, max=Math.max(...all)+5; return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Recent health activity chart"><g stroke="#e2e8f0" stroke-width="1">${[0,1,2,3,4].map(i=>`<line x1="25" x2="695" y1="${25+i*50}" y2="${25+i*50}"/>`).join('')}</g>${weight.length?`<path d="${linePath(weight,w,h,min,max)}" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>`:''}${bp.length?`<path d="${linePath(bp,w,h,min,max)}" fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round"/>`:''}${hr.length?`<path d="${linePath(hr,w,h,min,max)}" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>`:''}</svg>`;}
  function getMetrics(){
    const health=store('health'), bp=store('hd_bp_readings'), sleep=store('hd_sleep_logs'), meds=store('hd_medications');
    const weight=latest(health,'weight') ?? latest(health,'weightLb') ?? latest(health,'weightlbs');
    const systolic=latest(bp,'sys'), diastolic=latest(bp,'dia'), pulse=latest(bp,'pulse') ?? latest(health,'pulse');
    const sleepHours=latest(sleep,'hours'), mood=latest(sleep,'mood'), energy=latest(sleep,'energy');
    const waterTarget=n(localStorage.getItem('hd_water_target_oz'));
    const water=n(localStorage.getItem('hd_today_water_oz'));
    const steps=n(localStorage.getItem('hd_today_steps'));
    const parts=[];
    if(sleepHours!==null) parts.push(Math.min(100,(sleepHours/8)*100));
    if(mood!==null) parts.push(Math.min(100,(mood/10)*100));
    if(energy!==null) parts.push(Math.min(100,(energy/10)*100));
    if(water!==null && waterTarget!==null && waterTarget>0) parts.push(Math.min(100,(water/waterTarget)*100));
    if(steps!==null) parts.push(Math.min(100,(steps/10000)*100));
    const healthScore=parts.length?Math.round(parts.reduce((a,b)=>a+b,0)/parts.length):null;
    return {weight,systolic,diastolic,pulse,sleepHours,mood,energy,healthScore,waterTarget,water,steps,meds};
  }
  function getSeries(){
    const health=store('health').slice(-7), bp=store('hd_bp_readings').slice(-7);
    const weights=health.map(r=>n(r.weight)||n(r.weightLb)||n(r.weightlbs)).filter(v=>v!==null);
    const sys=bp.map(r=>n(r.sys)).filter(v=>v!==null);
    const hr=bp.map(r=>n(r.pulse)).filter(v=>v!==null);
    return {weights,sys,hr};
  }
  function dataValue(value,suffix=''){return value===null||value===undefined||Number.isNaN(value)?'No data':String(value)+suffix;}
  function pctWidth(value,max){return value===null||value===undefined||!max?'0':Math.max(0,Math.min(100,(value/max)*100));}
  function dashboardHTML(){const m=getMetrics(), s=getSeries(); const tasks=JSON.parse(localStorage.getItem('hd_dashboard_tasks')||'{}'); const taskList=['Log Weight','Medication','Track Water','Evening Journal','10 min Walk / Movement'];
    const scoreText=m.healthScore===null?'—':`${m.healthScore}<small>/100</small>`;
    const sleepText=m.sleepHours===null?'No data':`${m.sleepHours.toFixed(1)}h`;
    const waterPct=(m.water!==null&&m.waterTarget)?Math.round(m.water/m.waterTarget*100):null;
    const waterText=waterPct===null?'No data':`${waterPct}%`;
    const waterSub=(m.water!==null&&m.waterTarget)?`${m.water} oz / ${m.waterTarget} oz`:(m.water!==null?`${m.water} oz logged`:'Add water log');
    const stepsText=m.steps===null?'No data':m.steps.toLocaleString();
    const moodText=m.mood===null?'No data':(m.mood>=8?'Good':m.mood>=5?'Okay':'Low');
    const moodSub=m.mood===null?'Add sleep/mood log':`${m.mood}/10`;
    const weightText=m.weight===null?'No data':`${m.weight}<small> lbs</small>`;
    const bpText=(m.systolic!==null&&m.diastolic!==null)?`${m.systolic}/${m.diastolic} <small>mmHg</small>`:'No data';
    const pulseText=m.pulse===null?'No data':`${m.pulse} <small>bpm</small>`;
    return `<div class="hd-dash"><div class="hd-hero"><div><h1>Welcome back 👋</h1><p>Here is your live health overview for ${fmtDate()}.</p></div><button class="hd-customize" data-hd-open="settings">⚙ Customize Dashboard</button></div>
    <div class="hd-metric-grid"><div class="hd-metric"><div class="hd-icon">💙</div><h3>Health Score</h3><div class="hd-value">${scoreText}</div><div class="hd-sub">Calculated only from saved local data</div><div class="hd-bar"><span style="width:${m.healthScore??0}%"></span></div></div><div class="hd-metric sleep"><div class="hd-icon">🌙</div><h3>Sleep</h3><div class="hd-value">${sleepText}</div><div class="hd-sub">Latest sleep log</div><div class="hd-bar"><span style="width:${pctWidth(m.sleepHours,8)}%"></span></div></div><div class="hd-metric water"><div class="hd-icon">💧</div><h3>Water</h3><div class="hd-value">${waterText}</div><div class="hd-sub">${waterSub}</div><div class="hd-bar"><span style="width:${waterPct??0}%"></span></div></div><div class="hd-metric steps"><div class="hd-icon">🚶</div><h3>Steps</h3><div class="hd-value">${stepsText}</div><div class="hd-sub">Optional user-entered tracking</div><div class="hd-bar"><span style="width:${pctWidth(m.steps,10000)}%"></span></div></div><div class="hd-metric mood"><div class="hd-icon">😊</div><h3>Mood</h3><div class="hd-value">${moodText}</div><div class="hd-sub">${moodSub}</div><div class="hd-bar"><span style="width:${m.mood!==null?m.mood*10:0}%"></span></div></div></div>
    <div class="hd-main-grid"><div class="hd-card"><h3>Today's Tasks</h3>${taskList.map((t,i)=>`<label class="hd-task-row ${tasks[i]?'done':''}"><input type="checkbox" data-hd-task="${i}" ${tasks[i]?'checked':''}><span>${t}</span></label>`).join('')}<button class="hd-add-task" data-hd-open="journal">＋ Add New Task</button></div><div class="hd-card hd-chart"><div class="hd-chart-head"><h3>Recent Activity</h3><div class="hd-range"><span class="active">7 Days</span><span>30 Days</span><span>90 Days</span></div></div><div class="hd-legend"><span><i class="hd-dot blue"></i>Weight</span><span><i class="hd-dot green"></i>Blood Pressure (SYS)</span><span><i class="hd-dot red"></i>Resting HR</span></div>${chartSVG(s.weights,s.sys,s.hr)}</div></div>
    <div class="hd-card"><h3>Quick Actions</h3><div class="hd-quick-grid"><button class="hd-quick" data-hd-open="health">⚖️ Log Weight</button><button class="hd-quick" data-hd-open="health">❤️ Log Vitals</button><button class="hd-quick" data-hd-open="medication">💊 Medication</button><button class="hd-quick" data-hd-open="syringe">💧 Water</button><button class="hd-quick" data-hd-open="journal">📝 Journal</button><button class="hd-quick" data-hd-open="labs">🧪 Lab Results</button><button class="hd-quick" data-hd-open="costs">💲 Cost Analysis</button><button class="hd-quick" data-hd-open="reports">📊 Reports</button></div></div>
    <div class="hd-lower-grid"><div class="hd-card"><h3>Weight Progress</h3><div class="hd-mini-stat">${weightText}</div><p class="hd-sub">Updates from Health Overview entries.</p><div class="hd-bar"><span style="width:${m.weight===null?0:50}%"></span></div></div><div class="hd-card"><h3>Latest Vitals</h3><div class="hd-list-row"><span>Blood Pressure</span><strong>${bpText}</strong></div><div class="hd-list-row"><span>Resting Heart Rate</span><strong>${pulseText}</strong></div><button class="hd-open" data-hd-open="health">View All Vitals</button></div><div class="hd-card"><h3>Today's Journal</h3><p>${safe((store('journal').slice(-1)[0]||{}).notes || (store('journal').slice(-1)[0]||{}).entry || 'No journal entry yet. Open Journal to add notes for today.')}</p><button class="hd-open" data-hd-open="journal">Open Journal</button></div><div class="hd-card"><h3>Health Insights</h3><p>${m.healthScore===null?'No insights yet. Add sleep, mood, hydration, steps, or vitals to generate live dashboard feedback.':'Your dashboard is using only records saved locally in this browser.'}</p></div><div class="hd-card"><h3>Upcoming Appointments</h3><div class="hd-list-row"><span>Next Check-in</span><strong>No appointment saved</strong></div><button class="hd-open" data-hd-open="journal">Add Note</button></div><div class="hd-card"><h3>Reminders</h3><div class="hd-list-row"><span>Medication</span><strong>${m.meds.length?safe(m.meds[0].time||'Saved'):'No medication logs'}</strong></div><button class="hd-open" data-hd-open="medication">Open Medication</button></div></div></div>`;
  }
  function renderDashboard(){const panel=$('overview'); if(!panel)return; panel.innerHTML=dashboardHTML(); bindTasks();}
  function bindTasks(){$$('[data-hd-task]').forEach(cb=>{cb.addEventListener('change',()=>{const tasks=JSON.parse(localStorage.getItem('hd_dashboard_tasks')||'{}'); tasks[cb.dataset.hdTask]=cb.checked; localStorage.setItem('hd_dashboard_tasks',JSON.stringify(tasks)); cb.closest('.hd-task-row')?.classList.toggle('done',cb.checked);});});}
  function init(){prepSidebar(); buildMedicationPanel(); bindMed(); renderMed(); renderDashboard();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('storage',renderDashboard);
  const oldSet=localStorage.setItem.bind(localStorage); localStorage.setItem=function(k,v){oldSet(k,v); if(/^hd_|health|labs|journal/.test(k)){clearTimeout(window.__hdDashTimer); window.__hdDashTimer=setTimeout(()=>{renderDashboard();renderMed();},80);}};
})();
