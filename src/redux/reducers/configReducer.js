import { combineReducers } from 'redux';
import { CONFIG_ACTIONS } from '../actions/configActions';

const bridgeIP = (state = '', action) => {
  switch (action.type) {
    case CONFIG_ACTIONS.SET_CONFIG:
      return action.config.bridge_address || state;
    default:
      return state;
  }
};

const isLoading = (state = false, action) => {
  switch (action.type) {
    case CONFIG_ACTIONS.REQUEST_START:
      return true;
    case CONFIG_ACTIONS.REQUEST_DONE:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  bridgeIP,
  isLoading,
});
