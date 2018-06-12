export const HUE_ACTIONS = {
  GET_LIGHTS: 'GET_LIGHTS',
  FETCH_TOKEN: 'FETCH_TOKEN',
  SET_LIGHTS: 'SET_LIGHTS',
  REQUEST_DONE: 'REQUEST_DONE_HUE_ACTION',
  REQUEST_START: 'REQUEST_START_HUE_ACTION',
};

export const fetchLights = (bridgeIP, userToken) => ({
  type: HUE_ACTIONS.GET_LIGHTS,
  payload: {
    bridgeIP,
    userToken,
  },
});

export const fetchToken = (bridgeIP, userName) => ({
  type: HUE_ACTIONS.FETCH_TOKEN,
  payload: {
    bridgeIP,
    userName,
  },
});