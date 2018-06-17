export const HUE_ACTIONS = {
  GET_LIGHTS: 'GET_LIGHTS',
  FETCH_LIGHT_STATE: 'FETCH_LIGHT_STATE',
  FETCH_ALL_STATES: 'FETCH_ALL_STATES',
  FETCH_TOKEN: 'FETCH_TOKEN',
  SET_LIGHTS: 'SET_LIGHTS',
  SET_ALL_STATES: 'SET_ALL_STATES',
  SET_LIGHT_STATE: 'SET_LIGHT_STATE',
  REQUEST_DONE: 'REQUEST_DONE_HUE_ACTION',
  REQUEST_START: 'REQUEST_START_HUE_ACTION',
};

export const fetchLights = (bridgeIP, userToken) => ({
  type: HUE_ACTIONS.GET_LIGHTS,
  bridgeIP,
  userToken,
});

export const fetchToken = (bridgeIP, userName) => ({
  type: HUE_ACTIONS.FETCH_TOKEN,
  bridgeIP,
  userName,
});

export const fetchAllStates = (bridgeIP, userToken) => ({
  type: HUE_ACTIONS.FETCH_ALL_STATES,
  bridgeIP,
  userToken,
});

export const fetchLightState = (bridgeIP, userToken, lightID) => ({
  type: HUE_ACTIONS.FETCH_LIGHT_STATE,
  bridgeIP,
  userToken,
  lightID,
});
