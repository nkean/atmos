import { combineReducers } from 'redux';
import { HUE_ACTIONS } from '../actions/hueActions';

const lights = (state = [], action) => {
  switch (action.type) {
    case HUE_ACTIONS.SET_LIGHTS:
      return action.lights || state;
    default:
      return state;
  }
};

const isLoading = (state = false, action) => {
  switch (action.type) {
    case HUE_ACTIONS.REQUEST_START:
      return true;
    case HUE_ACTIONS.REQUEST_DONE:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  isLoading,
  lights,
});
