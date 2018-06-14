export const CONFIG_ACTIONS = {
  FETCH_CONFIG: 'FETCH_CONFIG',
  FETCH_LIGHTS: 'FETCH_LIGHTS',
  FETCH_GROUPS: 'FETCH_GROUPS',
  FETCH_ROOMS: 'FETCH_ROOMS',
  SAVE_CONFIG: 'SAVE_CONFIG',
  SET_CONFIG: 'SET_CONFIG',
  SET_GROUPS: 'SET_GROUPS',
  SET_ROOMS: 'SET_ROOMS',
  UPDATE_LIGHTS: 'UPDATE_LIGHTS',
  UPDATE_ROOM: 'UPDATE_ROOM',
  REQUEST_START: 'REQUEST_START_CONFIG_ACTION',
  REQUEST_DONE: 'REQUEST_DONE_CONFIG_ACTION',
};

export const saveConfig = (bridgeIP, userToken) => ({
  type: CONFIG_ACTIONS.SAVE_CONFIG,
  bridgeIP,
  userToken,
});

export const updateLights = (lights) => ({
  type: CONFIG_ACTIONS.UPDATE_LIGHTS,
  lights,
});

export const updateRoom = (room) => ({
  type: CONFIG_ACTIONS.UPDATE_ROOM,
  room,
});
