import { activerOnglet } from './nav.js';

export async function initEnsemble(){
  const chantiers = await fetch('data/chantiers_demo.json').then(r=>r.json());
  const dsi = chantiers.filter(c => c.si === true);
  const partiels = chantiers.filter(c => c.si === 'partiel');

  const listeDsi = items => items.map(c => `<li><b>#${c.n}</b> — ${c.titre}</li>`).join('');

  const cont = document.getElementById('onglet-ensemble');
  cont.innerHTML = `
    <h2>Travailler ensemble</h2>
    <p class="reco">Une méthode, par étapes. On commence petit et concret, on prouve, on étend.</p>
    <ol class="phases">
      <li>
        <h3>Phase 0 — Diagnostic flash du SI</h3>
        <p>Cartographie de l'existant et état des lieux, livré <b>avant l'arrivée de votre DSI</b> pour qu'il prenne ses fonctions avec une vision claire. Court, peu engageant.</p>
        <p>En premier, je cadre précisément le périmètre DSI de vos 12 chantiers :</p>
        <ul class="liste-dsi">
          ${listeDsi(dsi)}
        </ul>
        ${partiels.length ? `<p>Et les chantiers à composante SI partielle :</p><ul class="liste-dsi">${listeDsi(partiels)}</ul>` : ''}
        <p>J'inventorie aussi les briques d'<b>intelligence artificielle</b> que vous avez annoncées, pour les cadrer, les sécuriser et les rendre opérationnelles :</p>
        <ul class="liste-dsi">
          <li>IA de traitement des factures & détection d'anomalies</li>
          <li>Notifications usagers (coupures / reprises / travaux à venir)</li>
          <li>Chatbot en créole pour la relation usager</li>
          <li>Analyse des réseaux sociaux (réclamations, signaux faibles)</li>
        </ul>
        <button class="btn-demo" id="voir-demo-signal">▶ Voir le mécanisme de signalement en action</button>
      </li>
      <li>
        <h3>Phase 1 — Cahier des charges</h3>
        <p>On écrit ce qui doit être acheté ou construit, outil par outil :</p>
        <ul>
          <li><b>Centre opérationnel + écran géant</b> — livrable : spécifications fonctionnelles, architecture données, critères d'acceptation.</li>
          <li><b>Magasin / GMAO Odoo online</b> — livrable : workflow stock, réappro, traçabilité chantier.</li>
          <li><b>IA de contrôle des factures et d'anomalies</b> — livrable : périmètre de détection, règles métier, intégration comptable.</li>
          <li><b>Météo de l'eau + cartographie</b> — livrable : maquette fonctionnelle validée avec les maires.</li>
        </ul>
      </li>
      <li>
        <h3>Phase 2 — Accompagnement & pilote indexé résultat</h3>
        <p>Mise en place d'un pilote, <b>indexé sur le résultat</b> — exactement le type de contrat que vous décrivez dans votre discours :</p>
        <p><i>« Tant que je n'ai pas 10-20 % d'amélioration mesurable, vous n'êtes pas payés. »</i></p>
        <p>On définit ensemble les indicateurs (temps de réponse incident, taux de signalements résolus, ruptures de stock, etc.) et la rémunération liée à l'atteinte.</p>
      </li>
    </ol>
    <div class="idee-proposee">
      <b>💡 Idée à proposer</b> — une vue « tours d'eau » intelligente : visualiser et anticiper les rotations de distribution par secteur. À concevoir ensemble si le sujet vous intéresse.
    </div>
    <div class="cta">
      <p><b>Si la projection vous parle, parlons-en.</b></p>
      <p>Ronnie Capra — Synergy-BIM · Ingénieur VRD, BIM & SI</p>
      <p class="mention">On cadre ensemble en fonction de vos priorités et de votre budget.</p>
    </div>`;

  document.getElementById('voir-demo-signal').addEventListener('click', () => {
    activerOnglet('onglet-map');
  });
}
