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

### 1.2 Bouton « Déclarer un signalement » — Niveau A (zéro backend, à faire) — À FIABILISER
> En v1 ça fonctionne mal. Reprendre proprement.
- Bouton visible sur l'onglet Carte : **« 📍 Déclarer un signalement »**.
- Au clic : petite modale → choix du type + état de l'eau → **DEUX façons de poser le point, au choix** :
  1. **« Utiliser ma position »** → `navigator.geolocation.getCurrentPosition()` (vraie géoloc).
  2. **« Placer sur la carte »** → l'utilisateur **clique directement sur la carte** pour poser le point (indispensable : beaucoup d'ordinateurs n'ont pas de géoloc — ne PAS bloquer si la géoloc échoue ou est absente).
- Résultat : une **épingle 📍 (vrai marqueur Leaflet en forme de pin)** apparaît sur la carte à l'endroit déclaré, en direct, + **nouvelle entrée en haut du feed**.
- Important : la représentation sur la **carte** doit être une **épingle/pin**, pas seulement une ligne dans le texte du feed. Le feed liste les derniers signalements ; la carte montre les pins.
- Badge près de la fonctionnalité : « Démonstration du mécanisme — signalement géolocalisé ».

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
  - **DQE prévisionnel visible AVANT de lancer** : afficher la **liste détaillée des postes** (tableau : poste · quantité · unité · prix unitaire · total), pour que le chargé d'affaires ou le président voie le chiffrage ligne à ligne. Ex. pour Grandes Ravines : installation de chantier, terrassement, fourniture/pose PEHD Ø160, réfection de voirie, essais… + total.
  - Bouton **« Lancer le DQE / consultation »** (maquette : confirme « DQE envoyé en consultation — N lignes »).
- **Stock de pièces** : étoffer un peu le tableau existant (quelques références de plus, colonnes claires).
- Données : créer `data/chantiers_communes_demo.json` (3-4 chantiers, 2-3 communes, avec le détail des lignes DQE).
- But : montrer la **valeur études de prix** (chiffrage) de Ronnie au président.

### 3.2 Onglet Météo de l'eau → carte choroplèthe par commune
- Remplacer (ou compléter) les tuiles actuelles par une **carte Leaflet où les communes sont coloriées** selon l'état du service (normal / coupure / travaux).
- Couche de polygones par-dessus le fond OSM : utiliser le **GeoJSON des communes de Guadeloupe (dépt 971)** — disponible gratuitement (ex. dépôt `gregoiredavid/france-geojson`, fichier communes du 971).
- V1 du découpage = **par commune**. Prévoir l'évolution future (sous-quartiers) sans la coder maintenant.
- Couleur de remplissage = `data/meteo_demo.json` (mapper commune → état). Tooltip au survol : commune + état + horaires.
- **Bugs v1 à corriger** :
  - La carte se charge mal → init paresseuse au 1er affichage de l'onglet + **`map.invalidateSize()`** après affichage (problème classique de conteneur masqué).
  - **Verrouiller le zoom/pan sur la Guadeloupe** : définir `maxBounds` (cadre Guadeloupe), `minZoom`/`maxZoom` serrés, `maxBoundsViscosity: 1.0` → impossible de partir trop loin ou de trop dézoomer.
- **Élu / agent référent par commune** (point du discours Yacou : « un élu référent du syndicat par commune ») : afficher, par secteur/commune, le **nom du référent SMGEAG** responsable (ex. Les Abymes → untel, Pointe-à-Pitre → untel). Données illustratives `data/referents_demo.json` (commune → nom/rôle), badge projection. Tooltip ou panneau latéral.

---

## Récap fichiers à créer / modifier

- Modifier : `assets/js/map.js` (feed + bouton signalement + géoloc + option Firebase), `data/live_demo.json` (champs type/etat_eau).
- Modifier : `assets/js/overview.js` (mention Yacou + filtre SI visible).
- Modifier : `assets/js/ensemble.js` (3 phases détaillées + lien démo).
- Modifier : `assets/js/nav.js` ou `index.html` (toggle temps réel découvrable).
- Créer : `data/chantiers_communes_demo.json` + vue chantiers dans `magasin.js`.
- Modifier : `assets/js/meteo.js` (choroplèthe) + ajouter le GeoJSON communes 971 dans `data/`.
- (Option B) Créer : `assets/js/firebase-config.js` + flag `USE_FIREBASE`.

---

# ADDENDUM — demandes complémentaires (24/06, après revue v1)

> **Scope complet validé par Ronnie (24/06).** On fait tout. Les tiers 🔴/🟠 servent d'**ordre de build**
> (faire le 🔴 d'abord, puis 🟠), pas de coupe. Seul ⚪ reste pour plus tard (à concevoir proprement).

## 🔴 CŒUR D'IMPACT (le one-shot qui « pète la gueule » — à faire en premier et impeccable)

### A. Signalement géolocalisé en direct (déjà en Priorité 1 — confirmé A+B Firebase)
- Lien partageable : Ronnie envoie un lien par WhatsApp à quelqu'un en réunion → la personne ouvre, autorise sa position, déclare un défaut → **un pin géolocalisé apparaît sur la carte de Guadeloupe en temps réel** (cross-device via Firebase).
- Afficher ces signalements reçus **sur la carte** (pins) ET dans le feed défilant.
- Étiqueter « signalement géolocalisé » (pas « WhatsApp réel »). Voir §1.1–1.3.

### B. KPI rendement réseau (le chiffre qui parle à Yacou)
- Indicateur phare : **taux de pertes ~68 % (2022) → 58 % (2025)** ; **rendement ~32-40 %** (≈ 1 L sur 3 arrive au robinet). Source : Observatoire de l'eau Guadeloupe. Badge « projection / données publiques ».
- Visualisation captation → robinet : **100 % mis en distribution → ~35 % au robinet** (schéma de déperdition entre la source/départ de distribution et les points d'arrivée).
- **Suivi de progression sur 3 ans** (programme Yacou) : jauge/courbe montrant la baisse visée des pertes (68 % → … → objectif), présentée de façon agréable. Relier explicitement au **paiement indexé des prestataires de monitoring** (« tant que pas X % d'amélioration, pas payé ») et au principe des **compteurs anonymes télérelevés** chez des abonnés témoins (présence/absence d'eau).
- **Taux de pertes par commune** (voir choroplèthe en C) + lecture **point A → point B** (source → distribution).

### C. Bandeau « cockpit » pro
- Ajouter, en tête du dashboard, un bandeau discret : **« Projection — Centre opérationnel · État de gestion du réseau »**. Donne le ton « salle de pilotage ».

### D. Densifier le réseau AEP sur la carte
- Ajouter des **ramifications schématiques** au réseau (quelques branches secondaires) pour donner de la **densité visuelle** et rendre la simulation crédible — sans sur-modéliser. Objectif = impact image, pas exactitude.

### E. Onglet « téléphone » — notifications SMGEAG aux abonnés (le vrai besoin usager)
- Panneau latéral en **forme d'écran de téléphone** affichant des messages SMGEAG qui **défilent**, façon WhatsApp reçus :
  - « ⚠️ Coupure d'eau dans 2 h secteur X — organisez-vous (remplissez vos réserves). »
  - « 💧 Reprise de l'eau prévue sur le tronçon Y dans ~1 h. »
  - « 🚧 Travaux secteur Z demain — coupures possibles dans la journée. » (préavis ≥ 2 jours)
- **Angle clé à incarner** : l'usager connaît déjà le problème d'eau ; ce qu'il veut, c'est **savoir QUAND c'est coupé pour s'organiser**. La valeur = prévisibilité.
- Données fictives dans `data/notifs_demo.json`.

## 🟠 RENFORTS (si le temps le permet avant le 1er juillet)

### F. Tuile « Agenda des travaux » (planning organisé)
- Nouvelle tuile : **planning des travaux par commune ET sur la carte**.
- Catégories filtrables (avec légende) :
  - **À venir** (date programmée, horizon 4 / 6 / 12 mois),
  - **En cours** (durée, date de fin),
  - **Effectués** (historique).
- Sur la carte : **pictogramme travaux 🚧** aux endroits concernés. Filtre par catégorie.
- Données fictives `data/travaux_demo.json` (date_debut, date_fin, statut, commune, lat, lon, intitulé).

### G. Choroplèthe « taux de pertes par commune »
- Communes coloriées selon le taux de pertes (GeoJSON communes 971, cf. §3.2). Réutilisable pour la Météo de l'eau.

## ⚪ PHASE ULTÉRIEURE (ne pas faire maintenant)
- Représentation « intelligente » des **tours d'eau** (vue dédiée) : à concevoir proprement plus tard — éviter de la bâcler.
- Découpage sous-commune / quartier.
- Vrai WhatsApp (Twilio/Meta).

## Nouveaux fichiers de données à créer
- `data/notifs_demo.json` (notifications usagers défilantes)
- `data/travaux_demo.json` (agenda travaux)
- `data/rendement_demo.json` (KPI pertes : global + par commune + série 3 ans)
- `data/referents_demo.json` (commune → élu/agent référent — voir note honnêteté ci-dessous)
- GeoJSON communes Guadeloupe (dépt 971)

## ⚠️ Note honnêteté — noms des référents
Ne PAS inventer de vrais noms de référents par commune (Yacou connaît les siens). Options sûres :
- soit un libellé générique « Référent SMGEAG — secteur X » (sans nom propre),
- soit reprendre les VP réellement cités dans le discours (Mérim Boussius, Dixi Béguident, Jean Bardet, Gabriel Foin) comme illustration,
- dans tous les cas, badge « projection / illustratif ».

## Vérification (sur l'URL publique, après push)
- Le bouton « Déclarer un signalement » pose un point réel à ta position + l'ajoute au feed, en direct.
- Filtre SI visible et fonctionnel ; Yacou cité ; 3 phases détaillées ; toggle temps réel trouvable.
- Badge projection présent partout ; aucun prix réel ; mention « signalement géolocalisé » (pas « WhatsApp réel »).
