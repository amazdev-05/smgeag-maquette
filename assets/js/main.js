import { initNav } from './nav.js';
import { initOverview } from './overview.js';
import { initMapLazy } from './map.js';
import { initMagasin } from './magasin.js';
import { initMeteo } from './meteo.js';
import { initEnsemble } from './ensemble.js';
import { initLive } from './live.js';
import { initPertes } from './pertes.js';
import { initAgenda } from './agenda.js';
import { initNotifs } from './notifs.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Maquette SMGEAG — projection. Toutes données fictives.');
  initNav();
  initMapLazy();
  initLive();
  initNotifs();

  await Promise.all([
    initOverview(),
    initMagasin(),
    initMeteo(),
    initEnsemble(),
    initPertes(),
    initAgenda()
  ]);

  // Centre opérationnel = l'ensemble du site : on ouvre directement le dashboard, toutes tuiles visibles.
  const accueil = document.getElementById('accueil');
  if(accueil){ accueil.classList.remove('active'); accueil.hidden = true; }
  const dash = document.getElementById('dashboard');
  dash.classList.add('active');
  dash.hidden = false;
});
