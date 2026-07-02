const $=s=>document.querySelector(s); const $$=s=>document.querySelectorAll(s); const esc=(v='')=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const store={get:k=>JSON.parse(localStorage.getItem(k)||'[]'),set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const PEPTIDES=[{"name": "Retatrutide", "alias": "Reta", "category": "GLP-1/GIP/GCG", "halfLife": "6 days", "duration": "Long-acting triple agonist", "routes": "SC", "notes": "Approximate; formulation and study design dependent"}, {"name": "Tirzepatide", "alias": "Tirz", "category": "GLP-1/GIP", "halfLife": "5 days", "duration": "Weekly peptide drug analog", "routes": "SC", "notes": "Approximate"}, {"name": "Semaglutide", "alias": "Sema", "category": "GLP-1", "halfLife": "7 days", "duration": "Weekly GLP-1 analog", "routes": "SC/Oral formulation", "notes": "Approximate"}, {"name": "Cagrilintide", "alias": "Cagri", "category": "Amylin analog", "halfLife": "6 days", "duration": "Long acting amylin analog", "routes": "SC", "notes": "Approximate"}, {"name": "Liraglutide", "alias": "Lira", "category": "GLP-1", "halfLife": "13 hours", "duration": "Daily GLP-1 analog", "routes": "SC", "notes": "Approximate"}, {"name": "Dulaglutide", "alias": "Dula", "category": "GLP-1", "halfLife": "5 days", "duration": "Long acting GLP-1", "routes": "SC", "notes": "Approximate"}, {"name": "Exenatide", "alias": "Exen", "category": "GLP-1", "halfLife": "2.4 hours", "duration": "Short acting incretin mimetic", "routes": "SC", "notes": "Approximate"}, {"name": "Exenatide ER", "alias": "Bydureon", "category": "GLP-1", "halfLife": "14 days", "duration": "Extended-release formulation", "routes": "SC", "notes": "Formulation dependent"}, {"name": "Mazdutide", "alias": "IBI362", "category": "GLP-1/GCG", "halfLife": "7 days", "duration": "Investigational", "routes": "SC", "notes": "Estimated"}, {"name": "Survodutide", "alias": "BI 456906", "category": "GLP-1/GCG", "halfLife": "6.5 days", "duration": "Investigational", "routes": "SC", "notes": "Estimated"}, {"name": "Pemvidutide", "alias": "ALT-801", "category": "GLP-1/GCG", "halfLife": "7 days", "duration": "Investigational", "routes": "SC", "notes": "Estimated"}, {"name": "MariTide", "alias": "AMG-133", "category": "GLP-1/GIPR", "halfLife": "21 days", "duration": "Long acting investigational", "routes": "SC", "notes": "Estimated"}, {"name": "VK2735", "alias": "VK2735", "category": "GLP-1/GIP", "halfLife": "6.5 days", "duration": "Investigational", "routes": "SC", "notes": "Estimated"}, {"name": "BPC-157", "alias": "BPC", "category": "Healing / Recovery", "halfLife": "5 hours", "duration": "Biological effects may outlast plasma half-life", "routes": "SC/Oral", "notes": "Approximate research reference"}, {"name": "TB-500", "alias": "TB4 fragment", "category": "Healing / Recovery", "halfLife": "5 hours", "duration": "Effects may persist longer", "routes": "SC", "notes": "Approximate"}, {"name": "Thymosin Beta-4", "alias": "TB4", "category": "Healing / Recovery", "halfLife": "2 hours", "duration": "Parent thymosin peptide", "routes": "SC", "notes": "Approximate"}, {"name": "GHK-Cu", "alias": "Copper peptide", "category": "Regenerative / Skin", "halfLife": "18 hours", "duration": "Copper tripeptide", "routes": "Topical/SC", "notes": "Approximate"}, {"name": "MOTS-C", "alias": "MOTS-C", "category": "Mitochondrial", "halfLife": "45 minutes", "duration": "Mitochondrial-derived peptide", "routes": "SC", "notes": "Approximate"}, {"name": "SS-31", "alias": "Elamipretide", "category": "Mitochondrial", "halfLife": "6 hours", "duration": "Mitochondrial-targeted tetrapeptide", "routes": "SC/IV", "notes": "Approximate"}, {"name": "Humanin", "alias": "HN", "category": "Mitochondrial", "halfLife": "3 hours", "duration": "Mitochondrial-derived peptide", "routes": "SC", "notes": "Estimated"}, {"name": "AOD-9604", "alias": "AOD", "category": "Metabolic / Fat Loss", "halfLife": "2.5 hours", "duration": "hGH fragment analog", "routes": "SC", "notes": "Approximate"}, {"name": "Tesamorelin", "alias": "Egrifta analog", "category": "GHRH analog", "halfLife": "2 hours", "duration": "GH-releasing hormone analog", "routes": "SC", "notes": "Approximate"}, {"name": "Sermorelin", "alias": "GHRH 1-29", "category": "GHRH analog", "halfLife": "15 minutes", "duration": "Short acting GHRH fragment", "routes": "SC", "notes": "Approximate"}, {"name": "CJC-1295 No DAC", "alias": "Mod GRF 1-29", "category": "GHRH analog", "halfLife": "1 hours", "duration": "Short acting", "routes": "SC", "notes": "Approximate"}, {"name": "CJC-1295 DAC", "alias": "CJC DAC", "category": "GHRH analog", "halfLife": "6.5 days", "duration": "DAC extends half-life", "routes": "SC", "notes": "Approximate"}, {"name": "Ipamorelin", "alias": "Ipa", "category": "GH Secretagogue", "halfLife": "2 hours", "duration": "Ghrelin receptor agonist", "routes": "SC", "notes": "Approximate"}, {"name": "Hexarelin", "alias": "Hex", "category": "GH Secretagogue", "halfLife": "55 minutes", "duration": "GHRP family", "routes": "SC", "notes": "Approximate"}, {"name": "GHRP-2", "alias": "GHRP-2", "category": "GH Secretagogue", "halfLife": "25 minutes", "duration": "GHRP family", "routes": "SC", "notes": "Approximate"}, {"name": "GHRP-6", "alias": "GHRP-6", "category": "GH Secretagogue", "halfLife": "25 minutes", "duration": "GHRP family", "routes": "SC", "notes": "Approximate"}, {"name": "MK-677", "alias": "Ibutamoren", "category": "GH Secretagogue", "halfLife": "24 hours", "duration": "Non-peptide secretagogue", "routes": "Oral", "notes": "Included for tracker reference"}, {"name": "PEG-MGF", "alias": "PEG MGF", "category": "Growth Factor", "halfLife": "60 hours", "duration": "PEGylated mechano growth factor", "routes": "SC", "notes": "Approximate"}, {"name": "MGF", "alias": "Mechano Growth Factor", "category": "Growth Factor", "halfLife": "6 minutes", "duration": "Short acting splice variant", "routes": "SC", "notes": "Estimated"}, {"name": "IGF-1 LR3", "alias": "LR3", "category": "Growth Factor", "halfLife": "25 hours", "duration": "Longer acting IGF-1 analog", "routes": "SC", "notes": "Approximate"}, {"name": "IGF-1 DES", "alias": "DES", "category": "Growth Factor", "halfLife": "25 minutes", "duration": "Short IGF-1 variant", "routes": "SC", "notes": "Approximate"}, {"name": "Follistatin-344", "alias": "FST-344", "category": "Myostatin / Growth", "halfLife": "18 hours", "duration": "Myostatin pathway research", "routes": "SC", "notes": "Estimated"}, {"name": "Follistatin-315", "alias": "FST-315", "category": "Myostatin / Growth", "halfLife": "36 hours", "duration": "Myostatin pathway research", "routes": "SC", "notes": "Estimated"}, {"name": "Thymosin Alpha-1", "alias": "TA1", "category": "Immune", "halfLife": "2 hours", "duration": "Immune modulating peptide", "routes": "SC", "notes": "Approximate"}, {"name": "LL-37", "alias": "Cathelicidin", "category": "Antimicrobial", "halfLife": "1.5 hours", "duration": "Antimicrobial peptide", "routes": "Topical/SC", "notes": "Estimated"}, {"name": "KPV", "alias": "KPV", "category": "Anti-inflammatory", "halfLife": "2 hours", "duration": "Alpha-MSH fragment", "routes": "Oral/SC", "notes": "Estimated"}, {"name": "Epitalon", "alias": "Epithalon", "category": "Longevity", "halfLife": "3 hours", "duration": "Tetrapeptide", "routes": "SC", "notes": "Estimated"}, {"name": "Pinealon", "alias": "Pinealon", "category": "Bioregulator", "halfLife": "2 hours", "duration": "Short peptide bioregulator", "routes": "SC", "notes": "Estimated"}, {"name": "Vesugen", "alias": "Vesugen", "category": "Bioregulator", "halfLife": "2 hours", "duration": "Short peptide bioregulator", "routes": "SC", "notes": "Estimated"}, {"name": "Cortexin", "alias": "Cortexin", "category": "Nootropic complex", "halfLife": "3 hours", "duration": "Peptide complex", "routes": "IM", "notes": "Estimated"}, {"name": "Selank", "alias": "Selank", "category": "Nootropic", "halfLife": "10 minutes", "duration": "Effects may last much longer", "routes": "Nasal", "notes": "Approximate"}, {"name": "Semax", "alias": "Semax", "category": "Nootropic", "halfLife": "15 minutes", "duration": "Effects may last much longer", "routes": "Nasal", "notes": "Approximate"}, {"name": "NA Semax Amidate", "alias": "NASA", "category": "Nootropic", "halfLife": "1.5 hours", "duration": "Modified Semax", "routes": "Nasal", "notes": "Estimated"}, {"name": "NA Selank Amidate", "alias": "NASA/Selank", "category": "Nootropic", "halfLife": "1.5 hours", "duration": "Modified Selank", "routes": "Nasal", "notes": "Estimated"}, {"name": "Dihexa", "alias": "Dihexa", "category": "Nootropic", "halfLife": "10.5 days", "duration": "Very limited public PK data", "routes": "Oral", "notes": "Estimated/limited data"}, {"name": "VIP", "alias": "VIP", "category": "Neuropeptide", "halfLife": "2 minutes", "duration": "Very short plasma half-life", "routes": "Nasal/Injection", "notes": "Approximate"}, {"name": "Oxytocin", "alias": "OXT", "category": "Hormonal", "halfLife": "4 minutes", "duration": "Peptide hormone", "routes": "Nasal/Injection", "notes": "Approximate"}, {"name": "Desmopressin", "alias": "DDAVP", "category": "Hormonal", "halfLife": "2.5 hours", "duration": "Vasopressin analog", "routes": "Nasal/Oral/Injection", "notes": "Approximate"}, {"name": "Kisspeptin-10", "alias": "KP-10", "category": "Hormonal", "halfLife": "25 minutes", "duration": "Reproductive signaling", "routes": "SC/IV", "notes": "Approximate"}, {"name": "Kisspeptin-54", "alias": "KP-54", "category": "Hormonal", "halfLife": "29 hours", "duration": "Longer acting kisspeptin form", "routes": "SC/IV", "notes": "Approximate"}, {"name": "Melanotan I", "alias": "MT-1", "category": "Melanocortin", "halfLife": "30 hours", "duration": "Afamelanotide-related", "routes": "SC", "notes": "Approximate"}, {"name": "Melanotan II", "alias": "MT-2", "category": "Melanocortin", "halfLife": "34 hours", "duration": "Melanocortin agonist", "routes": "SC/Nasal", "notes": "Approximate"}, {"name": "PT-141", "alias": "Bremelanotide", "category": "Melanocortin", "halfLife": "2.7 hours", "duration": "Melanocortin agonist", "routes": "SC/Nasal", "notes": "Approximate"}, {"name": "DSIP", "alias": "DSIP", "category": "Sleep", "halfLife": "22 minutes", "duration": "Delta sleep-inducing peptide", "routes": "SC", "notes": "Estimated"}, {"name": "Glutathione", "alias": "GSH", "category": "Antioxidant", "halfLife": "12 minutes", "duration": "Tripeptide antioxidant", "routes": "IV/SC", "notes": "Approximate"}, {"name": "NAD+", "alias": "NAD", "category": "Metabolic cofactor", "halfLife": "1.5 hours", "duration": "Cofactor; not peptide", "routes": "IV/SC", "notes": "Included for tracker reference"}, {"name": "ARA-290", "alias": "Cibinetide", "category": "Regenerative", "halfLife": "20 minutes", "duration": "EPO receptor-derived peptide", "routes": "SC", "notes": "Approximate"}, {"name": "FOXO4-DRI", "alias": "FOXO4", "category": "Senolytic research", "halfLife": "9 hours", "duration": "Limited public PK data", "routes": "SC", "notes": "Estimated"}, {"name": "PNC-27", "alias": "PNC-27", "category": "Oncology research", "halfLife": "1.5 hours", "duration": "Limited public PK data", "routes": "SC/IV", "notes": "Estimated"}, {"name": "Klotho fragments", "alias": "Klotho", "category": "Longevity", "halfLife": "Limited data", "duration": "Fragment-dependent", "routes": "SC", "notes": "Limited data"}, {"name": "P21", "alias": "P021", "category": "Nootropic", "halfLife": "Limited data", "duration": "Investigational", "routes": "SC/Oral", "notes": "Limited data"}, {"name": "N-Acetyl Epitalon Amidate", "alias": "NA Epitalon", "category": "Longevity", "halfLife": "Limited data", "duration": "Longer than Epitalon / limited data", "routes": "SC", "notes": "Estimated"}, {"name": "ACE-031", "alias": "ACE-031", "category": "Myostatin pathway", "halfLife": "12 days", "duration": "Fusion protein/peptide biologic", "routes": "SC", "notes": "Approximate"}, {"name": "Myostatin Propeptide", "alias": "MSTN Propeptide", "category": "Myostatin pathway", "halfLife": "Limited data", "duration": "Research peptide", "routes": "SC", "notes": "Limited data"}, {"name": "HCG", "alias": "hCG", "category": "Hormonal glycoprotein", "halfLife": "30 hours", "duration": "Glycoprotein hormone", "routes": "SC/IM", "notes": "Included for tracker reference"}, {"name": "Gonadorelin", "alias": "GnRH", "category": "Hormonal", "halfLife": "3 minutes", "duration": "GnRH analog", "routes": "SC/IV", "notes": "Approximate"}, {"name": "Triptorelin", "alias": "GnRH agonist", "category": "Hormonal", "halfLife": "4 hours", "duration": "Formulation dependent", "routes": "SC/IM", "notes": "Approximate"}, {"name": "Buserelin", "alias": "GnRH agonist", "category": "Hormonal", "halfLife": "1.5 hours", "duration": "Formulation dependent", "routes": "Nasal/SC", "notes": "Approximate"}, {"name": "Gonadorelin Acetate", "alias": "GnRH acetate", "category": "Hormonal", "halfLife": "3 minutes", "duration": "GnRH analog", "routes": "SC/IV", "notes": "Approximate"}, {"name": "Nesiritide", "alias": "BNP", "category": "Cardiac peptide", "halfLife": "18 minutes", "duration": "Recombinant BNP", "routes": "IV", "notes": "Approximate"}, {"name": "Anamorelin", "alias": "Anamorelin", "category": "Ghrelin agonist", "halfLife": "7 hours", "duration": "Non-peptide ghrelin agonist", "routes": "Oral", "notes": "Included for tracker reference"}, {"name": "Abaloparatide", "alias": "ABL", "category": "PTHrP analog", "halfLife": "1.7 hours", "duration": "Bone-related peptide analog", "routes": "SC", "notes": "Approximate"}, {"name": "Teriparatide", "alias": "PTH 1-34", "category": "PTH analog", "halfLife": "1 hours", "duration": "Bone-related peptide analog", "routes": "SC", "notes": "Approximate"}, {"name": "Calcitonin Salmon", "alias": "Calcitonin", "category": "Hormonal", "halfLife": "43 minutes", "duration": "Peptide hormone analog", "routes": "Nasal/SC", "notes": "Approximate"}, {"name": "Pramlintide", "alias": "Symlin", "category": "Amylin analog", "halfLife": "48 minutes", "duration": "Amylin analog", "routes": "SC", "notes": "Approximate"}, {"name": "Amylin", "alias": "IAPP", "category": "Amylin", "halfLife": "13 minutes", "duration": "Native amylin", "routes": "SC/IV", "notes": "Approximate"}, {"name": "Leptin", "alias": "Metreleptin", "category": "Hormonal", "halfLife": "3.5 hours", "duration": "Protein hormone", "routes": "SC", "notes": "Approximate"}, {"name": "Insulin Lispro", "alias": "Lispro", "category": "Insulin analog", "halfLife": "1 hours", "duration": "Rapid-acting insulin analog", "routes": "SC", "notes": "Approximate"}, {"name": "Insulin Aspart", "alias": "Aspart", "category": "Insulin analog", "halfLife": "1 hours", "duration": "Rapid-acting insulin analog", "routes": "SC", "notes": "Approximate"}, {"name": "Insulin Glargine", "alias": "Glargine", "category": "Insulin analog", "halfLife": "12 hours", "duration": "Long-acting formulation", "routes": "SC", "notes": "Formulation-dependent"}, {"name": "GIP", "alias": "GIP", "category": "Incretin", "halfLife": "7 minutes", "duration": "Native incretin peptide", "routes": "IV/SC", "notes": "Approximate"}, {"name": "GLP-1 Native", "alias": "GLP-1", "category": "Incretin", "halfLife": "2 minutes", "duration": "Native GLP-1", "routes": "IV/SC", "notes": "Approximate"}, {"name": "Glucagon", "alias": "GCG", "category": "Hormonal", "halfLife": "5 minutes", "duration": "Peptide hormone", "routes": "Injection", "notes": "Approximate"}];
const LAB_MARKERS={'CBC':['WBC (White Blood Cell Count)','RBC (Red Blood Cell Count)','Hemoglobin','Hematocrit','Platelets'],'BMP / CMP':['Glucose','Sodium','Potassium','Chloride','Bicarbonate','BUN','Creatinine','ALT','AST','ALP','Albumin','Total Protein','Bilirubin'],'Lipid Panel':['Total Cholesterol','LDL','HDL','Triglycerides','ApoB'],'Thyroid Panel':['TSH','Free T3','Free T4'],'Blood Sugar & Metabolic Health':['HbA1c','Fasting Insulin'],'Inflammatory & Cardiac Markers':['hs-CRP','Troponin','Homocysteine'],'Nutritional & Mineral Levels':['Ferritin','Iron','Vitamin D','Vitamin B12','Folate']};
const badge=s=>`<span class="pill ${['Tested','Verified','Passed','In Range'].includes(s)?'success':['Failed','High','Low'].includes(s)?'danger':'warning'}">${esc(s)}</span>`;
function halfLifeHours(txt){ if(!txt||/limited|varies/i.test(txt))return null; let m=String(txt).match(/([0-9.]+)\s*(minutes?|hours?|days?|weeks?)/i); if(!m)return null; let n=parseFloat(m[1]),u=m[2].toLowerCase(); if(u.startsWith('minute'))return n/60; if(u.startsWith('hour'))return n; if(u.startsWith('day'))return n*24; if(u.startsWith('week'))return n*168; return null; }
function defaultHalfLifeSetting(p){const txt=p.halfLife||''; const m=String(txt).match(/([0-9.]+)\s*(minutes?|hours?|days?|weeks?)/i); if(!m||/limited|varies/i.test(txt))return {value:'',unit:'hours'}; let n=parseFloat(m[1]), u=m[2].toLowerCase(); if(u.startsWith('minute')) return {value:n,unit:'minutes'}; if(u.startsWith('hour')) return {value:n,unit:'hours'}; if(u.startsWith('day')) return {value:n,unit:'days'}; if(u.startsWith('week')) return {value:n*7,unit:'days'}; return {value:'',unit:'hours'}; }
function getHalfLifeSettings(){let saved=JSON.parse(localStorage.getItem('halfLifeSettings')||'{}'); PEPTIDES.forEach(p=>{if(!saved[p.name]) saved[p.name]=defaultHalfLifeSetting(p);}); return saved;}
function saveHalfLifeSetting(name,value,unit){const s=getHalfLifeSettings(); s[name]={value:value,unit:unit||'hours'}; localStorage.setItem('halfLifeSettings',JSON.stringify(s)); renderPeptideLogs(); renderLevels(); renderHalfLifeConfigTable(); renderHalfLifeTable();}
function configuredHalfLifeHours(name){const s=getHalfLifeSettings()[name]||{}; const v=parseFloat(s.value); if(!isFinite(v)||v<=0)return null; if(s.unit==='minutes')return v/60; if(s.unit==='days')return v*24; return v;}
function formatConfiguredHalfLife(name){const s=getHalfLifeSettings()[name]||{}; if(s.value===''||s.value==null)return 'Excluded'; return `${s.value} ${s.unit||'hours'}`;}
function hlHoursLabel(hl){if(!hl)return 'Excluded'; return hl.toFixed(3).replace(/\.000$/,'')+' h';}

function peptideByName(n){return PEPTIDES.find(p=>p.name===n)||PEPTIDES.find(p=>p.alias===n)||{};}
function remaining(dose,dt,hl){ if(!hl)return 0; const elapsed=(Date.now()-new Date(dt).getTime())/36e5; if(elapsed<0)return Number(dose)||0; return (Number(dose)||0)*Math.pow(.5,elapsed/hl); }
function countdownToNextHalf(dt,hl){ if(!hl)return 'Limited data'; const elapsed=(Date.now()-new Date(dt).getTime())/36e5; const next=Math.ceil(Math.max(elapsed,0)/hl)*hl; const hrs=Math.max(0,next-elapsed); const d=Math.floor(hrs/24), h=Math.floor(hrs%24), m=Math.floor((hrs*60)%60); return `${d}d ${h}h ${m}m`; }
function bmi(weight,unit,ft,inch){let w=Number(weight), h=(Number(ft)||0)*12+(Number(inch)||0); if(!w||!h)return ''; if(unit==='kg') w*=2.20462; return ((w/(h*h))*703).toFixed(1);}
function render(){ const inv=store.get('inventory'), logs=store.get('logs'), coas=store.get('coas'), labs=store.get('labs'), notes=store.get('structuredNotes'), plogs=store.get('peptideLogs'), health=store.get('health');
['compoundCount','doseCount','peptideLogCount','healthCount','coaCount','labCount'].forEach(id=>{const el=$('#'+id); if(el) el.textContent={compoundCount:inv.length,doseCount:logs.length,peptideLogCount:plogs.length,healthCount:health.length,coaCount:coas.length,labCount:labs.length}[id];}); $('#heroItems').textContent=inv.length; $('#heroPeptideLogs').textContent=plogs.length;
$('#inventoryTable').innerHTML=inv.map((i,n)=>`<tr><td>${esc(i.compound)}</td><td>${esc(i.strength)}</td><td>${esc(i.quantity)}</td><td>${esc(i.vendor)}</td><td>${esc(i.lot)}</td><td>${esc(i.cap)}</td><td>${esc(i.crimp)}</td><td>${badge(i.status)}</td><td><button class="btn danger" onclick="delRow('inventory',${n})">Delete</button></td></tr>`).join('');
$('#logTable').innerHTML=logs.map((i,n)=>`<tr><td>${esc(i.date)}</td><td>${esc(i.compound)}</td><td>${esc(i.amount)}</td><td>${esc(i.route)}</td><td>${esc(i.notes)}</td><td><button class="btn danger" onclick="delRow('logs',${n})">Delete</button></td></tr>`).join('');
$('#coaTable').innerHTML=coas.map((i,n)=>{const file=i.fileData?`<a class="btn secondary" href="${i.fileData}" target="_blank" download="${esc(i.fileName||'coa-file')}">Open ${esc(i.fileName||'file')}</a>`:(i.fileName?esc(i.fileName):'No file'); return `<tr><td>${esc(i.compound)}</td><td>${esc(i.lab)}</td><td>${esc(i.date)}</td><td>${esc(i.purity)}</td><td>${esc(i.mass)}</td><td>${badge(i.status)}</td><td>${file}</td><td><button class="btn danger" onclick="delRow('coas',${n})">Delete</button></td></tr>`}).join('');
$('#labTable').innerHTML=labs.map((i,n)=>`<tr><td>${esc(i.date)}</td><td>${esc(i.category)}</td><td>${esc(i.marker)}</td><td>${esc(i.value)}</td><td>${esc(i.units)}</td><td>${esc(i.range)}</td><td>${badge(i.status)}</td><td>${esc(i.notes)}</td><td><button class="btn danger" onclick="delRow('labs',${n})">Delete</button></td></tr>`).join('');
$('#noteTable').innerHTML=notes.map((i,n)=>`<tr><td>${esc(i.date)}</td><td>${esc(i.title)}</td><td>${esc(i.category)}</td><td>${esc(i.tags)}</td><td>${esc(i.details)}</td><td><button class="btn danger" onclick="delRow('structuredNotes',${n})">Delete</button></td></tr>`).join('');
renderPeptideLogs(); renderLevels(); renderHealth(); renderPremiumModules(); renderLiveCharts(); }
function renderPeptideLogs(){let arr=store.get('peptideLogs').slice().sort((a,b)=>new Date(b.datetime)-new Date(a.datetime)); const range=$('#peptideRange').value; if(range!=='all'){const cutoff=Date.now()-Number(range)*864e5; arr=arr.filter(x=>new Date(x.datetime).getTime()>=cutoff);} $('#peptideLogTable').innerHTML=arr.map(i=>{const idx=store.get('peptideLogs').indexOf(i); const hl=configuredHalfLifeHours(i.peptide), rem=remaining(i.amount,i.datetime,hl); return `<tr><td>${esc(i.datetime).replace('T',' ')}</td><td>${esc(i.peptide)}</td><td>${esc(i.amount)} mg</td><td>${esc(i.route)}</td><td>${esc(formatConfiguredHalfLife(i.peptide))}</td><td>${rem.toFixed(3)} mg</td><td>${countdownToNextHalf(i.datetime,hl)}</td><td>${esc(i.notes)}</td><td><button class="btn danger" onclick="delRow('peptideLogs',${idx})">Delete</button></td></tr>`}).join('');
const total=arr.reduce((s,x)=>s+Number(x.amount||0),0); const rem=arr.reduce((s,x)=>s+remaining(x.amount,x.datetime,configuredHalfLifeHours(x.peptide)),0); $('#peptideSummary').innerHTML=`<div class="stat"><span>${arr.length}</span><small>Logs in range</small></div><div class="stat"><span>${total.toFixed(2)}</span><small>Total mg logged</small></div><div class="stat"><span>${rem.toFixed(2)}</span><small>Estimated mg remaining</small></div>`; }
function renderLevels(){ const rows={}; store.get('peptideLogs').forEach(x=>{const hl=configuredHalfLifeHours(x.peptide); if(!hl)return; if(!rows[x.peptide])rows[x.peptide]={total:0,rem:0,last:''}; rows[x.peptide].total+=Number(x.amount||0); rows[x.peptide].rem+=remaining(x.amount,x.datetime,hl); if(!rows[x.peptide].last||new Date(x.datetime)>new Date(rows[x.peptide].last))rows[x.peptide].last=x.datetime;}); const entries=Object.entries(rows); $('#levelsTable').innerHTML=entries.map(([name,r])=>{const hl=configuredHalfLifeHours(name), pct=r.total?((r.rem/r.total)*100):0; return `<tr><td>${esc(name)}</td><td>${r.total.toFixed(3)} mg</td><td>${r.rem.toFixed(3)} mg</td><td>${pct.toFixed(1)}%</td><td>${countdownToNextHalf(r.last,hl)}</td><td>${esc(r.last).replace('T',' ')}</td></tr>`}).join(''); $('#levelsCards').innerHTML=entries.slice(0,6).map(([n,r])=>`<div class="stat"><span>${r.rem.toFixed(2)}</span><small>${esc(n)} est. mg remaining</small></div>`).join('')||'<div class="card">Add peptide log entries and configure a half-life to see live estimated levels.</div>'; }
function renderHalfLifeConfigTable(){const body=$('#halfLifeConfigTable'); if(!body)return; const q=($('#halfLifeConfigSearch')?.value||'').toLowerCase(), settings=getHalfLifeSettings(); body.innerHTML=PEPTIDES.filter(p=>Object.values(p).join(' ').toLowerCase().includes(q)).map(p=>{const s=settings[p.name]||defaultHalfLifeSetting(p), hl=configuredHalfLifeHours(p.name); return `<tr><td>${esc(p.name)}</td><td>${esc(p.alias)}</td><td>${esc(p.category)}</td><td><input class="hl-value" data-name="${esc(p.name)}" type="number" step="0.001" min="0" value="${esc(s.value)}" placeholder="blank = exclude"></td><td><select class="hl-unit" data-name="${esc(p.name)}"><option value="minutes" ${s.unit==='minutes'?'selected':''}>Minutes</option><option value="hours" ${s.unit==='hours'?'selected':''}>Hours</option><option value="days" ${s.unit==='days'?'selected':''}>Days</option></select></td><td>${hlHoursLabel(hl)}</td><td>${hl?'Included in levels':'Excluded from chart'}</td></tr>`}).join(''); $$('.hl-value').forEach(el=>el.onchange=()=>{const name=el.dataset.name, unit=document.querySelector(`.hl-unit[data-name="${CSS.escape(name)}"]`).value; saveHalfLifeSetting(name,el.value,unit);}); $$('.hl-unit').forEach(el=>el.onchange=()=>{const name=el.dataset.name, value=document.querySelector(`.hl-value[data-name="${CSS.escape(name)}"]`).value; saveHalfLifeSetting(name,value,el.value);});}
function renderHealth(){const rows=store.get('health').slice().sort((a,b)=>new Date(b.date)-new Date(a.date)); $('#healthTable').innerHTML=rows.map(i=>{const idx=store.get('health').indexOf(i), b=bmi(i.weight,i.weightUnit,i.heightFeet,i.heightInches); return `<tr><td>${esc(i.date)}</td><td>${esc(i.weight)} ${esc(i.weightUnit)}</td><td>${esc(i.systolic)}/${esc(i.diastolic)}</td><td>${esc(i.glucose)} ${esc(i.glucoseUnit)}</td><td>${esc(i.heartRate)} BPM</td><td>${b}</td><td>${esc(i.notes)}</td><td><button class="btn danger" onclick="delRow('health',${idx})">Delete</button></td></tr>`}).join(''); const latest=rows[0]||{}; $('#healthSummary').innerHTML=`<div class="stat"><span>${esc(latest.weight||'-')}</span><small>Latest Weight</small></div><div class="stat"><span>${latest.systolic?esc(latest.systolic+'/'+latest.diastolic):'-'}</span><small>Latest BP</small></div><div class="stat"><span>${esc(latest.glucose||'-')}</span><small>Latest Glucose</small></div><div class="stat"><span>${esc(latest.heartRate||'-')}</span><small>Latest Heart Rate</small></div>`; }

function chartEmpty(id,msg='Add records to see this live chart.'){const el=$('#'+id); if(el)el.innerHTML=`<div class="chart-empty">${esc(msg)}</div>`;}
function fmtShortDate(v){if(!v)return''; const d=new Date(v); if(isNaN(d))return String(v); return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});}
function groupCount(rows,key){return rows.reduce((m,r)=>{const k=r[key]||'Blank';m[k]=(m[k]||0)+1;return m;},{});}
function groupSum(rows,key,valueKey){return rows.reduce((m,r)=>{const k=r[key]||'Blank';m[k]=(m[k]||0)+Number(r[valueKey]||0);return m;},{});}
function drawBarChart(id,data,opts={}){const el=$('#'+id); if(!el)return; const entries=Object.entries(data).filter(([,v])=>Number(v)>0).sort((a,b)=>b[1]-a[1]).slice(0,opts.limit||10); if(!entries.length)return chartEmpty(id,opts.empty); const w=760,h=260,ml=130,mr=24,mt=20,mb=34,plotW=w-ml-mr,plotH=h-mt-mb,max=Math.max(...entries.map(e=>e[1]),1),barH=Math.max(14,Math.min(30,plotH/entries.length-8)); let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Live bar chart">`; svg+=`<line class="chart-axis" x1="${ml}" y1="${mt}" x2="${ml}" y2="${h-mb}"/><line class="chart-axis" x1="${ml}" y1="${h-mb}" x2="${w-mr}" y2="${h-mb}"/>`; entries.forEach(([label,val],i)=>{const y=mt+i*(plotH/entries.length)+4, bw=(val/max)*plotW; svg+=`<text class="chart-label" x="8" y="${y+barH*.7}">${esc(label).slice(0,22)}</text><rect class="chart-bar" x="${ml}" y="${y}" width="${Math.max(2,bw)}" height="${barH}" rx="6"/><text class="chart-label" x="${ml+bw+8}" y="${y+barH*.7}">${Number(val).toFixed(opts.decimals??0)}</text>`;}); svg+='</svg>'; el.innerHTML=svg;}
function drawLineChart(id,points,series,opts={}){const el=$('#'+id); if(!el)return; const rows=points.filter(p=>p.x&&series.some(s=>Number.isFinite(Number(p[s.key])))); if(rows.length<1)return chartEmpty(id,opts.empty); const w=760,h=260,ml=50,mr=24,mt=24,mb=44,plotW=w-ml-mr,plotH=h-mt-mb; const vals=[]; rows.forEach(r=>series.forEach(s=>{const v=Number(r[s.key]); if(Number.isFinite(v))vals.push(v);})); const min=Math.min(...vals), max=Math.max(...vals), span=(max-min)||1; const x=(i)=>ml+(rows.length===1?plotW/2:(i/(rows.length-1))*plotW), y=(v)=>mt+plotH-((v-min)/span)*plotH; let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Live line chart">`; for(let g=0;g<=4;g++){const yy=mt+(plotH/4)*g; svg+=`<line class="chart-gridline" x1="${ml}" y1="${yy}" x2="${w-mr}" y2="${yy}"/>`;} svg+=`<line class="chart-axis" x1="${ml}" y1="${mt}" x2="${ml}" y2="${h-mb}"/><line class="chart-axis" x1="${ml}" y1="${h-mb}" x2="${w-mr}" y2="${h-mb}"/>`; series.forEach((ser,si)=>{let d=''; rows.forEach((r,i)=>{const v=Number(r[ser.key]); if(!Number.isFinite(v))return; d+=(d?' L ':'M ')+x(i)+' '+y(v);}); svg+=`<path class="${si?'chart-line chart-bar-alt':'chart-line'}" d="${d}"/>`; rows.forEach((r,i)=>{const v=Number(r[ser.key]); if(Number.isFinite(v))svg+=`<circle class="chart-dot" cx="${x(i)}" cy="${y(v)}" r="4"><title>${esc(fmtShortDate(r.x))}: ${ser.label||ser.key} ${v}</title></circle>`;});}); rows.forEach((r,i)=>{if(i===0||i===rows.length-1||rows.length<8)svg+=`<text class="chart-label" x="${x(i)-18}" y="${h-16}">${esc(fmtShortDate(r.x))}</text>`;}); svg+='</svg>'; el.innerHTML=svg;}
function dailySeries(rows,dateKey,fields){const by={}; rows.forEach(r=>{const d=(r[dateKey]||'').slice(0,10); if(!d)return; by[d]=by[d]||{x:d}; fields.forEach(f=>{const v=Number(f.get?f.get(r):r[f.key]); if(Number.isFinite(v))by[d][f.key]=v;});}); return Object.values(by).sort((a,b)=>new Date(a.x)-new Date(b.x)).slice(-30);}

function daysAgo(n){const d=new Date(); d.setDate(d.getDate()-n); d.setHours(23,59,59,999); return d;}
function levelAt(peptide,at){const t=new Date(at).getTime(); return store.get('peptideLogs').filter(x=>x.peptide===peptide).reduce((sum,x)=>{const hl=configuredHalfLifeHours(x.peptide); const dt=new Date(x.datetime).getTime(); if(!hl||!Number.isFinite(dt)||dt>t)return sum; const elapsed=(t-dt)/36e5; return sum + Number(x.amount||0)*Math.pow(0.5, elapsed/hl);},0);}
function renderAccumulationChart(){const sel=$('#levelFocusPeptide'); if(!sel)return; const names=[...new Set(store.get('peptideLogs').map(x=>x.peptide).filter(Boolean))].sort(); const current=sel.value||names[0]||''; sel.innerHTML=names.map(n=>`<option ${n===current?'selected':''}>${esc(n)}</option>`).join(''); const chosen=sel.value||current; if(!chosen)return chartEmpty('accumulationChart','Add peptide logs to see accumulation over time.'); const pts=[]; for(let i=29;i>=0;i--){const d=daysAgo(i); pts.push({x:d.toISOString().slice(0,10), level:Number(levelAt(chosen,d).toFixed(3))});} drawLineChart('accumulationChart',pts,[{key:'level',label:chosen+' estimated mg'}],{empty:'Add peptide logs and half-lives to see accumulation.'});}
function renderLabTrendChart(){const sel=$('#labTrendMarker'); if(!sel)return; const labs=store.get('labs'); const markers=[...new Set(labs.map(x=>x.marker).filter(Boolean))].sort(); const current=sel.value||markers[0]||''; sel.innerHTML=markers.map(m=>`<option ${m===current?'selected':''}>${esc(m)}</option>`).join(''); const chosen=sel.value||current; if(!chosen)return chartEmpty('labTrendChart','Add lab records to see marker trends.'); const pts=labs.filter(x=>x.marker===chosen&&Number.isFinite(Number(x.value))).sort((a,b)=>new Date(a.date)-new Date(b.date)).map(x=>({x:x.date,value:Number(x.value)})).slice(-30); drawLineChart('labTrendChart',pts,[{key:'value',label:chosen}],{empty:'Add numeric values for this lab marker.'});}
function renderTimeline(){const el=$('#timelineFeed'); if(!el)return; const items=[]; store.get('peptideLogs').forEach(x=>items.push({date:x.datetime,title:`Peptide log: ${x.peptide||'Entry'}`,meta:`${x.amount||''} mg ${x.route?('• '+x.route):''}`})); store.get('health').forEach(x=>items.push({date:x.date,title:'Health record added',meta:[x.weight&&`Weight ${x.weight} ${x.weightUnit||''}`,x.systolic&&`BP ${x.systolic}/${x.diastolic}`,x.glucose&&`Glucose ${x.glucose}`].filter(Boolean).join(' • ')})); store.get('labs').forEach(x=>items.push({date:x.date,title:`Lab marker: ${x.marker||'Record'}`,meta:`${x.value||''} ${x.units||''} • ${x.status||''}`})); store.get('coas').forEach(x=>items.push({date:x.date,title:`COA: ${x.compound||'Record'}`,meta:`${x.lab||''} • ${x.status||''}`})); store.get('inventory').forEach(x=>items.push({date:new Date().toISOString(),title:`Inventory: ${x.compound||'Item'}`,meta:`${x.strength||''} • ${x.status||''}`})); items.sort((a,b)=>new Date(b.date)-new Date(a.date)); el.innerHTML=items.slice(0,10).map(i=>`<div class="timeline-item"><div class="timeline-date">${esc(fmtShortDate(i.date||''))}</div><div><div class="timeline-title">${esc(i.title)}</div><div class="timeline-meta">${esc(i.meta||'')}</div></div></div>`).join('')||'<div class="chart-empty">Add records to build your live activity timeline.</div>';}


const PREMIUM_KEYS=['inventory','logs','coas','labs','structuredNotes','peptideLogs','health','protocols','costs','vendors','measurements','journal','audit'];
const ALL_DATA_KEYS=[...PREMIUM_KEYS,'notes','paUser','paLoggedIn','halfLifeSettings','settings'];
function audit(action,section,details=''){const arr=store.get('audit');arr.unshift({time:new Date().toISOString(),action,section,details});store.set('audit',arr.slice(0,500));}
function money(n){return '$'+Number(n||0).toFixed(2)}
function safeNum(n){const v=Number(n);return Number.isFinite(v)?v:0;}
function daysBetween(a,b){if(!a||!b)return 0; return Math.max(0,Math.round((new Date(b)-new Date(a))/864e5));}
function renderPremiumModules(){renderProtocols();renderCosts();renderVendors();renderMeasurements();renderJournal();renderBackupSummary();renderInsights();renderAudit();renderSettings();renderAdmin();}
function protocolOccurrences(r){
  const start=new Date((r.start||'')+'T'+(r.time||'09:00'));
  const freq=safeNum(r.frequencyDays);
  const weeks=safeNum(r.durationWeeks)||12;
  if(!r.start||!freq||isNaN(start))return [];
  const count=Math.min(370,Math.max(1,Math.ceil((weeks*7)/freq)+1));
  const done=Array.isArray(r.completed)?r.completed:[];
  return Array.from({length:count},(_,i)=>{const d=new Date(start); d.setDate(d.getDate()+Math.round(i*freq)); const iso=d.toISOString().slice(0,10); return {idx:i,date:iso,time:r.time||'09:00',done:done.includes(i)};});
}
function nextProtocolDate(r){const now=new Date(); const next=protocolOccurrences(r).find(o=>!o.done && new Date(o.date+'T'+o.time)>=new Date(now.toDateString())); return next?next.date:'';}
function protocolAdherence(r){const occ=protocolOccurrences(r).filter(o=>new Date(o.date+'T23:59:59')<=new Date()); if(!occ.length)return 0; return Math.round((occ.filter(o=>o.done).length/occ.length)*100);}
function initProtocolPlanner(){
  const sel=$('#protocolPeptide'); if(sel)sel.innerHTML=PEPTIDES.map(p=>`<option>${esc(p.name)}</option>`).join('');
  const form=$('#protocolForm'); if(!form)return;
  form.addEventListener('submit',e=>{e.preventDefault(); const data=Object.fromEntries(new FormData(e.target).entries()); data.completed=[]; const arr=store.get('protocols'); arr.push(data); store.set('protocols',arr); audit('Add','protocols',data.name||data.peptide||'Protocol schedule'); e.target.reset(); if(sel)sel.innerHTML=PEPTIDES.map(p=>`<option>${esc(p.name)}</option>`).join(''); setDefaultDates(); render();});
}
window.toggleProtocolDose=function(rowIndex,occIndex){const arr=store.get('protocols'); if(!arr[rowIndex])return; const done=new Set(Array.isArray(arr[rowIndex].completed)?arr[rowIndex].completed:[]); done.has(occIndex)?done.delete(occIndex):done.add(occIndex); arr[rowIndex].completed=[...done].sort((a,b)=>a-b); store.set('protocols',arr); audit('Update','protocols',`${arr[rowIndex].name||'Protocol'} checkoff updated`); render();}
function renderProtocols(){
  const rows=store.get('protocols').slice().sort((a,b)=>new Date(a.start||0)-new Date(b.start||0));
  const original=store.get('protocols');
  const el=$('#protocolTable');
  if(el)el.innerHTML=rows.map(r=>{const n=original.indexOf(r), next=nextProtocolDate(r), adherence=protocolAdherence(r), occ=protocolOccurrences(r); return `<tr><td>${esc(r.name)}</td><td>${esc(r.peptide||r.compounds||'')}</td><td>${esc([r.dose,r.doseUnit].filter(Boolean).join(' '))}</td><td>Every ${esc(r.frequencyDays||'')} day(s)<br><small>${esc(r.start||'')} ${esc(r.time||'')}</small></td><td>${next?badge(next):badge('Complete')}</td><td><div class="progress"><span style="width:${adherence}%"></span></div><small>${adherence}% • ${occ.filter(o=>o.done).length}/${occ.filter(o=>new Date(o.date+'T23:59:59')<=new Date()).length||0} done</small></td><td>${badge(r.status||'Planning')}</td><td>${esc(r.goal||'')}</td><td><button class="btn danger" onclick="delRow('protocols',${n})">Delete</button></td></tr>`}).join('');
  const flat=[]; rows.forEach(r=>{const idx=original.indexOf(r); protocolOccurrences(r).slice(0,60).forEach(o=>flat.push({...o,rowIndex:idx,name:r.name,peptide:r.peptide||r.compounds,dose:[r.dose,r.doseUnit].filter(Boolean).join(' '),status:r.status}))});
  const upcoming=flat.filter(o=>new Date(o.date+'T23:59:59')>=new Date(Date.now()-864e5)).sort((a,b)=>new Date(a.date+'T'+a.time)-new Date(b.date+'T'+b.time)).slice(0,18);
  const cal=$('#protocolCalendar'); if(cal)cal.innerHTML=upcoming.length?upcoming.map(o=>`<div class="schedule-item ${o.done?'done':''}"><label><input type="checkbox" ${o.done?'checked':''} onchange="toggleProtocolDose(${o.rowIndex},${o.idx})"><span><strong>${esc(o.date)} ${esc(o.time)}</strong><small>${esc(o.name)} • ${esc(o.peptide||'')} ${esc(o.dose||'')}</small></span></label></div>`).join(''):'<p class="muted">Add a protocol schedule to generate your calendar.</p>';
  const next=upcoming.find(o=>!o.done); const nextCard=$('#nextProtocolCard'); if(nextCard)nextCard.innerHTML=next?`<div class="next-date">${esc(next.date)} ${esc(next.time)}</div><h3>${esc(next.name)}</h3><p>${esc(next.peptide||'')} ${esc(next.dose||'')}</p><button class="btn primary" onclick="toggleProtocolDose(${next.rowIndex},${next.idx})">Mark Complete</button>`:'<p class="muted">No upcoming scheduled entries. Add or extend a protocol.</p>';
  const past=flat.filter(o=>new Date(o.date+'T23:59:59')<=new Date()); const done=past.filter(o=>o.done).length, adherence=past.length?Math.round(done/past.length*100):0; const stats=$('#protocolStats'); if(stats)stats.innerHTML=`<div class="stat"><span>${rows.length}</span><small>Total protocols</small></div><div class="stat"><span>${rows.filter(r=>r.status==='Active').length}</span><small>Active</small></div><div class="stat"><span>${upcoming.filter(o=>!o.done).length}</span><small>Upcoming entries</small></div><div class="stat"><span>${adherence}%</span><small>Overall adherence</small></div>`;
  drawBarChart('protocolStatusChart',groupCount(rows,'status'),{empty:'Add protocols to see status.'});
  const weekly={}; past.forEach(o=>{const d=new Date(o.date); const key=d.toISOString().slice(0,10); weekly[key]=(weekly[key]||0)+(o.done?1:0)}); drawBarChart('protocolAdherenceChart',weekly,{empty:'Check off planned entries to see adherence.'});
  if(typeof renderLiveProtocolCalendar==='function') renderLiveProtocolCalendar();
}
function renderCosts(){const rows=store.get('costs').slice().sort((a,b)=>new Date(b.date)-new Date(a.date)); let total=0,totalMg=0,totalVials=0; const tbody=$('#costTable'); if(tbody)tbody.innerHTML=rows.map((r,n)=>{const mg=purchaseMg(r), cost=purchaseCost(r), vials=safeNum(r.vials), cpm=mg?cost/mg:0, cpv=vials?cost/vials:0; total+=cost; totalMg+=mg; totalVials+=vials; return `<tr><td>${esc(r.date)}</td><td>${esc(r.vendor)}</td><td>${esc(r.compound)}</td><td>${esc([r.lot,r.batch].filter(Boolean).join(' / '))}</td><td>${esc(r.vials)}</td><td>${mg?mg.toFixed(2):'-'}</td><td>${money(safeNum(r.price))}</td><td>${money(safeNum(r.shipping)+safeNum(r.fees))}</td><td>${money(cost)}</td><td>${vials?money(cpv):'-'}</td><td>${mg?money(cpm):'-'}</td><td>${badge(r.status||'Received')}</td><td>${esc(r.notes)}</td><td><button class="btn danger" onclick="delRow('costs',${n})">Delete</button></td></tr>`}).join(''); const last30=rows.filter(r=>(Date.now()-new Date(r.date).getTime())<=30*864e5).reduce((s,r)=>s+purchaseCost(r),0); const year=new Date().getFullYear(); const ytd=rows.filter(r=>new Date(r.date).getFullYear()===year).reduce((s,r)=>s+purchaseCost(r),0); const s=$('#costSummary'); if(s)s.innerHTML=`<div class="stat"><span>${money(total)}</span><small>Total lifetime spend</small></div><div class="stat"><span>${money(last30)}</span><small>Last 30 day spend</small></div><div class="stat"><span>${money(ytd)}</span><small>${year} spend</small></div><div class="stat"><span>${totalMg?money(total/totalMg):'$0.00'}</span><small>Average cost / mg</small></div><div class="stat"><span>${totalVials}</span><small>Total vials</small></div><div class="stat"><span>${rows.length}</span><small>Purchases</small></div>`; const cpm=costPerMgMap(rows); renderInventoryValue(cpm); drawBarChart('costMonthChart',sumCost(rows,'__month'),{decimals:2,empty:'Add purchases to see monthly spend.'}); drawBarChart('costCompoundChart',sumCost(rows,'compound'),{decimals:2,empty:'Add purchases to see spend by compound.'}); drawBarChart('costVendorChart',sumCost(rows,'vendor'),{decimals:2,empty:'Add purchases to see spend by vendor.'}); drawBarChart('costPerMgChart',cpm,{decimals:2,empty:'Add purchases to see cost per mg.'});}
function sumCost(rows,key){return rows.reduce((m,r)=>{const k=key==='__month'?monthKey(r.date):(r[key]||'Blank');m[k]=(m[k]||0)+purchaseCost(r);return m;},{});}
function renderVendors(){const rows=store.get('vendors').slice().sort((a,b)=>String(a.name).localeCompare(String(b.name))); const el=$('#vendorTable'); if(el)el.innerHTML=rows.map((r,n)=>`<tr><td>${esc(r.name)}</td><td>${r.website?`<a href="${esc(r.website)}" target="_blank" rel="noopener">Open</a>`:''}</td><td>${esc(r.contact)}</td><td>${esc(r.lastOrder)}</td><td>${esc(r.orders)}</td><td>${esc(r.avgPurity)}%</td><td>${esc(r.passRate)}%</td><td>${badge(r.status)}</td><td>${esc(r.notes)}</td><td><button class="btn danger" onclick="delRow('vendors',${n})">Delete</button></td></tr>`).join(''); const pass={}; rows.forEach(r=>pass[r.name||'Vendor']=safeNum(r.passRate)); drawBarChart('vendorPassChart',pass,{decimals:1,empty:'Add vendors to see pass rates.'}); const orders={}; rows.forEach(r=>orders[r.name||'Vendor']=safeNum(r.orders)); drawBarChart('vendorOrdersChart',orders,{empty:'Add vendors to see orders.'});}
function renderMeasurements(){const rows=store.get('measurements').slice().sort((a,b)=>new Date(b.date)-new Date(a.date)); const el=$('#measurementTable'); if(el)el.innerHTML=rows.map((r,n)=>`<tr><td>${esc(r.date)}</td><td>${esc(r.weight)}</td><td>${esc(r.bodyFat)}%</td><td>${esc(r.waist)}</td><td>${esc(r.hips)}</td><td>${esc(r.chest)}</td><td>${esc(r.arms)}</td><td>${esc(r.thighs)}</td><td>${esc(r.neck)}</td><td>${esc(r.notes)}</td><td><button class="btn danger" onclick="delRow('measurements',${n})">Delete</button></td></tr>`).join(''); const asc=rows.slice().sort((a,b)=>new Date(a.date)-new Date(b.date)); drawLineChart('waistChart',dailySeries(asc,'date',[{key:'waist'}]),[{key:'waist',label:'Waist'}],{empty:'Add waist measurements.'}); drawLineChart('bodyFatChart',dailySeries(asc,'date',[{key:'bodyFat'}]),[{key:'bodyFat',label:'Body fat %'}],{empty:'Add body fat records.'}); drawLineChart('measurementWeightChart',dailySeries(asc,'date',[{key:'weight'}]),[{key:'weight',label:'Weight'}],{empty:'Add weight measurements.'});}
function renderJournal(){const rows=store.get('journal').slice().sort((a,b)=>new Date(b.date)-new Date(a.date)); const el=$('#journalTable'); if(el)el.innerHTML=rows.map((r,n)=>`<tr><td>${esc(r.date)}</td><td>${esc(r.energy)}</td><td>${esc(r.sleep)}</td><td>${esc(r.mood)}</td><td>${esc(r.training)}</td><td>${esc(r.symptoms)}</td><td>${esc(r.notes)}</td><td><button class="btn danger" onclick="delRow('journal',${n})">Delete</button></td></tr>`).join(''); const asc=rows.slice().sort((a,b)=>new Date(a.date)-new Date(b.date)); drawLineChart('energyChart',dailySeries(asc,'date',[{key:'energy'}]),[{key:'energy',label:'Energy'}],{empty:'Add journal energy ratings.'}); drawLineChart('sleepChart',dailySeries(asc,'date',[{key:'sleep'}]),[{key:'sleep',label:'Sleep'}],{empty:'Add journal sleep ratings.'}); drawLineChart('moodChart',dailySeries(asc,'date',[{key:'mood'}]),[{key:'mood',label:'Mood'}],{empty:'Add journal mood ratings.'});}
function renderBackupSummary(){const el=$('#backupSummary'); if(!el)return; el.innerHTML=PREMIUM_KEYS.filter(k=>k!=='audit').map(k=>`<div class="marker-card"><h4>${esc(k)}</h4><p>${store.get(k).length} records</p></div>`).join('');}
function renderInsights(){const inv=store.get('inventory'), plogs=store.get('peptideLogs'), health=store.get('health'), labs=store.get('labs'), costs=store.get('costs'), prot=store.get('protocols'); const totalSpend=costs.reduce((s,r)=>s+safeNum(r.price)+safeNum(r.shipping),0); const active=prot.filter(p=>p.status==='Active').length; const latestHealth=health.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0]||{}; const cards=$('#insightCards'); if(cards)cards.innerHTML=`<div class="stat"><span>${active}</span><small>Active protocols</small></div><div class="stat"><span>${inv.length}</span><small>Inventory records</small></div><div class="stat"><span>${plogs.length}</span><small>Peptide logs</small></div><div class="stat"><span>${money(totalSpend)}</span><small>Total tracked spend</small></div>`; const notes=[]; notes.push(inv.length?`Inventory contains ${inv.length} tracked items.`:'Inventory is empty.'); notes.push(plogs.length?`Medication level engine has ${plogs.length} peptide log entries to model.`:'Add peptide logs to power estimated level charts.'); if(latestHealth.weight)notes.push(`Latest weight record: ${latestHealth.weight} ${latestHealth.weightUnit||''}.`); if(labs.length)notes.push(`${labs.length} lab marker records are available for trend analysis.`); if(totalSpend)notes.push(`Tracked purchasing total is ${money(totalSpend)}.`); const sum=$('#insightSummary'); if(sum)sum.innerHTML=notes.map(n=>`<div class="insight-item">${esc(n)}</div>`).join(''); drawBarChart('insightCommandChart',{Inventory:inv.length,'Peptide logs':plogs.length,Health:health.length,Labs:labs.length,Protocols:prot.length},{empty:'Add records to build command center.'}); drawBarChart('insightSpendChart',sumCost(costs,'compound'),{decimals:2,empty:'Add cost records to build financial overview.'});}
function renderAudit(){const el=$('#auditTable'); if(!el)return; el.innerHTML=store.get('audit').slice(0,150).map(r=>`<tr><td>${esc(new Date(r.time).toLocaleString())}</td><td>${esc(r.action)}</td><td>${esc(r.section)}</td><td>${esc(r.details)}</td></tr>`).join('')||'<tr><td colspan="4">No audit history yet.</td></tr>';}
function exportFullBackup(){const data={version:'premium-ultimate-plus',exportedAt:new Date().toISOString(),settings:JSON.parse(localStorage.getItem('settings')||'{}'),notes:localStorage.getItem('notes')||''}; PREMIUM_KEYS.forEach(k=>data[k]=store.get(k)); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})); a.download='peptide-anonymous-full-backup.json'; a.click(); URL.revokeObjectURL(a.href); audit('Export','Backup','Full JSON backup downloaded'); render();}
function importFullBackup(file){const reader=new FileReader(); reader.onload=()=>{try{const data=JSON.parse(reader.result); PREMIUM_KEYS.forEach(k=>{if(Array.isArray(data[k]))store.set(k,data[k]);}); if(data.settings)localStorage.setItem('settings',JSON.stringify(data.settings)); if(typeof data.notes==='string')localStorage.setItem('notes',data.notes); audit('Import','Backup','Full JSON backup restored'); $('#backupStatus').textContent='Backup imported successfully.'; render();}catch(e){$('#backupStatus').textContent='Import failed. Please select a valid backup JSON file.';}}; reader.readAsText(file);}

function renderLiveCharts(){
 const inv=store.get('inventory'), logs=store.get('logs'), coas=store.get('coas'), labs=store.get('labs'), plogs=store.get('peptideLogs'), health=store.get('health');
 drawBarChart('overviewChart',{Inventory:inv.length,'Dose logs':logs.length,'Peptide logs':plogs.length,Health:health.length,COAs:coas.length,Labs:labs.length},{empty:'Add any record to see totals.'});
 const activity={}; [...logs.map(x=>x.date),...plogs.map(x=>(x.datetime||'').slice(0,10)),...health.map(x=>x.date),...labs.map(x=>x.date),...coas.map(x=>x.date)].filter(Boolean).forEach(d=>activity[fmtShortDate(d)]=(activity[fmtShortDate(d)]||0)+1); drawBarChart('activityChart',activity,{limit:10,empty:'Add dated records to see activity.'});
 drawBarChart('peptideTotalsChart',groupSum(plogs,'peptide','amount'),{decimals:2,empty:'Add peptide logs to see totals.'}); drawBarChart('peptideFrequencyChart',groupCount(plogs,'peptide'),{empty:'Add peptide logs to see frequency.'});
 const levelRows={}; plogs.forEach(x=>{const hl=configuredHalfLifeHours(x.peptide); if(!hl)return; levelRows[x.peptide]=(levelRows[x.peptide]||0)+remaining(x.amount,x.datetime,hl);}); drawBarChart('levelsChart',levelRows,{decimals:2,limit:15,empty:'Add peptide logs and half-lives to see estimated levels.'});
 const h=health.slice().sort((a,b)=>new Date(a.date)-new Date(b.date)); drawLineChart('weightChart',dailySeries(h,'date',[{key:'weight'}]),[{key:'weight',label:'Weight'}],{empty:'Add weight records.'}); drawLineChart('bpChart',dailySeries(h,'date',[{key:'systolic'},{key:'diastolic'}]),[{key:'systolic',label:'Systolic'},{key:'diastolic',label:'Diastolic'}],{empty:'Add blood pressure records.'}); drawLineChart('glucoseChart',dailySeries(h,'date',[{key:'glucose'}]),[{key:'glucose',label:'Glucose'}],{empty:'Add blood glucose records.'}); drawLineChart('heartRateChart',dailySeries(h,'date',[{key:'heartRate'}]),[{key:'heartRate',label:'Heart rate'}],{empty:'Add heart rate records.'});
 drawBarChart('labCategoryChart',groupCount(labs,'category'),{empty:'Add lab marker records.'}); drawBarChart('labStatusChart',groupCount(labs,'status'),{empty:'Add lab marker records.'}); drawBarChart('coaStatusChart',groupCount(coas,'status'),{empty:'Add COA records.'}); drawBarChart('coaFileChart',{'With file':coas.filter(x=>x.fileData||x.fileName).length,'No file':coas.filter(x=>!(x.fileData||x.fileName)).length},{empty:'Add COA records.'});
 renderAccumulationChart(); renderLabTrendChart(); renderTimeline();
}


function initCoaForm(){const form=$('#coaForm'); if(!form)return; form.addEventListener('submit',e=>{e.preventDefault(); const fd=new FormData(e.target); const file=fd.get('coaFile'); const data=Object.fromEntries(fd.entries()); delete data.coaFile; const save=(fileData='')=>{if(file&&file.name){data.fileName=file.name; data.fileType=file.type||'file'; data.fileData=fileData;} const arr=store.get('coas'); arr.push(data); store.set('coas',arr); audit('Add','coas',data.compound||'COA record'); e.target.reset(); setDefaultDates(); render();}; if(file&&file.name){const reader=new FileReader(); reader.onload=()=>save(reader.result); reader.readAsDataURL(file);} else save('');});}

function addForm(formId,key){const form=$(formId); if(!form)return; form.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());const arr=store.get(key);arr.push(data);store.set(key,arr);audit('Add',key,data.name||data.compound||data.marker||data.date||'New record');e.target.reset();setDefaultDates();render();});}
function delRow(key,n){const arr=store.get(key);const removed=arr[n]||{};arr.splice(n,1);store.set(key,arr);audit('Delete',key,removed.name||removed.compound||removed.marker||removed.date||'Record removed');render();} window.delRow=delRow;
function calcSyringe(total,water,dose,units,target){
  if(!target)return;
  const visualPrefix = target.id === 'calcResult' ? 'rc' : 'sv';
  if(!total||!water||!dose||!units||total<=0||water<=0||dose<=0||units<=0){
    target.innerHTML='Please enter valid positive numbers.';
    updateSyringeVisual(visualPrefix,0,0,units||100);
    return;
  }
  const mgml=total/water, ml=dose/mgml, syringe=ml*units, mcg=dose*1000, doses=total/dose;
  const over = syringe>units;
  target.innerHTML=`<div class="calc-output-grid"><div><small>Concentration</small><strong>${mgml.toFixed(3)} mg/mL</strong></div><div><small>Target dose</small><strong>${dose} mg / ${mcg.toFixed(0)} mcg</strong></div><div><small>Draw volume</small><strong>${ml.toFixed(3)} mL</strong></div><div><small>Syringe units</small><strong>${syringe.toFixed(1)} units</strong></div><div><small>Doses per vial</small><strong>${doses.toFixed(1)}</strong></div></div>${over?'<p class="form-msg danger-text">Warning: calculated draw is larger than one full syringe. Split or recheck inputs with a qualified professional.</p>':''}`;
  updateSyringeVisual(visualPrefix,syringe,ml,units);
}
function updateSyringeVisual(prefix, syringeUnits, ml, unitsPerMl){
  const max = Number(unitsPerMl)||100;
  const pct = Math.max(0,Math.min(100,(Number(syringeUnits)||0)/max*100));
  const fill = document.getElementById(prefix+'SyringeFill');
  const unitLabel = document.getElementById(prefix+'SyringeLabel');
  const mlLabel = document.getElementById(prefix+'MlLabel');
  const pctLabel = document.getElementById(prefix+'PercentLabel');
  if(fill) fill.style.width = pct + '%';
  if(unitLabel) unitLabel.textContent = `${(Number(syringeUnits)||0).toFixed(1)} units`;
  if(mlLabel) mlLabel.textContent = `${(Number(ml)||0).toFixed(3)} mL`;
  if(pctLabel) pctLabel.textContent = `${pct.toFixed(0)}% of ${max}-unit syringe`;
}
function liveCalcSyringe(){calcSyringe(+$('#svTotalMg').value,+$('#svWaterMl').value,+$('#svDoseMg').value,+$('#svUnits').value,$('#syringeResult'));}
function liveCalcRecon(){calcSyringe(+$('#totalMg').value,+$('#waterMl').value,+$('#doseMg').value,+$('#unitsPerMl').value,$('#calcResult'));}
function bindLiveCalculatorInputs(){
  ['#svTotalMg','#svWaterMl','#svDoseMg','#svUnits'].forEach(id=>{const el=$(id); if(el)el.addEventListener('input',liveCalcSyringe);});
  ['#totalMg','#waterMl','#doseMg','#unitsPerMl'].forEach(id=>{const el=$(id); if(el)el.addEventListener('input',liveCalcRecon);});
  liveCalcSyringe(); liveCalcRecon();
}
function applySettingsDefaults(){const s=getSettings(); if(s.defaultSyringeUnits){['#svUnits','#unitsPerMl'].forEach(id=>{const el=$(id); if(el)el.value=s.defaultSyringeUnits;});} if(s.heightFeet||s.heightInches){$$('input[name="heightFeet"]').forEach(el=>{if(!el.value)el.value=s.heightFeet||''}); $$('input[name="heightInches"]').forEach(el=>{if(!el.value)el.value=s.heightInches||''});} if(s.weightUnit){$$('select[name="weightUnit"]').forEach(el=>el.value=s.weightUnit);} if(s.glucoseUnit){$$('select[name="glucoseUnit"]').forEach(el=>el.value=s.glucoseUnit);} const msg=$('#settingsStatus'); if(msg)msg.textContent='Defaults applied to matching forms.';}
function loadDemoData(){if(!confirm('Load sample demo data? This will add test records without deleting your existing data.'))return; const today=new Date(); const iso=(offset)=>{const d=new Date(today); d.setDate(d.getDate()+offset); return d.toISOString().slice(0,10)}; const dt=(offset,h=9)=>{const d=new Date(today); d.setDate(d.getDate()+offset); d.setHours(h,0,0,0); return d.toISOString().slice(0,16)};
 const push=(k,rows)=>{const a=store.get(k); rows.forEach(r=>a.push(r)); store.set(k,a);};
 push('inventory',[{compound:'Retatrutide',strength:'20 mg',quantity:'4',vendor:'Demo Vendor A',lot:'HD-DEMO-001',cap:'Blue',crimp:'Silver',status:'Verified'},{compound:'MOTS-C',strength:'10 mg',quantity:'6',vendor:'Demo Vendor B',lot:'HD-DEMO-002',cap:'White',crimp:'Black',status:'Tested'}]);
 push('peptideLogs',[{datetime:dt(-14),peptide:'Retatrutide',amount:'1.5',route:'SC',notes:'Demo entry'},{datetime:dt(-7),peptide:'Retatrutide',amount:'1.5',route:'SC',notes:'Demo entry'},{datetime:dt(-2),peptide:'MOTS-C',amount:'5',route:'SC',notes:'Demo entry'}]);
 push('health',[{date:iso(-30),weight:'215',weightUnit:'lb',systolic:'132',diastolic:'84',glucose:'102',glucoseUnit:'mg/dL',heartRate:'78',heightFeet:'5',heightInches:'8',notes:'Demo baseline'},{date:iso(-7),weight:'205',weightUnit:'lb',systolic:'126',diastolic:'80',glucose:'94',glucoseUnit:'mg/dL',heartRate:'72',heightFeet:'5',heightInches:'8',notes:'Demo update'},{date:iso(0),weight:'202',weightUnit:'lb',systolic:'122',diastolic:'78',glucose:'91',glucoseUnit:'mg/dL',heartRate:'70',heightFeet:'5',heightInches:'8',notes:'Demo current'}]);
 push('labs',[{date:iso(-60),category:'Lipid Panel (Cholesterol)',marker:'LDL',value:'118',units:'mg/dL',range:'<100',status:'High',notes:'Demo'},{date:iso(-7),category:'Lipid Panel (Cholesterol)',marker:'LDL',value:'96',units:'mg/dL',range:'<100',status:'In Range',notes:'Demo'},{date:iso(-7),category:'Blood Sugar & Metabolic Health',marker:'HbA1c',value:'5.3',units:'%',range:'<5.7',status:'In Range',notes:'Demo'}]);
 push('coas',[{compound:'Retatrutide',lab:'Demo Lab',date:iso(-20),purity:'99.2',mass:'Pass',status:'Passed',fileName:'Demo COA'}]);
 push('costs',[{date:iso(-45),vendor:'Demo Vendor A',compound:'Retatrutide',lot:'HD-DEMO-001',batch:'B1',vials:'10',mgPerVial:'20',totalMg:'200',price:'320',shipping:'20',fees:'0',status:'Verified',notes:'Demo purchase'},{date:iso(-25),vendor:'Demo Vendor B',compound:'MOTS-C',lot:'HD-DEMO-002',batch:'B2',vials:'10',mgPerVial:'10',totalMg:'100',price:'150',shipping:'15',fees:'0',status:'Received',notes:'Demo purchase'}]);
 push('vendors',[{name:'Demo Vendor A',website:'example.com',contact:'contact@example.com',lastOrder:iso(-45),orders:'3',avgPurity:'99.1',passRate:'100',status:'Active',notes:'Demo vendor'},{name:'Demo Vendor B',website:'example.com',contact:'support@example.com',lastOrder:iso(-25),orders:'2',avgPurity:'98.6',passRate:'90',status:'Active',notes:'Demo vendor'}]);
 push('protocols',[{name:'Demo Research Phase',start:iso(-14),end:iso(45),compounds:'Retatrutide, MOTS-C',frequencyDays:'7',lastDose:iso(-7),status:'Active',goal:'Demo protocol testing',notes:'Sample protocol'}]);
 push('measurements',[{date:iso(-30),weight:'215',bodyFat:'28',waist:'40',hips:'42',chest:'44',arms:'15',thighs:'24',neck:'16',notes:'Demo'},{date:iso(0),weight:'202',bodyFat:'25',waist:'37',hips:'41',chest:'43',arms:'15',thighs:'23',neck:'15.5',notes:'Demo'}]);
 push('journal',[{date:iso(-2),energy:'4',sleep:'3',mood:'4',training:'Walk',symptoms:'None',notes:'Demo journal entry'}]);
 audit('Load','Demo Data','Sample records added for testing charts and reports'); render();}
function buildReport(){const out=$('#reportOutput'); if(!out)return; const selected=[...$$('.report-opt')].filter(x=>x.checked).map(x=>x.value); const section=(title,html)=>selected.includes(title.toLowerCase().split(' ')[0])||selected.includes(title.toLowerCase())?`<h3>${title}</h3>${html}`:''; const s=getSettings(); let h=`<div class="report-page"><h2>${esc(s.reportHeader||'Health Dynamics Research Report')}</h2><p class="muted">Generated ${new Date().toLocaleString()} • Educational tool, not medical advice.</p>`;
 if(selected.includes('inventory')) h+=`<h3>Inventory</h3><p>${store.get('inventory').length} inventory records.</p>`;
 if(selected.includes('health')) h+=`<h3>Health</h3><p>${store.get('health').length} health records. Latest: ${esc((store.get('health').slice(-1)[0]||{}).weight||'-')}</p>`;
 if(selected.includes('labs')) h+=`<h3>Lab markers</h3><p>${store.get('labs').length} lab records.</p>`;
 if(selected.includes('peptides')) h+=`<h3>Peptide logs</h3><p>${store.get('peptideLogs').length} peptide administration records.</p>`;
 if(selected.includes('costs')) h+=`<h3>Costs</h3><p>Total purchasing records: ${store.get('costs').length}. Total spend: ${money(store.get('costs').reduce((sum,r)=>sum+purchaseCost(r),0))}</p>`;
 if(selected.includes('coas')) h+=`<h3>COAs</h3><p>${store.get('coas').length} certificate records.</p>`;
 h+=`<hr><p><strong>Disclaimer:</strong> Educational tool, not medical advice. Consult a licensed physician before starting any peptide.</p></div>`; out.innerHTML=h;}
function printReport(){buildReport(); window.print();}
function renderAdmin(){const cards=$('#adminCards'), status=$('#adminStatus'); if(cards)cards.innerHTML=PREMIUM_KEYS.filter(k=>k!=='audit').map(k=>`<div class="stat"><span>${store.get(k).length}</span><small>${esc(k)} records</small></div>`).join('')+`<div class="stat"><span>${localStorage.getItem('paLoggedIn')==='true'?'Active':'Locked'}</span><small>Login status</small></div>`; if(status)status.innerHTML=`<div><strong>App version:</strong> Premium Ultimate Plus</div><div><strong>Access mode:</strong> Local device passcode only</div><div><strong>Storage engine:</strong> Browser local storage + local file attachments</div><div><strong>Backup recommendation:</strong> Export JSON after major updates.</div>`;}

function init(){['#inventoryForm','#logForm','#labForm','#noteForm','#peptideLogForm','#healthForm','#costForm','#vendorForm','#measurementForm','#journalForm'].forEach((id,i)=>addForm(id,['inventory','logs','labs','structuredNotes','peptideLogs','health','costs','vendors','measurements','journal'][i])); initProtocolPlanner(); initCoaForm(); if(typeof initLiveProtocolCalendarControls==='function')initLiveProtocolCalendarControls();
$('#clearInventory').onclick=()=>{if(confirm('Clear inventory?')){localStorage.removeItem('inventory');audit('Clear','inventory','All records cleared');render();}}; $('#clearLogs').onclick=()=>{if(confirm('Clear dose logs?')){localStorage.removeItem('logs');audit('Clear','logs','All records cleared');render();}}; $('#clearCoa').onclick=()=>{if(confirm('Clear COA records?')){localStorage.removeItem('coas');audit('Clear','coas','All records cleared');render();}}; $('#clearLabs').onclick=()=>{if(confirm('Clear lab records?')){localStorage.removeItem('labs');audit('Clear','labs','All records cleared');render();}}; $('#clearPeptideLogs').onclick=()=>{if(confirm('Clear peptide logs?')){localStorage.removeItem('peptideLogs');audit('Clear','peptideLogs','All records cleared');render();}}; $('#clearHealth').onclick=()=>{if(confirm('Clear health records?')){localStorage.removeItem('health');audit('Clear','health','All records cleared');render();}}; ['Protocols','Costs','Vendors','Measurements','Journal','Audit'].forEach(name=>{const id='#clear'+name, key=name==='Audit'?'audit':name.toLowerCase(); const b=$(id); if(b)b.onclick=()=>{if(confirm('Clear '+name+'?')){localStorage.removeItem(key); if(key!=='audit')audit('Clear',key,'All records cleared'); render();}}}); if($('#exportBackup'))$('#exportBackup').onclick=exportFullBackup; if($('#importBackup'))$('#importBackup').onchange=e=>{if(e.target.files[0])importFullBackup(e.target.files[0]);}; if($('#clearAllData'))$('#clearAllData').onclick=()=>{if(confirm('Clear ALL app data?')){ALL_DATA_KEYS.forEach(k=>localStorage.removeItem(k)); render();}}; if($('#saveSettings'))$('#saveSettings').onclick=saveSettingsFromForm; if($('#applySettingsDefaults'))$('#applySettingsDefaults').onclick=applySettingsDefaults; if($('#loadDemoData'))$('#loadDemoData').onclick=loadDemoData; if($('#buildReport'))$('#buildReport').onclick=buildReport; if($('#printReport'))$('#printReport').onclick=printReport; if($('#adminExport'))$('#adminExport').onclick=exportFullBackup; if($('#adminDemo'))$('#adminDemo').onclick=loadDemoData; if($('#adminClear'))$('#adminClear').onclick=()=>{if(confirm('Clear ALL local app data?')){ALL_DATA_KEYS.forEach(k=>localStorage.removeItem(k)); render();}};
$('#calcBtn').onclick=liveCalcRecon; $('#syringeBtn').onclick=liveCalcSyringe; bindLiveCalculatorInputs(); if($('#levelFocusPeptide'))$('#levelFocusPeptide').onchange=renderAccumulationChart; if($('#labTrendMarker'))$('#labTrendMarker').onchange=renderLabTrendChart;
$('#peptideRange').onchange=renderPeptideLogs; $('#halfLifeSearch').oninput=renderHalfLifeTable; if($('#halfLifeConfigSearch'))$('#halfLifeConfigSearch').oninput=renderHalfLifeConfigTable; if($('#resetHalfLives'))$('#resetHalfLives').onclick=()=>{if(confirm('Reset half-life settings to defaults?')){localStorage.removeItem('halfLifeSettings');renderHalfLifeConfigTable();renderHalfLifeTable();renderPeptideLogs();renderLevels();}}; $('#peptideSelect').innerHTML=PEPTIDES.map(p=>`<option>${esc(p.name)}</option>`).join('');
$('#labCategory').innerHTML=Object.keys(LAB_MARKERS).map(c=>`<option>${esc(c)}</option>`).join(''); updateMarkerOptions(); $('#labCategory').onchange=updateMarkerOptions; renderMarkerLibrary(); renderHalfLifeTable(); renderHalfLifeConfigTable(); setDefaultDates();
$('#notesBox').value=localStorage.getItem('notes')||''; $('#notesBox').addEventListener('input',()=>{localStorage.setItem('notes',$('#notesBox').value);$('#noteSaveStatus').textContent='Auto-saved locally';}); $('#clearNotes').onclick=()=>{if(confirm('Clear notes?')){localStorage.removeItem('notes');localStorage.removeItem('structuredNotes');$('#notesBox').value='';render();}};
$('#exportLabs').onclick=()=>exportCsv('lab-marker-records.csv',['Date','Category','Marker','Value','Units','Reference Range','Status','Notes'],store.get('labs').map(r=>[r.date,r.category,r.marker,r.value,r.units,r.range,r.status,r.notes])); $('#exportNotes').onclick=()=>exportCsv('notes.csv',['Date','Title','Category','Tags','Details'],store.get('structuredNotes').map(r=>[r.date,r.title,r.category,r.tags,r.details])); if($('#exportCosts'))$('#exportCosts').onclick=()=>exportCsv('cost-purchasing-records.csv',['Date','Vendor','Compound','Lot','Batch','Vials','mg per vial','Total mg','Product cost','Shipping','Fees','Total cost','Cost per vial','Cost per mg','Status','Notes'],store.get('costs').map(r=>{const mg=purchaseMg(r),cost=purchaseCost(r),v=safeNum(r.vials);return [r.date,r.vendor,r.compound,r.lot,r.batch,r.vials,r.mgPerVial,mg,r.price,r.shipping,r.fees,cost,v?cost/v:'',mg?cost/mg:'',r.status,r.notes]}));
$('#registerForm').addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target).entries());localStorage.setItem('paUser',JSON.stringify(d));localStorage.setItem('paLoggedIn','true');$('#registerMsg').textContent='Local profile created. This device workspace is now unlocked.';}); $('#loginForm').addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target).entries()),u=JSON.parse(localStorage.getItem('paUser')||'{}');const login=String(d.email||'').trim().toLowerCase();const pass=String(d.password||'').trim();const master=false;const userMatch=(login===String(u.email||'').trim().toLowerCase()||login===String(u.name||'').trim().toLowerCase())&&pass===String(u.password||'').trim(); if(userMatch){localStorage.setItem('paLoggedIn','true');$('#loginMsg').textContent=`Welcome back, ${(u.name||'user')}. Access verified.`;} else {localStorage.removeItem('paLoggedIn');$('#loginMsg').textContent='Access denied. Verify the passcode saved on this device.';}});
$$('.tab').forEach(btn=>btn.addEventListener('click',()=>activateTab(btn.dataset.tab))); $$('.mini-link').forEach(btn=>btn.addEventListener('click',()=>activateTab(btn.dataset.jump)));  $('#year').textContent=new Date().getFullYear(); render(); setInterval(render,60000); syncHashToPanel(); window.addEventListener('hashchange',syncHashToPanel); if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{}); let dp; window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#installBtn').classList.remove('hidden');}); $('#installBtn').onclick=()=>{if(dp){dp.prompt();dp=null;}}; }
function renderHalfLifeTable(){const q=($('#halfLifeSearch').value||'').toLowerCase(); $('#halfLifeTable').innerHTML=PEPTIDES.filter(p=>Object.values(p).join(' ').toLowerCase().includes(q)).map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.alias)}</td><td>${esc(p.category)}</td><td>${esc(formatConfiguredHalfLife(p.name))}</td><td>${esc(p.duration)}</td><td>${esc(p.routes)}</td><td>${esc(p.notes)}</td></tr>`).join('');}
function updateMarkerOptions(){const cat=$('#labCategory').value; $('#labMarker').innerHTML=(LAB_MARKERS[cat]||[]).map(m=>`<option>${esc(m)}</option>`).join('');}
function renderMarkerLibrary(){$('#markerLibrary').innerHTML=Object.entries(LAB_MARKERS).map(([c,items])=>`<div class="marker-card"><h4>${esc(c)}</h4><p>${items.map(esc).join(' • ')}</p></div>`).join('');}
function exportCsv(name,heads,rows){const csv=[heads,...rows].map(r=>r.map(v=>'"'+String(v||'').replaceAll('"','""')+'"').join(',')).join('\n'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download=name; a.click(); URL.revokeObjectURL(a.href);}
function setDefaultDates(){const d=new Date().toISOString().slice(0,10); $$('input[type="date"]').forEach(i=>{if(!i.value)i.value=d}); $$('input[type="datetime-local"]').forEach(i=>{if(!i.value)i.value=new Date().toISOString().slice(0,16)});}
function activateTab(tabId){const btn=document.querySelector(`.tab[data-tab="${tabId}"]`),panel=document.getElementById(tabId); if(!btn||!panel)return; $$('.tab,.panel').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); panel.classList.add('active'); history.replaceState(null,'','#'+tabId); document.getElementById('app').scrollIntoView({behavior:'smooth'});} function syncHashToPanel(){const h=location.hash.replace('#',''); if(['overview','inventory','syringe','calculator','peptidelog','halflife','levels','health','log','coa','labs','protocols','costs','vendors','measurements','journal','backup','settings','reports','admin','insights','audit','notes'].includes(h))activateTab(h);} 
function initLiveSyringeCalculatorSafe(){
  function val(id){ const el=document.getElementById(id); return el ? parseFloat(el.value) : 0; }
  function setHtml(id, html){ const el=document.getElementById(id); if(el) el.innerHTML=html; }
  function update(prefix, total, water, dose, units, resultId){
    total=Number(total); water=Number(water); dose=Number(dose); units=Number(units)||100;
    const fill=document.getElementById(prefix+'SyringeFill');
    const unitLabel=document.getElementById(prefix+'SyringeLabel');
    const mlLabel=document.getElementById(prefix+'MlLabel');
    const pctLabel=document.getElementById(prefix+'PercentLabel');
    if(!(total>0 && water>0 && dose>0 && units>0)){
      if(fill) fill.style.width='0%';
      if(unitLabel) unitLabel.textContent='0 units';
      if(mlLabel) mlLabel.textContent='0.000 mL';
      if(pctLabel) pctLabel.textContent='0% of '+units+'-unit syringe';
      setHtml(resultId,'Enter valid positive values to calculate.');
      return;
    }
    const concentration=total/water;
    const ml=dose/concentration;
    const syringeUnits=ml*units;
    const pct=Math.max(0,Math.min(100,(syringeUnits/units)*100));
    const doses=total/dose;
    if(fill) fill.style.width=pct.toFixed(2)+'%';
    if(unitLabel) unitLabel.textContent=syringeUnits.toFixed(1)+' units';
    if(mlLabel) mlLabel.textContent=ml.toFixed(3)+' mL';
    if(pctLabel) pctLabel.textContent=pct.toFixed(0)+'% of '+units+'-unit syringe';
    const warning=syringeUnits>units?'<p class="form-msg danger-text">Warning: calculated draw is larger than one full syringe. Recheck entries and consult a licensed professional.</p>':'';
    setHtml(resultId,`<div class="calc-output-grid"><div><small>Concentration</small><strong>${concentration.toFixed(3)} mg/mL</strong></div><div><small>Draw volume</small><strong>${ml.toFixed(3)} mL</strong></div><div><small>Syringe units</small><strong>${syringeUnits.toFixed(1)} units</strong></div><div><small>Doses per vial</small><strong>${doses.toFixed(1)}</strong></div></div>${warning}`);
  }
  function updateSv(){ update('sv', val('svTotalMg'), val('svWaterMl'), val('svDoseMg'), val('svUnits'), 'syringeResult'); }
  function updateRc(){ update('rc', val('totalMg'), val('waterMl'), val('doseMg'), val('unitsPerMl'), 'calcResult'); }
  ['svTotalMg','svWaterMl','svDoseMg','svUnits'].forEach(id=>{ const el=document.getElementById(id); if(el){ el.removeEventListener('input', updateSv); el.addEventListener('input', updateSv); el.addEventListener('change', updateSv); }});
  ['totalMg','waterMl','doseMg','unitsPerMl'].forEach(id=>{ const el=document.getElementById(id); if(el){ el.removeEventListener('input', updateRc); el.addEventListener('input', updateRc); el.addEventListener('change', updateRc); }});
  const sb=document.getElementById('syringeBtn'); if(sb) sb.onclick=updateSv;
  const cb=document.getElementById('calcBtn'); if(cb) cb.onclick=updateRc;
  updateSv(); updateRc();
}
function bootApp(){ init(); initLiveSyringeCalculatorSafe(); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootApp); else bootApp();



/* PeptideIQ-style login gate: dashboard/tools require local login */
(function(){
  const isMaster = () => false; // no hardcoded local master access
  const $auth = (sel) => document.querySelector(sel);
  const isLoggedIn = () => localStorage.getItem('paLoggedIn') === 'true';
  function toast(msg){
    const old = document.querySelector('.login-required-toast');
    if(old) old.remove();
    const el = document.createElement('div');
    el.className = 'login-required-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 3000);
  }
  function setGate(){
    const logged = isLoggedIn();
    const app = $auth('#app');
    const locked = $auth('#locked');
    const dash = $auth('#dashboardNav');
    const logout = $auth('#logoutBtn');
    const status = $auth('#authStatus');
    const user = JSON.parse(localStorage.getItem('paUser') || '{}');
    if(app) app.classList.toggle('locked', !logged);
    if(locked) locked.classList.toggle('authed', logged);
    if(dash) dash.classList.toggle('hidden', !logged);
    if(logout) logout.classList.toggle('hidden', !logged);
    if(status) status.textContent = logged ? `Signed in${user.name ? ': ' + user.name : ''}` : 'Not signed in';
    if(location.hash === '#app' && !logged){
      history.replaceState(null, '', '#login');
      toast('Access required. Please sign in to continue to your private dashboard.');
    }
  }
  window.addEventListener('hashchange', setGate);
  document.addEventListener('DOMContentLoaded', setGate);
  setGate();

  const registerForm = $auth('#registerForm');
  if(registerForm){
    registerForm.addEventListener('submit', function(){
      setTimeout(()=>{
        localStorage.setItem('paLoggedIn','true');
        const msg = $auth('#registerMsg');
        if(msg) msg.textContent = 'Account created successfully. Your private dashboard is unlocked.';
        setGate();
        location.hash = '#app';
      }, 0);
    });
  }
  const loginForm = $auth('#loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', function(e){
      setTimeout(()=>{
        const data = Object.fromEntries(new FormData(loginForm).entries());
        const user = JSON.parse(localStorage.getItem('paUser') || '{}');
        const master = isMaster(data);
        if(master || ((String(data.email||'').trim().toLowerCase() === String(user.email||'').trim().toLowerCase() || String(data.email||'').trim().toLowerCase() === String(user.name||'').trim().toLowerCase()) && String(data.password||'').trim() === String(user.password||'').trim())){
          localStorage.setItem('paLoggedIn','true');
          const msg = $auth('#loginMsg');
          if(msg) msg.textContent = `Welcome back${user.name ? ', ' + user.name : ''}. Access verified and dashboard unlocked.`;
          setGate();
          location.hash = '#app';
        } else {
          localStorage.removeItem('paLoggedIn');
          const msg = $auth('#loginMsg');
          if(msg) msg.textContent = 'Access denied. Please verify your login and password, then try again.';
          toast('Login unsuccessful. Please verify your credentials.');
          setGate();
        }
      }, 0);
    });
  }
  const logout = $auth('#logoutBtn');
  if(logout){
    logout.addEventListener('click', function(){
      localStorage.removeItem('paLoggedIn');
      setGate();
      location.hash = '#home';
      toast('Signed out successfully. Your dashboard is now locked.');
    });
  }
  document.querySelectorAll('a[href="#app"], .mini-link').forEach(el=>{
    el.addEventListener('click', function(e){
      if(!isLoggedIn()){
        e.preventDefault();
        location.hash = '#login';
        toast('Access required. Please sign in to continue to your private dashboard.');
      }
    });
  });
})();

/* Emergency navigation/auth repair: keeps all sidebar tabs and protected pages clickable. */
(function(){
  function qs(s){ return document.querySelector(s); }
  function qsa(s){ return Array.from(document.querySelectorAll(s)); }
  function loggedIn(){ return localStorage.getItem('paLoggedIn') === 'true'; }
  function unlockApp(){
    var app = qs('#app'), locked = qs('#locked'), dash = qs('#dashboardNav'), logout = qs('#logoutBtn'), status = qs('#authStatus');
    if(app) app.classList.toggle('locked', !loggedIn());
    if(locked) locked.classList.toggle('authed', loggedIn());
    if(dash) dash.classList.toggle('hidden', !loggedIn());
    if(logout) logout.classList.toggle('hidden', !loggedIn());
    if(status) {
      var user = {};
      try { user = JSON.parse(localStorage.getItem('paUser') || '{}'); } catch(e) {}
      status.textContent = loggedIn() ? ('Signed in' + (user.name ? ': ' + user.name : '')) : 'Not signed in';
    }
  }
  function openPanel(tabId){
    if(!tabId) tabId = 'overview';
    if(!loggedIn()){
      location.hash = '#login';
      return false;
    }
    unlockApp();
    var panel = document.getElementById(tabId);
    var btn = qs('.tab[data-tab="' + CSS.escape(tabId) + '"]');
    if(!panel || !btn) return false;
    qsa('#app .panel').forEach(function(p){ p.classList.remove('active'); });
    qsa('#app .tab').forEach(function(b){ b.classList.remove('active'); });
    panel.classList.add('active');
    btn.classList.add('active');
    if(location.hash !== '#' + tabId) history.replaceState(null, '', '#' + tabId);
    var app = qs('#app');
    if(app) app.scrollIntoView({behavior:'smooth', block:'start'});
    return true;
  }
  window.paOpenPanel = openPanel;
  document.addEventListener('DOMContentLoaded', function(){
    unlockApp();
    document.addEventListener('click', function(e){
      var tab = e.target.closest && e.target.closest('.tab[data-tab]');
      if(tab){
        e.preventDefault();
        e.stopPropagation();
        openPanel(tab.getAttribute('data-tab'));
        return;
      }
      var mini = e.target.closest && e.target.closest('.mini-link[data-jump]');
      if(mini){
        e.preventDefault();
        e.stopPropagation();
        openPanel(mini.getAttribute('data-jump'));
        return;
      }
      var appLink = e.target.closest && e.target.closest('a[href="#app"]');
      if(appLink){
        e.preventDefault();
        if(loggedIn()) openPanel('overview'); else location.hash = '#login';
      }
    }, true);
    var loginForm = qs('#loginForm');
    if(loginForm){
      loginForm.addEventListener('submit', function(e){
        var data = new FormData(loginForm);
        var login = String(data.get('email') || data.get('login') || '').trim().toLowerCase();
        var pass = String(data.get('password') || '').trim();
        var saved = {};
        try { saved = JSON.parse(localStorage.getItem('paUser') || '{}'); } catch(err) {}
        var savedMatch = (login === String(saved.email || '').trim().toLowerCase() || login === String(saved.name || '').trim().toLowerCase()) && pass === String(saved.password || '').trim();
        if(savedMatch){
          localStorage.setItem('paLoggedIn','true');
          var msg = qs('#loginMsg');
          if(msg) msg.textContent = 'Welcome back. Access verified.';
          setTimeout(function(){ unlockApp(); openPanel('overview'); }, 25);
        }
      }, true);
    }
    var registerForm = qs('#registerForm');
    if(registerForm){
      registerForm.addEventListener('submit', function(){
        setTimeout(function(){ localStorage.setItem('paLoggedIn','true'); unlockApp(); openPanel('overview'); }, 25);
      }, true);
    }
    var logout = qs('#logoutBtn');
    if(logout){
      logout.addEventListener('click', function(e){
        e.preventDefault();
        localStorage.removeItem('paLoggedIn');
        unlockApp();
        location.hash = '#home';
      }, true);
    }
    window.addEventListener('hashchange', function(){
      var id = location.hash.replace('#','');
      if(id === 'app') id = 'overview';
      if(qs('.tab[data-tab="' + CSS.escape(id) + '"]')) openPanel(id);
      else unlockApp();
    });
    var start = location.hash.replace('#','');
    if(start === 'app') start = 'overview';
    if(loggedIn() && qs('.tab[data-tab="' + CSS.escape(start) + '"]')) openPanel(start);
  });
})();


/* Half-life database hard-fix: renders the full peptide list locally, even if earlier scripts fail */
(function(){
  function esc2(v){ return String(v ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function toHours2(txt){
    if(!txt || /limited|varies/i.test(String(txt))) return null;
    const m=String(txt).match(/([0-9.]+)\s*(minutes?|mins?|hours?|hrs?|days?|weeks?)/i);
    if(!m) return null;
    const n=parseFloat(m[1]); const u=m[2].toLowerCase();
    if(u.startsWith('min')) return n/60;
    if(u.startsWith('hour') || u.startsWith('hr')) return n;
    if(u.startsWith('day')) return n*24;
    if(u.startsWith('week')) return n*168;
    return null;
  }
  function formatHours2(h){
    if(!h) return 'Excluded / limited data';
    if(h < 1) return (h*60).toFixed(0)+' minutes';
    if(h < 24) return h.toFixed(h < 10 ? 2 : 1)+' hours';
    return (h/24).toFixed((h/24)<10 ? 2 : 1)+' days';
  }
  function getPeptides2(){
    try { if(Array.isArray(PEPTIDES) && PEPTIDES.length) return PEPTIDES; } catch(e) {}
    return [];
  }
  function renderHalfLifeHardFix(){
    const data=getPeptides2();
    const search1=document.getElementById('halfLifeSearch');
    const search2=document.getElementById('halfLifeSearchStandalone');
    const q=((search2 && search2.value) || (search1 && search1.value) || '').toLowerCase().trim();
    const rows=data.filter(p => !q || Object.values(p).join(' ').toLowerCase().includes(q));
    const html=rows.map(p=>{
      const hrs=toHours2(p.halfLife);
      return `<tr><td>${esc2(p.name)}</td><td>${esc2(p.alias)}</td><td>${esc2(p.category)}</td><td>${esc2(p.halfLife)}</td><td>${esc2(p.routes)}</td><td>${esc2(p.notes || p.duration)}</td></tr>`;
    }).join('') || '<tr><td colspan="6">No peptides found. Clear the search box or click Show All.</td></tr>';
    ['halfLifeTable','halfLifeTableStandalone'].forEach(id=>{ const el=document.getElementById(id); if(el) el.innerHTML=html; });
    const count=document.getElementById('halfLifeCount'); if(count) count.textContent=String(data.length);
    const inc=document.getElementById('halfLifeIncludedCount'); if(inc) inc.textContent=String(data.filter(p=>toHours2(p.halfLife)).length);
    const sel=document.getElementById('peptideSelect');
    if(sel && sel.options.length < data.length){ sel.innerHTML=data.map(p=>`<option>${esc2(p.name)}</option>`).join(''); }
    const proto=document.getElementById('protocolPeptide');
    if(proto && proto.options.length < data.length){ proto.innerHTML=data.map(p=>`<option>${esc2(p.name)}</option>`).join(''); }
  }
  window.renderHalfLifeHardFix=renderHalfLifeHardFix;
  document.addEventListener('DOMContentLoaded', function(){
    renderHalfLifeHardFix();
    ['halfLifeSearch','halfLifeSearchStandalone'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('input', renderHalfLifeHardFix); });
    const show=document.getElementById('showAllHalfLives'); if(show) show.addEventListener('click', function(){ const a=document.getElementById('halfLifeSearch'); const b=document.getElementById('halfLifeSearchStandalone'); if(a)a.value=''; if(b)b.value=''; renderHalfLifeHardFix(); });
    document.addEventListener('click', function(e){ if(e.target && e.target.matches && e.target.matches('.tab[data-tab="halflife"], .tab[data-tab="peptidelog"]')) setTimeout(renderHalfLifeHardFix, 50); }, true);
  });
  setTimeout(renderHalfLifeHardFix, 250);
})();

(function(){
  const KEY='pa_pdf_coa_records';
  function get(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
  function set(v){localStorage.setItem(KEY,JSON.stringify(v))}
  function esc(v){return String(v||'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]))}
  function renderPdfCoa(){
    const tbody=document.getElementById('pdfCoaTable');
    if(!tbody) return;
    const rows=get();
    tbody.innerHTML = rows.map((r,i)=>`<tr><td>${esc(r.compound)}</td><td>${esc(r.lab)}</td><td>${esc(r.date)}</td><td>${esc(r.filename)}</td><td>${esc(r.link)}</td><td><span class="pill blue">${esc(r.status)}</span></td><td>${esc(r.notes)}</td><td><button class="btn danger" data-pdfcoa-del="${i}" type="button">Delete</button></td></tr>`).join('') || '<tr><td colspan="8">No COA file records yet.</td></tr>';
  }
  document.addEventListener('DOMContentLoaded', function(){
    const form=document.getElementById('pdfCoaForm');
    if(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        const fd=new FormData(form);
        const rows=get();
        rows.unshift(Object.fromEntries(fd.entries()));
        set(rows); form.reset(); renderPdfCoa();
      });
    }
    const clear=document.getElementById('clearPdfCoa');
    if(clear) clear.addEventListener('click', function(){ if(confirm('Clear PDF COA records?')){set([]);renderPdfCoa();}});
    document.addEventListener('click', function(e){
      const btn=e.target.closest('[data-pdfcoa-del]');
      if(!btn) return;
      const rows=get(); rows.splice(Number(btn.dataset.pdfcoaDel),1); set(rows); renderPdfCoa();
    });
    renderPdfCoa();
  });
})();

// --- Live Protocol Calendar: local-only planned + completed + injection/dose logs ---
let liveCalMonthCursor = new Date();
let liveCalSelectedDate = new Date().toISOString().slice(0,10);
function isoDateOnly(value){
  if(!value) return '';
  if(/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value);
  const d = new Date(value);
  return isNaN(d) ? String(value).slice(0,10) : d.toISOString().slice(0,10);
}
function liveCalendarEvents(){
  const events = [];
  const protocols = store.get('protocols');
  protocols.forEach((p,rowIndex)=>{
    protocolOccurrences(p).forEach(o=>{
      events.push({
        date:o.date,
        time:o.time || p.time || '09:00',
        type:o.done?'done':'planned',
        title:p.name || 'Protocol',
        compound:p.peptide || p.compounds || '',
        amount:[p.dose,p.doseUnit].filter(Boolean).join(' '),
        route:p.route || '',
        note:o.done?'Protocol entry marked complete':'Planned protocol entry',
        rowIndex,
        occIndex:o.idx
      });
    });
  });
  store.get('peptideLogs').forEach(r=>{
    const dt = r.datetime || r.date || '';
    const d = isoDateOnly(dt);
    if(!d) return;
    const time = String(dt).includes('T') ? String(dt).split('T')[1].slice(0,5) : (r.time || '');
    events.push({date:d,time,type:'injection',title:'Peptide log',compound:r.peptide || r.compound || '',amount:[r.amount,r.unit].filter(Boolean).join(' ') || r.amount || '',route:r.route || r.site || '',note:r.notes || ''});
  });
  store.get('logs').forEach(r=>{
    const d = isoDateOnly(r.date || r.datetime);
    if(!d) return;
    events.push({date:d,time:r.time || '',type:'injection',title:'Dose log',compound:r.compound || r.peptide || '',amount:r.amount || '',route:r.route || '',note:r.notes || ''});
  });
  return events.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
}
function renderLiveProtocolCalendar(){
  const grid = document.getElementById('liveProtocolCalendar');
  if(!grid) return;
  const title = document.getElementById('liveCalTitle');
  const events = liveCalendarEvents();
  const y = liveCalMonthCursor.getFullYear();
  const m = liveCalMonthCursor.getMonth();
  const monthStart = new Date(y,m,1);
  const start = new Date(monthStart);
  start.setDate(start.getDate()-start.getDay());
  const todayIso = new Date().toISOString().slice(0,10);
  if(title) title.textContent = monthStart.toLocaleString(undefined,{month:'long',year:'numeric'});
  const byDate = events.reduce((map,e)=>{(map[e.date] ||= []).push(e); return map;},{});
  const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="live-cal-weekday">${d}</div>`).join('');
  let days = '';
  for(let i=0;i<42;i++){
    const d = new Date(start); d.setDate(start.getDate()+i);
    const iso = d.toISOString().slice(0,10);
    const dayEvents = byDate[iso] || [];
    const cls = ['live-cal-day', d.getMonth()!==m?'muted-month':'', iso===todayIso?'today':'', iso===liveCalSelectedDate?'selected':''].filter(Boolean).join(' ');
    const previews = dayEvents.slice(0,3).map(e=>`<div class="live-cal-event ${esc(e.type)}" title="${esc([e.time,e.title,e.compound,e.amount].filter(Boolean).join(' • '))}">${esc([e.time,e.compound||e.title,e.amount].filter(Boolean).join(' • '))}</div>`).join('');
    days += `<button type="button" class="${cls}" data-live-date="${iso}"><div class="live-cal-date"><span>${d.getDate()}</span>${dayEvents.length?`<span class="live-cal-count">${dayEvents.length}</span>`:''}</div>${previews}${dayEvents.length>3?`<div class="live-cal-more">+${dayEvents.length-3} more</div>`:''}</button>`;
  }
  grid.innerHTML = weekdays + days;
  grid.querySelectorAll('[data-live-date]').forEach(btn=>btn.addEventListener('click',()=>{liveCalSelectedDate=btn.dataset.liveDate; renderLiveProtocolCalendar();}));
  renderLiveCalDayDetails(byDate[liveCalSelectedDate] || [], liveCalSelectedDate);
}
function renderLiveCalDayDetails(events,date){
  const el = document.getElementById('liveCalDayDetails');
  if(!el) return;
  if(!events.length){el.innerHTML=`<p class="muted">${esc(date)} has no planned protocol entries or logged injections.</p>`; return;}
  el.innerHTML = events.map(e=>`<div class="live-cal-detail ${esc(e.type)}"><strong>${esc([e.time,e.title].filter(Boolean).join(' • '))}</strong><small>${esc([e.compound,e.amount,e.route].filter(Boolean).join(' • '))}</small>${e.note?`<p>${esc(e.note)}</p>`:''}${e.type==='planned'||e.type==='done'?`<button class="btn" type="button" onclick="toggleProtocolDose(${Number(e.rowIndex)},${Number(e.occIndex)})">${e.type==='done'?'Mark Not Done':'Mark Complete'}</button>`:''}</div>`).join('');
}
function initLiveProtocolCalendarControls(){
  const prev=document.getElementById('liveCalPrev'), next=document.getElementById('liveCalNext'), today=document.getElementById('liveCalToday');
  if(prev) prev.onclick=()=>{liveCalMonthCursor.setMonth(liveCalMonthCursor.getMonth()-1); renderLiveProtocolCalendar();};
  if(next) next.onclick=()=>{liveCalMonthCursor.setMonth(liveCalMonthCursor.getMonth()+1); renderLiveProtocolCalendar();};
  if(today) today.onclick=()=>{liveCalMonthCursor=new Date(); liveCalSelectedDate=new Date().toISOString().slice(0,10); renderLiveProtocolCalendar();};
}
