const COULEUR = {panne:'#e2574c',intervention:'#e7a13a',resolu:'#2e9e5b'};
let carteInitialisee = false;

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
  cont.innerHTML = `<div class="map-tete"><h2>Centre opérationnel — état du réseau (projection)</h2>
    <p class="map-legende">
      <span class="pastille" style="--c:#e2574c"></span>Panne
      <span class="pastille" style="--c:#e7a13a"></span>Intervention
      <span class="pastille" style="--c:#2e9e5b"></span>Rétabli</p></div>
    <div id="carte"></div>`;
  const map = L.map('carte').setView([16.20,-61.52],10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {attribution:'© OpenStreetMap',maxZoom:18}).addTo(map);
  const reseau = await fetch('data/reseau_demo.json').then(r=>r.json());
  reseau.forEach(r => L.polyline(r.points,{color:'#1c7fd6',weight:3,dashArray:'6 6',opacity:.7})
    .bindTooltip(r.nom).addTo(map));
  const incidents = await fetch('data/incidents_demo.json').then(r=>r.json());
  incidents.forEach(i => L.circleMarker([i.lat,i.lon],
    {radius:9,color:'#fff',weight:2,fillColor:COULEUR[i.statut],fillOpacity:.9})
    .bindPopup(`<b>${i.zone}</b><br>${i.type}<br><i>${i.statut}</i><br><small>Donnée illustrative</small>`)
    .addTo(map));
}
