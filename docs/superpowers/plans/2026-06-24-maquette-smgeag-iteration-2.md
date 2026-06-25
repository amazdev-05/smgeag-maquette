# Maquette SMGEAG — Itération 2 (brief pour Kimi)

> **Contexte :** la v1 est en ligne (https://amazdev-05.github.io/smgeag-maquette/). Bon socle.
> Cette itération = polish ciblé + le moment héro (signalement géolocalisé en direct).
> **Time-box : 1-2 jours.** Si ça déborde, on coupe la Priorité 3 avant la 1 et la 2.
> Règle d'or maintenue : **toutes données fictives**, badge « projection » partout, **aucun prix réel revendiqué**, et le mode signalement est étiqueté « signalement géolocalisé » (PAS « WhatsApp réel »).

---

## PRIORITÉ 1 — LE MOMENT HÉRO : signalement géolocalisé en direct (onglet Carte Guadeloupe)

C'est l'élément qui décroche le RDV. À rendre impeccable.

### 1.1 Feed défilant des signalements
- Sur l'onglet Carte, ajouter un panneau latéral (ou sous la carte sur mobile) : **flux des derniers signalements**, le plus récent en haut.
- Chaque entrée affiche : **heure** · **type** · **état de l'eau** · position.
- Types de signalement : `Coupure d'eau`, `Pas d'eau à l'arrivée`, `Eau revenue à HHhMM`.
- État de l'eau (badge couleur) : `Claire`, `Trouble`, `Marron`, `Odeur`.
- Pré-remplir avec les 3-4 signalements fictifs de `data/live_demo.json` (enrichir le JSON avec les champs `type` et `etat_eau`).
- Chaque signalement = aussi un point sur la carte (couleur selon statut panne/intervention/rétabli, déjà en place — à garder).

### 1.2 Bouton « Déclarer un signalement » — Niveau A (zéro backend, à faire)
- Bouton visible sur l'onglet Carte : **« 📍 Déclarer un signalement »**.
- Au clic : petite modale → choix du type + état de l'eau → bouton « Envoyer ma position ».
- Utiliser `navigator.geolocation.getCurrentPosition()` pour récupérer la **vraie** position de l'appareil.
- Résultat : un **nouveau point réel** sur la carte (animation d'apparition) + **nouvelle entrée en haut du feed**, en direct.
- Fallback si géoloc refusée : permettre un clic sur la carte pour poser le point manuellement.
- Badge near the feature : « Démonstration du mécanisme — signalement géolocalisé ».

### 1.3 Niveau B — cross-device temps réel via Firebase (VALIDÉ — à faire)
- Objectif : le téléphone de Ronnie écrit, le **grand écran** (autre appareil) voit le point apparaître en temps réel. C'est l'effet salle recherché.
- **Pré-requis Ronnie** : créer un projet Firebase (console.firebase.google.com), activer Realtime Database en mode test, copier la config web (apiKey, databaseURL, etc.) dans `assets/js/firebase-config.js`. Kimi peut guider pas à pas.
- Implémentation : **Firebase Realtime Database** (offre gratuite, pas de serveur à héberger).
  - Créer un projet Firebase, activer Realtime Database en mode test.
  - Le formulaire 1.2 écrit un enregistrement `{heure, type, etat_eau, lat, lon}` dans la DB.
  - La carte s'abonne (`onValue`) et ajoute les points/feed en live.
- Garder le Niveau A en fallback si Firebase non configuré (variable de config `USE_FIREBASE`).
- **Ne pas faire** le vrai WhatsApp (Twilio/Meta) : hors périmètre, c'est la Phase 2.

---

## PRIORITÉ 2 — Polish pas cher (vrais quick wins)

### 2.1 Onglet Vue d'ensemble
- **Citer l'auteur du discours** : afficher en tête « D'après le discours de prise de fonction d'**Henri Yacou, président du SMGEAG** (24 juin) ».
- **Filtre / surlignage du périmètre SI (DSI)** : vérifier qu'il fonctionne (il semble absent en v1). Le rendre **visible et actif** : une case « Surligner le périmètre Système d'Information (DSI) » qui met en avant les chantiers `si: true` / `si: "partiel"` et atténue les autres. Données déjà dans `data/chantiers_demo.json`.

### 2.2 Onglet Travailler ensemble
- **Détailler les 3 phases** (plus de substance, « dans la tête du président ») :
  - **Phase 0 — Diagnostic flash du SI** : afficher **la liste des chantiers du périmètre DSI** (réutiliser les entrées `si: true` de `chantiers_demo.json`) → « voici précisément ce que je cartographie en premier ». Montre que la Phase 0 est concrète et reliée à la Vue d'ensemble.
  - **Phase 1 — Cahier des charges** : lister les outils prioritaires (centre opérationnel, magasin/GMAO Odoo, IA contrôle factures) avec une ligne de livrable chacun.
  - **Phase 2 — Accompagnement & pilote indexé résultat** : reprendre les mots de Yacou (« tant que pas X % d'amélioration, pas payé »).
- **Lien vers la démo signalement** depuis la Phase 0 (bouton/toggle « voir le mécanisme en action » → bascule sur l'onglet Carte ou ouvre le mode temps réel).
- **Aucun prix.**

### 2.3 Mode temps réel — toggle découvrable
- Aujourd'hui activable seulement par `Ctrl+Shift+L`. Ajouter un **toggle discret mais trouvable** (ex. petit bouton « ● Temps réel » dans un coin du dashboard) pour que Ronnie l'active facilement devant le client.

---

## PRIORITÉ 3 — Vrais modules (time-boxés, fictifs mais convaincants)

> Si le temps manque, ces deux-là passent en dernier. Faire « crédible », pas exhaustif.

### 3.1 Onglet Magasin → vue « Chantiers par commune » (façon Hudu)
- Ajouter, à côté du stock pièces, une vue **chantiers rangés par commune**.
- Chaque chantier = une fiche, ex. :
  - **Le Gosier — Grandes Ravines : Réhabilitation AEP**
  - Sous-détail : installation de chantier, réduction PEHD Nopo Tab 160, terrassement, pose canalisation, réfection…
  - **Prix prévisionnel** (fictif, badge « estimatif — projection »), façon Patrimoine & Travaux.
  - Bouton **« Lancer un DQE / consultation »** (maquette : ouvre une modale « DQE généré — N lignes » fictive).
- Données : créer `data/chantiers_communes_demo.json` (3-4 chantiers, 2-3 communes).
- But : montrer la **valeur études de prix** (chiffrage) de Ronnie au président.

### 3.2 Onglet Météo de l'eau → carte choroplèthe par commune
- Remplacer (ou compléter) les tuiles actuelles par une **carte Leaflet où les communes sont coloriées** selon l'état du service (normal / coupure / travaux).
- Couche de polygones par-dessus le fond OSM : utiliser le **GeoJSON des communes de Guadeloupe (dépt 971)** — disponible gratuitement (ex. dépôt `gregoiredavid/france-geojson`, fichier communes du 971).
- V1 du découpage = **par commune**. Prévoir l'évolution future (sous-quartiers) sans la coder maintenant.
- Couleur de remplissage = `data/meteo_demo.json` (mapper commune → état). Tooltip au survol : commune + état + horaires.

---

## Récap fichiers à créer / modifier

- Modifier : `assets/js/map.js` (feed + bouton signalement + géoloc + option Firebase), `data/live_demo.json` (champs type/etat_eau).
- Modifier : `assets/js/overview.js` (mention Yacou + filtre SI visible).
- Modifier : `assets/js/ensemble.js` (3 phases détaillées + lien démo).
- Modifier : `assets/js/nav.js` ou `index.html` (toggle temps réel découvrable).
- Créer : `data/chantiers_communes_demo.json` + vue chantiers dans `magasin.js`.
- Modifier : `assets/js/meteo.js` (choroplèthe) + ajouter le GeoJSON communes 971 dans `data/`.
- (Option B) Créer : `assets/js/firebase-config.js` + flag `USE_FIREBASE`.

## Vérification (sur l'URL publique, après push)
- Le bouton « Déclarer un signalement » pose un point réel à ta position + l'ajoute au feed, en direct.
- Filtre SI visible et fonctionnel ; Yacou cité ; 3 phases détaillées ; toggle temps réel trouvable.
- Badge projection présent partout ; aucun prix réel ; mention « signalement géolocalisé » (pas « WhatsApp réel »).
