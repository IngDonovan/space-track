import * as Cesium from 'cesium';
import * as satellite from 'satellite.js';
import { loadingView } from '../loading';
import { headerView } from '../header';
import { menuBarView } from '../menuBar';
import { SatelliteTracker } from '../satelliteTracker';
import { CesiumViewer } from '../cesiumViewer';
import '../../main.scss';


export function initApp() {
    const API = 'https://api.tinygs.com/v1';
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjIyZTdiZi1mODQwLTQ0MjAtOWNlNS1lYTViMDc2OTlmYmQiLCJpZCI6MTU4MTU2LCJpYXQiOjE2OTEwMjQxMTl9.7otDjsYgAlZeullEThcZ8fKanHGXv0Lo2jAn6po1u3E';
    // Render the main app layout
    const appContainer = document.querySelector('#app');
    appContainer.innerHTML = `
      ${loadingView}
      ${headerView}
      ${menuBarView}
      <div class="timeClock">
        <div class="timeClockInfo">
          <button id="toggle2DButton">2D</button>
          <button id="toggleOrbitalButton">3D</button>
        </div>
        <div class= "timeClockInfo contButton">
          <button id="realSpeed">1X</button>
          <button id="speedButton">40X</button>
        </div>
        <div class="timeClockInfo contClock">
          <span id="hourElement" class="timeSat">00</span>:
          <span id="minuteElement" class="timeSat">00</span>:
          <span id="secElement" class="timeSat">00</span> 
        </div>
      </div>
      <div class="infoSatellite">
        <span class="infoData textTitle">Coordenadas</span>
        <div>
          <span id="NameSat" class="infoData">Satellite</span>
          <span id="LatSat" class="infoData">Grados</span>
          <span id="LongSat" class="infoData">Grados</span>
          <span id="heightSat" class="infoData">Km</span> 
        </div>
      </div>
    `;

    // Get the menu icon element (make sure it's defined in your HTML)
    const menuIco = document.querySelector(".menu");
    // Get the trackID element (make sure it's defined in your HTML)
    const trackID = document.getElementById('trackID');
    const showButton = document.querySelector(".show-button");

    // Initialize the Cesium viewer
    const cesiumViewer = new CesiumViewer();
    // Initialize the satellite tracker
    const satelliteTracker = new SatelliteTracker(API, cesiumViewer);
    // ... set up event listeners and interactions ...
    // menuIco.addEventListener('click', () => toggleMenu(satelliteTracker));
    menuIco.addEventListener('click', () => {
      if (!cesiumViewer.is3DMode()) {
        // menuIco.classList.add('inactive');
        return; // Si estás en modo 2D, no se permite abrir el menú
      }

      toggleMenu(satelliteTracker);
    });

    
    satelliteTracker.namesElements.addEventListener('change', (event) => selectNameElement(satelliteTracker, event));

    showButton.addEventListener('click', () => showButtom(satelliteTracker));
    // ... other event listeners ...
  }

  function showButtom(satelliteTracker) {
      satelliteTracker.loadSatellites();
  };

  function selectNameElement(satelliteTracker, event) {
    let selectedSatelliteName = event.target.value;
    satelliteTracker.searchSat(selectedSatelliteName);
  }

  function toggleMenu(satelliteTracker) {
    const isAsideClose = trackID.classList.contains('inactive');
    

    if (isAsideClose) {
      satelliteTracker.addListSatellites();
      if (satelliteTracker.SatsNames.length === 0) {
        satelliteTracker.searchSatellitesToShow();
      }
    }
    trackID.classList.toggle('inactive');
  }

