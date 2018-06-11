import { combineReducers } from 'redux';
import user from './userReducer';
import login from './loginReducer';
import config from './configReducer';

const store = combineReducers({
  user,
  login,
  config,
});

export default store;
