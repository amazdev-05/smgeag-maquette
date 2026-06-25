export async function initMagasin(){
  const cont = document.getElementById('onglet-magasin');
  const stock = await fetch('data/magasin_demo.json').then(r=>r.json());
  const communes = await fetch('data/chantiers_communes_demo.json').then(r=>r.json());

  cont.innerHTML = `
    <h2>Magasin de pièces & chantiers par commune</h2>
    <p class="reco">Recommandation : gestion de stock simple via <b>Odoo Inventory (online)</b> —
    suivi des seuils, réappro automatique, traçabilité des sorties chantier. Complété par une vue chantiers par commune (façon études de prix).</p>
    <div class="magasin-sections">
      <button class="active" data-section="stock">Stock pièces</button>
      <button data-section="communes">Chantiers par commune</button>
    </div>
    <div id="section-stock">${renderStock(stock)}</div>
    <div id="section-communes" hidden>${renderCommunes(communes)}</div>
    <div id="modale-dqe" class="modale" hidden>
      <div class="modale-contenu">
        <h3>DQE généré — projection</h3>
        <div id="dqe-detail"></div>
        <div class="modale-actions">
          <button id="btn-fermer-dqe" class="btn-primaire">Fermer</button>
        </div>
      </div>
    </div>`;

  cont.querySelectorAll('.magasin-sections button').forEach(btn => {
    btn.addEventListener('click', () => {
      cont.querySelectorAll('.magasin-sections button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cont.querySelector('#section-stock').hidden = btn.dataset.section !== 'stock';
      cont.querySelector('#section-communes').hidden = btn.dataset.section !== 'communes';
    });
  });

  cont.querySelectorAll('.btn-petit').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = parseInt(e.target.dataset.idx,10);
      const c = communes[idx];
      const lignes = c.lignes.map(l => `<tr><td>${l.designation}</td><td>${l.unite}</td><td>${l.qte}</td></tr>`).join('');
      document.getElementById('dqe-detail').innerHTML = `
        <p><b>${c.commune} — ${c.nom}</b></p>
        <p>${c.detail}</p>
        <table class="tbl-stock"><thead><tr><th>Désignation</th><th>Unité</th><th>Qté</th></tr></thead><tbody>${lignes}</tbody></table>
        <p class="prix-estimatif">Prix prévisionnel total (estimatif — projection) : ${c.prix_previsionnel.toLocaleString('fr-FR')} €</p>`;
      document.getElementById('modale-dqe').hidden = false;
    });
  });

  document.getElementById('btn-fermer-dqe').addEventListener('click', () => {
    document.getElementById('modale-dqe').hidden = true;
  });
}

function renderStock(data){
  return `
    <h3>Stock pièces — aujourd'hui inexistant</h3>
    <table class="tbl-stock"><thead><tr><th>Réf.</th><th>Désignation</th><th>Stock</th><th>Seuil</th><th>État</th></tr></thead>
    <tbody>${data.map(p=>`<tr class="st-${p.statut}">
      <td>${p.ref}</td><td>${p.designation}</td><td>${p.stock}</td><td>${p.seuil}</td>
      <td><span class="puce">${p.statut}</span></td></tr>`).join('')}</tbody></table>
    <p class="mention">Inventaire illustratif — projection de ce que donnerait l'outil.</p>`;
}

function renderCommunes(data){
  return `
    <h3>Chantiers par commune — vue études de prix</h3>
    <div class="grille-communes">${data.map((c,idx)=>`
      <article class="carte-commune">
        <h4>${c.commune}</h4>
        <div class="ligne-chantier">
          <b>${c.nom}</b>
          <p>${c.detail}</p>
          <span class="prix-estimatif">Prix prévisionnel : ${c.prix_previsionnel.toLocaleString('fr-FR')} €</span>
          <button class="btn-petit" data-idx="${idx}">Lancer un DQE / consultation</button>
        </div>
      </article>`).join('')}</div>
    <p class="mention">Données chiffrées fictives — projection à vocation illustrative.</p>`;
}
