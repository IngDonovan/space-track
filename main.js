  // Inicializamos el mapa en una ubicación y nivel de zoom específicos
  var mymap = L.map('map').setView([51.505, -0.09], 13);

  // Añadimos una capa de mapa base de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);

  // Añadimos un marcador en una ubicación específica
  var marker = L.marker([51.5, -0.09]).addTo(mymap);

  // Añadimos un círculo en otra ubicación
  var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
  }).addTo(mymap);

  // Añadimos un polígono con coordenadas específicas
  var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
  ]).addTo(mymap);

  // Añadimos un popup a los marcadores y al polígono
  marker.bindPopup("¡Hola! Soy un marcador.").openPopup();
  circle.bindPopup("¡Hola! Soy un círculo.");
  polygon.bindPopup("¡Hola! Soy un polígono.");