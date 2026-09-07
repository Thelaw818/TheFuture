/* TheFuture GitHub Pages cache reset service worker — 2026-09-06 */
const CACHE_RESET_VERSION='thefuture-cache-reset-20260906-v2';
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    try{
      const keys=await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }catch(e){}
    try{ await self.registration.unregister(); }catch(e){}
    try{ await self.clients.claim(); }catch(e){}
  })());
});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  event.respondWith(fetch(event.request,{cache:'no-store'}));
});
