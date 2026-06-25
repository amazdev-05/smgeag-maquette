export function initEnsemble(){
  const cont = document.getElementById('onglet-ensemble');
  cont.innerHTML = `
    <h2>Travailler ensemble</h2>
    <p class="reco">Une méthode, par étapes. On commence petit et concret, on prouve, on étend.</p>
    <ol class="phases">
      <li><h3>Phase 0 — Diagnostic flash du SI</h3>
        <p>Cartographie de l'existant et état des lieux, livré <b>avant l'arrivée de votre DSI</b> pour qu'il prenne ses fonctions avec une vision claire. Court, peu engageant.</p></li>
      <li><h3>Phase 1 — Cahier des charges</h3>
        <p>Outils prioritaires : centre opérationnel, magasin / GMAO Odoo, IA de contrôle des factures. On écrit ce qui doit être acheté ou construit.</p></li>
      <li><h3>Phase 2 — Accompagnement & pilote</h3>
        <p>Mise en place d'un pilote, <b>indexé sur le résultat</b> — exactement le type de contrat que vous décrivez dans votre discours.</p></li>
    </ol>
    <div class="cta">
      <p><b>Si la projection vous parle, parlons-en.</b></p>
      <p>Ronnie Capra — Synergy-BIM · Ingénieur VRD & BIM</p>
      <p class="mention">Aucun tarif ici : on cadre ensemble en fonction de vos priorités et de votre budget.</p>
    </div>`;
}
