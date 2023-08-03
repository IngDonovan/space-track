import { twoline2satrec, propagate, eciToGeodetic, degreesLat, degreesLong } from 'satellite.js';

// Función para calcular los ángulos de visión de un satélite
function calculateSatelliteAngles() {
    const tleLine1 = '1 88888U 24001FA 23163.94096086 .00000000 00000-0 10000-4 0 9999';
    const tleLine2 = '2 88888 97.5077 280.5424 0008220 228.6198 130.8530 15.11803180 1009';
  
    // Parsea los datos TLE para obtener el objeto de satélite
    const satrec = twoline2satrec(tleLine1, tleLine2);
  
    // Obtiene la fecha y hora en la que deseas calcular los ángulos de visión
    const date = new Date();
  
    // Calcula la posición del satélite en la fecha dada
    const positionAndVelocity = propagate(satrec, date);
    const positionEci = positionAndVelocity.position;
  
    // Obtén las coordenadas geodéticas (latitud, longitud y altitud) desde las coordenadas ECI
    const geodeticCoords = eciToGeodetic(positionEci);
  
    // Coordenadas de la estación receptora (ejemplo: latitud y longitud de una ubicación)
    const observerLat = 6.1980/* Latitud de la estación receptora */;
    const observerLong = -75-6092/* Longitud de la estación receptora */;
  
    // Calcula los ángulos de visión: azimut, elevación y distancia
    const observerGd = {
      longitude: degreesLong(observerLong),
      latitude: degreesLat(observerLat),
    //   height: /* Altitud de la estación receptora (opcional) */,
    };
  
    const lookAngles = satellite.eciToLookAngles(observerGd, positionEci);
  
    // const azimuth = radianToDegree(lookAngles.azimuth);
    // const elevation = radianToDegree(lookAngles.elevation);
    const rangeSat = lookAngles.rangeSat;
  
    console.log('Azimut:', azimuth);
    console.log('Elevación:', elevation);
    console.log('Distancia:', rangeSat);
  }
  
  // Llama a la función para calcular los ángulos de visión del satélite
//   calculateSatelliteAngles();