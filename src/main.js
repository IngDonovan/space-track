const API = 'https://api.tinygs.com/v1';
const ALLSAT = '/satellites';
const ONESAT = '/satellite';
const SatsNames = [];
// let firstTime = true;
const satellitesData = [
  {
    name: 'PlatziSat-1',
    tle1: '1 88888U 24001FA  23163.94096086  .00000000  00000-0  10000-4 0  9999',
    tle2: '2 88888  97.5077 280.5424 0008220 228.6198 130.8530 15.11803180  1009',
  },
  {
    name: 'ISS',
    tle1: '1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927',
    tle2: '2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537',
  },
  // ... Add more satellites here
];
const satrec = satellite.twoline2satrec(satellitesData[0].tle1, satellitesData[0].tle2);
const satName = satellitesData[0].name;

const menuIco = document.querySelector(".menu");
const trackID = document.querySelector('#trackID');
const namesElements = document.getElementById("sateSelec");
const allButton = document.getElementById("allButton");
const searchInput = document.getElementById("searchInput")
const satelliteOptions = document.getElementById("satelliteOptions");
const searchButton = document.getElementById("searchButton");

searchInput.addEventListener('input',(event) => {
  const typedText = event.target.value.trim().toLowerCase();
  const filteredSatellites = SatsNames.filter(name => name.toLowerCase().includes(typedText));
  // console.log('Filtered Satellites:', filteredSatellites);
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
  console.log('Send Satellite Search:', typedText);
  const selectedSatellite = satellitesData.find(satellite => satellite.name === typedText);
  const platziName =  satellitesData.find(satellite => 'FossaSat-FX14' === typedText);
  if (!selectedSatellite && !platziName){
    searchSat(typedText);
  } else {
    console.log('ya está grabado');
  }
})

namesElements.addEventListener('change', (event) => {
  const selectedSatelliteName = event.target.value;
  console.log('Selected Satellite:', selectedSatelliteName);
});

allButton.addEventListener('click', () => {
  const selectedSatelliteName = namesElements.value;
  console.log('Send Satellite All:', selectedSatelliteName);
  // Buscar el satélite en el array satellitesData
  const selectedSatellite = satellitesData.find(satellite => satellite.name === selectedSatelliteName);
  const platziName =  satellitesData.find(satellite => 'FossaSat-FX14' === selectedSatelliteName);
  if (!selectedSatellite && !platziName){
    searchSat(selectedSatelliteName);
  } else {
    console.log('ya está grabado');
  }
})

menuIco.addEventListener('click', toggleMenu);
//open and close de menu && fetch Satellites names
function toggleMenu(){
  const isAsideClose = trackID.classList.contains('inactive');
  // console.log(isAsideClose);
  if (isAsideClose && (SatsNames == 0)) {
    searchSatellitesToShow();
    // console.log('Satellites Names',SatsNames); 
  }
  trackID.classList.toggle('inactive');
  if (!isAsideClose) {
    console.log('Cargando Nuevo');
    loadAllSatellites();
  }
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

        console.log('Tle',orbSat.tle[0]);
        console.log('Tle',orbSat.tle[1]);
        console.log('Tle',orbSat.tle[2]);

        satellitesData.push({
          name: nameSat,
          tle1: orbSat.tle[1],
          tle2: orbSat.tle[2],
        });

    } catch (error) {
        console.error(error);
    }
}

// const searchAllSatellites = async () => {
//   try {
//     for (const name of satelliteNames) {
//       const orbSat = await fetchData(`${API + ONESAT}/${name}`);
//       satellitesData.push({ name: orbSat.name, tle: [orbSat.tle[0], orbSat.tle[1]] });
//     }
//     // Una vez que se hayan obtenido los TLE de todos los satélites, cargamos el mapa.
//     loadMap();
//   } catch (error) {
//     console.error(error);
//   }
// };//revew-------------------

async function loadAllSatellites() {
  try {
    for (const sat of satellitesData) {
      const nameSat = sat.name;
      const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
      loadMap(satrec, nameSat);
    }
  } catch (error) {
    console.error(error);
  }
}

// -----------------------------------fromWorldTerrain()
//inicializamos el visor. Aquí pasamos algunas opciones adicionales para deshabilitar la funcionalidad que requiere un token de acceso:
const viewer = new Cesium.Viewer('cesiumContainer', {
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
    // terrain: Cesium.Terrain.fromWorldTerrain(),
    url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
  }),
  baseLayerPicker: false, 
  geocoder: false, 
  homeButton: false, 
  infoBox: false,
  navigationHelpButton: false, 
  sceneModePicker: false
});
viewer.scene.globe.enableLighting = true;
// -------------------------------------------------


async function loadMap (satrec, nameSat) {

  const date = new Date();
  const positionAndVelocity = satellite.propagate(satrec, date);
  const gmst = satellite.gstime(date);
  const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
  // console.log(position.longitude);// in radians
  // console.log(position.latitude);// in radians
  // console.log(position.height);// in km
 //---------------------------------------------------------------

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

    //-----------------
    // const satelliteEntity = new Cesium.Entity({
    //   position: positionsOverTime,
    // });
    // // Si usas un archivo PNG como ícono
    // satelliteEntity.billboard = new Cesium.BillboardGraphics({
    //   image: '../assets/SatellitePlatzi.png',
    //   width: 30,
    //   height: 30,
    // });


    // Por último, pasamos este objeto positionsOverTime a nuestro punto
    const satellitePoint = viewer.entities.add({
      position: positionsOverTime,
      label: {
        text: nameSat,
        font: "14pt monospace",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        //verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(0, 32),
      },
      point: { 
        pixelSize: 6,
        color: Cesium.Color.YELLOW 
      }
    });
    const satelliteImg = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
    billboard: {
      image: "../assets/FP_Satellite_icon.png",
      sizeInMeters: true,
    },
      
    });
    // if (firstTime) {
    //   console.log('Primera Vez',firstTime);
    //   viewer.trackedEntity = satellitePoint;
    //   firstTime = false;
    //   console.log('Ahora?',firstTime);
    // }
    // El punto se moverá según se mueva la línea de tiempo de la parte inferior. Para fijar la cámara al punto en movimiento hacemos:
    
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

