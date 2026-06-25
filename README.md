# Maquette projectionnelle SMGEAG

Démonstration (appât commercial) pour décrocher un RDV avec le président du SMGEAG.

**URL publique (GitHub Pages) :** https://amazdev-05.github.io/smgeag-maquette/

Site statique : ouvrir via `python -m http.server 8080` puis http://localhost:8000

**Toutes les données sont fictives (projection).** Aucun prix affiché.

## Itération 2 — ce qui est livré

- **Signalement géolocalisé en direct** sur l'onglet Carte : feed défilant + bouton « Déclarer un signalement » avec géolocalisation réelle + fallback clic sur la carte.
- **Mode temps réel découvrable** : bouton discret « ● Temps réel » dans la barre d'onglets (en plus du raccourci `Ctrl+Shift+L` et du paramètre `?live`).
- **Polish Vue d'ensemble** : citation d'Henri Yacou + filtre SI fonctionnel et visible.
- **Travailler ensemble enrichi** : 3 phases détaillées, périmètre DSI cartographié dans la Phase 0, lien vers la démo signalement.
- **Magasin de pièces** : onglet complété par une vue « chantiers par commune » avec DQE fictif.
- **Météo de l'eau** : carte choroplèthe des communes de Guadeloupe (découpage 971) coloriées selon l'état du service.

## Firebase (Niveau B — temps réel cross-device)

Pour activer la synchronisation cross-device via Firebase Realtime Database :

1. Créer un projet sur https://console.firebase.google.com
2. Activer **Realtime Database** en mode test
3. Copier la config web dans `assets/js/firebase-config.js`
4. Passer `USE_FIREBASE` à `true`

Tant que `USE_FIREBASE` est `false`, la maquette fonctionne en mode local (fallback Niveau A).

Conception : `docs/superpowers/specs/2026-06-24-maquette-smgeag-design.md`
Plan itération 2 : `docs/superpowers/plans/2026-06-24-maquette-smgeag-iteration-2.md`
