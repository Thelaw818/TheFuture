from pathlib import Path
p=Path('/mnt/data/pro_responses/app.js')
s=p.read_text()
# improve old duplicate handler messages
s=s.replace("$('#registerMsg').textContent='Local account saved. You can login now.';", "$('#registerMsg').textContent='Account created successfully. Your secure workspace is now ready.';")
s=s.replace("`Welcome back, ${master?'Frankie':(u.name||'user')}.`:'No account match found.'", "`Welcome back, ${master?'Frankie':(u.name||'user')}. Access verified.`:'We could not verify those credentials. Please check your login and try again.'")
# professional toasts/messages in gate
s=s.replace("toast('Please login to access the dashboard and tools.');", "toast('Access required. Please sign in to continue to your private dashboard.');")
s=s.replace("'Account created. Dashboard unlocked.'", "'Account created successfully. Your private dashboard is unlocked.'")
s=s.replace("'Welcome back, Frankie. Dashboard unlocked.'", "'Welcome back, Frankie. Master access verified.'")
s=s.replace("`Welcome back${user.name ? ', ' + user.name : ''}. Dashboard unlocked.`", "`Welcome back${user.name ? ', ' + user.name : ''}. Access verified and dashboard unlocked.`")
s=s.replace("toast('Logged out. Dashboard locked.');", "toast('Signed out successfully. Your dashboard is now locked.');")
s=s.replace("toast('Access required. Please sign in to continue to your private dashboard.');", "toast('Access required. Please sign in to continue to your private dashboard.');")
# add explicit invalid credential message in gate after removeItem
s=s.replace("localStorage.removeItem('paLoggedIn');\n          setGate();", "localStorage.removeItem('paLoggedIn');\n          const msg = $auth('#loginMsg');\n          if(msg) msg.textContent = 'Access denied. Please verify your login and password, then try again.';\n          toast('Login unsuccessful. Please verify your credentials.');\n          setGate();")
p.write_text(s)

# index wording
ip=Path('/mnt/data/pro_responses/index.html')
h=ip.read_text()
h=h.replace('<h2>Member login</h2><p>Login is required to access the dashboard, calculators, trackers, logs, charts, and private research tools.</p>', '<h2>Secure member access</h2><p>Sign in to open your private command center, analytics, calculators, protocol tools, logs, charts, and research records.</p>')
h=h.replace('<p class="muted">Master login: Frankie</p>', '<p class="muted">Authorized users only. Master access is configured for Frankie.</p>')
h=h.replace('<h2>Create your access account</h2><p>Create a private local account to unlock the dashboard and research tracking tools on this device.</p>', '<h2>Create workspace access</h2><p>Create a private account profile for this device and unlock the professional research management workspace.</p>')
h=h.replace('<p>The dashboard, calculators, peptide logs, health trackers, COA tools, charts, and database sections are protected behind login.</p>', '<p>Your dashboard, calculators, protocol planner, body-load charts, peptide logs, health trackers, COA tools, cost system, and database sections are protected behind secure access.</p>')
h=h.replace('<h2>Login required to view the application</h2>', '<h2>Secure access required</h2>')
ip.write_text(h)

# css polish
cp=Path('/mnt/data/pro_responses/styles.css')
c=cp.read_text()
add='''\n.form-msg{font-weight:800;border-left:4px solid var(--blue,#0b57d0);padding:10px 12px;background:#f8fbff;border-radius:10px;color:#0f172a}\n.auth-card input:focus,.form-grid input:focus,.form-grid select:focus,.form-grid textarea:focus{outline:3px solid rgba(37,99,235,.18);border-color:#2563eb}\n.locked-panel .section-title{max-width:820px;margin:auto;text-align:center}\n'''
if '.form-msg{' not in c:
    c += add
cp.write_text(c)
