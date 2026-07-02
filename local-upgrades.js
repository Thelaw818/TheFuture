/* Local-only reliability upgrades: no cloud, no server, no remote sync. */
(function(){
  'use strict';
  const DATA_KEYS = [
    'inventory','logs','coas','labs','health','measurements','peptideLogs','protocols','costs','vendors','journal','audit','notes','structuredNotes',
    'pa_live_inventory_records','pa_live_dose_records','pa_live_coa_records','pa_live_lab_records','pa_live_health_records','pa_body_measurements',
    'pa_pdf_coa_records','pa_coa_attached_files','pa_section_attachments_inventory','pa_section_attachments_coa','halfLifeSettings','settings','paUser'
  ];
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  function parse(k, fallback){ try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback; } catch(e){ return fallback; } }
  function download(name, text, type){
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),500);
  }
  function collectBackup(){
    const data={}; DATA_KEYS.forEach(k=>{ const v=localStorage.getItem(k); if(v!==null) data[k]=v; });
    return {app:'Health Dynamics Local-Only Tracker', version:'local-only-2026.06', exportedAt:new Date().toISOString(), storage:'browser-device-local-only', data};
  }
  window.paExportLocalOnlyBackup = function(){
    download('peptide-anonymous-local-backup-'+new Date().toISOString().slice(0,10)+'.json', JSON.stringify(collectBackup(),null,2), 'application/json');
    localStorage.setItem('paLastBackupAt', new Date().toISOString());
    renderLocalStatus();
  };
  window.paImportLocalOnlyBackup = function(file){
    const r=new FileReader();
    r.onload=()=>{ try{
      const parsed=JSON.parse(String(r.result||'{}'));
      const data=parsed.data || parsed;
      Object.entries(data).forEach(([k,v])=>{ if(typeof v==='string') localStorage.setItem(k,v); else localStorage.setItem(k, JSON.stringify(v)); });
      localStorage.setItem('paLastImportAt', new Date().toISOString());
      alert('Local backup imported successfully.'); location.reload();
    }catch(e){ alert('Import failed. Select a valid Health Dynamics JSON backup.'); }};
    r.readAsText(file);
  };
  function bytes(){ let total=0; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); total += (k.length + (localStorage.getItem(k)||'').length) * 2; } return total; }
  function fmtBytes(n){ return n<1024 ? n+' B' : n<1048576 ? (n/1024).toFixed(1)+' KB' : (n/1048576).toFixed(2)+' MB'; }
  function daysSince(iso){ if(!iso) return null; const d=(Date.now()-new Date(iso).getTime())/86400000; return isFinite(d)?Math.floor(d):null; }
  function renderLocalStatus(){
    const box=$('#localOnlyStatusBox'); if(!box) return;
    const last=localStorage.getItem('paLastBackupAt'); const d=daysSince(last); const warning=d===null||d>=7;
    box.innerHTML=`<div class="stat"><span>${fmtBytes(bytes())}</span><small>Local browser storage used</small></div>
      <div class="stat"><span>${last?esc(new Date(last).toLocaleDateString()):'Never'}</span><small>Last JSON backup</small></div>
      <div class="stat"><span>${warning?'Backup due':'Current'}</span><small>${warning?'Export a backup now':'Backup reminder'}</small></div>`;
  }
  function injectUI(){
    if($('#localOnlyUpgradeCard')) return;
    const target=$('#backup .card') || $('#admin .card') || $('#overview');
    if(target){
      const card=document.createElement('div'); card.className='card local-only-upgrade-card'; card.id='localOnlyUpgradeCard';
      card.innerHTML=`<h3>Local-only device storage</h3>
      <p class="muted"><strong>Nothing is uploaded.</strong> Records stay on this browser/device. Use JSON backups to transfer or protect your data.</p>
      <div id="localOnlyStatusBox" class="cards"></div>
      <div class="actions"><button class="btn primary" type="button" id="localOnlyExportBtn">Export Local Backup</button>
      <label class="btn secondary">Import Local Backup<input id="localOnlyImportInput" type="file" accept="application/json" style="display:none"></label></div>`;
      target.parentNode.insertBefore(card, target.nextSibling);
    }
    $('#localOnlyExportBtn')?.addEventListener('click', window.paExportLocalOnlyBackup);
    $('#localOnlyImportInput')?.addEventListener('change', e=>{ if(e.target.files[0]) window.paImportLocalOnlyBackup(e.target.files[0]); });
    renderLocalStatus();
  }
  function addBackupReminder(){
    const last=localStorage.getItem('paLastBackupAt'); const d=daysSince(last); if(d!==null && d<7) return;
    if($('.pa-local-backup-reminder')) return;
    const app=$('#app'); if(!app) return;
    const div=document.createElement('div'); div.className='data-warning pa-local-backup-reminder';
    div.innerHTML='<strong>Local backup reminder:</strong> Your data is device-only. Export a JSON backup before clearing browser data or switching devices.';
    app.insertBefore(div, app.firstChild);
  }
  function patchAuthText(){
    const help=document.querySelector('.login-help p'); if(help) help.textContent='Create a local profile first, then sign in on this same device. No master password is included.';
    const loginMsg=$('#loginMsg'); if(loginMsg && /Frankie|Calstate/i.test(loginMsg.textContent)) loginMsg.textContent='';
  }
  function removeHardcodedMaster(){
    // Existing files may have older event listeners; this capture listener enforces saved-device profile only.
    const form=$('#loginForm'); if(!form || form.dataset.localOnlyAuth==='1') return; form.dataset.localOnlyAuth='1';
    form.addEventListener('submit', function(e){
      e.preventDefault(); e.stopImmediatePropagation();
      const fd=new FormData(form), login=String(fd.get('email')||'').trim().toLowerCase(), pass=String(fd.get('password')||'');
      const u=parse('paUser',{});
      const ok=(login===String(u.email||'').trim().toLowerCase() || login===String(u.name||'').trim().toLowerCase()) && pass===String(u.password||'');
      if(ok){ localStorage.setItem('paLoggedIn','true'); $('#loginMsg')&&( $('#loginMsg').textContent='Access verified on this device.' ); location.hash='#app'; setTimeout(()=>window.paOpenPanel?window.paOpenPanel('overview'):null,50); }
      else { localStorage.removeItem('paLoggedIn'); $('#loginMsg')&&( $('#loginMsg').textContent='Access denied. Use the local profile/passcode saved on this device.' ); }
    }, true);
  }
  document.addEventListener('DOMContentLoaded', function(){ injectUI(); addBackupReminder(); patchAuthText(); removeHardcodedMaster(); });
  window.addEventListener('storage', renderLocalStatus);
  const oldSet=localStorage.setItem.bind(localStorage); localStorage.setItem=function(k,v){ oldSet(k,v); if(/^paLastBackupAt$|inventory|logs|coas|labs|health|costs|vendors|measurements|peptide/i.test(k)) setTimeout(renderLocalStatus,50); };
})();
