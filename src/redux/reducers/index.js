import { combineReducers } from 'redux';
import user from './userReducer';
import login from './loginReducer';
import config from './configReducer';
import hue from './hueReducer';

const store = combineReducers({
  user,
  login,
  config,
  hue,
});

export default store;
