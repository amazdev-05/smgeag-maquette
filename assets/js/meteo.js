const ICONE = {normal:'🟢',coupure:'🔴',travaux:'🟠'};
const COULEUR_ETAT = {normal:'#2e9e5b',coupure:'#e2574c',travaux:'#e7a13a'};
// Cadre Guadeloupe — verrouille le zoom/pan
const BOUNDS = L.latLngBounds([15.83,-61.81],[16.52,-61.0]);

let meteoCarteInitialisee = false;

export async function initMeteo(){
  const cont = document.getElementById('onglet-meteo');
  const data = await fetch('data/meteo_demo.json').then(r=>r.json());
  const referents = await fetch('data/referents_demo.json').then(r=>r.json());

  cont.innerHTML = `
    <h2>Météo de l'eau — vue maires & présidents</h2>
    <p class="reco">Tableau de transparence partagé aux élus : état du service par commune, horaires de coupure et de réouverture, et élu/agent référent. Projection.</p>
    <div class="meteo-legende">
      <span class="pastille" style="--c:#2e9e5b"></span>Normal
      <span class="pastille" style="--c:#e2574c"></span>Coupure
      <span class="pastille" style="--c:#e7a13a"></span>Travaux
    </div>
    <div id="carte-meteo"></div>
    <div class="grille-meteo">${data.map(m=>`<article class="meteo-carte etat-${m.etat}">
      <div class="meteo-tete">${ICONE[m.etat]} <b>${m.commune}</b></div>
      <p class="meteo-etat">${m.etat.toUpperCase()}</p>
      <p class="meteo-h">${m.debut} → ${m.reouverture}</p>
      <p class="meteo-d">${m.detail}</p>
      <p class="meteo-ref">👤 ${refPour(referents, m.commune)}</p></article>`).join('')}</div>
    <p class="mention">Référents : élus/agents cités ou à nommer — illustratif (projection).</p>`;

  // Init carte paresseuse au 1er affichage de l'onglet (évite le conteneur masqué)
  document.addEventListener('onglet:active', e => {
    if(e.detail.cibleId === 'onglet-meteo' && !meteoCarteInitialisee){
      meteoCarteInitialisee = true;
      construireCarteMeteo(data, referents);
    }
  });
}

function refPour(referents, commune){
  const r = referents.find(x => x.commune === commune);
  return r ? `${r.nom} — ${r.role}` : 'Référent à nommer';
}

function normaliserNom(n){
  return n.toLowerCase()
    .replace(/^(le|la|les|l')\s+/i, '')
    .replace(/\s+/g, '-')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

async function construireCarteMeteo(data, referents){
  const map = L.map('carte-meteo', {
    maxBounds: BOUNDS, maxBoundsViscosity: 1.0,
    minZoom: 9, maxZoom: 13
  }).fitBounds(BOUNDS);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {attribution:'© OpenStreetMap',maxZoom:18}).addTo(map);

  const etats = {};
  data.forEach(d => { etats[normaliserNom(d.commune)] = d; });
  const refs = {};
  referents.forEach(r => { refs[normaliserNom(r.commune)] = r; });

  try {
    const geo = await fetch('data/communes-971.geojson').then(r=>r.json());
    L.geoJSON(geo, {
      style: feature => {
        const nom = normaliserNom(feature.properties.nom);
        const etat = etats[nom]?.etat || 'normal';
        return {fillColor: COULEUR_ETAT[etat], weight:1, opacity:1, color:'#fff', fillOpacity:0.55};
      },
      onEachFeature: (feature, layer) => {
        const nom = feature.properties.nom;
        const norm = normaliserNom(nom);
        const info = etats[norm];
        const ref = refs[norm];
        const etatLabel = info ? `${info.etat.toUpperCase()} — ${info.debut} → ${info.reouverture}` : 'Non renseigné';
        const detail = info ? `<br>${info.detail}` : '';
        const refLabel = ref ? `<br>👤 ${ref.nom} (${ref.role})` : '';
        layer.bindTooltip(`<b>${nom}</b><br>${etatLabel}${detail}${refLabel}<br><small>Projection illustrative</small>`);
      }
    }).addTo(map);
  } catch(e){
    console.warn('GeoJSON communes indisponible', e);
  }

  // Conteneur était masqué à la création → recalcul de taille
  setTimeout(() => map.invalidateSize(), 200);
}
