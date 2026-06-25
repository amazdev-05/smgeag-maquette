let started = false;
let timer = null;

export function initNotifs(){
  document.addEventListener('onglet:active', e => {
    if(e.detail.cibleId === 'onglet-notifs' && !started){
      started = true;
      construireNotifs();
    }
  });
}

async function construireNotifs(){
  const cont = document.getElementById('onglet-notifs');
  const alertes = await fetch('data/notifs_demo.json').then(r=>r.json());
  const signalements = await fetch('data/live_demo.json').then(r=>r.json());

  cont.innerHTML = `
    <h2>Notifications usagers — la relation va dans les deux sens</h2>
    <p class="reco">L'usager connaît déjà le problème d'eau. Ce qu'il veut, c'est <b>savoir quand l'eau est coupée</b> pour s'organiser. À gauche, ce que le SMGEAG pousse aux abonnés ; à droite, les signalements que les abonnés renvoient (les mêmes que sur la carte).</p>
    <div class="telephones-duo">
      <div>
        <p class="telephone-titre-mini">📲 SMGEAG → abonnés (alertes)</p>
        <div class="telephone-cadre"><div class="telephone-ecran">
          <div class="telephone-entete"><h3>SMGEAG · Alertes eau</h3><span>messages aux abonnés</span></div>
          <div class="telephone-flux" id="tel-flux-a"></div>
          <div class="telephone-mention">Messages illustratifs — projection</div>
        </div></div>
      </div>
      <div>
        <p class="telephone-titre-mini">📩 Abonnés → SMGEAG (signalements)</p>
        <div class="telephone-cadre"><div class="telephone-ecran">
          <div class="telephone-entete"><h3>Signalements reçus</h3><span>remontées terrain géolocalisées</span></div>
          <div class="telephone-flux" id="tel-flux-b">${signalements.map(s=>`
            <div class="notif-bulle envoye">
              <div class="notif-heure">${s.h} · ${s.type}${s.etat_eau?' · '+s.etat_eau:''}</div>${s.msg}
            </div>`).join('')}</div>
          <div class="telephone-mention">Mêmes signalements que sur la carte — projection</div>
        </div></div>
      </div>
    </div>`;

  const flux = document.getElementById('tel-flux-a');
  let i = 0;
  const pousser = () => {
    if(!document.body.contains(flux)){ clearInterval(timer); return; }
    const m = alertes[i % alertes.length];
    const el = document.createElement('div');
    el.className = 'notif-bulle';
    el.innerHTML = `<div class="notif-heure">${m.h}</div>${m.msg}`;
    flux.appendChild(el);
    flux.scrollTop = flux.scrollHeight;
    if(flux.children.length > 12) flux.removeChild(flux.firstChild);
    i++;
  };
  pousser();
  if(timer) clearInterval(timer);
  timer = setInterval(pousser, 2500);
}
