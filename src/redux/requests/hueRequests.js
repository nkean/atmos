import axios from 'axios';

export function getLights(bridgeIP, userToken) {
  const url = `http://${bridgeIP}/api/${userToken}/lights`;
  return axios.get(url)
    .then(response => {
      let lights = response.data;
      let allLights = [];
      for (const key of Object.keys(lights)) {
        let lightType = lights[key].type;
        let lightName = lights[key].name;
        if (lightType === 'Extended color light') {
          lightType = 'color';
        } else if (lightType === 'Dimmable light') {
          lightType = 'white';
        }
        const newLight = {
          id: key,
          type: lightType,
          name: lightName,
        };
        allLights.push(newLight);
      }
      return allLights;
    })
    .catch(error => {
      throw error.response || error;
    })
}

export function getAllStates(bridgeIP, userToken) {
  const url = `http://${bridgeIP}/api/${userToken}/lights`;
  return axios.get(url)
    .then(response => {
      let lights = response.data;
      let lightStates = {};
      let newState = {};
      for (const key of Object.keys(lights)) {
        let state = lights[key].state;
        if (state.xy) {
          newState = {
            on: state.on,
            bri: state.bri,
            xy: state.xy,
          };
        } else {
          newState = {
            on: state.on,
            bri: state.bri,
          };
        }
        lightStates = {
          ...lightStates,
          [key]: newState,
        };
      }
      return lightStates;
    })
    .catch(error => {
      console.log('Error getting state of lights: ',  error);
    })
}

export function getLightState(bridgeIP, userToken, lightID) {
  const url = `http://${bridgeIP}/api/${userToken}/lights/${lightID}`;
  return axios.get(url)
    .then(response => {
      let state = response.data.state;
      let newState = {};
      if (state.xy) {
        newState = {
          on: state.on,
          bri: state.bri,
          xy: state.xy,
        };
      } else {
        newState = {
          on: state.on,
          bri: state.bri,
        };
      }
      console.log(newState);
      return newState;
    })
    .catch(error => {
      console.log('Error getting state of light: ', error);
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

export function setLight(bridgeIP, userToken, lightID, state) {
  const url = `http://${bridgeIP}/api/${userToken}/lights/${lightID}/state`;
  axios.put(url, state)
    .then(response => response)
    .catch(error => {
      console.log('Error setting light state: ', error);
    })
}
