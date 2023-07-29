  // // Inicializamos el mapa en una ubicación y nivel de zoom específicos
  // var mymap = L.map('map').setView([51.505, -0.09], 13);

  // // Añadimos una capa de mapa base de OpenStreetMap
  // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(mymap);

  // // Añadimos un marcador en una ubicación específica
  // var marker = L.marker([51.5, -0.09]).addTo(mymap);

  // // Añadimos un círculo en otra ubicación
  // var circle = L.circle([51.508, -0.11], {
  //   color: 'red',
  //   fillColor: '#f03',
  //   fillOpacity: 0.5,
  //   radius: 500
  // }).addTo(mymap);

  // // Añadimos un polígono con coordenadas específicas
  // var polygon = L.polygon([
  //   [51.509, -0.08],
  //   [51.503, -0.06],
  //   [51.51, -0.047]
  // ]).addTo(mymap);

  // // Añadimos un popup a los marcadores y al polígono
  // marker.bindPopup("¡Hola! Soy un marcador.").openPopup();
  // circle.bindPopup("¡Hola! Soy un círculo.");
  // polygon.bindPopup("¡Hola! Soy un polígono.");

const ISS_TLE = 
  `1 88888U 24001FA  23163.94096086  .00000000  00000-0  10000-4 0  9999
  2 88888  97.5077 280.5424 0008220 228.6198 130.8530 15.11803180  1009`;
const tl1 = ISS_TLE.split('\n')[0].trim();
const tl2 = ISS_TLE.split('\n')[1].trim();
console.log(tl1);
console.log(tl2);

const satrec = satellite.twoline2satrec(tl1,tl2);
console.log(satrec);

// Get the position of the satellite at the given date
const date = new Date();
console.log(date);

const positionAndVelocity = satellite.propagate(satrec, date);
console.log(positionAndVelocity);

const gmst = satellite.gstime(date);
console.log(gmst);

const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

console.log(position.longitude);// in radians
console.log(position.latitude);// in radians
console.log(position.height);// in km
  
//-----------------------------------------\

// Initialize the Cesium viewer.
const viewer = new Cesium.Viewer('cesiumContainer', {
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
    url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
  }),
  baseLayerPicker: false, geocoder: false, homeButton: false, infoBox: false,
  navigationHelpButton: false, sceneModePicker: false
});
viewer.scene.globe.enableLighting = true;
  
  
  
  