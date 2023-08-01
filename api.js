// import fetch from 'node-fetch';
const API = 'https://api.tinygs.com/v1';
const ALLSAT = '/satellites';
const ONESAT = '/satellite';
console.log('hola');

async function fetchData(urlApi) {
    const response = await fetch(urlApi);
    const data = await response.json();
    return data;
}

const searchSatellites = async (urlApi) => {
    try {
        const orbSatellites = await fetchData(`${urlApi + ALLSAT}`);
        // const category = await fetchData(`${urlApi}/categories/${product.category.id}`);

        // console.log('Satellites',orbSatellites);
        // console.log('Satellite',orbSat);
//      {        
//     "name": "FossaSat-FX14",
//     "displayName": "FossaSat FEROX 14",
//     "description": "FOSSASat FEROX 14 (PlatziSat-1) is a new nanosatellite platform developed by FOSSA Systems after the FOSSASat-2E generation demonstrators ",
//     "longDescription": "<p>FOSSASat FEROX 14 (PlatziSat-1) is a new nanosatellite platform developed by FOSSA Systems after the FOSSASat-2E generation demonstrators. The satellite provides low poer LoRa IoT connectivity for 80-byte messages and is also flying an earth observation experiment that downlinks low resolution images in a distributed fashion. FOSSA will share information on when downlink of images are available.</p><p>he satellite transmits beacons containing telemetry information of the subsystems and experiments such as the camera will be turned on after comissioning of the spacecraft. The satellite has capabilities comparable to that of a 6 to 12U satellite in a fraction of the size, and FOSSA offers IoT connectivity with them worldwide.</p><p>FOSSA plans to deploy a constellation of 80 satellites.</p>",
//     "images": [
//       "https://static.tinygs.com/satellites/Fossa/WHITEROOM_3-scaled.jpeg",
//       "https://static.tinygs.com/satellites/Fossa/EQwjpcCW4AAsP2x.jpeg"
//     ],
//     "configurations": [
//       {
//         "mode": "LoRa",
//         "freq": 401.7,
//         "bw": 125,
//         "sf": 11,
//         "cr": 8,
//         "sw": 18,
//         "pwr": 5,
//         "cl": 120,
//         "pl": 8,
//         "gain": 0,
//         "crc": true,
//         "fldro": 1,
//         "sat": "FossaSat-FX14",
//         "NORAD": 70301
//       }
//     ],
//     "status": "Inactive",
//     "launchDate": 1686182401000
//   },
        // console.log('Name',orbSatellites[0].name);
        
    //     "name": "FossaSat-FX14",
    //     "displayName": "FossaSat FEROX 14",
    //     "description": "FOSSASat FEROX 14 (PlatziSat-1) is a new nanosatellite platform developed by FOSSA Systems after the FOSSASat-2E generation demonstrators ",
    //     "longDescription": "<p>FOSSASat FEROX 14 (PlatziSat-1) is a new nanosatellite platform developed by FOSSA Systems after the FOSSASat-2E generation demonstrators. The satellite provides low poer LoRa IoT connectivity for 80-byte messages and is also flying an earth observation experiment that downlinks low resolution images in a distributed fashion. FOSSA will share information on when downlink of images are available.</p><p>he satellite transmits beacons containing telemetry information of the subsystems and experiments such as the camera will be turned on after comissioning of the spacecraft. The satellite has capabilities comparable to that of a 6 to 12U satellite in a fraction of the size, and FOSSA offers IoT connectivity with them worldwide.</p><p>FOSSA plans to deploy a constellation of 80 satellites.</p>",
    //     "images": [
    //       "https://static.tinygs.com/satellites/Fossa/WHITEROOM_3-scaled.jpeg",
    //       "https://static.tinygs.com/satellites/Fossa/EQwjpcCW4AAsP2x.jpeg"
    //     ],
    //     "configurations": [
    //       {
    //         "mode": "LoRa",
    //         "freq": 401.7,
    //         "bw": 125,
    //         "sf": 11,
    //         "cr": 8,
    //         "sw": 18,
    //         "pwr": 5,
    //         "cl": 120,
    //         "pl": 8,
    //         "gain": 0,
    //         "crc": true,
    //         "fldro": 1,
    //         "sat": "FossaSat-FX14",
    //         "NORAD": 70301
    //       }
    //     ],
    //     "tle": [
    //       "FOSSASAT FEROX",
    //       "1 88888U 24001FA  23163.94096086  .00000000  00000-0  10000-4 0  9999",
    //       "2 88888  97.5077 280.5424 0008220 228.6198 130.8530 15.11803180  1009"
    //     ],
    //     "status": "Inactive",
    //     "launchDate": 1686182401000,
    //     "lastTelemetry": {
    //       "fo0": [
    //         70,
    //         79,
    //         48
    //       ],
    //       "satId": "14",
    //       "payload": {
    //         "data": {
    //           "frameId": 1,
    //           "timestamp": 1687028929,
    //           "beaconFrame": {
    //             "gpsTime": 1687026320,
    //             "gpsAltitude": 543009,
    //             "gpsLatitude": -2656.232177734375,
    //             "gpsLongitude": 10721.03515625,
    //             "gpsPdop": 0,
    //             "gpsHdop": 0,
    //             "gpsVdop": 0,
    //             "imuGyroX": 0,
    //             "imuGyroY": 0,
    //             "imuGyroZ": 0,
    //             "obctTemp": -12,
    //             "adcsTemp": 0,
    //             "plTemp": 0,
    //             "epsMpptTemp": -9
    //           }
    //         },
    //         "tinygsTxPower": 158,
    //         "tinygsSatellite": "FossaSat-FX14",
    //         "tinygsTemp": 0,
    //         "tinygsAlt": 543009,
    //         "tinygsGyroY": 0,
    //         "tinygsGyroX": 0,
    //         "tinygsLat": -2656.232177734375,
    //         "tinygsGyroZ": 0,
    //         "tinygsLng": 10721.03515625
    //       },
    //       "frameId": 1,
    //       "type": "Beacon",
    //       "telemetry": true,
    //       "object": 0
    //     },
    //     "webTemplate": "<div v-if=\"p.data.frameId==1\">\n 📻 {{p.tinygsTxPower}}mW  <br />\n🌡{{p.tinygsTemp}}ºC  🌡{{p.data.beaconFrame.obctTemp}}ºC 🌡{{p.data.beaconFrame.adcsTemp}}ºC 🌡{{p.data.beaconFrame.epsMpptTemp}}ºC <br />\n🌀 imu ({{fixed2 (p.tinygsGyroX+0.0001)}},{{fixed2 (p.tinygsGyroY+0.0001)}},{{fixed2 (p.tinygsGyroZ+0.0001)}}) <br />\n </div> <div v-else><strong>No parser available for this type of packet.</strong> This is a valid packet but its contents are unknown. The information to decode this packet was not published yet.</div>"
    //   }

        orbSatellites.forEach(satellite => {
            console.log(satellite.name);
        });
        // console.log(products);
        // console.log(product.title);
        // console.log(category.name);
    } catch (error){
        console.error(error);
    }
}
async function searchSat(urlApi, nameSat) {
    try {
        const orbSat = await fetchData(`${urlApi + ONESAT}/${nameSat}`);
        console.log('Satellite',orbSat.tle);
    } catch (error) {
        console.error(error);
    }
}

searchSatellites(API);
searchSat(API, 'FossaSat-FX14');