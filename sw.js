const CACHE='thefuture-v4-1-peptide-bg-35-20260720';
const CORE=['./','./index.html','./styles.css','./v4.css','./v4.js','./app.js','./manifest.json','./coa-database.json','./inventory.xlsx','./peptides.json','./assets/backgrounds/peptide-chain-dashboard-bg.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const fresh=['coa-database.json','inventory.xlsx','index.html','v4.js','v4.css'].some(x=>u.pathname.endsWith(x));
  if(fresh){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return n})));
  }
});
