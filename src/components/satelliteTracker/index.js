import * as satellite from 'satellite.js';
import { fetchData } from '../utils';

export class SatelliteTracker {
  constructor(apiUrl, cesiumViewer) {
    this.apiUrl = apiUrl;
    this.cesiumViewer = cesiumViewer;
    this.SatsNames = [];
    this.lisToShowSatellites = [
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
    this.ulList = document.getElementById('ShowlistExist');
    this.namesElements = document.getElementById('sateSelec');

    this.init();

  }

  async init() {
    await this.loadSatellites();
    this.startRealTimeTracking();
    // ... other initialization ...
  }
//searchSatellitesToShow
  async loadSatellites() {
    try {
      for (const sat of this.lisToShowSatellites) { // Use 'this' to refer to the class property
        const nameSat = sat.name;
        const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
        
        this.cesiumViewer.loadMap(satrec, nameSat); // Call the method on the cesiumViewer instance
      }
    } catch (error) {
      console.error(error);
    }
  }
//----------------revisar
  async searchSatellitesToShow() {
    try {
      const orbSatellites = await fetchData(`${this.apiUrl}/satellites`);
      orbSatellites.forEach(satellite => {
        this.SatsNames.push(satellite.name);
        const optionElement = document.createElement('option');
        optionElement.textContent = satellite.name;
        this.namesElements.appendChild(optionElement);
      });
    } catch (error) {
      console.error(error);
    }
  }

  //igual
  addListSatellites() {
    this.ulList.innerHTML = '';
    this.lisToShowSatellites.forEach(satellite => {
      const newLiElement = document.createElement('li');
      newLiElement.textContent = satellite.name;
      this.ulList.appendChild(newLiElement);
    });
  }

  async searchSat(nameSat) {

    try {
      const orbSat = await fetchData(`${this.apiUrl}/satellite/${nameSat}`);
      const existSatelliteIndex = this.lisToShowSatellites.findIndex(satellite => satellite.name === nameSat);
      if (existSatelliteIndex === -1) {
        // Si el satélite no existe en la lista, lo agregamos
        this.lisToShowSatellites.push({
          name: nameSat,
          tle1: orbSat.tle[1],
          tle2: orbSat.tle[2],
        });
      } else {
        // Si el satélite ya existe en la lista, lo eliminamos y luego lo agregamos nuevamente
        this.lisToShowSatellites.splice(existSatelliteIndex, 1); // Eliminamos el satélite existente
        this.lisToShowSatellites.push({ // Agregamos el satélite actualizado
          name: nameSat,
          tle1: orbSat.tle[1],
          tle2: orbSat.tle[2],
        });
      }
      // console.log(this.lisToShowSatellites);
      this.addListSatellites();

    } catch (error) {
      console.error(error);
    }
  }
  // ... other satellite-related methods ...
  async startRealTimeTracking() {
    try {
      setInterval(() => {
        for (const sat of this.lisToShowSatellites) {
          const nameSat = sat.name;
          const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
            const date = new Date();
            const positionAndVelocity = satellite.propagate(satrec, date);
            const gmst = satellite.gstime(date);
            const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
          // console.log(position);
          const latitude = (position.latitude * 180 / Math.PI).toFixed(2);
          const longitude = (position.longitude * 180 / Math.PI).toFixed(2);
          const height = (position.height).toFixed(2);
          // console.log(latitude);
          // console.log(longitude);
          document.getElementById('LatSat').textContent = `Latitud: ${latitude}°`;
          document.getElementById('LongSat').textContent = `Longitud: ${longitude}°`;
          document.getElementById('heightSat').textContent = `Altura: ${height} Km`;
        }
      }, 1000); // Update every 1 second
    } catch (error) {
      console.error(error);
    }
  }


}