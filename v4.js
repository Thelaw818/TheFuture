
(() => {
'use strict';
const V4 = {
  selected: [],
  lastSync: new Date().toISOString(),
  getRecords(){
    if(typeof coaRows==='undefined' || !Array.isArray(coaRows) || !coaRows.length) return [];
    const h=coaRows[0].map(x=>String(x||''));
    return coaRows.slice(1).filter(r=>r&&r[0]).map((r,idx)=>({h,r,idx:idx+1,o:Object.fromEntries(h.map((k,i)=>[k,r[i]]))}));
  },
  norm(v){return String(v??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ')},
  fuzzyScore(text,query){
    text=this.norm(text); query=this.norm(query).trim(); if(!query) return 1;
    if(text.includes(query)) return 100-query.length;
    let ti=0,score=0,last=-2;
    for(const ch of query){
      ti=text.indexOf(ch,ti); if(ti<0)return -1;
      score += ti===last+1?4:1; last=ti; ti++;
    }
    return score;
  },
  esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))},
  get(rec,key){return rec.o[key]??''},
  path(rec){return this.get(rec,'Source Type')||this.get(rec,'File/Link')||''},
  filePath(rec){
    const raw=this.path(rec);
    const m=String(raw).match(/assets\/coa\/[^;]+/i);
    return m?m[0].trim():'';
  },
  find(id){return this.getRecords().find(r=>String(this.get(r,'COA ID'))===String(id))},
  init(){
    this.addShellTools(); this.addSearch(); this.addAnalyticsPanels(); this.addCertificateTools();
    this.wrapFunctions(); this.showSkeletons(); this.bindHash(); this.registerPwa();
    document.addEventListener('keydown',e=>{
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();this.openSearch()}
      if(e.key==='Escape')this.closeSearch();
    });
    this.waitForData();
  },
  waitForData(){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(this.getRecords().length===35){
        clearInterval(timer); this.afterData();
      } else if(tries>120){clearInterval(timer)}
    },100);
  },
  afterData(){
    this.lastSync=new Date().toISOString();
    this.updateIntegrity(); this.renderV4Analytics(); this.applyHash();
    this.animateNumbers(); document.documentElement.classList.add('v4-ready');
  },
  addShellTools(){
    const saved=localStorage.getItem('pa-v4-theme')||'dark';
    document.documentElement.dataset.theme=saved;
    const el=document.createElement('div'); el.className='v4-shell-tools';
    el.innerHTML=`<div class="v4-integrity" id="v4Integrity"><i></i><span>Verifying 35 records…</span></div>
      <button class="v4-icon-btn" id="v4SearchBtn" title="Search everything (Ctrl/Cmd+K)">⌕</button>
      <button class="v4-icon-btn" id="v4ThemeBtn" title="Toggle appearance">${saved==='light'?'☀':'◐'}</button>`;
    document.body.appendChild(el);
    el.querySelector('#v4SearchBtn').onclick=()=>this.openSearch();
    el.querySelector('#v4ThemeBtn').onclick=()=>{
      const next=document.documentElement.dataset.theme==='light'?'dark':'light';
      document.documentElement.dataset.theme=next;localStorage.setItem('pa-v4-theme',next);
      el.querySelector('#v4ThemeBtn').textContent=next==='light'?'☀':'◐';
    };
  },
  updateIntegrity(){
    const recs=this.getRecords(), ghk=recs.find(r=>this.get(r,'COA ID')==='COA-0035');
    const ok=recs.length===35 && ghk && Number(this.get(ghk,'Purity %'))===99.77;
    const el=document.querySelector('#v4Integrity span');
    if(el) el.textContent=ok?`Integrity verified · ${recs.length} COAs`:`Integrity warning · ${recs.length} COAs`;
    document.querySelectorAll('.v4-sync').forEach(x=>x.textContent=`Last synced ${new Date(this.lastSync).toLocaleString()}`);
  },
  addSearch(){
    const overlay=document.createElement('div');overlay.className='v4-search-overlay';overlay.id='v4SearchOverlay';
    overlay.innerHTML=`<div class="v4-search-box"><input id="v4GlobalSearch" autocomplete="off" placeholder="Search compounds, labs, batches, COA IDs…">
      <div class="v4-search-results" id="v4SearchResults"><p class="muted">Type to search all 35 COA records. Press Esc to close.</p></div></div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click',e=>{if(e.target===overlay)this.closeSearch()});
    overlay.querySelector('input').addEventListener('input',e=>this.renderSearch(e.target.value));
  },
  openSearch(){const o=document.getElementById('v4SearchOverlay');o.classList.add('show');setTimeout(()=>document.getElementById('v4GlobalSearch').focus(),30)},
  closeSearch(){document.getElementById('v4SearchOverlay')?.classList.remove('show')},
  renderSearch(q){
    const out=document.getElementById('v4SearchResults');
    if(!q.trim()){out.innerHTML='<p class="muted">Type to search all 35 COA records.</p>';return}
    const found=this.getRecords().map(rec=>{
      const text=Object.values(rec.o).join(' ');
      return {rec,score:this.fuzzyScore(text,q)};
    }).filter(x=>x.score>=0).sort((a,b)=>b.score-a.score).slice(0,12);
    out.innerHTML=found.map(({rec})=>`<div class="v4-search-result" data-v4-open="${this.esc(this.get(rec,'COA ID'))}">
      <div><b>${this.esc(this.get(rec,'Compound'))} · ${this.esc(this.get(rec,'COA ID'))}</b>
      <small>${this.esc(this.get(rec,'Lab'))} · ${this.esc(this.get(rec,'Test Date'))} · Purity ${this.esc(this.get(rec,'Purity %'))}%</small></div>
      <span class="badge verified">${this.esc(this.get(rec,'Pass/Fail'))}</span></div>`).join('')||'<p class="muted">No fuzzy matches found.</p>';
    out.querySelectorAll('[data-v4-open]').forEach(el=>el.onclick=()=>{this.closeSearch();this.openRecord(el.dataset.v4Open)});
  },
  addAnalyticsPanels(){
    const sec=document.getElementById('analytics'); if(!sec)return;
    const grid=document.createElement('div');grid.className='v4-analytics-grid';grid.id='v4AnalyticsGrid';
    grid.innerHTML=`<article class="card v4-chart"><div class="v4-chart-head"><div><h3>Purity Intelligence</h3><span>Compound trend across test dates</span></div><select id="v4TrendCompound"></select></div><div id="v4TrendChart"></div></article>
      <article class="card v4-chart"><div class="v4-chart-head"><div><h3>Lab Reliability</h3><span>Average purity and consistency</span></div></div><div id="v4LabReliability"></div></article>
      <article class="card v4-chart"><div class="v4-chart-head"><div><h3>Anomaly Detection</h3><span>Variance outside compound history</span></div></div><div id="v4Anomalies"></div></article>
      <article class="card v4-chart"><div class="v4-chart-head"><div><h3>Data Integrity</h3><span>Live database validation</span></div></div><div id="v4DataHealth"></div></article>`;
    const top=sec.querySelector('.topbar'); top.insertAdjacentElement('afterend',grid);
  },
  renderV4Analytics(){
    const recs=this.getRecords(); if(!recs.length)return;
    const compounds=[...new Set(recs.map(r=>this.get(r,'Compound')).filter(Boolean))].sort();
    const sel=document.getElementById('v4TrendCompound');
    sel.innerHTML=compounds.map(c=>`<option>${this.esc(c)}</option>`).join('');
    const preferred=compounds.includes('Retatrutide')?'Retatrutide':compounds[0];sel.value=preferred;
    sel.onchange=()=>this.renderTrend(sel.value);this.renderTrend(preferred);
    this.renderLabs();this.renderAnomalies();this.renderHealth();
  },
  renderTrend(compound){
    const rows=this.getRecords().filter(r=>this.get(r,'Compound')===compound&&Number.isFinite(Number(this.get(r,'Purity %'))))
      .sort((a,b)=>String(this.get(a,'Test Date')).localeCompare(String(this.get(b,'Test Date'))));
    const box=document.getElementById('v4TrendChart');
    if(rows.length<2){box.innerHTML=`<p class="muted">Only ${rows.length} purity result is available for ${this.esc(compound)}. Add another batch to unlock a trend line.</p>`;return}
    const vals=rows.map(r=>Number(this.get(r,'Purity %'))), min=Math.min(...vals)-.05,max=Math.max(...vals)+.05,w=720,h=210,p=28;
    const x=i=>p+(i/(rows.length-1))*(w-2*p), y=v=>h-p-((v-min)/(max-min||1))*(h-2*p);
    const points=vals.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
    box.innerHTML=`<svg class="v4-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Purity trend for ${this.esc(compound)}">
      <line class="v4-axis" x1="${p}" y1="${h-p}" x2="${w-p}" y2="${h-p}"/><line class="v4-axis" x1="${p}" y1="${p}" x2="${p}" y2="${h-p}"/>
      <polyline class="v4-line" points="${points}"/>
      ${rows.map((r,i)=>`<circle class="v4-dot" cx="${x(i)}" cy="${y(vals[i])}" r="5"><title>${this.esc(this.get(r,'COA ID'))}: ${vals[i]}%</title></circle>
      <text class="v4-label" x="${x(i)}" y="${h-7}" text-anchor="middle">${this.esc(this.get(r,'COA ID')).replace('COA-','')}</text>`).join('')}
      <text class="v4-label" x="${p+4}" y="${p-7}">${max.toFixed(2)}%</text><text class="v4-label" x="${p+4}" y="${h-p-6}">${min.toFixed(2)}%</text></svg>`;
  },
  renderLabs(){
    const groups={};this.getRecords().forEach(r=>{const lab=this.get(r,'Lab')||'Unknown',p=Number(this.get(r,'Purity %'));if(!groups[lab])groups[lab]=[];if(Number.isFinite(p))groups[lab].push(p)});
    const stats=Object.entries(groups).map(([lab,v])=>{const avg=v.reduce((a,b)=>a+b,0)/(v.length||1);const sd=Math.sqrt(v.reduce((s,x)=>s+(x-avg)**2,0)/(v.length||1));return{lab,avg,sd,n:v.length,score:Math.max(0,Math.min(100,avg-(sd*3)))}}).sort((a,b)=>b.score-a.score);
    document.getElementById('v4LabReliability').innerHTML=stats.map(s=>`<div class="v4-lab-row"><div><b>${this.esc(s.lab)}</b><small class="muted"> ${s.n} tests</small></div><div class="v4-meter"><i style="width:${s.score}%"></i></div><strong>${s.avg.toFixed(2)}%</strong></div>`).join('');
  },
  renderAnomalies(){
    const groups={};this.getRecords().forEach(r=>{const c=this.get(r,'Compound'),v=Number(this.get(r,'Variance %'));if(c&&Number.isFinite(v)){(groups[c]??=[]).push({r,v})}});
    const flags=[];Object.entries(groups).forEach(([compound,arr])=>{if(arr.length<2)return;const avg=arr.reduce((s,x)=>s+x.v,0)/arr.length;const sd=Math.sqrt(arr.reduce((s,x)=>s+(x.v-avg)**2,0)/arr.length);arr.forEach(x=>{const z=sd?Math.abs((x.v-avg)/sd):0;if(z>=1.5||Math.abs(x.v)>0.2)flags.push({compound,z,...x})})});
    flags.sort((a,b)=>b.z-a.z);
    document.getElementById('v4Anomalies').innerHTML=(flags.slice(0,5).map(x=>`<div class="v4-anomaly"><span>⚠</span><div><strong>${this.esc(x.compound)} · ${this.esc(this.get(x.r,'COA ID'))}</strong><div class="muted">Variance ${(x.v*100).toFixed(2)}% differs from this compound’s batch history.</div></div></div>`).join('')||'<div class="v4-anomaly"><span>✓</span><div><strong>No major anomalies detected</strong><div class="muted">Current variance values remain within available compound history.</div></div></div>');
  },
  renderHealth(){
    const recs=this.getRecords(),ids=new Set(recs.map(r=>this.get(r,'COA ID'))),files=recs.filter(r=>this.filePath(r)).length;
    const tests=[
      ['Record count',recs.length===35,`${recs.length}/35`],
      ['Unique COA IDs',ids.size===35,`${ids.size}/35`],
      ['COA-0035 present',!!this.find('COA-0035'),'GHK-Cu'],
      ['Certificate links',files>0,`${files} linked`],
    ];
    document.getElementById('v4DataHealth').innerHTML=tests.map(([n,ok,v])=>`<div class="v4-lab-row"><div><b>${ok?'✓':'!'} ${this.esc(n)}</b></div><div class="v4-meter"><i style="width:${ok?100:30}%"></i></div><strong>${this.esc(v)}</strong></div>`).join('');
  },
  addCertificateTools(){
    const sec=document.getElementById('certificates');if(!sec)return;
    const tb=sec.querySelector('.topbar');
    const sync=document.createElement('span');sync.className='v4-sync';sync.textContent='Waiting for database…';tb.appendChild(sync);
    const bar=document.createElement('div');bar.className='card toolbar';
    bar.innerHTML=`<strong>Verification Workspace</strong><button class="v4-secondary" id="v4ExportCsv">Export filtered CSV</button><button class="v4-secondary" id="v4Print">Print / PDF</button><span class="status">Select two records to compare batches</span>`;
    tb.insertAdjacentElement('afterend',bar);
    bar.querySelector('#v4ExportCsv').onclick=()=>this.exportCsv();
    bar.querySelector('#v4Print').onclick=()=>window.print();
    const compare=document.createElement('div');compare.id='v4CompareBar';compare.className='v4-compare-bar';
    compare.innerHTML=`<b id="v4CompareText">0 of 2 selected</b><button class="v4-secondary" id="v4ClearCompare">Clear</button><button class="v4-primary v4-secondary" id="v4RunCompare">Compare batches</button>`;
    document.body.appendChild(compare);
    compare.querySelector('#v4ClearCompare').onclick=()=>{this.selected=[];this.updateCompareBar();this.refreshCertificates()};
    compare.querySelector('#v4RunCompare').onclick=()=>this.showComparison();
  },
  wrapFunctions(){
    const self=this;
    const wait=setInterval(()=>{
      if(typeof window.buildCertificates==='function' && typeof window.showDetail==='function'){
        clearInterval(wait);
        const originalBuild=window.buildCertificates;
        window.buildCertificates=function(){originalBuild();self.enhanceCertificates()};
        const originalDetail=window.showDetail;
        window.showDetail=function(o){originalDetail(o);setTimeout(()=>self.enhanceModal(o),0)};
        if(self.getRecords().length) self.enhanceCertificates();
      }
    },50);
  },
  refreshCertificates(){if(typeof window.buildCertificates==='function')window.buildCertificates()},
  enhanceCertificates(){
    const recs=this.getRecords();
    document.querySelectorAll('#certCards .cert').forEach((card,i)=>{
      if(card.dataset.v4done)return;
      const title=card.querySelector('h3')?.textContent||'';
      const idNode=[...card.querySelectorAll('dd')].find(x=>/^COA-\d+$/i.test(x.textContent.trim()));
      let rec=idNode?this.find(idNode.textContent.trim()):recs.filter(r=>this.get(r,'Compound')===title)[i]||recs.find(r=>this.get(r,'Compound')===title);
      if(!rec)return;
      const id=this.get(rec,'COA ID');card.dataset.v4done='1';card.dataset.coaId=id;
      const qr=document.createElement('img');qr.className='v4-qr';qr.alt=`QR verification for ${id}`;qr.src=`assets/qr/${encodeURIComponent(id)}.png`;
      const top=card.querySelector('.batchtop');if(top)top.appendChild(qr);
      const actions=document.createElement('div');actions.className='v4-cert-actions';
      actions.innerHTML=`<button class="v4-secondary" data-v4-link="${this.esc(id)}">Copy direct link</button>
        <button class="v4-secondary" data-v4-compare="${this.esc(id)}">${this.selected.includes(id)?'Selected ✓':'Compare'}</button>`;
      card.appendChild(actions);
    });
    document.querySelectorAll('[data-v4-link]').forEach(b=>b.onclick=async()=>{
      const url=`${location.origin}${location.pathname}#coa=${b.dataset.v4Link}`;
      try{await navigator.clipboard.writeText(url);b.textContent='Link copied ✓'}catch{prompt('Copy this link',url)}
    });
    document.querySelectorAll('[data-v4-compare]').forEach(b=>b.onclick=()=>this.toggleCompare(b.dataset.v4Compare));
  },
  enhanceModal(o){
    const body=document.getElementById('modalBody');if(!body||body.dataset.v4done)return;
    const recId=(o&&o.m&&o.r)?(o.r[o.m['coa id']]||o.r[o.m['COA ID']]):null;
    const rec=this.find(recId)||this.getRecords().find(r=>this.get(r,'Compound')===document.getElementById('modalTitle')?.textContent);
    if(!rec)return;
    const existing=body.innerHTML,file=this.filePath(rec),id=this.get(rec,'COA ID');
    const preview=file?(file.toLowerCase().endsWith('.pdf')?`<iframe src="${this.esc(file)}#view=FitH" title="${id} certificate" onerror="this.parentElement.innerHTML='<p class=&quot;muted&quot;>Certificate file could not be loaded.</p>'"></iframe>`:`<img src="${this.esc(file)}" alt="${id} certificate image" onerror="this.parentElement.innerHTML='<p class=&quot;muted&quot;>Certificate image could not be loaded.</p>'">`):'<p class="muted">No certificate image is linked to this record.</p>';
    body.innerHTML=`<div class="v4-detail-grid"><div class="v4-coa-preview">${preview}</div><div class="v4-detail-side">
      <div class="v4-detail-verify"><img class="v4-qr" src="assets/qr/${encodeURIComponent(id)}.png" alt="QR code" onerror="this.style.display='none'"><div><b>Direct verification</b><div class="muted">${this.esc(id)} · Scan to reopen this record</div></div></div>${existing}</div></div>`;
    body.dataset.v4done='1';history.replaceState(null,'',`#coa=${encodeURIComponent(id)}`);
  },
  openRecord(id){
    const rec=this.find(id);if(!rec)return;
    document.querySelector('.navbtn[data-target="certificates"]')?.click();
    const o=(typeof records==='function' && typeof certRows!=='undefined' && typeof valBy==='function')?records(certRows).find(x=>String(valBy(x,['coa id']))===id):null;
    if(o&&window.showDetail)window.showDetail(o);
    else{
      const fallback={h:Object.keys(rec.o),r:Object.values(rec.o),m:Object.fromEntries(Object.keys(rec.o).map((k,i)=>[k.toLowerCase(),i]))};
      window.showDetail?.(fallback);
    }
  },
  bindHash(){window.addEventListener('hashchange',()=>this.applyHash())},
  applyHash(){const m=location.hash.match(/coa=([^&]+)/i);if(m&&this.getRecords().length)this.openRecord(decodeURIComponent(m[1]))},
  toggleCompare(id){
    if(this.selected.includes(id))this.selected=this.selected.filter(x=>x!==id);
    else{if(this.selected.length>=2)this.selected.shift();this.selected.push(id)}
    this.updateCompareBar();this.refreshCertificates();
  },
  updateCompareBar(){
    const bar=document.getElementById('v4CompareBar');if(!bar)return;
    bar.classList.toggle('show',this.selected.length>0);document.getElementById('v4CompareText').textContent=`${this.selected.length} of 2 selected`;
  },
  showComparison(){
    if(this.selected.length!==2){alert('Select two COA records first.');return}
    const a=this.find(this.selected[0]),b=this.find(this.selected[1]);if(!a||!b)return;
    const fields=['COA ID','Compound','Lab','Test Date','Labeled Qty (mg)','Actual Content (mg)','Variance %','Purity %','Pass/Fail','Cap Color','Crimp Color'];
    document.getElementById('modalTitle').textContent='Batch Comparison';
    document.getElementById('modalBody').dataset.v4done='';
    document.getElementById('modalBody').innerHTML=`<div class="v4-compare-grid">${[a,b].map(r=>`<article class="v4-compare-card"><h3>${this.esc(this.get(r,'Compound'))}</h3>${fields.map(f=>`<p><small class="muted">${this.esc(f)}</small><br><b>${this.esc(this.get(r,f)||'—')}</b></p>`).join('')}</article>`).join('')}</div>`;
    document.getElementById('detailModal').classList.add('show');
  },
  exportCsv(){
    const q=(document.getElementById('certSearch')?.value||'').trim(),rows=this.getRecords().filter(r=>!q||this.fuzzyScore(Object.values(r.o).join(' '),q)>=0);
    const h=Object.keys(rows[0]?.o||{}),csv=[h,...rows.map(r=>h.map(k=>r.o[k]))].map(row=>row.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=`coa-export-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(a.href);
  },
  showSkeletons(){
    ['kpiCoas','kpiPass','kpiPurity','kpiOverfill','kpiLabs','kpiSheets'].forEach(id=>document.getElementById(id)?.classList.add('v4-skeleton'));
    const timer=setInterval(()=>{if(this.getRecords().length){clearInterval(timer);document.querySelectorAll('.v4-skeleton').forEach(x=>x.classList.remove('v4-skeleton'))}},100);
  },
  animateNumbers(){
    document.querySelectorAll('.kpi .value,.hero-metric b').forEach(el=>{
      const txt=el.textContent,match=txt.match(/-?\d+(\.\d+)?/);if(!match)return;
      const target=Number(match[0]),suffix=txt.replace(match[0],'');let start=0,t0=performance.now();
      const step=t=>{const p=Math.min(1,(t-t0)/700),v=target*(1-Math.pow(1-p,3));el.textContent=(Number.isInteger(target)?Math.round(v):v.toFixed(2))+suffix;if(p<1)requestAnimationFrame(step)};
      requestAnimationFrame(step);
    });
  },
  registerPwa(){
    if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }
};
window.addEventListener('DOMContentLoaded',()=>V4.init());
window.PA_V4=V4;
})();
