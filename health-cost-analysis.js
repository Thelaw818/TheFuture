(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const num = v => { const n = parseFloat(String(v ?? '').replace(/[^0-9.-]/g,'')); return Number.isFinite(n) ? n : 0; };
  const money = v => '$' + num(v).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2});
  const esc = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const getRows = () => { try { return JSON.parse(localStorage.getItem('costs') || '[]'); } catch(e){ return []; } };
  const saveRows = rows => localStorage.setItem('costs', JSON.stringify(rows));

  const benchmarks = {
    acaIndOop: 10600,
    acaFamilyOop: 21200,
    hsaSelf: 4400,
    hsaFamily: 8750,
    hdhpDedSelf: 1700,
    hdhpDedFamily: 3400,
    hdhpOopSelf: 8500,
    hdhpOopFamily: 17000,
    medicareBMonthly: 202.90,
    medicareBDeductible: 283,
    employerFamilyPremium: 26993,
    workerFamilyShare: 6850,
    avgSingleDeductible: 1886
  };

  function annualPremium(r){
    return Math.max(0, (num(r.monthlyPremium) - num(r.employerContribution)) * 12);
  }
  function plannedCare(r){
    return (num(r.primaryVisits) * num(r.primaryCopay)) +
      (num(r.specialistVisits) * num(r.specialistCopay)) +
      num(r.labCosts) + num(r.rxCosts) + num(r.therapyCosts) + num(r.emergencyFund);
  }
  function estimatedAnnual(r){
    return Math.max(0, annualPremium(r) + plannedCare(r) - num(r.reimbursements));
  }
  function worstCase(r){
    const oop = num(r.oopMax);
    const care = plannedCare(r);
    const exposure = oop > 0 ? Math.min(Math.max(care, num(r.annualDeductible)), oop) : care;
    return Math.max(0, annualPremium(r) + exposure - num(r.reimbursements));
  }
  function monthlyBudget(r){ return estimatedAnnual(r) / 12; }
  function labelFor(r){ return [r.person, r.coverageType, r.planName].filter(Boolean).join(' / ') || 'Scenario'; }

  function grouped(rows, keyFn, valFn){
    return rows.reduce((m,r)=>{ const k = keyFn(r) || 'Unspecified'; m[k] = (m[k]||0) + valFn(r); return m; },{});
  }
  function draw(id, data, options){
    if(typeof window.drawBarChart === 'function') return window.drawBarChart(id, data, options || {});
    const el = document.getElementById(id); if(!el) return;
    const entries = Object.entries(data).slice(0,8);
    if(!entries.length){ el.innerHTML = '<p class="muted">Add scenarios to see this chart.</p>'; return; }
    const max = Math.max(...entries.map(e=>e[1]),1);
    el.innerHTML = entries.map(([k,v])=>`<div class="mini-bar-row"><span>${esc(k)}</span><b>${money(v)}</b><i style="width:${Math.max(4,(v/max)*100)}%"></i></div>`).join('');
  }

  function normalizeRows(){
    const rows = getRows(); let changed = false;
    rows.forEach((r,i)=>{ if(!r._id){ r._id = 'hc_' + Date.now().toString(36) + '_' + i + '_' + Math.random().toString(36).slice(2,6); changed = true; } });
    if(changed) saveRows(rows);
    return rows;
  }

  function renderHealthCosts(){
    const rows = normalizeRows().slice().sort((a,b)=> new Date(b.date || 0) - new Date(a.date || 0));
    const tbody = $('#costTable');
    let totalEst = 0, totalWorst = 0, totalPremium = 0, totalCare = 0;
    rows.forEach(r=>{ totalEst += estimatedAnnual(r); totalWorst += worstCase(r); totalPremium += annualPremium(r); totalCare += plannedCare(r); });
    if(tbody){
      tbody.innerHTML = rows.map(r=>`<tr>
        <td>${esc(r.date)}</td><td>${esc(r.person)}</td><td>${esc(r.coverageType)}</td><td>${esc(r.planName)}</td>
        <td>${money(annualPremium(r))}</td><td>${money(plannedCare(r))}</td><td>${money(estimatedAnnual(r))}</td><td>${money(worstCase(r))}</td><td>${money(monthlyBudget(r))}</td>
        <td>${money(r.hsaFsa)}</td><td><span class="badge">${esc(r.status || 'Planning')}</span></td><td>${esc(r.notes || r.state || '')}</td>
        <td><button class="btn danger hd-delete-cost" type="button" data-id="${esc(r._id)}">Delete</button></td>
      </tr>`).join('') || '<tr><td colspan="13"><p class="muted">No cost scenarios saved yet. Add one above to calculate annual and monthly estimates.</p></td></tr>';
    }
    const summary = $('#costSummary');
    if(summary){
      summary.innerHTML = `<div class="stat"><span>${rows.length}</span><small>Cost scenarios</small></div>
        <div class="stat"><span>${money(totalEst)}</span><small>Total estimated annual cost</small></div>
        <div class="stat"><span>${money(rows.length ? totalEst/rows.length : 0)}</span><small>Average annual estimate</small></div>
        <div class="stat"><span>${money(rows.length ? (totalEst/rows.length)/12 : 0)}</span><small>Average monthly budget</small></div>
        <div class="stat"><span>${money(totalPremium)}</span><small>Annual premiums after employer contribution</small></div>
        <div class="stat"><span>${money(totalWorst)}</span><small>Total worst-case exposure</small></div>`;
    }
    const inv = $('#inventoryValueSummary');
    if(inv){
      const hsaTotal = rows.reduce((s,r)=>s+num(r.hsaFsa),0);
      inv.innerHTML = `<div class="stat"><span>${money(totalCare)}</span><small>Planned care estimate</small></div>
        <div class="stat"><span>${money(hsaTotal)}</span><small>Planned HSA/FSA contributions</small></div>
        <div class="stat"><span>${money(benchmarks.acaIndOop)}</span><small>2026 federal individual OOP cap reference</small></div>
        <div class="stat"><span>${money(benchmarks.acaFamilyOop)}</span><small>2026 federal family OOP cap reference</small></div>`;
    }
    draw('costMonthChart', grouped(rows, labelFor, estimatedAnnual), {decimals:2, empty:'Add scenarios to see annual cost estimates.'});
    draw('proCostCompoundChart', grouped(rows, r=>r.coverageType, estimatedAnnual), {decimals:2, empty:'Add scenarios to see cost by coverage type.'});
    draw('costVendorChart', {'Premiums':totalPremium, 'Planned care':totalCare, 'Reimbursements': rows.reduce((s,r)=>s+num(r.reimbursements),0)}, {decimals:2});
    draw('costPerMgChart', grouped(rows, labelFor, worstCase), {decimals:2, empty:'Add scenarios to see worst-case exposure.'});
  }

  function exportHealthCosts(){
    const rows = normalizeRows();
    const headers = ['Date','Person','Coverage Type','Plan Name','Monthly Premium','Employer Monthly Contribution','Annual Deductible','Out of Pocket Max','Coinsurance %','Primary Visits','Primary Copay','Specialist Visits','Specialist Copay','Lab Costs','Prescription Costs','Therapy Wellness Costs','Emergency Reserve','HSA/FSA Planned','Reimbursements','State Local Notes','Annual Premium','Planned Care','Estimated Annual','Worst Case','Monthly Budget','Status','Notes'];
    const body = rows.map(r => [r.date,r.person,r.coverageType,r.planName,r.monthlyPremium,r.employerContribution,r.annualDeductible,r.oopMax,r.coinsurance,r.primaryVisits,r.primaryCopay,r.specialistVisits,r.specialistCopay,r.labCosts,r.rxCosts,r.therapyCosts,r.emergencyFund,r.hsaFsa,r.reimbursements,r.state,annualPremium(r),plannedCare(r),estimatedAnnual(r),worstCase(r),monthlyBudget(r),r.status,r.notes]);
    const csv = [headers].concat(body).map(row => row.map(v => '"' + String(v ?? '').replace(/"/g,'""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'health-cost-analysis.csv'; a.click(); URL.revokeObjectURL(a.href);
  }

  function bind(){
    $$('button.tab[data-tab="costs"]').forEach(b => b.textContent = b.classList.contains('premium-tab') ? '★ Cost Analysis' : 'Cost Analysis');
    $$('[data-jump="costs"] strong').forEach(e => e.textContent = 'Cost Analysis');
    $$('[data-jump="costs"] span').forEach(e => e.textContent = 'Estimate health plan costs, premiums, deductibles, copays, prescriptions, labs, and worst-case exposure.');
    const exp = $('#exportCosts'); if(exp) exp.onclick = exportHealthCosts;
    const clr = $('#clearCosts'); if(clr) clr.onclick = () => { if(confirm('Clear saved health cost scenarios?')){ localStorage.removeItem('costs'); renderHealthCosts(); } };
    document.addEventListener('click', e => {
      const btn = e.target.closest('.hd-delete-cost'); if(!btn) return;
      const id = btn.dataset.id; saveRows(getRows().filter(r => r._id !== id)); renderHealthCosts();
    });
  }

  window.renderCosts = renderHealthCosts;
  window.healthCostBenchmarks2026 = benchmarks;
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { bind(); setTimeout(renderHealthCosts, 100); });
  else { bind(); setTimeout(renderHealthCosts, 100); }
  document.addEventListener('submit', e => { if(e.target && e.target.id === 'costForm') setTimeout(renderHealthCosts, 180); }, true);
  document.addEventListener('click', e => { if(e.target && e.target.closest('.tab')) setTimeout(renderHealthCosts, 180); }, true);
})();
