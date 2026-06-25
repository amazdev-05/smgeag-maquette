const LIBELLE_ETAT = {inexistant:"N'existe pas",a_construire:"À construire",
  a_relancer:"À relancer",a_cadrer:"À cadrer",prototype:"Prototype",en_cours:"En cours"};

export async function initOverview(){
  const cont = document.getElementById('onglet-overview');
  const data = await fetch('data/chantiers_demo.json').then(r=>r.json());
  cont.innerHTML = `
    <div class="overview-tete">
      <h2>Les 12 chantiers de votre discours</h2>
      <label class="filtre"><input type="checkbox" id="filtre-si"> Surligner le périmètre Système d'Information</label>
    </div>
    <div class="grille-chantiers">${data.map(carteChantier).join('')}</div>`;
  document.getElementById('filtre-si').addEventListener('change', e => {
    cont.querySelectorAll('.chantier').forEach(c =>
      c.classList.toggle('attenue', e.target.checked && c.dataset.si === 'false'));
  });
}

function carteChantier(c){
  const siTag = c.si === true ? 'SI' : (c.si === 'partiel' ? 'SI partiel' : '');
  return `<article class="chantier urg-${c.urgence}" data-si="${c.si}">
    <header><span class="num">${c.n}</span>${siTag?`<span class="badge-si">${siTag}</span>`:''}</header>
    <h3>${c.titre}</h3>
    <ul class="meta">
      <li><b>État :</b> ${LIBELLE_ETAT[c.etat]||c.etat}</li>
      <li><b>Porteur :</b> ${c.porteur}</li>
      <li><b>Urgence :</b> ${c.urgence}</li>
    </ul></article>`;
}
