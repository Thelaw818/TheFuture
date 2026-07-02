(function(){
  "use strict";
  const $ = (id)=>document.getElementById(id);
  const qs = (sel,root=document)=>root.querySelector(sel);
  const qsa = (sel,root=document)=>Array.from(root.querySelectorAll(sel));
  const esc = (s)=>String(s==null?"":s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const n = (v)=>{const x=parseFloat(v);return Number.isFinite(x)?x:null};
  const today = ()=>new Date().toISOString().slice(0,10);
  const read = (k)=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch(e){return []}};
  const write = (k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const download = (name,text,type="text/csv")=>{const blob=new Blob([text],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};
  const csv = (rows)=>rows.map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(',')).join('\n');

  const policyHTML = {
    privacyPolicy: `<h2>Privacy Policy</h2><div class="card">
      <p><strong>Effective Date:</strong> July 1, 2026</p>
      <div class="hd-v2-banner"><h3>Privacy-first local storage guarantee</h3><p>Health Dynamics is designed as a local-first health and wellness record app. In this static version, records you enter are stored on your own device/browser and are not uploaded to a Health Dynamics server.</p></div>
      <div class="hd-policy-grid">
        <div class="hd-policy-card"><h3>What we store</h3><p>The app may store wellness entries, health journal notes, calculator inputs, lab marker notes, goals, reminders, reports, and settings <strong>locally on your device</strong> using browser storage.</p></div>
        <div class="hd-policy-card"><h3>What we do not store</h3><ul><li>No default cloud database.</li><li>No default server-side health profile.</li><li>No sale of personal information.</li><li>No advertising tracker built into this local package.</li><li>No medical record sharing by Health Dynamics.</li></ul></div>
        <div class="hd-policy-card"><h3>Your control</h3><p>You control your data through your device, browser, exports, backups, and delete/clear options. Export files are your responsibility to protect.</p></div>
        <div class="hd-policy-card"><h3>Local storage warning</h3><p>Data may be deleted if you clear browser data, use private browsing, reset your device, uninstall the app, or run cleanup software. Export backups regularly.</p></div>
      </div>
      <h3>Categories of information</h3><p>Depending on what you choose to enter, information may include wellness metrics, weight, sleep, mood, activity, hydration, blood pressure, glucose, lab-marker notes, medication reminders, goals, journal notes, and imported/exported files.</p>
      <h3>How information is used</h3><p>Information is used locally to calculate estimates, display charts, generate summaries, remember settings, and help you organize your own records. This app does not replace professional healthcare records.</p>
      <h3>Children and minors</h3><p>This app is intended for adults. Do not allow children to enter personal health information unless reviewed and supervised by a parent/guardian and allowed by applicable law.</p>
      <h3>HIPAA and health privacy notice</h3><p>Health Dynamics is not presented as a healthcare provider, health plan, clearinghouse, pharmacy, insurer, or medical practice. HIPAA may not apply to every health app, but other federal and state consumer privacy laws may apply depending on how the app is deployed, marketed, connected, or operated. Have a qualified attorney review this policy before public launch.</p>
      <h3>California and state privacy notice</h3><p>If Health Dynamics is offered publicly or connected to a hosted service, California and other state privacy laws may require additional notices, rights request procedures, retention disclosures, and business disclosures. This local package is written to accurately describe a local-only app and should be reviewed before commercial use.</p>
      <h3>Security practices</h3><p>Use a secure device, strong device password, updated browser, and protected backups. Anyone with access to your device/browser profile may be able to view locally stored records.</p>
      <h3>Contact</h3><p>Add your business contact email, mailing address, and support process here before public release.</p>
      <div class="hd-policy-note"><strong>Important:</strong> This policy is a professional template for a local-first app, not legal advice. Review with counsel before publishing commercially.</div>
    </div>`,
    termsOfUse: `<h2>Terms of Use</h2><div class="card">
      <p><strong>Effective Date:</strong> July 1, 2026</p>
      <h3>Acceptance</h3><p>By accessing or using Health Dynamics, you agree to these Terms of Use. If you do not agree, do not use the app.</p>
      <h3>Purpose</h3><p>Health Dynamics is a personal wellness organization, tracking, calculator, and reporting tool. It is provided for informational, educational, and personal record-keeping purposes only.</p>
      <h3>No medical, legal, or professional advice</h3><p>Health Dynamics does not provide medical advice, diagnosis, treatment, prescribing guidance, medication instructions, legal advice, compliance advice, or professional healthcare services. No provider-patient, physician-patient, pharmacist-patient, attorney-client, or professional relationship is created.</p>
      <h3>User responsibility</h3><p>You are responsible for the accuracy of information you enter, decisions you make, data you export, and compliance with all federal, state, local, and international laws that apply to you.</p>
      <h3>Calculators and live tools</h3><p>Calculators, charts, wellness scores, BMI estimates, calorie estimates, hydration estimates, blood-pressure averages, sleep scores, heart-rate zones, and other outputs are estimates only. They may be incomplete, inaccurate, outdated, or inappropriate for your situation.</p>
      <h3>Emergency and professional care</h3><p>Do not delay medical care because of information in this app. For emergencies, call emergency services or seek urgent medical care immediately.</p>
      <h3>Privacy and local data</h3><p>This local package stores records in the user's browser/device. You are responsible for protecting your device, browser profile, local app data, exported files, and backups.</p>
      <h3>Prohibited uses</h3><ul><li>Do not use the app to provide unlicensed medical advice or healthcare services.</li><li>Do not use the app for unlawful activity.</li><li>Do not misrepresent calculator outputs as professional medical instructions.</li><li>Do not use the app in a way that violates another person's privacy.</li></ul>
      <h3>No warranty</h3><p>The app is provided “as is” and “as available,” without warranties of any kind. Health Dynamics does not guarantee accuracy, uptime, compatibility, fitness for a particular purpose, legal compliance, or uninterrupted operation.</p>
      <h3>Limitation of liability</h3><p>To the maximum extent permitted by law, Health Dynamics and its owners, contributors, and operators are not liable for indirect, incidental, consequential, special, exemplary, punitive, or lost-profit damages arising from use of the app.</p>
      <h3>Indemnification</h3><p>You agree to defend, indemnify, and hold harmless Health Dynamics from claims, losses, liabilities, damages, costs, and expenses arising from your use of the app, your data, your decisions, or your violation of these Terms.</p>
      <h3>Governing law</h3><p>Unless a different jurisdiction is required by law, these Terms are intended to be governed by California law. Add your final business jurisdiction before public launch.</p>
      <h3>Changes</h3><p>Health Dynamics may update these Terms. Continued use after updates means you accept the updated Terms.</p>
      <div class="hd-policy-note"><strong>Review needed:</strong> These Terms are a strong starting template, not a substitute for legal review.</div>
    </div>`,
    medicalDisclaimer: `<h2>Medical Disclaimer</h2><div class="card">
      <p><strong>Educational and informational tool only. Not medical advice.</strong></p>
      <p>Health Dynamics is not a medical provider, clinic, pharmacy, laboratory, health plan, insurer, emergency service, or substitute for a licensed healthcare professional.</p>
      <h3>No diagnosis or treatment</h3><p>The app does not diagnose, treat, cure, prevent, screen for, or manage any disease, condition, injury, or health problem. It does not determine whether a symptom, lab value, medication, supplement, peptide, compound, or activity is safe or appropriate for you.</p>
      <h3>No local or statewide medical advice</h3><p>Health Dynamics does not provide medical advice under any local, state, federal, or international medical-practice standard. Nothing in the app should be interpreted as a physician order, prescription, dosing direction, treatment plan, or clinical recommendation.</p>
      <h3>Talk to a licensed professional</h3><p>Always consult a licensed physician or qualified healthcare professional before making health decisions, starting or stopping medication, changing diet/exercise, interpreting labs, or acting on symptoms.</p>
      <h3>Emergency warning</h3><p>If you may be experiencing a medical emergency, call 911 or your local emergency number immediately. Do not rely on this app during an emergency.</p>
      <h3>Calculator waiver</h3><p>All calculations are estimates based only on the values entered. Outputs can be wrong because of user error, formula limitations, software issues, missing context, or individual health factors.</p>
      <h3>User assumption of risk</h3><p>You understand and agree that you use Health Dynamics at your own risk and remain solely responsible for your health decisions and for obtaining professional medical care.</p>
    </div>`,
    legalNotice: `<h2>Legal Notice</h2><div class="card">
      <h3>Local-first software notice</h3><p>Health Dynamics is a local-first wellness tracking application. This package is not a hosted healthcare service unless later modified and deployed with servers, accounts, analytics, payments, or cloud storage.</p>
      <h3>Compliance responsibility</h3><p>Depending on deployment and business model, applicable requirements may include consumer protection, privacy, health data, accessibility, advertising, state medical-practice, and data-security laws. The operator is responsible for legal review before public release.</p>
      <h3>No compliance guarantee</h3><p>Health Dynamics does not guarantee HIPAA, CCPA/CPRA, FTC, FDA, state privacy, or other legal compliance. The app is designed to reduce data collection by storing records locally by default, but final compliance depends on actual deployment and business practices.</p>
      <h3>Accuracy</h3><p>Content, formulas, and features may contain errors and should be tested before use. Do not rely on this app as the sole source of truth for medical, legal, financial, or safety decisions.</p>
      <h3>Ownership</h3><p>Replace this section with your company ownership, copyright, trademark, contact, and support information before public launch.</p>
    </div>`
  };

  function applyPolicies(){
    Object.keys(policyHTML).forEach(id=>{const el=$(id); if(el && !el.dataset.hdV2Policy){el.innerHTML=policyHTML[id]; el.dataset.hdV2Policy='1';}});
    const privacy=$('privacy'); if(privacy){privacy.innerHTML='<p class="eyebrow">Privacy Policy</p><h2>Privacy Policy</h2><p>Health Dynamics is local-first. In this static version, your data is stored on your own browser/device and is not uploaded to a Health Dynamics server.</p><p><strong>Guarantee for this local package:</strong> no built-in cloud database, no server profile, no sale of personal information, and no advertising tracker.</p>';}
    const legal=$('legal'); if(legal){legal.innerHTML='<p class="eyebrow">Terms & Legal</p><h2>Terms of Use</h2><p>Health Dynamics is a personal wellness organization and tracking app. It is provided for informational use only and does not provide medical, legal, or professional advice.</p>';}
    const disclaimer=$('disclaimer'); if(disclaimer){disclaimer.innerHTML='<p class="eyebrow">Medical Disclaimer</p><h2>Medical Disclaimer</h2><p><strong>Not medical advice.</strong> Health Dynamics does not diagnose, treat, prescribe, or provide local/statewide/federal medical advice. Talk with a licensed healthcare professional for medical decisions.</p>';}
  }

  function toolHTML(){return `<div class="hd-live-suite card" id="hdLiveHealthSuite">
    <div class="hd-live-header"><div><p class="eyebrow">Live Wellness Tools</p><h2>Health Dynamics Live Calculators</h2><p>Fast local calculators and trackers. Nothing entered here is uploaded by this local app.</p></div><span class="pill blue">Local Only</span></div>
    <div class="hd-consent-box"><input type="checkbox" id="hdConsent"><label for="hdConsent"><strong>I understand these are educational estimates only.</strong><br><span class="muted">These tools do not provide medical advice, diagnosis, treatment, or emergency guidance.</span></label></div>
    <div class="hd-live-grid">
      <div class="hd-tool"><h3>BMI Calculator</h3><p>Height and weight estimate.</p><div class="hd-mini-form"><label>Height ft<input id="hdBmiFt" type="number" value="5"></label><label>Height in<input id="hdBmiIn" type="number" value="10"></label><label>Weight lb<input id="hdBmiLb" type="number" value="180"></label><label>Unit<select id="hdBmiUnit"><option>US</option><option>Metric kg/cm</option></select></label></div><div class="hd-result" id="hdBmiResult">Enter values.</div></div>
      <div class="hd-tool"><h3>Calories & Macros</h3><p>BMR/TDEE educational estimate.</p><div class="hd-mini-form"><label>Age<input id="hdAge" type="number" value="35"></label><label>Sex<select id="hdSex"><option value="male">Male</option><option value="female">Female</option></select></label><label>Weight lb<input id="hdCalLb" type="number" value="180"></label><label>Height in<input id="hdCalIn" type="number" value="70"></label><label class="full">Activity<select id="hdActivity"><option value="1.2">Sedentary</option><option value="1.375">Light</option><option value="1.55" selected>Moderate</option><option value="1.725">Very active</option><option value="1.9">Athlete</option></select></label></div><div class="hd-result" id="hdCalResult">Enter values.</div></div>
      <div class="hd-tool"><h3>Water Intake</h3><p>Simple hydration planning estimate.</p><div class="hd-mini-form"><label>Weight lb<input id="hdWaterLb" type="number" value="180"></label><label>Exercise min<input id="hdExercise" type="number" value="30"></label><label>Climate<select id="hdClimate"><option value="0">Normal</option><option value="12">Hot / dry</option><option value="20">Very hot</option></select></label><label>Caffeine<select id="hdCaffeine"><option value="0">Low</option><option value="8">Moderate</option><option value="16">High</option></select></label></div><div class="hd-result" id="hdWaterResult">Enter values.</div></div>
      <div class="hd-tool"><h3>Blood Pressure Average</h3><p>Track readings locally.</p><div class="hd-mini-form"><label>Systolic<input id="hdSys" type="number" placeholder="120"></label><label>Diastolic<input id="hdDia" type="number" placeholder="80"></label><label>Pulse<input id="hdPulse" type="number" placeholder="72"></label><label>Date<input id="hdBpDate" type="date"></label></div><div class="hd-actions"><button class="hd-save" id="hdSaveBp" type="button">Save Reading</button><button class="hd-export" id="hdExportBp" type="button">Export CSV</button><button class="hd-clear" id="hdClearBp" type="button">Clear</button></div><div class="hd-result" id="hdBpResult">No readings yet.</div><table class="hd-live-table"><thead><tr><th>Date</th><th>BP</th><th>Pulse</th></tr></thead><tbody id="hdBpRows"></tbody></table></div>
      <div class="hd-tool"><h3>Heart Rate Zones</h3><p>Training zone estimate.</p><div class="hd-mini-form"><label>Age<input id="hdHrAge" type="number" value="35"></label><label>Resting HR<input id="hdRestHr" type="number" value="70"></label></div><div class="hd-result" id="hdHrResult">Enter values.</div></div>
      <div class="hd-tool"><h3>Sleep & Mood Log</h3><p>Save a simple daily wellness score.</p><div class="hd-mini-form"><label>Date<input id="hdSleepDate" type="date"></label><label>Sleep hours<input id="hdSleepHours" type="number" step="0.1" value="7"></label><label>Mood 1-10<input id="hdMood" type="number" min="1" max="10" value="7"></label><label>Energy 1-10<input id="hdEnergy" type="number" min="1" max="10" value="7"></label></div><div class="hd-actions"><button class="hd-save" id="hdSaveSleep" type="button">Save Log</button><button class="hd-export" id="hdExportSleep" type="button">Export CSV</button><button class="hd-clear" id="hdClearSleep" type="button">Clear</button></div><div class="hd-result" id="hdSleepResult">No logs yet.</div><table class="hd-live-table"><thead><tr><th>Date</th><th>Sleep</th><th>Mood</th><th>Energy</th></tr></thead><tbody id="hdSleepRows"></tbody></table></div>
    </div>
  </div>`}

  function addLiveTools(){
    if($('hdLiveHealthSuite')) return;
    const calc = $('calculator') || qs('section.panel');
    if(calc) calc.insertAdjacentHTML('beforeend', toolHTML());
    const bpDate=$('hdBpDate'), sleepDate=$('hdSleepDate'); if(bpDate) bpDate.value=today(); if(sleepDate) sleepDate.value=today();
  }
  function bmi(){
    const unit=$('hdBmiUnit')?.value; let kg, cm;
    if(unit && unit.startsWith('Metric')){kg=n($('hdBmiLb')?.value); cm=(n($('hdBmiFt')?.value)||0)*30.48+(n($('hdBmiIn')?.value)||0)*2.54;} else {const lb=n($('hdBmiLb')?.value), inches=(n($('hdBmiFt')?.value)||0)*12+(n($('hdBmiIn')?.value)||0); kg=lb?lb*0.453592:null; cm=inches?inches*2.54:null;}
    const out=$('hdBmiResult'); if(!out)return; if(!kg||!cm){out.innerHTML='Enter valid height and weight.';return;} const val=kg/Math.pow(cm/100,2); let cat=val<18.5?'Underweight':val<25?'Normal range':val<30?'Overweight range':'Obesity range'; out.innerHTML=`BMI: ${val.toFixed(1)} <small>${cat}. Educational estimate only.</small>`;
  }
  function calories(){const age=n($('hdAge')?.value), lb=n($('hdCalLb')?.value), inches=n($('hdCalIn')?.value), sex=$('hdSex')?.value, act=n($('hdActivity')?.value)||1.2,out=$('hdCalResult'); if(!out)return; if(!age||!lb||!inches){out.innerHTML='Enter valid values.';return;} const kg=lb*.453592, cm=inches*2.54; const bmr=10*kg+6.25*cm-5*age+(sex==='female'?-161:5); const tdee=bmr*act; const protein=lb*.8; out.innerHTML=`Maintenance: ${Math.round(tdee)} cal/day <small>BMR ${Math.round(bmr)}. Protein target estimate: ${Math.round(protein)}g/day.</small>`;}
  function water(){const lb=n($('hdWaterLb')?.value), ex=n($('hdExercise')?.value)||0, climate=n($('hdClimate')?.value)||0, caf=n($('hdCaffeine')?.value)||0,out=$('hdWaterResult'); if(!out)return; if(!lb){out.innerHTML='Enter weight.';return;} const oz=lb*.5+(ex/30)*12+climate+caf; out.innerHTML=`${Math.round(oz)} oz/day <small>${(oz/33.814).toFixed(1)} liters. Adjust for clinician advice and conditions.</small>`;}
  function hr(){const age=n($('hdHrAge')?.value), rest=n($('hdRestHr')?.value), out=$('hdHrResult'); if(!out)return; if(!age){out.innerHTML='Enter age.';return;} const max=220-age, reserve=rest?max-rest:null; const z2=reserve?[Math.round(reserve*.6+rest),Math.round(reserve*.7+rest)]:[Math.round(max*.6),Math.round(max*.7)]; out.innerHTML=`Estimated max HR: ${max} bpm <small>Zone 2 estimate: ${z2[0]}–${z2[1]} bpm.</small>`;}
  function renderBp(){const rows=read('hd_bp_readings'); const tbody=$('hdBpRows'), res=$('hdBpResult'); if(tbody) tbody.innerHTML=rows.slice(-5).reverse().map(r=>`<tr><td>${esc(r.date)}</td><td>${esc(r.sys)}/${esc(r.dia)}</td><td>${esc(r.pulse||'')}</td></tr>`).join('')||'<tr><td colspan="3">No readings saved.</td></tr>'; if(res){if(!rows.length){res.textContent='No readings yet.'}else{const avg=(key)=>Math.round(rows.reduce((s,r)=>s+(n(r[key])||0),0)/rows.length); res.innerHTML=`Average: ${avg('sys')}/${avg('dia')} <small>${rows.length} saved reading(s). Share concerning readings with a licensed clinician.</small>`;}}}
  function renderSleep(){const rows=read('hd_sleep_logs'); const tbody=$('hdSleepRows'), res=$('hdSleepResult'); if(tbody) tbody.innerHTML=rows.slice(-5).reverse().map(r=>`<tr><td>${esc(r.date)}</td><td>${esc(r.hours)}</td><td>${esc(r.mood)}</td><td>${esc(r.energy)}</td></tr>`).join('')||'<tr><td colspan="4">No logs saved.</td></tr>'; if(res){if(!rows.length){res.textContent='No logs yet.'}else{const avg=(key)=>rows.reduce((s,r)=>s+(n(r[key])||0),0)/rows.length; const score=Math.round(((Math.min(avg('hours'),8)/8)*50)+(avg('mood')/10*25)+(avg('energy')/10*25)); res.innerHTML=`Wellness score: ${score}/100 <small>${rows.length} saved log(s). Educational tracking only.</small>`;}}}
  function bind(){
    qsa('#hdLiveHealthSuite input,#hdLiveHealthSuite select').forEach(el=>el.addEventListener('input',()=>{bmi();calories();water();hr();}));
    $('hdSaveBp')?.addEventListener('click',()=>{const rows=read('hd_bp_readings'); rows.push({date:$('hdBpDate')?.value||today(),sys:$('hdSys')?.value,dia:$('hdDia')?.value,pulse:$('hdPulse')?.value}); write('hd_bp_readings',rows); renderBp();});
    $('hdClearBp')?.addEventListener('click',()=>{if(confirm('Clear saved blood pressure readings from this browser?')){write('hd_bp_readings',[]);renderBp();}});
    $('hdExportBp')?.addEventListener('click',()=>download('health-dynamics-blood-pressure.csv',csv([['Date','Systolic','Diastolic','Pulse'],...read('hd_bp_readings').map(r=>[r.date,r.sys,r.dia,r.pulse])]))) ;
    $('hdSaveSleep')?.addEventListener('click',()=>{const rows=read('hd_sleep_logs'); rows.push({date:$('hdSleepDate')?.value||today(),hours:$('hdSleepHours')?.value,mood:$('hdMood')?.value,energy:$('hdEnergy')?.value}); write('hd_sleep_logs',rows); renderSleep();});
    $('hdClearSleep')?.addEventListener('click',()=>{if(confirm('Clear saved sleep/mood logs from this browser?')){write('hd_sleep_logs',[]);renderSleep();}});
    $('hdExportSleep')?.addEventListener('click',()=>download('health-dynamics-sleep-mood.csv',csv([['Date','Sleep Hours','Mood','Energy'],...read('hd_sleep_logs').map(r=>[r.date,r.hours,r.mood,r.energy])]))) ;
  }
  function init(){applyPolicies(); addLiveTools(); bind(); bmi();calories();water();hr();renderBp();renderSleep();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
