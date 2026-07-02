
(function(){
  const APP='Health Dynamics';
  document.title = document.title.replace(/Peptide Anonymous|PeptideAnonymous|PA Local|PA/g, APP).replace(/Health Dynamics Local/g,'Health Dynamics');
  document.querySelectorAll('.brand .logo,.logo').forEach(el=>{ if(el.textContent.trim()==='PA') el.textContent='HD'; });
  document.querySelectorAll('.brand span').forEach(el=>{ if(/Peptide Anonymous|Health Dynamics/.test(el.textContent)) el.textContent='Health Dynamics'; });
  const hero=document.querySelector('.hero .eyebrow,.section-title .eyebrow');
  if(hero && !document.querySelector('.health-dynamics-badge')){ const b=document.createElement('div'); b.className='health-dynamics-badge'; b.textContent='Professional Health Platform'; hero.parentNode.insertBefore(b, hero); }
})();
