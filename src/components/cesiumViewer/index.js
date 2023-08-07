import * as Cesium from 'cesium';
import * as satellite from 'satellite.js';
import sateOrbi from '../../assets/Satellite.svg';

export class CesiumViewer {
  constructor() {
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      animation: false,
    });
    this.initClock();
    this.initUpdateClockInfo();
 
  this.resetSpeedButton = document.getElementById('realSpeed');
  this.resetSpeedButton.addEventListener('click', () => {
    this.viewer.clock.currentTime = Cesium.JulianDate.now(); // 
    this.viewer.clock.multiplier = 1;
    this.viewer.clock.shouldAnimate = true; // Reinicia la animación
  });

    this.speedButton = document.getElementById('speedButton');
    this.speedButton.addEventListener('click', () => {
    this.changeAnimationSpeed(40); // Cambia la velocidad como desees
  });
  this.initMapButtons(); // Agregamos la inicialización de los botones de mapa
  }

  initClock() {
    const viewer = this.viewer;

    viewer.clock.startTime = Cesium.JulianDate.fromDate(new Date());
    viewer.clock.stopTime = Cesium.JulianDate.addSeconds(viewer.clock.startTime, 360, new Cesium.JulianDate());
    viewer.clock.currentTime = viewer.clock.startTime;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 60;
    viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
  }

  initUpdateClockInfo() {
    const viewer = this.viewer;
    function updateCesiumClockInfo() {
      const cesiumClock = viewer.clock;
      const currentTime = Cesium.JulianDate.toDate(cesiumClock.currentTime);
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();
      const formatHours = `${hours}`.padStart(2, '0');
      const formatMinutes = `${minutes}`.padStart(2, '0');
      const formatSeconds = `${seconds}`.padStart(2, '0');
      
      document.getElementById('hourElement').textContent = formatHours;
      document.getElementById('minuteElement').textContent = formatMinutes;
      document.getElementById('secElement').textContent = formatSeconds;
    }

    setInterval(updateCesiumClockInfo, 1000);
  }

  loadMap(satrec, nameSat) {
    const viewer = this.viewer;

    const orbitPositions = [];

    const totalSeconds = 60 * 60 * 6;
    const timestepInSeconds = 10;//10
    const start = Cesium.JulianDate.fromDate(new Date());
    const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());


    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.timeline.zoomTo(start, stop);
    viewer.clock.multiplier = 1;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

    const positionsOverTime = new Cesium.SampledPositionProperty();

    for (let i = 0; i < totalSeconds; i += timestepInSeconds) {
      const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
      const jsDate = Cesium.JulianDate.toDate(time);
      const positionAndVelocity = satellite.propagate(satrec, jsDate);
      const gmst = satellite.gstime(jsDate);
      const p = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
      const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
      // orbitPositions.push({
      //   timeSat:time,
      //   positionSat:position,
      // });
      positionsOverTime.addSample(time, position);
      // console.log(time);
      // console.log(position);
    }
    console.log(orbitPositions);
    const platziName = ('FossaSat-FX14' === nameSat);
    const newName = platziName ? 'PlatziSat-1' : nameSat;
    const satellitePoint = viewer.entities.add({
      position: positionsOverTime,
      billboard: {
        image: sateOrbi, // Replace with your image path
        show: true,
        width: 64,
        height: 64,
      },
      label: {
        text: newName,
        backgroundColor: Cesium.Color.WHITE,
        fillColor: Cesium.Color.WHITE,
        font: 'small-caps bold 24px/1 sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 3,
        pixelOffset: new Cesium.Cartesian2(0, 32),
      },
      point: {
        pixelSize: 6,
        color: platziName ? Cesium.Color.RED : Cesium.Color.YELLOW,
      },
    });

    // const firstPosition = orbitPositions[0].positionSat;
    // const lastPosition = orbitPositions[100].positionSat;

    // const lastPosition = orbitPositions[orbitPositions.length - 1].positionSat;

    // const entity = viewer.entities.add({
    //   polyline: {
    //     positions: [firstPosition, lastPosition],
    //     width: 2,
    //     material: new Cesium.PolylineGlowMaterialProperty({
    //       glowPower: 0.1,
    //       color: Cesium.Color.YELLOW,
    //     }),
    //   },
    // });
    
    // this.createOrbitPath(satrec, orbitPositions);
    


    viewer.trackedEntity = satellitePoint;
    // viewer.trackedEntity = entity;

    // Show orbit path

    let initialized = false;
    viewer.scene.globe.tileLoadProgressEvent.addEventListener(() => {
      if (!initialized && viewer.scene.globe.tilesLoaded === true) {
        viewer.clock.shouldAnimate = true;
        initialized = true;
        viewer.scene.camera.zoomOut(7000000);
        document.querySelector("#loading").classList.toggle('disappear', true);

      }
    });
  }

  createOrbitPath(satrec, positions) {
    const viewer = this.viewer;
  
    let currentIndex = 0;
    let timeInterval = 1000; // Tiempo en milisegundos entre actualizaciones
    let lastUpdateTime = Cesium.JulianDate.toDate(positions[currentIndex].timeSat);
  
    const orbitLine = viewer.entities.add({
      polyline: {
        positions: [positions[currentIndex].positionSat],
        width: 2,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Cesium.Color.YELLOW,
        }),
      },
    });
  
    const updateOrbitPath = () => {
      const currentTime = Cesium.JulianDate.now();
      const deltaTime = Cesium.JulianDate.secondsDifference(currentTime, positions[currentIndex].timeSat);
  
      if (deltaTime >= timeInterval / 1000) {
        currentIndex++;
        if (currentIndex >= positions.length) {
          currentIndex = 0;
        }
  
        const newPosition = positions[currentIndex].positionSat;
        orbitLine.polyline.positions.setValue(0, newPosition);
  
        lastUpdateTime = Cesium.JulianDate.toDate(positions[currentIndex].timeSat);
      }
    };
  
    viewer.clock.onTick.addEventListener(updateOrbitPath);
  }

  // ... other Cesium-related methods ...
  changeAnimationSpeed(speed) {
    this.viewer.clock.multiplier = speed;
  }

  toggle2DMap() {
    this.viewer.scene.morphTo2D(1); // Cambia al modo 2D
  }

  toggleOrbitalMap() {
    this.viewer.scene.morphTo3D(1); // Cambia al modo orbital
    
  }

  initMapButtons() {
    const cesiumViewer = this;

    document.getElementById('toggle2DButton').addEventListener('click', () => {
      cesiumViewer.toggle2DMap();
    });

    document.getElementById('toggleOrbitalButton').addEventListener('click', () => {
      cesiumViewer.toggleOrbitalMap();
    });
  }


}