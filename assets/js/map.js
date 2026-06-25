import { USE_FIREBASE, firebaseConfig } from './firebase-config.js';

const COULEUR = {panne:'#e2574c',intervention:'#e7a13a',resolu:'#2e9e5b'};
const COULEUR_EAU = {Claire:'#2e9e5b',Trouble:'#e7a13a',Marron:'#8b5a2b',Odeur:'#7c3aed'};
const LIBELLE_TYPE = {
  'Coupure d\'eau':'Coupure',
  'Pas d\'eau à l\'arrivée':'Pas d\'eau',
  'Eau revenue à HHhMM':'Eau revenue'
};

let carteInitialisee = false;
let map = null;
let markersLayer = null;
let signals = [];
let firebaseApp = null;
let db = null;
let rtdbRef = null;
let unsubscribe = null;

export function initMapLazy(){
  document.addEventListener('onglet:active', e => {
    if(e.detail.cibleId === 'onglet-map' && !carteInitialisee){
      carteInitialisee = true;
      construireCarte();
    }
  });
}

async function construireCarte(){
  const cont = document.getElementById('onglet-map');
  cont.innerHTML = `
    <div class="map-tete">
      <div>
        <h2>Centre opérationnel — état du réseau (projection)</h2>
        <p class="map-soustitre">Données illustratives · réseau schématique · signalement géolocalisé</p>
      </div>
      <button id="btn-declarer" class="btn-primaire">📍 Déclarer un signalement</button>
    </div>
    <p class="map-legende">
      <span class="pastille" style="--c:#e2574c"></span>Panne
      <span class="pastille" style="--c:#e7a13a"></span>Intervention
      <span class="pastille" style="--c:#2e9e5b"></span>Rétabli</p>
    <div class="carte-layout">
      <div id="carte"></div>
      <aside class="feed-panel">
        <h3>Derniers signalements</h3>
        <div id="feed-signalements"></div>
        <p class="feed-mention">Démonstration du mécanisme — signalement géolocalisé</p>
      </aside>
    </div>
    <div id="modale-signal" class="modale" hidden>
      <div class="modale-contenu">
        <h3>Déclarer un signalement</h3>
        <label>Type
          <select id="signal-type">
            <option>Coupure d'eau</option>
            <option>Pas d'eau à l'arrivée</option>
            <option>Eau revenue à HHhMM</option>
          </select>
        </label>
        <label>État de l'eau
          <select id="signal-etat">
            <option>Claire</option>
            <option>Trouble</option>
            <option>Marron</option>
            <option>Odeur</option>
          </select>
        </label>
        <p class="modale-info">Cliquez sur « Envoyer ma position » pour utiliser votre géolocalisation,<br>ou cliquez sur la carte pour placer le point manuellement.</p>
        <div class="modale-actions">
          <button id="btn-annuler" class="btn-secondaire">Annuler</button>
          <button id="btn-envoyer" class="btn-primaire">📍 Envoyer ma position</button>
        </div>
      </div>
    </div>`;

  map = L.map('carte').setView([16.20,-61.52],10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {attribution:'© OpenStreetMap',maxZoom:18}).addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  const reseau = await fetch('data/reseau_demo.json').then(r=>r.json());
  reseau.forEach(r => L.polyline(r.points,{color:'#1c7fd6',weight:3,dashArray:'6 6',opacity:.7})
    .bindTooltip(r.nom).addTo(map));

  const incidents = await fetch('data/incidents_demo.json').then(r=>r.json());
  incidents.forEach(i => addMarker(i.lat,i.lon,i.zone,i.type,i.statut));

  const live = await fetch('data/live_demo.json').then(r=>r.json());
  signals = live.map(s => ({...s, source:'demo'}));
  signals.forEach(s => addMarker(s.lat,s.lon,s.msg,s.type,s.statut,formatHeureEau(s)));
  renderFeed();

  initFirebase();

  document.getElementById('btn-declarer').addEventListener('click', ouvrirModale);
  document.getElementById('btn-annuler').addEventListener('click', fermerModale);
  document.getElementById('btn-envoyer').addEventListener('click', envoyerGeoloc);

  map.on('click', e => {
    if(document.getElementById('modale-signal').hidden) return;
    ajouterSignal(e.latlng.lat, e.latlng.lng);
    fermerModale();
  });
}

function makePin(color){
  return L.divIcon({
    className:'pin-wrap',
    html:`<div class="pin" style="--pin:${color}"></div>`,
    iconSize:[22,30], iconAnchor:[11,28], popupAnchor:[0,-26]
  });
}

function addMarker(lat,lon,titre,type,statut,popupExtra=''){
  const color = COULEUR[statut] || COULEUR.intervention;
  const m = L.marker([lat,lon], {icon: makePin(color)})
    .bindPopup(`<b>${titre}</b><br>${type}<br><i>${statut}</i>${popupExtra?'<br>'+popupExtra:''}<br><small>Donnée illustrative</small>`)
    .addTo(markersLayer);
  return m;
}

function formatHeureEau(s){
  const eau = s.etat_eau ? `<span style="color:${COULEUR_EAU[s.etat_eau]}">● ${s.etat_eau}</span>` : '';
  return `${eau}`;
}

function renderFeed(){
  const feed = document.getElementById('feed-signalements');
  if(!feed) return;
  const tri = [...signals].sort((a,b)=> b.h.localeCompare(a.h));
  feed.innerHTML = tri.map(s => {
    const eauClass = s.etat_eau ? `eau-${s.etat_eau.toLowerCase()}` : '';
    return `<div class="feed-item">
      <div class="feed-top"><span class="feed-heure">${s.h}</span><span class="feed-type">${LIBELLE_TYPE[s.type] || s.type}</span></div>
      <div class="feed-detail">${s.msg}</div>
      <div class="feed-meta">
        <span class="badge-eau ${eauClass}">${s.etat_eau || 'Non précisé'}</span>
        <span class="feed-pos">📍 ${s.lat.toFixed(3)}, ${s.lon.toFixed(3)}</span>
      </div>
    </div>`;
  }).join('');
}

function ouvrirModale(){
  document.getElementById('modale-signal').hidden = false;
}
function fermerModale(){
  document.getElementById('modale-signal').hidden = true;
}

function envoyerGeoloc(){
  if(!navigator.geolocation){
    alert('Géolocalisation non disponible. Cliquez sur la carte pour positionner le signalement.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      ajouterSignal(pos.coords.latitude, pos.coords.longitude);
      fermerModale();
    },
    err => {
      console.warn('Géoloc refusée', err);
      alert('Géolocalisation refusée ou indisponible. Cliquez sur la carte pour positionner le signalement.');
    },
    {enableHighAccuracy:true,timeout:10000,maximumAge:0}
  );
}

function ajouterSignal(lat,lon){
  const type = document.getElementById('signal-type').value;
  const etat = document.getElementById('signal-etat').value;
  const heure = new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  const signal = {
    h: heure,
    tel: 'Moi',
    msg: type,
    lat, lon,
    type,
    etat_eau: etat,
    statut: type.includes('revenue') ? 'resolu' : 'panne',
    source: 'utilisateur'
  };
  signals.unshift(signal);
  addMarker(lat,lon,signal.msg,signal.type,signal.statut,formatHeureEau(signal));
  renderFeed();
  if(map) map.flyTo([lat,lon],14);

  if(USE_FIREBASE && db && rtdbRef){
    pushSignalToFirebase(signal);
  }
}

async function initFirebase(){
  if(!USE_FIREBASE) return;
  const configOk = firebaseConfig.apiKey && firebaseConfig.databaseURL;
  if(!configOk){
    console.warn('Firebase activé mais config incomplète — mode local utilisé.');
    return;
  }
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getDatabase, ref, onValue, push } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js');
    firebaseApp = initializeApp(firebaseConfig);
    db = getDatabase(firebaseApp);
    rtdbRef = ref(db, 'signalements');

    onValue(rtdbRef, snap => {
      const data = snap.val();
      if(!data) return;
      Object.values(data).forEach(s => {
        if(signals.some(x => x.h === s.h && x.lat === s.lat && x.lon === s.lon && x.source === 'firebase')) return;
        const enriched = {...s, source:'firebase'};
        signals.push(enriched);
        addMarker(enriched.lat,enriched.lon,enriched.msg,enriched.type,enriched.statut,formatHeureEau(enriched));
      });
      renderFeed();
    });

    window._pushSignalToFirebase = async (signal) => {
      await push(rtdbRef, signal);
    };
  } catch(e){
    console.error('Erreur Firebase:', e);
  }
}

function pushSignalToFirebase(signal){
  if(window._pushSignalToFirebase) window._pushSignalToFirebase(signal);
}
