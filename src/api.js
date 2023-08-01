const API = 'https://api.tinygs.com/v1';
const ALLSAT = '/satellites';
const ONESAT = '/satellite';
const SatsNames = [];
const selectElement = document.getElementById("sateSelec");

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
            
            selectElement.appendChild(optionElement);
        });

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

// searchSatellites(API);
// searchSat(API, 'FossaSat-FX14');