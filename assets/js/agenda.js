const BOUNDS = L.latLngBounds([15.83,-61.81],[16.52,-61.0]);
const LIBELLE = {a_venir:'À venir', en_cours:'En cours', effectue:'Effectué'};
const PICTO = {a_venir:'🗓️', en_cours:'🚧', effectue:'✅'};

let carteInit = false;
let travaux = [];
let map = null;
let markers = []; // {statut, marker}
let filtreActif = 'tous';

export async function initAgenda(){
  const cont = document.getElementById('onglet-agenda');
  travaux = await fetch('data/travaux_demo.json').then(r=>r.json());

  cont.innerHTML = `
    <h2>Agenda des travaux — planning réseau</h2>
    <p class="reco">Travaux à venir, en cours et réalisés, par commune et sur la carte. Préavis aux usagers ≥ 2 jours. Projection.</p>
    <div class="filtres-agenda">
      <button class="btn-gris active" data-f="tous">Tous</button>
      <button class="btn-gris" data-f="a_venir">À venir</button>
      <button class="btn-gris" data-f="en_cours">En cours</button>
      <button class="btn-gris" data-f="effectue">Effectués</button>
    </div>
    <p class="pertes-legende">🗓️ À venir &nbsp;·&nbsp; 🚧 En cours &nbsp;·&nbsp; ✅ Effectué — cliquez un filtre pour isoler sur la carte et dans la liste</p>
    <div class="agenda-layout">
      <div id="carte-agenda"></div>
      <aside class="agenda-liste"><h4>Chantiers</h4><div id="agenda-items"></div></aside>
    </div>
    <p class="mention">🚧 = travaux localisés. Données illustratives — projection.</p>`;

  cont.querySelectorAll('.filtres-agenda button').forEach(b => {
    b.addEventListener('click', () => {
      cont.querySelectorAll('.filtres-agenda button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      filtreActif = b.dataset.f;
      appliquerFiltre();
    });
  });

  renderListe();

  document.addEventListener('onglet:active', e => {
    if(e.detail.cibleId === 'onglet-agenda' && !carteInit){
      carteInit = true;
      construireCarteAgenda();
    }
  });
}

function visible(t){ return filtreActif === 'tous' || t.statut === filtreActif; }

function renderListe(){
  const box = document.getElementById('agenda-items');
  if(!box) return;
  box.innerHTML = travaux.filter(visible).map(t => `
    <div class="agenda-item">
      <span class="agenda-statut ${t.statut}">${LIBELLE[t.statut]}</span>
      <div class="agenda-titre">${t.intitule}</div>
      <div class="agenda-meta">${t.commune} · ${t.debut}${t.fin && t.fin!==t.debut ? ' → '+t.fin : ''}</div>
    </div>`).join('') || '<p class="mention">Aucun chantier pour ce filtre.</p>';
}

function construireCarteAgenda(){
  map = L.map('carte-agenda', {maxBounds:BOUNDS, maxBoundsViscosity:1.0, minZoom:9, maxZoom:13}).fitBounds(BOUNDS);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:18}).addTo(map);

  travaux.forEach(t => {
    const icon = L.divIcon({className:'travaux-pin', html:`<div class="travaux-ico statut-${t.statut}">${PICTO[t.statut]||'🚧'}</div>`, iconSize:[28,28], iconAnchor:[14,14], popupAnchor:[0,-14]});
    const m = L.marker([t.lat,t.lon], {icon})
      .bindPopup(`<b>${t.intitule}</b><br>${t.commune}<br>${LIBELLE[t.statut]} · ${t.debut}${t.fin&&t.fin!==t.debut?' → '+t.fin:''}<br><small>Projection</small>`)
      .addTo(map);
    markers.push({statut:t.statut, marker:m});
  });

  setTimeout(() => map.invalidateSize(), 200);
}

function appliquerFiltre(){
  renderListe();
  markers.forEach(({statut, marker}) => {
    const show = filtreActif === 'tous' || statut === filtreActif;
    if(show){ if(map && !map.hasLayer(marker)) marker.addTo(map); }
    else { if(map && map.hasLayer(marker)) map.removeLayer(marker); }
  });
}
