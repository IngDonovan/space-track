const menuIco = document.querySelector('.menu');
const trackID = document.querySelector('#trackID');

console.log(menuIco);
console.log(trackID);
menuIco.addEventListener('click', toggleMenu);


function toggleMenu(){
  const isAsideClose = trackID.classList.contains('inactive');
  console.log(isAsideClose);
  trackID.classList.toggle('inactive');
}
