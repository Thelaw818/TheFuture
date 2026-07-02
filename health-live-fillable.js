(function(){
  'use strict';
  const $=(id)=>document.getElementById(id);
  const q=(sel)=>document.querySelector(sel);
  const today=()=>new Date().toISOString().slice(0,10);
  const num=(v)=>{const n=Number(v); return Number.isFinite(n)?n:null};
  const arr=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return []}};
  const save=(key,val)=>localStorage.setItem(key,JSON.stringify(val));
  const esc=(s)=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const latest=(key,field)=>{const rows=arr(key).slice().sort((a,b)=>new Date(b.date||b.createdAt||0)-new Date(a.date||a.createdAt||0)); for(const r of rows){const v=num(r[field]); if(v!==null)return v;} return null};
  function seedStarterData(){
    if(localStorage.getItem('hd_live_fillable_seeded_v1')==='yes') return;
    const hasAny = arr('health').length || arr('hd_bp_readings').length || arr('hd_sleep_logs').length || arr('journal').length || arr('protocols').length;
    if(!hasAny){
      save('health',[{date:today(),weight:'192.4',weightUnit:'lb',systolic:'118',diastolic:'74',heartRate:'68',glucose:'',glucoseUnit:'mg/dL',heightFeet:'5',heightInches:'10',notes:'Starter health record. Edit or delete anytime.'}]);
      save('hd_bp_readings',[{date:today(),sys:'118',dia:'74',pulse:'68',notes:'Starter vitals record.'}]);
      save('hd_sleep_logs',[{date:today(),hours:'7.8',quality:'8',mood:'8',energy:'8',notes:'Starter sleep and mood record.'}]);
      save('hd_medications',[{date:today(),name:'Medication',amount:'',time:'Morning',frequency:'As recorded',notes:'Starter reminder. Edit or delete anytime.'}]);
      save('journal',[{date:today(),entry:'Starter journal note. Replace this with your own daily health notes.',notes:'Starter journal note. Replace this with your own daily health notes.'}]);
      localStorage.setItem('hd_today_water_oz','64');
      localStorage.setItem('hd_today_water_goal','94');
      localStorage.setItem('hd_today_steps','6523');
      localStorage.setItem('hd_steps_goal','10000');
    }
    localStorage.setItem('hd_live_fillable_seeded_v1','yes');
  }
  function setVal(id,val){const el=$(id); if(el) el.value = val ?? '';}
  function latestObj(key){return arr(key).slice().sort((a,b)=>new Date(b.date||b.createdAt||0)-new Date(a.date||a.createdAt||0))[0]||{};}
  function renderLiveCenter(){
    const overview=$('overview'); if(!overview) return;
    if(!$('hdLiveFillCenter')){
      const wrap=document.createElement('div');
      wrap.id='hdLiveFillCenter';
      wrap.className='hd-card';
      wrap.style.marginTop='18px';
      wrap.innerHTML=`
        <h3>Live Data Entry Center</h3>
        <p class="hd-sub">Everything entered here is saved locally on this device and updates the dashboard, logs, reports, and charts.</p>
        <div class="hd-live-entry-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin-top:12px">
          <form id="hdQuickVitals" class="hd-live-form"><h4>Vitals / Weight</h4><input id="hdQDate" type="date" required><input id="hdQWeight" type="number" step="0.1" placeholder="Weight lb"><input id="hdQSys" type="number" placeholder="BP systolic"><input id="hdQDia" type="number" placeholder="BP diastolic"><input id="hdQPulse" type="number" placeholder="Heart rate BPM"><button class="btn primary" type="submit">Save Vitals</button></form>
          <form id="hdQuickSleep" class="hd-live-form"><h4>Sleep / Mood</h4><input id="hdSDate" type="date" required><input id="hdSHours" type="number" step="0.1" placeholder="Sleep hours"><input id="hdSQuality" type="number" min="1" max="10" placeholder="Sleep quality 1-10"><input id="hdSMood" type="number" min="1" max="10" placeholder="Mood 1-10"><input id="hdSEnergy" type="number" min="1" max="10" placeholder="Energy 1-10"><button class="btn primary" type="submit">Save Sleep/Mood</button></form>
          <form id="hdQuickActivity" class="hd-live-form"><h4>Water / Steps</h4><input id="hdWaterOz" type="number" placeholder="Water today oz"><input id="hdWaterGoal" type="number" placeholder="Water goal oz"><input id="hdSteps" type="number" placeholder="Steps today"><input id="hdStepsGoal" type="number" placeholder="Steps goal"><button class="btn primary" type="submit">Update Activity</button></form>
          <form id="hdQuickMedication" class="hd-live-form"><h4>Medication</h4><input id="hdMedName" placeholder="Medication"><input id="hdMedAmount" placeholder="Amount"><input id="hdMedTime" placeholder="Time"><input id="hdMedFreq" placeholder="Frequency"><button class="btn primary" type="submit">Save Medication</button></form>
          <form id="hdQuickJournal" class="hd-live-form" style="grid-column:1/-1"><h4>Journal / Notes</h4><input id="hdJDate" type="date" required><textarea id="hdJEntry" rows="3" placeholder="Write notes..."></textarea><button class="btn primary" type="submit">Save Journal Entry</button></form>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button class="btn" id="hdRefreshAllLive" type="button">Refresh Live Dashboard</button><button class="btn" id="hdExportLiveData" type="button">Export Health Data JSON</button></div>`;
      overview.appendChild(wrap);
      bindLiveCenter();
    }
    fillLiveCenterDefaults();
  }
  function fillLiveCenterDefaults(){
    const h=latestObj('health'), bp=latestObj('hd_bp_readings'), s=latestObj('hd_sleep_logs'), m=latestObj('hd_medications'), j=latestObj('journal');
    setVal('hdQDate', h.date || bp.date || today()); setVal('hdQWeight', h.weight || ''); setVal('hdQSys', h.systolic || bp.sys || ''); setVal('hdQDia', h.diastolic || bp.dia || ''); setVal('hdQPulse', h.heartRate || bp.pulse || '');
    setVal('hdSDate', s.date || today()); setVal('hdSHours', s.hours || ''); setVal('hdSQuality', s.quality || ''); setVal('hdSMood', s.mood || ''); setVal('hdSEnergy', s.energy || '');
    setVal('hdWaterOz', localStorage.getItem('hd_today_water_oz') || ''); setVal('hdWaterGoal', localStorage.getItem('hd_today_water_goal') || '94'); setVal('hdSteps', localStorage.getItem('hd_today_steps') || ''); setVal('hdStepsGoal', localStorage.getItem('hd_steps_goal') || '10000');
    setVal('hdMedName', m.name || ''); setVal('hdMedAmount', m.amount || ''); setVal('hdMedTime', m.time || ''); setVal('hdMedFreq', m.frequency || '');
    setVal('hdJDate', j.date || today()); setVal('hdJEntry', j.entry || j.notes || '');
  }
  function refreshAll(){
    if(typeof window.render==='function') try{window.render()}catch(e){}
    if(typeof window.paRenderProfessionalUpgrade==='function') try{window.paRenderProfessionalUpgrade()}catch(e){}
    if(typeof window.dispatchEvent==='function') window.dispatchEvent(new Event('storage'));
    setTimeout(renderLiveCenter,150);
  }
  function bindLiveCenter(){
    $('hdQuickVitals')?.addEventListener('submit',e=>{e.preventDefault(); const date=$('hdQDate').value||today(); const rec={date,weight:$('hdQWeight').value,weightUnit:'lb',systolic:$('hdQSys').value,diastolic:$('hdQDia').value,heartRate:$('hdQPulse').value,glucose:'',glucoseUnit:'mg/dL',notes:'Saved from Live Data Entry Center'}; const rows=arr('health'); rows.push(rec); save('health',rows); const bp=arr('hd_bp_readings'); bp.push({date,sys:rec.systolic,dia:rec.diastolic,pulse:rec.heartRate,notes:'Saved from Live Data Entry Center'}); save('hd_bp_readings',bp); refreshAll();});
    $('hdQuickSleep')?.addEventListener('submit',e=>{e.preventDefault(); const rows=arr('hd_sleep_logs'); rows.push({date:$('hdSDate').value||today(),hours:$('hdSHours').value,quality:$('hdSQuality').value,mood:$('hdSMood').value,energy:$('hdSEnergy').value,notes:'Saved from Live Data Entry Center'}); save('hd_sleep_logs',rows); refreshAll();});
    $('hdQuickActivity')?.addEventListener('submit',e=>{e.preventDefault(); localStorage.setItem('hd_today_water_oz',$('hdWaterOz').value||'0'); localStorage.setItem('hd_today_water_goal',$('hdWaterGoal').value||'94'); localStorage.setItem('hd_today_steps',$('hdSteps').value||'0'); localStorage.setItem('hd_steps_goal',$('hdStepsGoal').value||'10000'); refreshAll();});
    $('hdQuickMedication')?.addEventListener('submit',e=>{e.preventDefault(); const rows=arr('hd_medications'); rows.push({date:today(),name:$('hdMedName').value,amount:$('hdMedAmount').value,time:$('hdMedTime').value,frequency:$('hdMedFreq').value,notes:'Saved from Live Data Entry Center'}); save('hd_medications',rows); refreshAll();});
    $('hdQuickJournal')?.addEventListener('submit',e=>{e.preventDefault(); const rows=arr('journal'); rows.push({date:$('hdJDate').value||today(),entry:$('hdJEntry').value,notes:$('hdJEntry').value}); save('journal',rows); refreshAll();});
    $('hdRefreshAllLive')?.addEventListener('click',refreshAll);
    $('hdExportLiveData')?.addEventListener('click',()=>{const keys=['health','hd_bp_readings','hd_sleep_logs','hd_medications','journal','labs','measurements','protocols','costs','peptideLogs','logs']; const data={app:'Health Dynamics',exportedAt:new Date().toISOString()}; keys.forEach(k=>data[k]=arr(k)); data.activity={waterOz:localStorage.getItem('hd_today_water_oz'),waterGoal:localStorage.getItem('hd_today_water_goal'),steps:localStorage.getItem('hd_today_steps'),stepsGoal:localStorage.getItem('hd_steps_goal')}; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})); a.download='health-dynamics-live-data-backup.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500);});
  }
  function patchDashboardFallbacks(){
    // Make the old dashboard numbers editable by storing them as actual local records, not just display text.
    seedStarterData();
    renderLiveCenter();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(patchDashboardFallbacks,350)); else setTimeout(patchDashboardFallbacks,350);
  document.addEventListener('click',e=>{if(e.target.closest('[data-hd-open],.tab,.navbtn,button')) setTimeout(renderLiveCenter,250);},true);
  const oldSet=localStorage.setItem.bind(localStorage); localStorage.setItem=function(k,v){oldSet(k,v); if(/^(health|hd_|journal|labs|measurements|protocols|costs|peptideLogs|logs)/.test(k)){clearTimeout(window.__hdFillTimer); window.__hdFillTimer=setTimeout(renderLiveCenter,250);}};
})();
