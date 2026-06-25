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
