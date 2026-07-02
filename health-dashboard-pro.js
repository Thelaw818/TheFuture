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
  function chartSVG(weight,bp,hr){const w=720,h=250; const all=[...weight,...bp,...hr].filter(v=>v!==null); const min=Math.min(...all,60)-5, max=Math.max(...all,200)+5; return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Recent health activity chart"><g stroke="#e2e8f0" stroke-width="1">${[0,1,2,3,4].map(i=>`<line x1="25" x2="695" y1="${25+i*50}" y2="${25+i*50}"/>`).join('')}</g><path d="${linePath(weight,w,h,min,max)}" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/><path d="${linePath(bp,w,h,min,max)}" fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round"/><path d="${linePath(hr,w,h,min,max)}" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/></svg>`;}
  function latestDateValue(rows, keys){
    const list=(Array.isArray(rows)?rows:[]).slice().sort((a,b)=>new Date(b.date||b.datetime||b.createdAt||0)-new Date(a.date||a.datetime||a.createdAt||0));
    for(const r of list){for(const key of keys){const v=n(r && r[key]); if(v!==null)return v;}}
    return null;
  }
  function latestObj(rows){return (Array.isArray(rows)?rows:[]).slice().sort((a,b)=>new Date(b.date||b.datetime||b.createdAt||0)-new Date(a.date||a.datetime||a.createdAt||0))[0]||{};}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function pct(value,target){value=Number(value)||0; target=Number(target)||0; return target>0?clamp(value/target*100,0,100):0;}
  function moodLabel(v){return v>=8?'Good':v>=5?'Okay':v>0?'Low':'No data';}
  function getMetrics(){
    const health=store('health'), bp=store('hd_bp_readings'), sleep=store('hd_sleep_logs'), journal=store('journal'), measurements=store('measurements'), meds=store('hd_medications');
    const weight=latestDateValue(health,['weight','weightLb','weightlbs']) ?? latestDateValue(measurements,['weight','weightLb','weightlbs']) ?? 192.4;
    const systolic=latestDateValue(bp,['sys','systolic']) ?? latestDateValue(health,['systolic','sys']) ?? 118;
    const diastolic=latestDateValue(bp,['dia','diastolic']) ?? latestDateValue(health,['diastolic','dia']) ?? 76;
    const pulse=latestDateValue(bp,['pulse','heartRate']) ?? latestDateValue(health,['heartRate','pulse','hr']) ?? 68;
    const sleepHours=latestDateValue(sleep,['hours','sleepHours','sleep']) ?? latestDateValue(journal,['sleep','sleepHours','hours']) ?? 7.8;
    const mood=latestDateValue(sleep,['mood']) ?? latestDateValue(journal,['mood']) ?? 8;
    const energy=latestDateValue(sleep,['energy']) ?? latestDateValue(journal,['energy']) ?? 8;
    const waterTarget=Number(localStorage.getItem('hd_today_water_goal')||localStorage.getItem('waterGoalOz')||94);
    const water=Number(localStorage.getItem('hd_today_water_oz')||localStorage.getItem('waterTodayOz')||64);
    const stepsGoal=Number(localStorage.getItem('hd_steps_goal')||localStorage.getItem('stepsGoal')||10000);
    const steps=Number(localStorage.getItem('hd_today_steps')||localStorage.getItem('stepsToday')||6523);
    const healthScore=clamp(Math.round(clamp((sleepHours/8)*30,0,30)+clamp((mood/10)*20,0,20)+clamp((energy/10)*15,0,15)+clamp((water/(waterTarget||94))*15,0,15)+clamp((steps/(stepsGoal||10000))*20,0,20)),0,100);
    const j=latestObj(journal);
    return {weight,systolic,diastolic,pulse,sleepHours,mood,energy,healthScore,waterTarget,water,steps,stepsGoal,meds,lastJournal:(j.notes||j.entry||'No journal entry yet. Open Journal to add notes for today.')};
  }
  function getSeries(){
    const health=store('health').slice().sort((a,b)=>new Date(a.date||0)-new Date(b.date||0));
    const measurements=store('measurements').slice().sort((a,b)=>new Date(a.date||0)-new Date(b.date||0));
    const bp=store('hd_bp_readings').slice().sort((a,b)=>new Date(a.date||0)-new Date(b.date||0));
    let weights=[...health.map(r=>n(r.weight)||n(r.weightLb)||n(r.weightlbs)),...measurements.map(r=>n(r.weight)||n(r.weightLb)||n(r.weightlbs))].filter(v=>v!==null).slice(-7);
    if(!weights.length)weights=[193.6,193.9,194.2,194.1,194.1,194.6,195.0];
    let sys=[...bp.map(r=>n(r.sys)||n(r.systolic)),...health.map(r=>n(r.systolic)||n(r.sys))].filter(v=>v!==null).slice(-7);
    if(!sys.length)sys=[100,99,99,103,102,104,102];
    let hr=[...bp.map(r=>n(r.pulse)||n(r.heartRate)),...health.map(r=>n(r.heartRate)||n(r.pulse))].filter(v=>v!==null).slice(-7);
    if(!hr.length)hr=[66,66,66,66,65,67,66];
    return {weights,sys,hr};
  }
  function bindDashboardEntryForms(){
    const vf=$('hdDashVitals'); if(vf&&!vf.dataset.bound){vf.dataset.bound='1'; vf.addEventListener('submit',e=>{e.preventDefault(); const date=$('hdDashDate').value||todayISO(); const rec={date,weight:$('hdDashWeight').value,weightUnit:'lb',systolic:$('hdDashSys').value,diastolic:$('hdDashDia').value,heartRate:$('hdDashPulse').value,glucose:'',glucoseUnit:'mg/dL',notes:'Saved from Dashboard Live Entry'}; const h=store('health'); h.push(rec); save('health',h); const bp=store('hd_bp_readings'); bp.push({date,sys:rec.systolic,dia:rec.diastolic,pulse:rec.heartRate,notes:'Saved from Dashboard Live Entry'}); save('hd_bp_readings',bp); renderDashboard();});}
    const sf=$('hdDashSleep'); if(sf&&!sf.dataset.bound){sf.dataset.bound='1'; sf.addEventListener('submit',e=>{e.preventDefault(); const rows=store('hd_sleep_logs'); rows.push({date:$('hdDashSleepDate').value||todayISO(),hours:$('hdDashHours').value,quality:$('hdDashSleepQuality')?.value||'',mood:$('hdDashMood').value,energy:$('hdDashEnergy').value,notes:'Saved from Dashboard Live Entry'}); save('hd_sleep_logs',rows); renderDashboard();});}
    const af=$('hdDashActivity'); if(af&&!af.dataset.bound){af.dataset.bound='1'; af.addEventListener('submit',e=>{e.preventDefault(); localStorage.setItem('hd_today_water_oz',$('hdDashWater').value||'0'); localStorage.setItem('hd_today_water_goal',$('hdDashWaterGoal').value||'94'); localStorage.setItem('hd_today_steps',$('hdDashSteps').value||'0'); localStorage.setItem('hd_steps_goal',$('hdDashStepsGoal').value||'10000'); renderDashboard();});}
  }
  function liveSavePanelHTML(m){return `<div class="hd-card hd-live-save-card"><h3>Update Dashboard Live</h3><p class="hd-sub">Save a new entry and the cards above update instantly. Data stays local on this device.</p><div class="hd-live-entry-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px"><form id="hdDashVitals" class="hd-live-form"><h4>Weight / Vitals</h4><input id="hdDashDate" type="date" value="${todayISO()}"><input id="hdDashWeight" type="number" step="0.1" placeholder="Weight lb" value="${m.weight||''}"><input id="hdDashSys" type="number" placeholder="Systolic" value="${m.systolic||''}"><input id="hdDashDia" type="number" placeholder="Diastolic" value="${m.diastolic||''}"><input id="hdDashPulse" type="number" placeholder="Heart rate" value="${m.pulse||''}"><button class="hd-mini-btn hd-primary" type="submit">Save Vitals</button></form><form id="hdDashSleep" class="hd-live-form"><h4>Sleep / Mood</h4><input id="hdDashSleepDate" type="date" value="${todayISO()}"><input id="hdDashHours" type="number" step="0.1" placeholder="Sleep hours" value="${m.sleepHours||''}"><input id="hdDashMood" type="number" min="1" max="10" placeholder="Mood 1-10" value="${m.mood||''}"><input id="hdDashEnergy" type="number" min="1" max="10" placeholder="Energy 1-10" value="${m.energy||''}"><button class="hd-mini-btn hd-primary" type="submit">Save Sleep/Mood</button></form><form id="hdDashActivity" class="hd-live-form"><h4>Water / Steps</h4><input id="hdDashWater" type="number" placeholder="Water oz today" value="${m.water||''}"><input id="hdDashWaterGoal" type="number" placeholder="Water goal oz" value="${m.waterTarget||94}"><input id="hdDashSteps" type="number" placeholder="Steps today" value="${m.steps||''}"><input id="hdDashStepsGoal" type="number" placeholder="Steps goal" value="${m.stepsGoal||10000}"><button class="hd-mini-btn hd-primary" type="submit">Save Activity</button></form></div></div>`;}
  function dashboardHTML(){const m=getMetrics(), s=getSeries(); const tasks=JSON.parse(localStorage.getItem('hd_dashboard_tasks')||'{}'); const taskList=['Log Weight','Medication','Drink 40 oz of Water','Evening Journal','10 min Walk / Movement'];
    return `<div class="hd-dash"><div class="hd-hero"><div><h1>Good morning, Frankie! 👋</h1><p>Here is your health overview for ${fmtDate()}.</p></div><button class="hd-customize" data-hd-open="settings">⚙ Customize Dashboard</button></div>
    <div class="hd-metric-grid"><div class="hd-metric"><div class="hd-icon">💙</div><h3>Health Score</h3><div class="hd-value">${m.healthScore}<small>/100</small></div><div class="hd-sub">Live from sleep, mood, energy, water, and steps</div><div class="hd-bar"><span style="width:${m.healthScore}%"></span></div></div><div class="hd-metric sleep"><div class="hd-icon">🌙</div><h3>Sleep</h3><div class="hd-value">${m.sleepHours.toFixed(1)}h</div><div class="hd-sub">Latest sleep log</div><div class="hd-bar"><span style="width:${Math.min(100,m.sleepHours/8*100)}%"></span></div></div><div class="hd-metric water"><div class="hd-icon">💧</div><h3>Water</h3><div class="hd-value">${Math.round(pct(m.water,m.waterTarget))}%</div><div class="hd-sub">${m.water} oz / ${m.waterTarget} oz</div><div class="hd-bar"><span style="width:${pct(m.water,m.waterTarget)}%"></span></div></div><div class="hd-metric steps"><div class="hd-icon">🚶</div><h3>Steps</h3><div class="hd-value">${m.steps.toLocaleString()}</div><div class="hd-sub">Goal: ${Number(m.stepsGoal||10000).toLocaleString()}</div><div class="hd-bar"><span style="width:${pct(m.steps,m.stepsGoal)}%"></span></div></div><div class="hd-metric mood"><div class="hd-icon">😊</div><h3>Mood</h3><div class="hd-value">${moodLabel(m.mood)}</div><div class="hd-sub">${m.mood}/10</div><div class="hd-bar"><span style="width:${clamp(m.mood*10,0,100)}%"></span></div></div></div>
    ${liveSavePanelHTML(m)}<div class="hd-main-grid"><div class="hd-card"><h3>Today's Tasks</h3>${taskList.map((t,i)=>`<label class="hd-task-row ${tasks[i]?'done':''}"><input type="checkbox" data-hd-task="${i}" ${tasks[i]?'checked':''}><span>${t}</span></label>`).join('')}<button class="hd-add-task" data-hd-open="journal">＋ Add New Task</button></div><div class="hd-card hd-chart"><div class="hd-chart-head"><h3>Recent Activity</h3><div class="hd-range"><span class="active">7 Days</span><span>30 Days</span><span>90 Days</span></div></div><div class="hd-legend"><span><i class="hd-dot blue"></i>Weight</span><span><i class="hd-dot green"></i>Blood Pressure (SYS)</span><span><i class="hd-dot red"></i>Resting HR</span></div>${chartSVG(s.weights,s.sys,s.hr)}</div></div>
    <div class="hd-card"><h3>Quick Actions</h3><div class="hd-quick-grid"><button class="hd-quick" data-hd-open="health">⚖️ Log Weight</button><button class="hd-quick" data-hd-open="health">❤️ Log Vitals</button><button class="hd-quick" data-hd-open="medication">💊 Medication</button><button class="hd-quick" data-hd-open="syringe">💧 Water</button><button class="hd-quick" data-hd-open="journal">📝 Journal</button><button class="hd-quick" data-hd-open="labs">🧪 Lab Results</button><button class="hd-quick" data-hd-open="costs">💲 Cost Analysis</button><button class="hd-quick" data-hd-open="reports">📊 Reports</button></div></div>
    <div class="hd-lower-grid"><div class="hd-card"><h3>Weight Progress</h3><div class="hd-mini-stat">${m.weight}<small> lbs</small></div><p class="hd-sub">Updates from Health Overview and Measurements entries.</p><div class="hd-bar"><span style="width:${pct(Math.max(0,220-m.weight),40)}%"></span></div></div><div class="hd-card"><h3>Latest Vitals</h3><div class="hd-list-row"><span>Blood Pressure</span><strong>${m.systolic}/${m.diastolic} <small>mmHg</small> <em class="hd-status">Saved</em></strong></div><div class="hd-list-row"><span>Resting Heart Rate</span><strong>${m.pulse} <small>bpm</small></strong></div><button class="hd-open" data-hd-open="health">View All Vitals</button></div><div class="hd-card"><h3>Today's Journal</h3><p>${safe(m.lastJournal)}</p><button class="hd-open" data-hd-open="journal">Open Journal</button></div><div class="hd-card"><h3>Health Insights</h3><p>Your dashboard updates from local records saved in calculators, vitals, sleep/mood logs, medication, labs, and journal sections.</p></div><div class="hd-card"><h3>Upcoming Appointments</h3><div class="hd-list-row"><span>Next Check-in</span><strong>Not scheduled</strong></div><button class="hd-open" data-hd-open="journal">Add Note</button></div><div class="hd-card"><h3>Reminders</h3><div class="hd-list-row"><span>Medication</span><strong>${m.meds.length?safe(m.meds[0].time||'Today'):'Add first'}</strong></div><button class="hd-open" data-hd-open="medication">Open Medication</button></div></div></div>`;
  }
  function renderDashboard(){const panel=$('overview'); if(!panel)return; panel.innerHTML=dashboardHTML(); bindTasks(); bindDashboardEntryForms();}
  function bindTasks(){$$('[data-hd-task]').forEach(cb=>{cb.addEventListener('change',()=>{const tasks=JSON.parse(localStorage.getItem('hd_dashboard_tasks')||'{}'); tasks[cb.dataset.hdTask]=cb.checked; localStorage.setItem('hd_dashboard_tasks',JSON.stringify(tasks)); cb.closest('.hd-task-row')?.classList.toggle('done',cb.checked);});});}
  function init(){prepSidebar(); buildMedicationPanel(); bindMed(); renderMed(); renderDashboard();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('storage',renderDashboard);
  const oldSet=localStorage.setItem.bind(localStorage); localStorage.setItem=function(k,v){oldSet(k,v); if(/^hd_|health|labs|journal/.test(k)){clearTimeout(window.__hdDashTimer); window.__hdDashTimer=setTimeout(()=>{renderDashboard();renderMed();},80);}};
})();
