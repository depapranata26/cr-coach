const CACHE='cr-coach-v2';
const ASSETS=['.','index.html','manifest.json','data/cards.json','data/meta_decks.json','data/counters.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>{
    if(r) return r;
    return fetch(e.request).then(res=>{
      if(res.ok&&e.request.url.includes('/img/cards/')){
        const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));
      }
      return res;
    }).catch(()=>caches.match('index.html'));
  }));
});
