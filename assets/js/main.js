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

  document.getElementById('entrer').addEventListener('click', () => {
    document.getElementById('accueil').classList.remove('active');
    document.getElementById('accueil').hidden = true;
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('dashboard').hidden = false;
  });
});
