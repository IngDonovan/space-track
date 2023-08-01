const PlatziSat_01 = 
  `1 88888U 24001FA  23163.94096086  .00000000  00000-0  10000-4 0  9999
  2 88888  97.5077 280.5424 0008220 228.6198 130.8530 15.11803180  1009`;
const tl1 = PlatziSat_01.split('\n')[0].trim();
const tl2 = PlatziSat_01.split('\n')[1].trim();
// console.log(tl1);
// console.log(tl2);

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

// console.log(position.longitude);// in radians
// console.log(position.latitude);// in radians
// console.log(position.height);// in km
  
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
    });
