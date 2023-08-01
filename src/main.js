const menuIco = document.querySelector('.menu');
const trackID = document.querySelector('#trackID');

console.log(selectElement);

menuIco.addEventListener('click', toggleMenu);

function toggleMenu(){
  const isAsideClose = trackID.classList.contains('inactive');
  // console.log(isAsideClose);
  if (isAsideClose && (SatsNames == 0)) {
    searchSatellites(API);
    console.log('Satellites Names',SatsNames);

  }
  trackID.classList.toggle('inactive');
}


