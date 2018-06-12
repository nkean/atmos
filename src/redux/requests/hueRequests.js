import axios from 'axios';

export function getLights(bridgeIP, userToken) {
  const url = `http://${bridgeIP}/api/${userToken}/lights`;
  return axios.get(url)
    .then(response => {
      let lights = response.data;
      let allLights = [];
      for (const key of Object.keys(lights)) {
        const newLight = {
          id: key,
          type: lights[key].type,
          name: lights[key].name,
        };
        allLights.push(newLight);
      }
      return allLights;
    })
    .catch(error => {
      throw error.response || error;
    })
}

export function getToken(bridgeIP, userName) {
  const url = `http://${bridgeIP}/api`;
  const config = { "devicetype": `atmos#${userName}` };
  return axios.post(url, config)
    .then(response => response.data[0].success.username)
    .catch(error => {
      throw error.response || error;
    })
}
