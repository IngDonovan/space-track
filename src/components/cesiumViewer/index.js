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
    const totalSeconds = 60 * 60 * 6;
    const timestepInSeconds = 10;
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
      positionsOverTime.addSample(time, position);
    }

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

    viewer.trackedEntity = satellitePoint;

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

  // ... other Cesium-related methods ...
}