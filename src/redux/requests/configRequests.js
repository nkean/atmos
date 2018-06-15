import axios from 'axios';

export function getConfig() {
  return axios.get('/api/config/fetch')
    .then(response => response.data)
    .catch(error => {
      throw error.response || error;
    })
}

export function getLights() {
  return axios.get('/api/config/lights')
    .then(response => response.data)
    .catch(error => {
      throw error.response || error;
    })
}

export function getRooms() {
  return axios.get('/api/config/rooms')
    .then(response => response.data)
    .catch(error => {
      throw error.response || error;
    })
}

export function getGroups() {
  return axios.get('/api/config/groups')
    .then(response => {
      let lightArray = response.data;
      let groupObject = {
        names: [],
        lights: [],
      };
      lightArray.forEach(light => {
        let roomId = light.room_id - 1;
        let roomName = light.room_name;
        let newLight = {
          id: light.id,
          name: light.name,
          type: light.type,
        };
        if (groupObject.lights[roomId]) {
          groupObject.lights[roomId] = [...groupObject.lights[roomId], newLight];
        } else {
          if(groupObject.names.indexOf(roomName) === -1) {
            groupObject.names.push(roomName);
          }
          groupObject.lights[roomId] = [newLight];
        };
      });
      return groupObject;
    })
    .catch(error => {
      throw error.response || error;
    })
}

export function saveBridgeAddress(bridgeIP) {
  return axios.post('/api/config/bridge', { "bridge_address": bridgeIP })
    .then(response => response.data)
    .catch(error => {
      throw error.response || error;
    })
}

export function saveLights(lights) {
  return axios.post('/api/config/lights', { "lights": lights })
    .then(response => response.data)
    .catch(error => {
      throw error.response || error;
    })
}

export function saveRoom(room) {
  return axios.post('/api/config/room', { "room": room })
    .then(response => response.data)
    .catch(error => {
      throw error.response || error;
    })
}

export function saveUserToken(userToken) {
  return axios.post('/api/config/token', { "token": userToken })
    .then(response => response.data)
    .catch(error => {
      throw error.response || error;
    })
}
