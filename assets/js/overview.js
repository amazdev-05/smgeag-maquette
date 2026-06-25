const LIBELLE_ETAT = {inexistant:"N'existe pas",a_construire:"À construire",
  a_relancer:"À relancer",a_cadrer:"À cadrer",prototype:"Prototype",en_cours:"En cours"};

export async function initOverview(){
  const cont = document.getElementById('onglet-overview');
  const data = await fetch('data/chantiers_demo.json').then(r=>r.json());
  cont.innerHTML = `
    <h2>Discours de prise de fonction — les 12 chantiers nommés par M. Yacou</h2>
    <p class="overview-soustitre">D'après le discours de prise de fonction d'<b>Henri Yacou, président du SMGEAG</b> (24 juin). La moitié de ces chantiers reposent sur un système d'information que la maison n'a pas encore — le SMGEAG recrute son DSI.</p>
    <div class="audit-pitch">
      <b>C'est ici que je me positionne.</b> Sur le périmètre Système d'Information (filtre ci-dessous), je propose un <b>audit / état des lieux du SI réalisé AVANT le recrutement de votre DSI</b>. L'intérêt pour vous :
      <ul>
        <li>votre futur DSI prend ses fonctions avec une <b>cartographie précise</b> de tout l'existant au SMGEAG ;</li>
        <li>il a immédiatement des <b>directions de travail claires</b>, sans perdre 5-6 mois à découvrir le terrain ;</li>
        <li>vous sécurisez les chantiers SI les plus urgents (centre opérationnel, IA factures, magasin) dès maintenant.</li>
      </ul>
    </div>
    <div class="overview-tete">
      <div></div>
      <label class="filtre"><input type="checkbox" id="filtre-si"> Surligner le périmètre Système d'Information (DSI)</label>
    </div>
    <div class="grille-chantiers">${data.map(carteChantier).join('')}</div>`;
  document.getElementById('filtre-si').addEventListener('change', e => {
    cont.querySelectorAll('.chantier').forEach(c => {
      const si = c.dataset.si;
      const estSi = si === 'true' || si === 'partiel';
      const attenuer = e.target.checked && !estSi;
      c.classList.toggle('attenue', attenuer);
      c.classList.toggle('mis-en-avant', e.target.checked && estSi);
    });
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
