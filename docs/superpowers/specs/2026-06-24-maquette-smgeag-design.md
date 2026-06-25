# Maquette projectionnelle SMGEAG — « hameçon Yacou »

**Date :** 2026-06-24
**Auteur :** Ronnie Capra (Synergy-BIM) + Claude
**Statut :** Design validé, prêt pour plan d'implémentation

---

## 1. Objectif

Décrocher un **rendez-vous** avec Henri Yacou, nouveau président du SMGEAG
(Syndicat Mixte de Gestion de l'Eau et de l'Assainissement de la Guadeloupe),
en vue d'une **prestation d'audit / accompagnement SI** au moment où il recrute
son DSI.

La maquette est **l'appât assumé**. Ce qui se vend ensuite, c'est
l'accompagnement (diagnostic SI pré-DSI, cahier des charges, pilote indexé
résultat). La maquette ne vend pas un logiciel et ne prétend pas être un
produit fini.

**Source :** discours de prise de fonction de Yacou (24 juin), transcrit dans
`S:\...\JOB-HUNTING V3\2026-06_010 henri yacou smgeag\Transcription(base).md`.
Dans ce discours il annonce « 12 choses », dont la moitié relèvent d'un
système d'information **qu'il n'a pas encore** (« il n'y a pas de directeur des
systèmes d'information dans cette maison… il est parti »).

## 2. Message porté (sans jamais l'écrire frontalement)

> « J'ai écouté votre discours de prise de fonction. Vous avez nommé 12
> chantiers. La moitié relèvent d'un système d'information que vous n'avez pas
> encore — vous recrutez justement votre DSI. Voici, en maquette, comment je
> vois le centre opérationnel que vous décrivez, et le travail d'audit qui le
> rendrait possible. »

## 3. Principe d'honnêteté (non négociable)

- **Aucune donnée réelle.** Tout incident / chiffre / point sur carte est
  fictif.
- **Badge « données illustratives — projection » visible en permanence** sur
  toute vue contenant des données simulées.
- On ne prétend jamais disposer de données opérationnelles du SMGEAG.
- **Aucun prix dans la maquette.** Le tarif se discute uniquement de vive voix,
  après contact, une fois le budget du client connu (voir §8).

## 3bis. Paysage numérique existant (à connaître, à dépasser)

Le SMGEAG et son écosystème ont déjà des outils — la maquette doit se poser
**au-dessus**, jamais en doublon :

- **Carte des tours d'eau** (smgeag.fr) : **PDF statique hebdomadaire**
  (commune / section / jours / horaires de distribution). Figé, orienté usager.
- **Observatoire de l'eau de Guadeloupe** (cartothèque) : ~175 cartes
  thématiques + quelques cartos dynamiques, réalisées par le prestataire
  **Koredge**. Carto **administrative / infrastructure** (avancement PPI), pas
  un centre opérationnel.

**Le trou (= notre positionnement) :** personne n'offre le **cockpit
opérationnel temps réel** (incidents live, remontée terrain, dispatch des
équipes) que Yacou décrit. Notre maquette se présente comme **« l'étage
au-dessus de votre carte des tours d'eau »** — ce qui prouve qu'on connaît
l'existant et qu'on apporte des **solutions-actions**, pas de l'analyse.

## 4. Architecture (hybride : narratif + dashboard)

Site statique mono-projet, hébergé sur **GitHub Pages**, lien partageable.

```
Accueil narratif (1 écran)
   │  « Discours du 24 juin → 12 chantiers → la moitié = un SI absent »
   │  [ Bouton : Entrer dans le centre opérationnel ]
   ▼
Dashboard à onglets (façon écran géant / centre opérationnel)
   ├── Vue d'ensemble    → 12 chantiers en tuiles + filtre « périmètre SI »
   ├── Carte Guadeloupe  → HERO : Leaflet/OSM + réseau schématique + incidents fictifs
   ├── Magasin de pièces → tuile-reco « stock canalisations → Odoo online » (maquette d'inventaire faux)
   ├── Météo de l'eau    → vue transparence maires/présidents (état travaux, dates coupure/réouverture)
   └── Travailler ensemble → méthode d'audit en 3 phases, SANS chiffres, + CTA contact

   [ Mode produit-phare : CACHÉ, activable sur commande ]
      → remontée WhatsApp géolocalisée « temps réel » + circulation eau (données bidon)
      → non affiché d'emblée ; Ronnie le révèle quand il veut en réunion
```

## 5. Composants détaillés

### 5.1 Accueil narratif
Un seul écran. Accroche reprenant le discours, transition vers le dashboard.
Court, sobre, se lit seul. Bouton d'entrée bien visible.

### 5.2 Vue d'ensemble — les 12 chantiers
Chaque chantier = une tuile avec, pour chacun :
`Existe / N'existe pas` · `Qui le porte` · `Niveau d'urgence`.
Un **filtre/surlignage « périmètre SI / Data (mon positionnement) »** met en
avant les chantiers où Ronnie se pose en prestataire.

Les 12 chantiers extraits du discours (à figer tels quels) :

| # | Chantier | Périmètre SI ? |
|---|----------|----------------|
| 1 | Contrat pluriannuel d'objectifs de gestion + contrat financier d'urgence (juil.→déc. 2026, trésorerie critique) | Non |
| 2 | Fonds de solidarité « O » + **magasin de pièces inexistant** (stock réparations canalisations) | **Oui** (GMAO/Odoo) |
| 3 | Relance continuité service eau potable (régies, zones rurales/économiques), avec le département | Non |
| 4 | Distribution d'eau de crise organisée (artisans/boulangers), fonds solidarité | Non |
| 5 | Rapprochement clients : élu référent + agents-interface par commune | Partiel |
| 6 | Gestion RH du transfert de personnel communes ↔ syndicat | Non |
| 7 | Pôle médiation + médiateur ; fracture facture ; métrologie compteurs | Partiel |
| 8 | Chèque eau (modèle chèque énergie, avec la CAF) | Non |
| 9 | Carte SOLID'O (solidarité usagers) | Partiel |
| 10 | Modèle de gestion organisationnelle quantifié/chiffré pour anticiper + prix solidaire fournisseur | **Oui** (data) |
| 11 | **Logiciel de gestion réseau + centre opérationnel + écran géant** (contrat fournisseur indexé résultat) | **Oui** |
| 12 | **Création DSI** + IA traitement factures/anomalies + SMS usager + chatbot créole + météo de l'eau + liaison SIG/GLC + remplacement directeur financier (contrôle interne) | **Oui** |

### 5.3 Carte Guadeloupe (HERO)
- Fond de carte réel : **Leaflet + tuiles OpenStreetMap** (gratuit).
- Surcouche : tracés réseau **schématiques** (illustratifs) + **points
  d'incident fictifs** (couleurs par statut : panne / intervention / résolu).
- Clic sur un point → mini-fiche fictive (zone, type, statut).
- Badge « données illustratives — projection » permanent.
- Objectif secondaire : faire ressortir la **fibre VRD** de Ronnie (lecture
  réseau).

### 5.4 Magasin de pièces
Tuile-recommandation + maquette d'un inventaire (faux) : présenter l'angle
**Odoo online** comme solution simple de gestion de stock des pièces de
réparation. Non construit — illustration de la reco.

### 5.5 Météo de l'eau
Vue de transparence destinée aux maires/présidents : état des travaux par zone,
dates de coupure/réouverture. En projection. Coupable en priorité si time-box
déborde.

### 5.6 Mode produit-phare (caché)
Activable sur commande (bouton/raccourci discret, non affiché par défaut).
Révèle : remontée **WhatsApp géolocalisée** d'usagers sans eau « en temps réel »
+ visualisation circulation de l'eau. **Données entièrement bidon**, badge
projection. Ronnie décide quand le montrer en réunion.

### 5.7 Travailler ensemble
Présente la **méthode d'audit en 3 phases — SANS aucun chiffre** :
- **Phase 0 — Diagnostic flash SI** : cartographie de l'existant, état des lieux
  pour le futur DSI. Porte d'entrée courte et peu risquée.
- **Phase 1 — Cahier des charges** : outils prioritaires (centre opérationnel,
  magasin/GMAO Odoo, IA factures).
- **Phase 2 — Accompagnement / pilote** indexé résultat (le contrat que Yacou a
  lui-même décrit dans son discours).

CTA : inviter Yacou à **contacter Ronnie**. Pas de prix, pas de jours-homme.

## 6. Tech & rôles

- Site **statique** : HTML / CSS / JS vanilla + **Leaflet** pour la carte.
- Données fictives en fichiers locaux (JSON), clairement nommés `*_demo` /
  `*_fictif`.
- Hébergement : **GitHub Pages**, repo dans `C:\__amazdevwork\smgeag-maquette`.
- **Kimi code et pousse** (commits + push). Claude produit la spec et le
  cadrage, ne pousse pas.
- Honnêteté câblée dans le composant d'affichage : tout jeu de données simulé
  porte le badge projection au niveau du composant, pas en option.

## 7. Périmètre / YAGNI (time-box ~1-2 jours de build Kimi)

**Priorité (ne jamais couper) :** Accueil narratif + Vue d'ensemble + Carte
hero.

**Nice-to-have (coupables dans cet ordre si ça déborde) :** Météo de l'eau →
Mode produit-phare WhatsApp → fiches détaillées des tuiles.

**Hors périmètre :** toute vraie ingestion de données, tout backend, toute
authentification, toute intégration SIG/GLC réelle, tout pipeline WhatsApp réel.

## 8. Stratégie commerciale (note interne — PAS dans la maquette)

- Aucun prix affiché. Yacou contacte → on cherche **d'abord son budget** → on
  fait une proposition **adaptée**.
- Positionnement prix : « juste assez cher pour qu'il dise oui », sans tirer sur
  la corde (contexte de trésorerie tendue du syndicat ; ne pas être cher comme
  Artelia).
- Canal de contact (vue 1%) — **éviter les canaux usagers** (n° unique
  0590 41 33 33, formulaire, adresse réclamations Jarry) où le pitch se noie :
  - **Primaire : LinkedIn** — profil `henri-yacou-1a919463` (~121 relations,
    ancien directeur CGSS, juriste). Message court + lien maquette.
  - **Renfort : courrier** — *Monsieur le Président Henri Yacou, SMGEAG, Route
    de Blanchard, CS 80 002, 97190 Le Gosier*.
  - **Entourage cité** possible : Patrick Zivane (CAF), VPs (Béguident, Bardet).
- Levier d'accroche : Yacou aime explicitement les **contrats indexés résultat**
  (« tant que je n'ai pas 10-20 % d'amélioration, vous n'êtes pas payés ») —
  cohérent avec la Phase 2.

## 9. Critères de succès

- La maquette tient sur un lien partageable, s'ouvre sans installation.
- Elle prouve, en < 2 min de navigation, que Ronnie a écouté le discours et
  pense comme un DSI.
- Elle ne contient aucune affirmation factuellement fausse (tout est étiqueté
  projection).
- Elle se termine sur un appel clair à contacter Ronnie.
