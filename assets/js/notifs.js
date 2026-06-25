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

function phone(titre, sousTitre, fluxId, contenu){
  return `
    <div class="telephone-cadre">
      <div class="telephone-ecran">
        <div class="tel-statusbar"><span>9:41</span><span class="tel-status-ico">📶 &nbsp;🔋</span></div>
        <div class="telephone-entete wa">
          <span class="wa-back">‹</span>
          <span class="wa-avatar">💧</span>
          <div class="wa-id"><b>${titre}</b><small>${sousTitre}</small></div>
        </div>
        <div class="telephone-flux" id="${fluxId}">${contenu}</div>
        <div class="tel-input"><span class="tel-input-zone">Message…</span><span class="tel-send">➤</span></div>
        <div class="tel-home"></div>
      </div>
    </div>`;
}

async function construireNotifs(){
  const cont = document.getElementById('onglet-notifs');
  const alertes = await fetch('data/notifs_demo.json').then(r=>r.json());
  const signalements = await fetch('data/live_demo.json').then(r=>r.json());

  const bullesB = signalements.map(s=>`
    <div class="notif-bulle envoye">
      <div class="bulle-txt">${s.msg}</div>
      <div class="bulle-meta">${s.h} · ${s.type}${s.etat_eau?' · '+s.etat_eau:''} <span class="tick">✓✓</span></div>
    </div>`).join('');

  cont.innerHTML = `
    <h2>Notifications usagers — la relation va dans les deux sens</h2>
    <p class="reco">L'usager connaît déjà le problème d'eau. Ce qu'il veut, c'est <b>savoir quand l'eau est coupée</b> pour s'organiser. À gauche, ce que le SMGEAG pousse aux abonnés ; à droite, les signalements que les abonnés renvoient (les mêmes que sur la carte).</p>
    <div class="telephones-duo">
      <div>
        <p class="telephone-titre-mini">📲 SMGEAG → abonnés (alertes)</p>
        ${phone('SMGEAG · Alertes eau','en ligne','tel-flux-a','')}
      </div>
      <div>
        <p class="telephone-titre-mini">📩 Abonnés → SMGEAG (signalements)</p>
        ${phone('Signalements reçus','remontées géolocalisées','tel-flux-b',bullesB)}
      </div>
    </div>
    <p class="mention">Messages illustratifs — projection.</p>`;

  const flux = document.getElementById('tel-flux-a');
  let i = 0;
  const pousser = () => {
    if(!document.body.contains(flux)){ clearInterval(timer); return; }
    const m = alertes[i % alertes.length];
    const el = document.createElement('div');
    el.className = 'notif-bulle';
    el.innerHTML = `<div class="bulle-txt">${m.msg}</div><div class="bulle-meta">${m.h} <span class="tick">✓✓</span></div>`;
    flux.appendChild(el);
    flux.scrollTop = flux.scrollHeight;
    if(flux.children.length > 12) flux.removeChild(flux.firstChild);
    i++;
  };
  pousser();
  if(timer) clearInterval(timer);
  timer = setInterval(pousser, 2500);
}
