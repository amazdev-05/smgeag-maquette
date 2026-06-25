const ICONE = {normal:'🟢',coupure:'🔴',travaux:'🟠'};
const COULEUR_ETAT = {normal:'#2e9e5b',coupure:'#e2574c',travaux:'#e7a13a'};
let meteoCarteInitialisee = false;

export async function initMeteo(){
  const cont = document.getElementById('onglet-meteo');
  const data = await fetch('data/meteo_demo.json').then(r=>r.json());

  cont.innerHTML = `
    <h2>Météo de l'eau — vue maires & présidents</h2>
    <p class="reco">Tableau de transparence partagé aux élus : état du service par commune, horaires de coupure et de réouverture. Projection.</p>
    <div id="carte-meteo"></div>
    <div class="meteo-legende">
      <span class="pastille" style="--c:#2e9e5b"></span>Normal
      <span class="pastille" style="--c:#e2574c"></span>Coupure
      <span class="pastille" style="--c:#e7a13a"></span>Travaux
    </div>
    <div class="grille-meteo">${data.map(m=>`<article class="meteo-carte etat-${m.etat}">
      <div class="meteo-tete">${ICONE[m.etat]} <b>${m.commune}</b></div>
      <p class="meteo-etat">${m.etat.toUpperCase()}</p>
      <p class="meteo-h">${m.debut} → ${m.reouverture}</p>
      <p class="meteo-d">${m.detail}</p></article>`).join('')}</div>`;

  if(!meteoCarteInitialisee){
    meteoCarteInitialisee = true;
    await construireCarteMeteo(data);
  }
}

function normaliserNom(n){
  return n.toLowerCase()
    .replace(/^(le|la|les|l')\s+/i, '')
    .replace(/\s+/g, '-')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function construireCarteMeteo(data){
  const map = L.map('carte-meteo').setView([16.20,-61.52],10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {attribution:'© OpenStreetMap',maxZoom:18}).addTo(map);

  const etats = {};
  data.forEach(d => { etats[normaliserNom(d.commune)] = d; });

  const geo = await fetch('data/communes-971.geojson').then(r=>r.json());
  L.geoJSON(geo, {
    style: feature => {
      const nom = normaliserNom(feature.properties.nom);
      const etat = etats[nom]?.etat || 'normal';
      return {
        fillColor: COULEUR_ETAT[etat],
        weight: 1,
        opacity: 1,
        color: '#fff',
        dashArray: '',
        fillOpacity: 0.5
      };
    },
    onEachFeature: (feature, layer) => {
      const nom = feature.properties.nom;
      const norm = normaliserNom(nom);
      const info = etats[norm];
      const etatLabel = info ? `${info.etat.toUpperCase()} — ${info.debut} → ${info.reouverture}` : 'Non renseigné';
      const detail = info ? `<br>${info.detail}` : '';
      layer.bindTooltip(`<b>${nom}</b><br>${etatLabel}${detail}<br><small>Projection illustrative</small>`);
    }
  }).addTo(map);
}
