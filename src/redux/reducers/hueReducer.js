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

const states = (state = null, action) => {
  switch (action.type) {
    case HUE_ACTIONS.SET_ALL_STATES:
      return action.states || state;
    case HUE_ACTIONS.SET_LIGHT_STATE:
      return {...state, [action.lightID]: action.state} || state;
    default:
      return state;
  }
};

export default combineReducers({
  isLoading,
  lights,
  states,
});
