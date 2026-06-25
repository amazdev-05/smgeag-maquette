export async function initMagasin(){
  const cont = document.getElementById('onglet-magasin');
  const data = await fetch('data/magasin_demo.json').then(r=>r.json());
  cont.innerHTML = `
    <h2>Magasin de pièces — aujourd'hui inexistant</h2>
    <p class="reco">Recommandation : gestion de stock simple via <b>Odoo Inventory (online)</b> —
    suivi des seuils, réappro automatique, traçabilité des sorties chantier. Mise en place rapide, coût maîtrisé.</p>
    <table class="tbl-stock"><thead><tr><th>Réf.</th><th>Désignation</th><th>Stock</th><th>Seuil</th><th>État</th></tr></thead>
    <tbody>${data.map(p=>`<tr class="st-${p.statut}">
      <td>${p.ref}</td><td>${p.designation}</td><td>${p.stock}</td><td>${p.seuil}</td>
      <td><span class="puce">${p.statut}</span></td></tr>`).join('')}</tbody></table>
    <p class="mention">Inventaire illustratif — projection de ce que donnerait l'outil.</p>`;
}
