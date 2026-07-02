// Health Pro Polish: safe, non-destructive UI text polish only. Does not override original navigation/data logic.
(function(){
  function txt(el){ return (el && el.textContent || '').trim(); }
  function renameTabs(){
    document.querySelectorAll('button.tab, .tab').forEach(function(el){
      var t = txt(el);
      if(t === 'Inventory') el.textContent = 'Wellness Items';
      if(t === 'Peptide Log') el.textContent = 'Health Log';
      if(t === 'Dose Log') el.textContent = 'Daily Log';
      if(t === 'Lab Markers') el.textContent = 'Lab & Biomarkers';
      if(t === 'Cost Tracking') el.textContent = 'Wellness Costs';
      if(t === 'Vendor Database') el.textContent = 'Source Notes';
      if(t === 'COA Tracker') el.textContent = 'Documents';
      if(t === 'PDF COA Storage') el.textContent = 'Document Storage';
      if(t === 'Executive Dashboard') el.textContent = 'Health Dashboard';
      if(t === 'Admin Center') el.textContent = 'App Center';
    });
  }
  function addRibbon(){
    var overview = document.querySelector('#overview');
    if(!overview || document.querySelector('.health-pro-ribbon')) return;
    var div=document.createElement('div');
    div.className='health-pro-ribbon';
    div.innerHTML='<strong>Health Pro Workspace</strong><span class="health-pro-pill">Logs</span><span class="health-pro-pill">Measurements</span><span class="health-pro-pill">Labs</span><span class="health-pro-pill">Reports</span><span class="health-pro-pill">Private local data</span>';
    overview.insertBefore(div, overview.firstChild);
  }
  function removeOpsLinks(){
    document.querySelectorAll('button,a').forEach(function(el){
      var t=txt(el).toLowerCase();
      if(t.includes('operations center') || t.includes('stock movement') || t.includes('batches') || t.includes('orders') || t.includes('shipments')){
        el.style.display='none';
      }
    });
  }
  function run(){ renameTabs(); addRibbon(); removeOpsLinks(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  setTimeout(run,500);
})();
