import axios from 'axios';

export function getConfig() {
  return axios.get('/api/config/fetch')
    .then(response => response.data)
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

export function saveUserToken(userToken) {
  return axios.post('/api/config/token', { "token": userToken})
    .then(response => response.data)
    .catch(error => {
      throw error.response || error;
    })
}