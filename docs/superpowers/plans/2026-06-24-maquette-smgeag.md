# Maquette projectionnelle SMGEAG — Plan d'implémentation

> **Pour Kimi (exécutant) :** ce plan est conçu pour être exécuté tâche par tâche.
> Chaque tâche produit un commit. Tu codes et tu pousses ; Claude ne pousse pas.
> Pense en FR dans tes raisonnements. Référence de conception :
> `docs/superpowers/specs/2026-06-24-maquette-smgeag-design.md`.

**Goal :** Bâtir un mini-site statique (la maquette projectionnelle) qui décroche un rendez-vous avec Henri Yacou (président SMGEAG), en montrant le « centre opérationnel » qu'il a décrit dans son discours.

**Architecture :** Site statique hybride — un accueil narratif d'un écran, puis un dashboard à onglets (façon centre opérationnel). HTML/CSS/JS vanilla, carte Leaflet/OSM. Données 100 % fictives, badge « projection » câblé. Hébergement GitHub Pages.

**Tech Stack :** HTML5, CSS (variables/tokens), JavaScript vanilla (ES modules), Leaflet 1.9 via CDN, données en JSON locaux. Aucun backend, aucune auth, aucun build step.

**Honnêteté (règle dure) :** toute vue avec données simulées affiche en permanence le badge « Données illustratives — projection ». Aucun prix nulle part.

**Time-box :** ~1-2 jours. Priorité non coupable : Accueil + Vue d'ensemble + Carte hero. Coupables si débordement, dans l'ordre : Météo de l'eau → Mode produit-phare → fiches détaillées.

---

## Structure de fichiers

```
smgeag-maquette/
├── index.html              # Accueil narratif + conteneur dashboard
├── assets/
│   ├── css/
│   │   └── styles.css      # Tokens couleur + layout + composants
│   └── js/
│       ├── main.js         # Bootstrap : routing accueil↔dashboard, init onglets
│       ├── nav.js          # Gestion des onglets + mode caché
│       ├── overview.js     # Onglet Vue d'ensemble (12 chantiers)
│       ├── map.js          # Onglet Carte hero (Leaflet)
│       ├── magasin.js      # Onglet Magasin de pièces
│       ├── meteo.js        # Onglet Météo de l'eau
│       ├── ensemble.js     # Onglet Travailler ensemble
│       └── live.js         # Mode produit-phare caché (WhatsApp/temps réel)
├── data/
│   ├── chantiers_demo.json # Les 12 chantiers (source de vérité du contenu)
│   ├── incidents_demo.json # Points d'incident fictifs pour la carte
│   ├── reseau_demo.json    # Tracés réseau schématiques (polylignes)
│   ├── magasin_demo.json   # Inventaire pièces fictif
│   ├── meteo_demo.json     # États travaux par zone
│   └── live_demo.json      # Remontées WhatsApp fictives
├── docs/superpowers/...    # spec + ce plan
├── .gitignore
└── README.md
```

**Vérification :** ce projet n'a pas de runner de tests automatisés (maquette front jetable). Chaque tâche se vérifie en **ouvrant `index.html` dans un navigateur** (ou via un serveur statique `python -m http.server`) et en contrôlant des éléments DOM précis. Note : `fetch()` de JSON local exige un serveur — lancer `python -m http.server 8000` depuis la racine et ouvrir `http://localhost:8000`.

---

### Task 1 : Scaffold du projet

**Files :**
- Create: `index.html`, `assets/css/styles.css`, `assets/js/main.js`, `.gitignore`, `README.md`

- [ ] **Step 1 : Créer `.gitignore`**

```
.DS_Store
Thumbs.db
node_modules/
*.log
```

- [ ] **Step 2 : Créer `README.md`**

```markdown
# Maquette projectionnelle SMGEAG
Démonstration (appât commercial) pour décrocher un RDV avec le président du SMGEAG.
Site statique : ouvrir via `python -m http.server 8000` puis http://localhost:8000
**Toutes les données sont fictives (projection).** Aucun prix affiché.
Conception : docs/superpowers/specs/2026-06-24-maquette-smgeag-design.md
```

- [ ] **Step 3 : Créer `index.html`** avec le conteneur accueil + dashboard (sections vides pour l'instant), Leaflet en CDN, et le badge projection global.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SMGEAG — Centre opérationnel (projection)</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <div id="badge-projection">Données illustratives — projection</div>

  <main id="accueil" class="vue active">
    <!-- rempli en Task 2 -->
  </main>

  <div id="dashboard" class="vue" hidden>
    <nav id="tabs"><!-- rempli en Task 3 --></nav>
    <section id="onglet-overview" class="onglet"></section>
    <section id="onglet-map" class="onglet" hidden></section>
    <section id="onglet-magasin" class="onglet" hidden></section>
    <section id="onglet-meteo" class="onglet" hidden></section>
    <section id="onglet-ensemble" class="onglet" hidden></section>
    <section id="onglet-live" class="onglet" hidden></section>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script type="module" src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4 : Créer `assets/css/styles.css`** avec les tokens et le badge.

```css
:root{
  --bleu:#0a4d8c; --bleu-clair:#1c7fd6; --eau:#2bb3c0;
  --alerte:#e2574c; --ok:#2e9e5b; --intervention:#e7a13a;
  --fond:#f4f7fa; --carte:#ffffff; --texte:#11243a; --gris:#6b7c8f;
  --radius:10px; --ombre:0 2px 10px rgba(17,36,58,.08);
}
*{box-sizing:border-box}
body{margin:0;font-family:system-ui,Segoe UI,Roboto,sans-serif;color:var(--texte);background:var(--fond)}
.vue{min-height:100vh}
.vue:not(.active){display:none}
#badge-projection{position:fixed;top:10px;right:10px;z-index:9999;
  background:var(--alerte);color:#fff;font-size:12px;font-weight:600;
  padding:5px 10px;border-radius:999px;box-shadow:var(--ombre)}
```

- [ ] **Step 5 : Créer `assets/js/main.js`** (squelette qui révèle l'accueil).

```js
// Bootstrap. Le routing accueil↔dashboard est ajouté en Task 3.
document.addEventListener('DOMContentLoaded', () => {
  console.log('Maquette SMGEAG — projection. Toutes données fictives.');
});
```

- [ ] **Step 6 : Vérifier** — lancer `python -m http.server 8000`, ouvrir http://localhost:8000. Attendu : page avec le badge rouge « Données illustratives — projection » en haut à droite, fond clair, aucune erreur console.

- [ ] **Step 7 : Commit**

```bash
git add .
git commit -m "chore: scaffold maquette SMGEAG (structure, tokens, badge projection)"
```

---

### Task 2 : Accueil narratif

**Files :**
- Modify: `index.html` (#accueil), `assets/css/styles.css`

- [ ] **Step 1 : Remplir `#accueil`** dans `index.html`.

```html
<section class="hero-accueil">
  <p class="kicker">Discours de prise de fonction — 24 juin</p>
  <h1>Vous avez nommé 12 chantiers.<br>La moitié reposent sur un système d'information<br>que la maison n'a pas encore.</h1>
  <p class="sous">Vous recrutez votre DSI. Voici, en maquette, le centre opérationnel que vous décrivez — l'étage au-dessus de votre carte des tours d'eau.</p>
  <button id="entrer" class="btn-primaire">Entrer dans le centre opérationnel →</button>
  <p class="mention">Démonstration. Toutes les données sont illustratives.</p>
</section>
```

- [ ] **Step 2 : Styler** l'accueil dans `styles.css`.

```css
.hero-accueil{max-width:820px;margin:0 auto;padding:14vh 24px;text-align:center}
.kicker{color:var(--bleu-clair);font-weight:600;letter-spacing:.04em;text-transform:uppercase;font-size:13px}
.hero-accueil h1{font-size:clamp(24px,4vw,40px);line-height:1.2;margin:.4em 0}
.sous{color:var(--gris);font-size:18px;max-width:620px;margin:0 auto 2em}
.btn-primaire{background:var(--bleu);color:#fff;border:0;border-radius:var(--radius);
  padding:14px 26px;font-size:16px;font-weight:600;cursor:pointer}
.btn-primaire:hover{background:var(--bleu-clair)}
.mention{color:var(--gris);font-size:12px;margin-top:1.6em}
```

- [ ] **Step 3 : Vérifier** — recharger. Attendu : titre, sous-titre, bouton bleu « Entrer dans le centre opérationnel ». (Le clic n'agit pas encore — Task 3.)

- [ ] **Step 4 : Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "feat: accueil narratif (accroche discours + bouton entrer)"
```

---

### Task 3 : Shell dashboard + navigation onglets + routing

**Files :**
- Modify: `index.html` (#tabs), `assets/css/styles.css`
- Create: `assets/js/nav.js`; Modify: `assets/js/main.js`

- [ ] **Step 1 : Remplir `#tabs`** dans `index.html` (l'onglet `live` est volontairement absent de la barre — il est caché, voir Task 9).

```html
<button class="tab active" data-cible="onglet-overview">Vue d'ensemble</button>
<button class="tab" data-cible="onglet-map">Carte Guadeloupe</button>
<button class="tab" data-cible="onglet-magasin">Magasin de pièces</button>
<button class="tab" data-cible="onglet-meteo">Météo de l'eau</button>
<button class="tab" data-cible="onglet-ensemble">Travailler ensemble</button>
```

- [ ] **Step 2 : Styler** la barre d'onglets et le dashboard.

```css
#dashboard{display:flex;flex-direction:column;min-height:100vh}
#tabs{display:flex;flex-wrap:wrap;gap:4px;background:var(--bleu);padding:10px 14px}
.tab{background:transparent;color:#cfe2f5;border:0;padding:10px 14px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600}
.tab:hover{background:rgba(255,255,255,.1);color:#fff}
.tab.active{background:#fff;color:var(--bleu)}
.onglet{padding:24px;flex:1}
.onglet[hidden]{display:none}
```

- [ ] **Step 3 : Créer `assets/js/nav.js`**.

```js
export function activerOnglet(cibleId){
  document.querySelectorAll('.onglet').forEach(o => o.hidden = (o.id !== cibleId));
  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('active', t.dataset.cible === cibleId));
  document.dispatchEvent(new CustomEvent('onglet:active', {detail:{cibleId}}));
}

export function initNav(){
  document.querySelectorAll('.tab').forEach(tab =>
    tab.addEventListener('click', () => activerOnglet(tab.dataset.cible)));
}
```

- [ ] **Step 4 : Mettre à jour `assets/js/main.js`** pour le routing accueil↔dashboard.

```js
import { initNav } from './nav.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Maquette SMGEAG — projection. Toutes données fictives.');
  initNav();
  document.getElementById('entrer').addEventListener('click', () => {
    document.getElementById('accueil').classList.remove('active');
    document.getElementById('accueil').hidden = true;
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('dashboard').hidden = false;
  });
});
```

- [ ] **Step 5 : Vérifier** — recharger, cliquer « Entrer ». Attendu : l'accueil disparaît, le dashboard apparaît, la barre bleue d'onglets s'affiche, cliquer chaque onglet bascule la section active (sections encore vides). Aucune erreur console.

- [ ] **Step 6 : Commit**

```bash
git add index.html assets/css/styles.css assets/js/nav.js assets/js/main.js
git commit -m "feat: shell dashboard + navigation onglets + routing accueil"
```

---

### Task 4 : Onglet Vue d'ensemble — les 12 chantiers

**Files :**
- Create: `data/chantiers_demo.json`, `assets/js/overview.js`; Modify: `main.js`, `styles.css`

- [ ] **Step 1 : Créer `data/chantiers_demo.json`** (source de vérité, reprise du §5.2 de la spec).

```json
[
  {"n":1,"titre":"Contrat pluriannuel d'objectifs + contrat financier d'urgence (juil.→déc. 2026)","etat":"a_construire","porteur":"Présidence / élus","urgence":"haute","si":false},
  {"n":2,"titre":"Magasin de pièces (stock réparations canalisations) — inexistant","etat":"inexistant","porteur":"Exploitation","urgence":"haute","si":true},
  {"n":3,"titre":"Relance continuité service eau potable (zones rurales/économiques)","etat":"a_relancer","porteur":"Direction + Département","urgence":"moyenne","si":false},
  {"n":4,"titre":"Distribution d'eau de crise organisée (artisans, fonds solidarité)","etat":"a_construire","porteur":"Affaires sociales","urgence":"moyenne","si":false},
  {"n":5,"titre":"Rapprochement clients : élu référent + agents-interface par commune","etat":"a_construire","porteur":"Communes","urgence":"moyenne","si":"partiel"},
  {"n":6,"titre":"Gestion RH du transfert de personnel communes ↔ syndicat","etat":"a_cadrer","porteur":"RH","urgence":"moyenne","si":false},
  {"n":7,"titre":"Pôle médiation + métrologie compteurs (fracture facture)","etat":"a_construire","porteur":"Direction clientèle","urgence":"moyenne","si":"partiel"},
  {"n":8,"titre":"Chèque eau (modèle chèque énergie, avec la CAF)","etat":"a_construire","porteur":"Social / CAF","urgence":"basse","si":false},
  {"n":9,"titre":"Carte SOLID'O (solidarité usagers)","etat":"prototype","porteur":"Présidence","urgence":"basse","si":"partiel"},
  {"n":10,"titre":"Modèle de gestion quantifié/chiffré pour anticiper + prix solidaire","etat":"a_construire","porteur":"Direction","urgence":"haute","si":true},
  {"n":11,"titre":"Logiciel réseau + centre opérationnel + écran géant (contrat indexé résultat)","etat":"en_cours","porteur":"Direction technique","urgence":"haute","si":true},
  {"n":12,"titre":"Création DSI + IA factures/anomalies + SMS usager + météo de l'eau + SIG","etat":"inexistant","porteur":"DSI (à recruter)","urgence":"haute","si":true}
]
```

- [ ] **Step 2 : Créer `assets/js/overview.js`** — rend les tuiles + un filtre « périmètre SI ».

```js
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
```

- [ ] **Step 3 : Styler** la grille.

```css
.overview-tete{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.filtre{font-size:14px;color:var(--bleu);font-weight:600;cursor:pointer}
.grille-chantiers{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:16px}
.chantier{background:var(--carte);border-radius:var(--radius);box-shadow:var(--ombre);padding:14px;border-left:4px solid var(--gris);transition:opacity .2s}
.chantier.urg-haute{border-left-color:var(--alerte)}
.chantier.urg-moyenne{border-left-color:var(--intervention)}
.chantier.urg-basse{border-left-color:var(--ok)}
.chantier.attenue{opacity:.25}
.chantier header{display:flex;justify-content:space-between;align-items:center}
.chantier .num{background:var(--bleu);color:#fff;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:13px}
.badge-si{background:var(--eau);color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px}
.chantier h3{font-size:15px;margin:.5em 0}
.chantier .meta{list-style:none;padding:0;margin:0;font-size:13px;color:var(--gris)}
.chantier .meta b{color:var(--texte)}
```

- [ ] **Step 4 : Brancher dans `main.js`** — importer et appeler `initOverview()` après `initNav()`.

```js
import { initOverview } from './overview.js';
// ... dans le DOMContentLoaded, après initNav():
initOverview();
```

- [ ] **Step 5 : Vérifier** — entrer dans le dashboard. Attendu : 12 tuiles numérotées, bordure colorée selon urgence, badge « SI » sur les chantiers 2,10,11,12 (et « SI partiel » sur 5,7,9). Cocher le filtre → les chantiers non-SI s'atténuent.

- [ ] **Step 6 : Commit**

```bash
git add data/chantiers_demo.json assets/js/overview.js assets/js/main.js assets/css/styles.css
git commit -m "feat: onglet vue d'ensemble (12 chantiers + filtre périmètre SI)"
```

---

### Task 5 : Onglet Carte hero (Leaflet)

**Files :**
- Create: `data/incidents_demo.json`, `data/reseau_demo.json`, `assets/js/map.js`; Modify: `main.js`, `styles.css`

- [ ] **Step 1 : Créer `data/incidents_demo.json`** (points fictifs, coords plausibles Guadeloupe).

```json
[
  {"zone":"Pointe-à-Pitre centre","type":"Fuite réseau","statut":"panne","lat":16.241,"lon":-61.534},
  {"zone":"Les Abymes — Grand Camp","type":"Coupure programmée","statut":"intervention","lat":16.271,"lon":-61.510},
  {"zone":"Le Gosier","type":"Pression faible","statut":"intervention","lat":16.206,"lon":-61.491},
  {"zone":"Baie-Mahault — Jarry","type":"Casse canalisation","statut":"panne","lat":16.250,"lon":-61.566},
  {"zone":"Sainte-Anne","type":"Rétabli","statut":"resolu","lat":16.226,"lon":-61.380},
  {"zone":"Le Moule","type":"Tour d'eau actif","statut":"intervention","lat":16.331,"lon":-61.348},
  {"zone":"Basse-Terre centre","type":"Fuite détectée","statut":"panne","lat":15.998,"lon":-61.726},
  {"zone":"Petit-Bourg","type":"Rétabli","statut":"resolu","lat":16.190,"lon":-61.591}
]
```

- [ ] **Step 2 : Créer `data/reseau_demo.json`** (polylignes schématiques illustratives).

```json
[
  {"nom":"Adducteur Grande-Terre","points":[[16.241,-61.534],[16.271,-61.510],[16.331,-61.348],[16.226,-61.380]]},
  {"nom":"Liaison Jarry–Gosier","points":[[16.250,-61.566],[16.241,-61.534],[16.206,-61.491]]},
  {"nom":"Réseau Basse-Terre","points":[[15.998,-61.726],[16.190,-61.591]]}
]
```

- [ ] **Step 3 : Créer `assets/js/map.js`** — init paresseuse (Leaflet n'aime pas un conteneur caché ; init au premier affichage de l'onglet).

```js
const COULEUR = {panne:'#e2574c',intervention:'#e7a13a',resolu:'#2e9e5b'};
let carteInitialisee = false;

export function initMapLazy(){
  document.addEventListener('onglet:active', e => {
    if(e.detail.cibleId === 'onglet-map' && !carteInitialisee){
      carteInitialisee = true;
      construireCarte();
    }
  });
}

async function construireCarte(){
  const cont = document.getElementById('onglet-map');
  cont.innerHTML = `<div class="map-tete"><h2>Centre opérationnel — état du réseau (projection)</h2>
    <p class="map-legende">
      <span class="pastille" style="--c:#e2574c"></span>Panne
      <span class="pastille" style="--c:#e7a13a"></span>Intervention
      <span class="pastille" style="--c:#2e9e5b"></span>Rétabli</p></div>
    <div id="carte"></div>`;
  const map = L.map('carte').setView([16.20,-61.52],10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {attribution:'© OpenStreetMap',maxZoom:18}).addTo(map);
  const reseau = await fetch('data/reseau_demo.json').then(r=>r.json());
  reseau.forEach(r => L.polyline(r.points,{color:'#1c7fd6',weight:3,dashArray:'6 6',opacity:.7})
    .bindTooltip(r.nom).addTo(map));
  const incidents = await fetch('data/incidents_demo.json').then(r=>r.json());
  incidents.forEach(i => L.circleMarker([i.lat,i.lon],
    {radius:9,color:'#fff',weight:2,fillColor:COULEUR[i.statut],fillOpacity:.9})
    .bindPopup(`<b>${i.zone}</b><br>${i.type}<br><i>${i.statut}</i><br><small>Donnée illustrative</small>`)
    .addTo(map));
}
```

- [ ] **Step 4 : Styler** la carte.

```css
#carte{height:60vh;min-height:360px;border-radius:var(--radius);box-shadow:var(--ombre)}
.map-tete{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.map-legende{font-size:13px;color:var(--gris);display:flex;gap:14px;align-items:center;margin:0}
.pastille{width:12px;height:12px;border-radius:50%;background:var(--c);display:inline-block;margin-right:5px}
```

- [ ] **Step 5 : Brancher dans `main.js`** — importer et appeler `initMapLazy()` dans le DOMContentLoaded.

```js
import { initMapLazy } from './map.js';
// ... initMapLazy();  (avant ou après initOverview, peu importe)
```

- [ ] **Step 6 : Vérifier** — entrer, cliquer « Carte Guadeloupe ». Attendu : carte OSM centrée sur la Guadeloupe, 3 tracés bleus pointillés, 8 pastilles colorées (rouge/orange/vert), clic sur une pastille → popup avec « Donnée illustrative ». La carte se dessine correctement (pas de tuiles grises tronquées) car init au premier affichage.

- [ ] **Step 7 : Commit**

```bash
git add data/incidents_demo.json data/reseau_demo.json assets/js/map.js assets/js/main.js assets/css/styles.css
git commit -m "feat: onglet carte hero (Leaflet + réseau schématique + incidents fictifs)"
```

---

### Task 6 : Onglet Magasin de pièces (reco Odoo + inventaire fictif)

**Files :**
- Create: `data/magasin_demo.json`, `assets/js/magasin.js`; Modify: `main.js`, `styles.css`

- [ ] **Step 1 : Créer `data/magasin_demo.json`**.

```json
[
  {"ref":"PVC-110","designation":"Tube PVC Ø110 (ml)","stock":12,"seuil":40,"statut":"critique"},
  {"ref":"VAN-DN80","designation":"Vanne fonte DN80","stock":5,"seuil":8,"statut":"bas"},
  {"ref":"COL-110","designation":"Collier de réparation Ø110","stock":63,"seuil":30,"statut":"ok"},
  {"ref":"CMP-15","designation":"Compteur DN15","stock":140,"seuil":100,"statut":"ok"},
  {"ref":"RAC-MUL","designation":"Raccord multi-matériaux","stock":7,"seuil":25,"statut":"critique"}
]
```

- [ ] **Step 2 : Créer `assets/js/magasin.js`**.

```js
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
```

- [ ] **Step 3 : Styler**.

```css
.reco{background:#eaf4fb;border-left:4px solid var(--bleu-clair);padding:12px 14px;border-radius:8px;max-width:760px}
.tbl-stock{width:100%;border-collapse:collapse;margin-top:16px;background:var(--carte);box-shadow:var(--ombre);border-radius:var(--radius);overflow:hidden}
.tbl-stock th,.tbl-stock td{padding:10px 12px;text-align:left;border-bottom:1px solid #eef2f6;font-size:14px}
.tbl-stock th{background:var(--bleu);color:#fff}
.puce{font-size:12px;font-weight:700;padding:2px 8px;border-radius:999px;color:#fff;background:var(--ok)}
.st-bas .puce{background:var(--intervention)}
.st-critique .puce{background:var(--alerte)}
```

- [ ] **Step 4 : Brancher dans `main.js`** — `import { initMagasin }` + appel.

- [ ] **Step 5 : Vérifier** — onglet « Magasin de pièces ». Attendu : encart reco Odoo, tableau 5 lignes, puces colorées (critique rouge, bas orange, ok vert).

- [ ] **Step 6 : Commit**

```bash
git add data/magasin_demo.json assets/js/magasin.js assets/js/main.js assets/css/styles.css
git commit -m "feat: onglet magasin de pieces (reco Odoo + inventaire fictif)"
```

---

### Task 7 : Onglet Météo de l'eau (coupable si débordement)

**Files :**
- Create: `data/meteo_demo.json`, `assets/js/meteo.js`; Modify: `main.js`, `styles.css`

- [ ] **Step 1 : Créer `data/meteo_demo.json`**.

```json
[
  {"commune":"Les Abymes","etat":"coupure","debut":"06:00","reouverture":"14:00","detail":"Tour d'eau secteur Grand Camp"},
  {"commune":"Le Gosier","etat":"normal","debut":"-","reouverture":"-","detail":"Service nominal"},
  {"commune":"Baie-Mahault","etat":"travaux","debut":"08:00","reouverture":"17:00","detail":"Réparation casse Jarry"},
  {"commune":"Le Moule","etat":"coupure","debut":"05:00","reouverture":"12:00","detail":"Tour d'eau programmé"},
  {"commune":"Basse-Terre","etat":"travaux","debut":"07:30","reouverture":"16:00","detail":"Recherche de fuite"}
]
```

- [ ] **Step 2 : Créer `assets/js/meteo.js`**.

```js
const ICONE = {normal:'🟢',coupure:'🔴',travaux:'🟠'};
export async function initMeteo(){
  const cont = document.getElementById('onglet-meteo');
  const data = await fetch('data/meteo_demo.json').then(r=>r.json());
  cont.innerHTML = `
    <h2>Météo de l'eau — vue maires & présidents</h2>
    <p class="reco">Tableau de transparence partagé aux élus : état du service par commune, horaires de coupure et de réouverture. Projection.</p>
    <div class="grille-meteo">${data.map(m=>`<article class="meteo-carte etat-${m.etat}">
      <div class="meteo-tete">${ICONE[m.etat]} <b>${m.commune}</b></div>
      <p class="meteo-etat">${m.etat.toUpperCase()}</p>
      <p class="meteo-h">${m.debut} → ${m.reouverture}</p>
      <p class="meteo-d">${m.detail}</p></article>`).join('')}</div>`;
}
```

- [ ] **Step 3 : Styler**.

```css
.grille-meteo{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;margin-top:16px}
.meteo-carte{background:var(--carte);border-radius:var(--radius);box-shadow:var(--ombre);padding:14px;border-top:4px solid var(--ok)}
.meteo-carte.etat-coupure{border-top-color:var(--alerte)}
.meteo-carte.etat-travaux{border-top-color:var(--intervention)}
.meteo-etat{font-weight:700;font-size:13px;margin:.4em 0}
.meteo-h{font-family:monospace;color:var(--bleu)}
.meteo-d{color:var(--gris);font-size:13px;margin:0}
```

- [ ] **Step 4 : Brancher dans `main.js`** + appel `initMeteo()`.

- [ ] **Step 5 : Vérifier** — onglet « Météo de l'eau ». Attendu : 5 cartes commune, icône couleur selon état, horaires début→réouverture.

- [ ] **Step 6 : Commit**

```bash
git add data/meteo_demo.json assets/js/meteo.js assets/js/main.js assets/css/styles.css
git commit -m "feat: onglet meteo de l'eau (transparence elus, projection)"
```

---

### Task 8 : Onglet Travailler ensemble (3 phases, SANS prix, CTA)

**Files :**
- Create: `assets/js/ensemble.js`; Modify: `main.js`, `styles.css`

- [ ] **Step 1 : Créer `assets/js/ensemble.js`** — contenu en dur (pas de JSON, contenu éditorial). RAPPEL : aucun chiffre, aucun prix.

```js
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
```

- [ ] **Step 2 : Styler**.

```css
.phases{list-style:none;counter-reset:p;padding:0;max-width:760px}
.phases li{counter-increment:p;background:var(--carte);box-shadow:var(--ombre);border-radius:var(--radius);padding:16px 16px 16px 56px;position:relative;margin-bottom:12px}
.phases li::before{content:counter(p);position:absolute;left:14px;top:16px;background:var(--bleu);color:#fff;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-weight:700}
.phases h3{margin:.1em 0 .3em}
.cta{margin-top:20px;background:var(--bleu);color:#fff;padding:18px;border-radius:var(--radius);max-width:760px}
.cta .mention{color:#cfe2f5}
```

- [ ] **Step 3 : Brancher dans `main.js`** + appel `initEnsemble()`.

- [ ] **Step 4 : Vérifier** — onglet « Travailler ensemble ». Attendu : 3 phases numérotées, encart CTA bleu, mention « Aucun tarif ici ». Contrôle dur : **aucun chiffre de prix nulle part** dans la page.

- [ ] **Step 5 : Commit**

```bash
git add assets/js/ensemble.js assets/js/main.js assets/css/styles.css
git commit -m "feat: onglet travailler ensemble (3 phases sans prix + CTA)"
```

---

### Task 9 : Mode produit-phare caché (activable sur commande)

**Files :**
- Create: `data/live_demo.json`, `assets/js/live.js`; Modify: `index.html` (tab live), `nav.js`, `main.js`, `styles.css`

- [ ] **Step 1 : Ajouter dans `#tabs`** (`index.html`) un onglet `live` masqué par défaut.

```html
<button class="tab tab-cache" data-cible="onglet-live" id="tab-live" hidden>● Temps réel</button>
```

- [ ] **Step 2 : Créer `data/live_demo.json`** (remontées WhatsApp fictives).

```json
[
  {"h":"02:14","tel":"+590 6•• •• 41 22","msg":"Pa dlo Grand Camp depi yè oswa","lat":16.272,"lon":-61.509},
  {"h":"02:31","tel":"+590 6•• •• 88 07","msg":"Toujou pa dlo Gosier bord-de-mer","lat":16.205,"lon":-61.493},
  {"h":"03:02","tel":"+590 6•• •• 12 55","msg":"Coupure Jarry zone industrielle","lat":16.249,"lon":-61.565}
]
```

- [ ] **Step 3 : Créer `assets/js/live.js`** — révèle l'onglet + rend un faux flux temps réel (apparition progressive).

```js
export function initLive(){
  // Activation cachée : touche Ctrl+Shift+L ou ?live dans l'URL
  const reveler = () => {
    document.getElementById('tab-live').hidden = false;
    construireLive();
  };
  if(location.search.includes('live')) reveler();
  document.addEventListener('keydown', e => {
    if(e.ctrlKey && e.shiftKey && e.key.toLowerCase()==='l') reveler();
  });
}

async function construireLive(){
  const cont = document.getElementById('onglet-live');
  if(cont.dataset.pret) return;
  cont.dataset.pret = '1';
  const data = await fetch('data/live_demo.json').then(r=>r.json());
  cont.innerHTML = `<h2>Remontée terrain temps réel — WhatsApp géolocalisé</h2>
    <p class="reco">Mode démonstration : un numéro unique reçoit les signalements « pa dlo », géolocalisés et reportés sur la carte. Données fictives.</p>
    <div id="flux-live" class="flux-live"></div>`;
  const flux = document.getElementById('flux-live');
  data.forEach((m,idx)=>setTimeout(()=>{
    const el=document.createElement('div');
    el.className='msg-live';
    el.innerHTML=`<span class="msg-h">${m.h}</span> <b>${m.tel}</b><br>${m.msg}
      <span class="msg-geo">📍 ${m.lat.toFixed(3)}, ${m.lon.toFixed(3)}</span>`;
    flux.prepend(el);
  }, idx*900));
}
```

- [ ] **Step 4 : Styler**.

```css
.tab-cache{background:var(--eau)!important;color:#fff!important}
.flux-live{max-width:560px;display:flex;flex-direction:column;gap:10px;margin-top:14px}
.msg-live{background:var(--carte);box-shadow:var(--ombre);border-left:4px solid var(--eau);border-radius:8px;padding:10px 12px;font-size:14px;animation:apparait .3s}
.msg-h{color:var(--bleu);font-family:monospace}
.msg-geo{display:block;color:var(--gris);font-size:12px;margin-top:4px}
@keyframes apparait{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
```

- [ ] **Step 5 : Brancher dans `main.js`** + appel `initLive()`.

- [ ] **Step 6 : Vérifier** — dans le dashboard, l'onglet « ● Temps réel » est **absent** par défaut. Appuyer `Ctrl+Shift+L` (ou ajouter `?live` à l'URL) → l'onglet apparaît en couleur eau ; le sélectionner montre les 3 messages qui s'égrènent. Recharger sans le raccourci → de nouveau caché.

- [ ] **Step 7 : Commit**

```bash
git add data/live_demo.json assets/js/live.js index.html assets/js/main.js assets/css/styles.css
git commit -m "feat: mode produit-phare cache (remontee WhatsApp temps reel, activable sur commande)"
```

---

### Task 10 : Finitions — responsive, badge global, déploiement GitHub Pages

**Files :**
- Modify: `styles.css`, `README.md`

- [ ] **Step 1 : Ajouter le responsive** en fin de `styles.css`.

```css
@media (max-width:640px){
  #tabs{overflow-x:auto;flex-wrap:nowrap}
  .tab{white-space:nowrap}
  .onglet{padding:16px}
  #badge-projection{font-size:11px;padding:4px 8px}
}
```

- [ ] **Step 2 : Vérifier le badge projection** est visible sur **tous** les onglets (il est global dans `index.html`, donc OK) — contrôle visuel en parcourant chaque onglet, y compris le mode live.

- [ ] **Step 3 : Vérifier l'ensemble du parcours** en local : accueil → entrer → chaque onglet → mode caché. Aucune erreur console. Tous les `fetch` aboutissent (serveur statique lancé).

- [ ] **Step 4 : Déployer sur GitHub Pages.**

```bash
git push -u origin main
# Puis sur GitHub : Settings → Pages → Source = branch main / root → Save.
# Vérifier que Leaflet (CDN) et les fetch JSON (chemins relatifs) fonctionnent sur l'URL Pages.
```

- [ ] **Step 5 : Noter l'URL Pages dans `README.md`** et commit.

```bash
git add README.md
git commit -m "docs: url GitHub Pages de la maquette"
git push
```

- [ ] **Step 6 : Vérification finale sur l'URL publique** — ouvrir l'URL Pages dans un navigateur (et sur mobile) : parcours complet OK, carte chargée, badge présent partout, aucun prix, mode caché caché. C'est le lien à coller dans le message LinkedIn à Yacou.

---

## Auto-revue (faite)

- **Couverture spec :** Accueil (T2), dashboard hybride (T3), 12 chantiers + filtre SI (T4), carte hero Leaflet (T5), magasin Odoo (T6), météo de l'eau (T7), travailler ensemble sans prix (T8), mode produit-phare caché (T9), honnêteté/badge + déploiement (T1/T10). Paysage existant (§3bis) reflété dans l'accroche accueil (« l'étage au-dessus de votre carte des tours d'eau »). ✓
- **Placeholders :** aucun — code complet par étape. ✓
- **Cohérence des noms :** `activerOnglet`/événement `onglet:active` utilisés en T3/T5/T9 ; ids `onglet-*` constants ; fonctions `init*` toutes branchées dans `main.js`. ✓
- **Prix :** explicitement exclu, contrôle dur en T8 step 4. ✓
