const BOUNDS = L.latLngBounds([15.83,-61.81],[16.52,-61.0]);
const couleurPerte = p => p>=65 ? '#e2574c' : (p>=55 ? '#e7a13a' : '#2e9e5b');
const classePerte = p => p>=65 ? 'fort' : (p>=55 ? 'moyen' : 'faible');

let carteInit = false;

export async function initPertes(){
  const cont = document.getElementById('onglet-pertes');
  const d = await fetch('data/rendement_demo.json').then(r=>r.json());
  const serie = d.serie;
  const pertes2025 = serie[serie.length-1].pertes;
  const perteReseau = 100 - d.rendement_robinet;

  cont.innerHTML = `
    <h2>Taux de pertes du réseau — projection illustrative</h2>
    <p class="reco">${d.message} <br><small>Source : ${d.source}.</small></p>

    <div class="kpi-bandeau">
      <div class="kpi-carte"><div class="kpi-valeur alerte">${pertes2025}%</div><div class="kpi-label">Pertes réseau (2025)</div></div>
      <div class="kpi-carte"><div class="kpi-valeur">${d.rendement_robinet}%</div><div class="kpi-label">Eau arrivant au robinet (rendement)</div></div>
      <div class="kpi-carte"><div class="kpi-valeur ok">${d.objectif_pertes}%</div><div class="kpi-label">Objectif pertes (programme 3 ans)</div></div>
    </div>

    <h3>De la captation au robinet</h3>
    <div class="cascade-eau">
      <div class="cascade-etape"><i>💧</i>Mis en distribution<br><b>100%</b></div>
      <div class="cascade-fleche">→</div>
      <div class="cascade-etape"><i>🚰</i>Réseau<br><span class="cascade-perte">− ${perteReseau}% pertes</span></div>
      <div class="cascade-fleche">→</div>
      <div class="cascade-etape"><i>🚿</i>Au robinet<br><b>${d.rendement_robinet}%</b></div>
    </div>

    <h3>Trajectoire des pertes (suivi sur 3 ans)</h3>
    <div class="graph-ligne">
      <div class="graph-barres">
        ${serie.map(s=>`<div class="graph-barre" style="height:${(s.pertes/80*100).toFixed(0)}%;background:${couleurPerte(s.pertes)}"><span>${s.annee} · ${s.pertes}%</span></div>`).join('')}
      </div>
      <p class="graph-legende">Les paiements des prestataires de monitoring sont indexés sur cette baisse (compteurs témoins télérelevés). Objectif : ${d.objectif_pertes}% de pertes.</p>
    </div>

    <h3>Taux de pertes par commune</h3>
    <div class="pertes-legende">
      <span class="pastille" style="--c:#e2574c"></span>≥ 65%
      <span class="pastille" style="--c:#e7a13a"></span>55–64%
      <span class="pastille" style="--c:#2e9e5b"></span>&lt; 55%
    </div>
    <div id="carte-pertes"></div>
    <div class="pertes-grille">
      ${d.par_commune.map(c=>`<div class="perte-carte"><span class="perte-nom">${c.commune}</span><span class="perte-val ${classePerte(c.pertes)}">${c.pertes}%</span></div>`).join('')}
    </div>
    <p class="mention">Données publiques retraitées — projection illustrative.</p>`;

  document.addEventListener('onglet:active', e => {
    if(e.detail.cibleId === 'onglet-pertes' && !carteInit){
      carteInit = true;
      construireCartePertes(d);
    }
  });
}

function normaliserNom(n){
  return n.toLowerCase().replace(/^(le|la|les|l')\s+/i,'').replace(/\s+/g,'-')
    .normalize('NFD').replace(/[̀-ͯ]/g,'');
}

async function construireCartePertes(d){
  const map = L.map('carte-pertes', {maxBounds:BOUNDS, maxBoundsViscosity:1.0, minZoom:9, maxZoom:13}).fitBounds(BOUNDS);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:18}).addTo(map);

  const parC = {};
  d.par_commune.forEach(c => { parC[normaliserNom(c.commune)] = c.pertes; });

  try {
    const geo = await fetch('data/communes-971.geojson').then(r=>r.json());
    L.geoJSON(geo, {
      style: f => {
        const p = parC[normaliserNom(f.properties.nom)];
        return {fillColor: p!=null ? couleurPerte(p) : '#cbd5e1', weight:1, opacity:1, color:'#fff', fillOpacity: p!=null ? 0.6 : 0.25};
      },
      onEachFeature: (f, layer) => {
        const p = parC[normaliserNom(f.properties.nom)];
        layer.bindTooltip(`<b>${f.properties.nom}</b><br>${p!=null ? 'Pertes : '+p+'%' : 'Non renseigné'}<br><small>Projection</small>`);
      }
    }).addTo(map);
  } catch(e){ console.warn('GeoJSON communes indisponible', e); }

  setTimeout(() => map.invalidateSize(), 200);
}
