const ICONE = {normal:'🟢',coupure:'🔴',travaux:'🟠'};
export async function initMeteo(){
  const cont = document.getElementById('onglet-meteo');
  const data = await fetch('data/meteo_demo.json').then(r=>r.json());
  cont.innerHTML = `
    <h2>Météo de l'eau — vue maires & présidents</h2>
    <p class="reco">Tableau de transparence partagé aux élus : état du service par commune, horaires de coupure et de réouverture. Projection.</p>
    <div class="grille-meteo">${data.map(m=>`<article class="meteo-carte etat-${m.etat}">
      <div class="meteo-tete">${ICONE[m.etat]} <b>${m.commune}</b></div>
      <p class="meteo-etat">${m.etat.toUpperCase()}</p>
      <p class="meteo-h">${m.debut} → ${m.reouverture}</p>
      <p class="meteo-d">${m.detail}</p></article>`).join('')}</div>`;
}
