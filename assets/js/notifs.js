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
  const data = await fetch('data/notifs_demo.json').then(r=>r.json());

  cont.innerHTML = `
    <h2>Notifications usagers — savoir QUAND, pour s'organiser</h2>
    <p class="reco">L'usager connaît déjà le problème d'eau. Ce qu'il veut, c'est <b>savoir quand l'eau est coupée</b> pour s'organiser. Le SMGEAG pousse des messages clairs : coupure imminente, reprise, travaux à venir (préavis ≥ 2 jours).</p>
    <div class="telephone-cadre">
      <div class="telephone-ecran">
        <div class="telephone-entete"><h3>SMGEAG · Alertes eau</h3><span>messages aux abonnés</span></div>
        <div class="telephone-flux" id="tel-flux"></div>
        <div class="telephone-mention">Messages illustratifs — projection</div>
      </div>
    </div>`;

  const flux = document.getElementById('tel-flux');
  let i = 0;
  const pousser = () => {
    if(!document.body.contains(flux)) { clearInterval(timer); return; }
    const m = data[i % data.length];
    const el = document.createElement('div');
    el.className = 'notif-bulle';
    el.innerHTML = `<div class="notif-heure">${m.h}</div>${m.msg}`;
    flux.appendChild(el);
    flux.scrollTop = flux.scrollHeight;
    if(flux.children.length > 14) flux.removeChild(flux.firstChild);
    i++;
  };

  pousser();
  if(timer) clearInterval(timer);
  timer = setInterval(pousser, 2500);
}
