import './main.scss';
import { loadingView } from './components/loading';
import { headerView } from './components/header';
import { menuBarView } from './components/menuBar';
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
    ${menuBarView}
`;

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
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjIyZTdiZi1mODQwLTQ0MjAtOWNlNS1lYTViMDc2OTlmYmQiLCJpZCI6MTU4MTU2LCJpYXQiOjE2OTEwMjQxMTl9.7otDjsYgAlZeullEThcZ8fKanHGXv0Lo2jAn6po1u3E';
const viewer = new Cesium.Viewer('cesiumContainer',{

// Hide the base layer picker
  baseLayerPicker: false, 
  geocoder: false, 
  homeButton: false, 
  infoBox: false,
  navigationHelpButton: false, 
  sceneModePicker: false
});
viewer.scene.globe.enableLighting = true;
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
      billboard: {
        image: "/SateVertic.png",
        show:true,
        width: 64,
        height: 64,
      },
      label: {
        text: newName,
        backgroundColor:Cesium.Color.WHITE,
        fillColor:Cesium.Color.WHITE,
        font: "small-caps bold 24px/1 sans-serif",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 3,
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



