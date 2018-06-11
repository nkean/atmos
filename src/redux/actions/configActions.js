export const CONFIG_ACTIONS = {
  SET_CONFIG: 'SET_CONFIG',
  FETCH_CONFIG: 'FETCH_CONFIG',
  SAVE_CONFIG: 'SAVE_CONFIG',
  REQUEST_START: 'REQUEST_START_CONFIG_ACTION',
  REQUEST_DONE: 'REQUEST_DONE_CONFIG_ACTION',
};

export const saveConfig = (bridgeIP, userToken) => ({
  type: CONFIG_ACTIONS.SAVE_CONFIG,
  payload: {
    bridgeIP,
    userToken,
  },
});