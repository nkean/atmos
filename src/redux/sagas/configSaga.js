import { put, takeLatest } from 'redux-saga/effects';
import { CONFIG_ACTIONS } from '../actions/configActions';
import { USER_ACTIONS } from '../actions/userActions';
import { HUE_ACTIONS } from '../actions/hueActions';
import { callUser } from '../requests/userRequests';
import { saveBridgeAddress, 
         saveUserToken, 
         getConfig,
         getGroups, 
         getLights, 
         getRooms, 
         saveLights, 
         saveRoom } from '../requests/configRequests';


function* fetchConfig() {
  try {
    yield put({ type: CONFIG_ACTIONS.REQUEST_START });
    const config = yield getConfig();
    yield put({
      type: CONFIG_ACTIONS.SET_CONFIG,
      config,
    });
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
  } catch (error) {
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO GET CONFIG -- CHECK SERVER CONSOLE', error);
  }
}

function* fetchLights() {
  try {
    yield put({ type: CONFIG_ACTIONS.REQUEST_START });
    const lights = yield getLights();
    yield put({
      type: HUE_ACTIONS.SET_LIGHTS,
      lights,
    });
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
  } catch (error) {
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO GET LIGHTS -- CHECK SERVER CONSOLE', error);
  }
}

function* saveConfig(action) {
  try {
    yield put({ type: CONFIG_ACTIONS.REQUEST_START });
    yield saveBridgeAddress(action.bridgeIP);
    yield saveUserToken(action.userToken);
    const config = yield getConfig();
    yield put({
      type: CONFIG_ACTIONS.SET_CONFIG,
      config,
    });
    const user = yield callUser();
    yield put({
      type: USER_ACTIONS.SET_USER,
      user,
    });
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
  } catch (error) {
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO SAVE CONFIG -- CHECK SERVER CONSOLE', error);
  }
}

function* updateLights(action) {
  try {
    yield put({ type: CONFIG_ACTIONS.REQUEST_START });
    yield saveLights(action.lights);
    const lights = yield getLights();
    yield put({
      type: HUE_ACTIONS.SET_LIGHTS,
      lights,
    });
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
  } catch (error) {
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO UPDATE LIGHTS -- CHECK SERVER CONSOLE', error);
  }
}

function* fetchRooms() {
  try {
    yield put({ type: CONFIG_ACTIONS.REQUEST_START });
    const rooms = yield getRooms();
    yield put({
      type: CONFIG_ACTIONS.SET_ROOMS,
      rooms,
    });
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
  } catch (error) {
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO FETCH ROOMS -- CHECK SERVER CONSOLE', error);
  }
}

function* updateRoom(action) {
  try {
    yield put({ type: CONFIG_ACTIONS.REQUEST_START });
    yield saveRoom(action.room);
    yield put({ type: CONFIG_ACTIONS.FETCH_ROOMS });
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
  } catch (error) {
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO UPDATE ROOM -- CHECK SERVER CONSOLE', error);
  }
}

function* fetchGroups() {
  try {
    yield put({ type: CONFIG_ACTIONS.REQUEST_START });
    const groups = yield getGroups();
    yield put({
      type: CONFIG_ACTIONS.SET_GROUPS,
      groups,
    });
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
  } catch (error) {
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO FETCH GROUPS -- CHECK SERVER CONSOLE', error);
  }
}

function* configSaga() {
  yield takeLatest(CONFIG_ACTIONS.FETCH_CONFIG, fetchConfig);
  yield takeLatest(CONFIG_ACTIONS.FETCH_GROUPS, fetchGroups);
  yield takeLatest(CONFIG_ACTIONS.FETCH_LIGHTS, fetchLights);
  yield takeLatest(CONFIG_ACTIONS.FETCH_ROOMS, fetchRooms);
  yield takeLatest(CONFIG_ACTIONS.SAVE_CONFIG, saveConfig);
  yield takeLatest(CONFIG_ACTIONS.UPDATE_LIGHTS, updateLights);
  yield takeLatest(CONFIG_ACTIONS.UPDATE_ROOM, updateRoom);
}

export default configSaga;
