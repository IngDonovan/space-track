let tl0 ='PlatziSat-1';
let tl1 ='1 88888U 24001FA  23163.94096086  .00000000  00000-0  10000-4 0  9999';
let tl2 ='2 88888  97.5077 280.5424 0008220 228.6198 130.8530 15.11803180  1009';
const API = 'https://api.tinygs.com/v1';
const ALLSAT = '/satellites';
const ONESAT = '/satellite';
const SatsNames = [];
let newTl0 = '';
let newTl1 = '';
let newTl2 = '';
const satellitesData = [
  {
    name: 'PlatziSat-1',
    tle1: '1 88888U 24001FA  23163.94096086  .00000000  00000-0  10000-4 0  9999',
    tle2: '2 88888  97.5077 280.5424 0008220 228.6198 130.8530 15.11803180  1009',
  },
  {
    name: 'Norby-2',
    tle1: '1 57181U 23091R   23214.09222394  .00004444  00000+0  33119-3 0  9995',
    tle2: '2 57181  97.6618 264.4411 0019931 129.3314 230.9682 15.03254832  5333',
  },
  // ... Add more satellites here
];

const menuIco = document.querySelector('.menu');
const trackID = document.querySelector('#trackID');
const namesElements = document.getElementById("sateSelec");
const allButton = document.getElementById("allButton");

allButton.addEventListener('click', () => {
  console.log('click');
  searchSat(API, 'FEES');
})

menuIco.addEventListener('click', toggleMenu);
//open and close de menu && fetch Satellites names
function toggleMenu(){
  const isAsideClose = trackID.classList.contains('inactive');
  // console.log(isAsideClose);
  if (isAsideClose && (SatsNames == 0)) {
    searchSatellites(API);
    // console.log('Satellites Names',SatsNames); 
  }
  trackID.classList.toggle('inactive');
  if (!isAsideClose) {
    console.log('loadAll');
    loadAllSatellites();
  }
}

async function fetchData(urlApi) {
    const response = await fetch(urlApi);
    const data = await response.json();
    return data;
}

const searchSatellites = async (urlApi) => {
    try {
        const orbSatellites = await fetchData(`${urlApi + ALLSAT}`);

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


async function searchSat(urlApi, nameSat) {
    try {
        const orbSat = await fetchData(`${urlApi + ONESAT}/${nameSat}`);
        // const tle = `${orbSat.tle[1]}\n${orbSat.tle[2]}`;
        // tl0 = `${orbSat.tle[0]}`
        // tl1 = `${orbSat.tle[1]}`;
        // tl2 = `${orbSat.tle[2]}`;
        // newTl0 = `${orbSat.tle[0]}`
        // newTl1 = `${orbSat.tle[1]}`;
        // newTl2 = `${orbSat.tle[2]}`;
        console.log('Tle',orbSat.tle[0]);
        console.log('Tle',orbSat.tle[1]);
        console.log('Tle',orbSat.tle[2]);
          //console.log(tle);
        //loadMap(orbSat.tle[1],orbSat.tle[2]);
        satellitesData.push({
          name: nameSat,
          tle1: orbSat.tle[1],
          tle2: orbSat.tle[2],
        });
    } catch (error) {
        console.error(error);
    }
}

const searchAllSatellites = async () => {
  try {
    for (const name of satelliteNames) {
      const orbSat = await fetchData(`${API + ONESAT}/${name}`);
      satellitesData.push({ name: orbSat.name, tle: [orbSat.tle[0], orbSat.tle[1]] });
    }
    // Una vez que se hayan obtenido los TLE de todos los satélites, cargamos el mapa.
    loadMap();
  } catch (error) {
    console.error(error);
  }
};//revew-------------------

async function loadAllSatellites() {
  try {
    for (const sat of satellitesData) {
      const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
      loadMap(satrec);
    }
  } catch (error) {
    console.error(error);
  }
}

// searchSatellites(API);
// searchSat(API, 'Norbi');

// -----------------------------------
//inicializamos el visor. Aquí pasamos algunas opciones adicionales para deshabilitar la funcionalidad que requiere un token de acceso:
const viewer = new Cesium.Viewer('cesiumContainer', {
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
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


async function loadMap (satrec) {
  // console.log('TLE');
  // console.log(newTl1);
  // console.log(newTl2);
  // const satrec = satellite.twoline2satrec(newTl1,newTl2);
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
      // billboard: {
      //   image: "../assets/SatellitePlatzi.png",
      //   width: 64,
      //   height: 64,
      // },
      label: {
        text: tl0,
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

    // El punto se moverá según se mueva la línea de tiempo de la parte inferior. Para fijar la cámara al punto en movimiento hacemos:
    viewer.trackedEntity = satellitePoint;
    // viewer.trackedEntity = satelliteEntity;

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
const satrec = satellite.twoline2satrec(satellitesData[0].tle1, satellitesData[0].tle2);
loadMap(satrec);

// -----------------------------------
/*
// const PlatziSat_01 = 
//   `1 88888U 24001FA  23163.94096086  .00000000  00000-0  10000-4 0  9999
//   2 88888  97.5077 280.5424 0008220 228.6198 130.8530 15.11803180  1009`;
// const tl1 = PlatziSat_01.split('\n')[0].trim();
// const tl2 = PlatziSat_01.split('\n')[1].trim();
console.log(tl0);
console.log(tl1);
console.log(tl2);
// Inicializar el registro de satélite con este TLE
const satrec = satellite.twoline2satrec(tl1,tl2);
// console.log(satrec);

//Obtener la posición del satélite en la fecha dada
const date = new Date();
// console.log(date);

const positionAndVelocity = satellite.propagate(satrec, date);
// console.log(positionAndVelocity);

const gmst = satellite.gstime(date);
// console.log(gmst);

const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

console.log(position.longitude);// in radians
console.log(position.latitude);// in radians
console.log(position.height);// in km
  
//-----------------------------------------\

// Inicialice el visor Cesium.
// Luego inicializamos el visor. Aquí pasamos algunas opciones adicionales para deshabilitar la funcionalidad que requiere un token de acceso:
const viewer = new Cesium.Viewer('cesiumContainer', {
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
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

//Finalmente, visualizaremos la posición del satélite como un punto rojo en el espacio:
// const satellitePoint = viewer.entities.add({
//   position: Cesium.Cartesian3.fromRadians(
//     position.longitude, 
//     position.latitude, 
//     position.height * 1000
//   ),
//   point: { 
//     pixelSize: 5, 
//     color: Cesium.Color.RED }
// });

// Proporcione a SatelliteJS los TLE y una hora específica..
// Recuperar una longitud, latitud, altura (km).
// Vamos a generar una posición cada 10 segundos desde ahora hasta dentro de 6 segundos.
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

//Creamos un SampledPositionProperty. Se trata de un objeto que contendrá muestras de posición a lo largo del tiempo e interpolará entre ellas
const positionsOverTime = new Cesium.SampledPositionProperty();
// Hacemos un bucle a través de cuantas muestras queramos obtener, y para cada muestra, construimos un objeto de tiempo, llamado JulianDate en CesiumJS, y una posición, y lo añadimos como una muestra::
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
const satellitePoint = viewer.entities.add({
  position: positionsOverTime,
  point: { pixelSize: 6, color: Cesium.Color.YELLOW }
});

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
    });*/
