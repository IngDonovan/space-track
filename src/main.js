import './main.scss';
import { loadingView } from './components/loading';
import { headerView } from './components/header';
// import './components/satellite';
// import './components/wordMap';
import * as Cesium from 'cesium';
import * as satellite from 'satellite.js';

const API = 'https://api.tinygs.com/v1';
const ALLSAT = '/satellites';
const ONESAT = '/satellite';
const SatsNames = [];
// let firstTime = true;
const lisToShowSatellites = [
  {
    name: 'FossaSat-FX14',
    tle1: '1 88888U 24001FA  23163.94096086  .00000000  00000-0  10000-4 0  9999',
    tle2: '2 88888  97.5077 280.5424 0008220 228.6198 130.8530 15.11803180  1009',
  },
  // {
  //   name: 'ISS',
  //   tle1: '1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927',
  //   tle2: '2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537',
  // },
  // ... Add more satellites here
];

const satrec = satellite.twoline2satrec(lisToShowSatellites[0].tle1, lisToShowSatellites[0].tle2);
const satName = lisToShowSatellites[0].name;

// ---------------------
document.querySelector('#app').innerHTML = `
    ${loadingView}
    ${headerView}
  <aside id="trackID" class="trackMenu inactive">
    <p>Search</p>
    <div class="container">
      <input placeholder="Satellite Name" id="searchInput" list="satelliteOptions"/>
      <datalist id="satelliteOptions"></datalist>
      <picture id="searchButton">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7499 4.5C12.1641 4.5 12.4999 4.83579 12.4999 5.25V11H18.25C18.6642 11 19 11.3358 19 11.75C19 12.1642 18.6642 12.5 18.25 12.5H12.4999V18.25C12.4999 18.6642 12.1641 19 11.7499 19C11.3357 19 10.9999 18.6642 10.9999 18.25V12.5H5.25C4.83579 12.5 4.5 12.1642 4.5 11.75C4.5 11.3358 4.83579 11 5.25 11H10.9999V5.25C10.9999 4.83579 11.3357 4.5 11.7499 4.5Z" fill="currentColor"/>
          </svg>
      </picture>
    </div>
    <p>All</p>
    <div class="container">
      <select name="sateSelec" id="sateSelec">
          <!-- <option>ISS</option>
          <option>PlatziSat-1</option> -->
      </select>
    </div>
    <ul id="ShowlistExist"></ul>
    <a class="show-button" href="#">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.5564 4.61008C37.0194 4.07311 36.1488 4.07311 35.6118 4.61008C35.0748 5.14705 35.0748 6.01765 35.6118 6.55462C39.0969 10.0397 41.25 14.8503 41.25 20.1664C41.25 25.4826 39.0969 30.2932 35.6118 33.7782C35.0748 34.3152 35.0748 35.1858 35.6118 35.7228C36.1488 36.2598 37.0194 36.2598 37.5564 35.7228C41.5361 31.7431 44 26.2412 44 20.1664C44 14.0917 41.5361 8.58979 37.5564 4.61008Z" fill="currentColor"/>
        <path d="M8.3882 6.55462C8.92517 6.01765 8.92517 5.14705 8.3882 4.61008C7.85122 4.07311 6.98062 4.07311 6.44365 4.61008C2.46394 8.58979 0 14.0917 0 20.1664C0 26.2412 2.46394 31.7431 6.44365 35.7228C6.98062 36.2598 7.85122 36.2598 8.3882 35.7228C8.92517 35.1858 8.92517 34.3152 8.3882 33.7782C4.90312 30.2932 2.75 25.4826 2.75 20.1664C2.75 14.8503 4.90312 10.0397 8.3882 6.55462Z" fill="currentColor"/>
        <path d="M14.87 13.0364C15.407 12.4995 15.407 11.6289 14.87 11.0919C14.333 10.5549 13.4624 10.5549 12.9255 11.0919C10.6046 13.4128 9.16667 16.623 9.16667 20.1664C9.16667 23.7099 10.6046 26.9201 12.9255 29.241C13.4624 29.7779 14.333 29.7779 14.87 29.241C15.407 28.704 15.407 27.8334 14.87 27.2964C13.0438 25.4702 11.9167 22.9512 11.9167 20.1664C11.9167 17.3816 13.0438 14.8627 14.87 13.0364Z" fill="currentColor"/>
        <path d="M31.0745 11.0919C30.5376 10.5549 29.667 10.5549 29.13 11.0919C28.593 11.6289 28.593 12.4995 29.13 13.0364C30.9562 14.8627 32.0833 17.3816 32.0833 20.1664C32.0833 22.9512 30.9562 25.4702 29.13 27.2964C28.593 27.8334 28.593 28.704 29.13 29.241C29.667 29.7779 30.5376 29.7779 31.0745 29.241C33.3954 26.9201 34.8333 23.7099 34.8333 20.1664C34.8333 16.623 33.3954 13.4128 31.0745 11.0919Z" fill="currentColor"/>
        <path d="M25.6667 20.1667C25.6667 21.7055 24.7188 23.0229 23.375 23.5668V38.9583C23.375 39.7177 22.7594 40.3333 22 40.3333C21.2406 40.3333 20.625 39.7177 20.625 38.9583V23.5668C19.2812 23.0229 18.3333 21.7055 18.3333 20.1667C18.3333 18.1416 19.975 16.5 22 16.5C24.025 16.5 25.6667 18.1416 25.6667 20.1667Z" fill="currentColor"/>
        </svg>
      <span class="texts">
        <span class="text-1">SHOW</span>
        <span class="text-2">Satellite</span>
      </span>
    </a>
    
  </aside>
`

// -------------



const menuIco = document.querySelector(".menu");
const trackID = document.querySelector('#trackID');
const namesElements = document.getElementById("sateSelec");

const searchInput = document.getElementById("searchInput")
const satelliteOptions = document.getElementById("satelliteOptions");
const searchButton = document.getElementById("searchButton");
const ulList = document.getElementById('ShowlistExist');
const showButton = document.querySelector(".show-button");

searchInput.addEventListener('input',(event) => {
  const typedText = event.target.value.trim().toLowerCase();
  const filteredSatellites = SatsNames.filter(name => name.toLowerCase().includes(typedText));
  // Limpia las opciones previas del datalist
  satelliteOptions.innerHTML = '';
  // Agrega las opciones filtradas al datalist
  filteredSatellites.forEach(name => {
    const optionElement = document.createElement("option");
    optionElement.value = name;
    satelliteOptions.appendChild(optionElement);
  });
});

searchButton.addEventListener('click', () => {
  const typedText = searchInput.value;
  const selectedSatellite = SatsNames.find(name => name === typedText);
  if(selectedSatellite){
    console.log('Send Satellite Search:', typedText);
    searchSat(typedText);
  }
})
//lee los cambios del elemento namesElement
namesElements.addEventListener('change', (event) => {
  let selectedSatelliteName = event.target.value;
  console.log('Selected and search Satellite:', selectedSatelliteName);
  searchSat(selectedSatelliteName);
});

function addListSatellites() {
  ulList.innerHTML = '';
  lisToShowSatellites.forEach(satellite => {
    const newLiElement = document.createElement('li');
    newLiElement.textContent = satellite.name;
    ulList.appendChild(newLiElement);
  });
}
showButton.addEventListener('click', () => {
  loadAllSatellites();
});


menuIco.addEventListener('click', toggleMenu);
//open and close de menu && fetch Satellites names
function toggleMenu(){
  const isAsideClose = trackID.classList.contains('inactive');
  // console.log(isAsideClose);
  if (isAsideClose) {
    addListSatellites();
    if (SatsNames == 0) {
      searchSatellitesToShow();
      // console.log('Satellites Names',SatsNames); 
    }
  }
  trackID.classList.toggle('inactive');

}

async function fetchData(urlApi) {
    const response = await fetch(urlApi);
    const data = await response.json();
    return data;
}

const searchSatellitesToShow = async () => {
    try {
        const orbSatellites = await fetchData(`${API + ALLSAT}`);

        orbSatellites.forEach(satellite => {
            // console.log(satellite.name);
            SatsNames.push(satellite.name);
            const optionElement = document.createElement("option");
            optionElement.textContent = satellite.name;

            namesElements.appendChild(optionElement);
        });

    } catch (error){
        console.error(error);
    }
}

async function searchSat(nameSat) {
    try {
        const orbSat = await fetchData(`${API + ONESAT}/${nameSat}`);
        
        const existSatelliteIndex = lisToShowSatellites.findIndex(satellite => satellite.name === nameSat);

        if (existSatelliteIndex === -1) {
          // Si el satélite no existe en la lista, lo agregamos
          lisToShowSatellites.push({
            name: nameSat,
            tle1: orbSat.tle[1],
            tle2: orbSat.tle[2],
          });
        } else {
          // Si el satélite ya existe en la lista, lo eliminamos y luego lo agregamos nuevamente
          lisToShowSatellites.splice(existSatelliteIndex, 1); // Eliminamos el satélite existente
          lisToShowSatellites.push({ // Agregamos el satélite actualizado
            name: nameSat,
            tle1: orbSat.tle[1],
            tle2: orbSat.tle[2],
          });
        }

        console.log(lisToShowSatellites);
        addListSatellites();

    } catch (error) {
        console.error(error);
    }
}

async function loadAllSatellites() {
  try {
    for (const sat of lisToShowSatellites) {
      const nameSat = sat.name;
      const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
      loadMap(satrec, nameSat);
    }
  } catch (error) {
    console.error(error);
  }
}

const viewer = new Cesium.Viewer('cesiumContainer');
// console.log(lisToShowSatellites);
// console.log(API);


function loadMap (satrec, nameSat) {

    const date = new Date();
    const positionAndVelocity = satellite.propagate(satrec, date);
    const gmst = satellite.gstime(date);
    const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
  
    const totalSeconds = 60 * 60 * 6;
    const timestepInSeconds = 10;
    const start = Cesium.JulianDate.fromDate(new Date());
    const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.timeline.zoomTo(start, stop);
    viewer.clock.multiplier = 40;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
  
    const positionsOverTime = new Cesium.SampledPositionProperty();
  
    for (let i = 0; i < totalSeconds; i+= timestepInSeconds) {
      const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
      const jsDate = Cesium.JulianDate.toDate(time);
  
      const positionAndVelocity = satellite.propagate(satrec, jsDate);
      const gmst = satellite.gstime(jsDate);
      const p   = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
      // ...Get position from satellite-js...
      const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
      positionsOverTime.addSample(time, position);
    }
  
    // Por último, pasamos este objeto positionsOverTime a nuestro punto
    const platziName = ('FossaSat-FX14' === nameSat);
  
    let newName;
    let colorSat;
    if (!platziName) {
      newName = nameSat;
      colorSat = Cesium.Color.YELLOW;
    } else {
      newName = 'PlatziSat-1';
      colorSat = Cesium.Color.RED;
    }
    const satellitePoint = viewer.entities.add({
      position: positionsOverTime,
      label: {
        text: newName,
        font: "14pt monospace",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        //verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(0, 32),
      },
      point: { 
        pixelSize: 6,
        color: colorSat 
      }
    });

    viewer.trackedEntity = satellitePoint;
  
    let initialized = false;
    viewer.scene.globe.tileLoadProgressEvent.addEventListener(() => {
      if (!initialized && viewer.scene.globe.tilesLoaded === true) {
        viewer.clock.shouldAnimate = true;
        initialized = true;
        viewer.scene.camera.zoomOut(7000000);
        document.querySelector("#loading").classList.toggle('disappear', true)
      }
    });
          
  }
  loadMap(satrec,satName);



