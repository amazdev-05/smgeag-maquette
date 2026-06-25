export function initLive(){
  // Activation cachée : touche Ctrl+Shift+L ou ?live dans l'URL
  const reveler = () => {
    document.getElementById('tab-live').hidden = false;
    construireLive();
  };
  if(location.search.includes('live')) reveler();
  document.addEventListener('keydown', e => {
    if(e.ctrlKey && e.shiftKey && e.key.toLowerCase()==='l') reveler();
  });
}

async function construireLive(){
  const cont = document.getElementById('onglet-live');
  if(cont.dataset.pret) return;
  cont.dataset.pret = '1';
  const data = await fetch('data/live_demo.json').then(r=>r.json());
  cont.innerHTML = `<h2>Remontée terrain temps réel — WhatsApp géolocalisé</h2>
    <p class="reco">Mode démonstration : un numéro unique reçoit les signalements « pa dlo », géolocalisés et reportés sur la carte. Données fictives.</p>
    <div id="flux-live" class="flux-live"></div>`;
  const flux = document.getElementById('flux-live');
  data.forEach((m,idx)=>setTimeout(()=>{
    const el=document.createElement('div');
    el.className='msg-live';
    el.innerHTML=`<span class="msg-h">${m.h}</span> <b>${m.tel}</b><br>${m.msg}
      <span class="msg-geo">📍 ${m.lat.toFixed(3)}, ${m.lon.toFixed(3)}</span>`;
    flux.prepend(el);
  }, idx*900));
}
