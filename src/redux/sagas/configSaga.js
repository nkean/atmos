import { put, takeLatest } from 'redux-saga/effects';
import { CONFIG_ACTIONS } from '../actions/configActions';
import { USER_ACTIONS } from '../actions/userActions';
import { callUser } from '../requests/userRequests';
import { saveBridgeAddress, saveUserToken, getConfig } from '../requests/configRequests';

function* saveConfig(action) {
  try {
    yield put({ type: CONFIG_ACTIONS.REQUEST_START });
    yield saveBridgeAddress(action.payload.bridgeIP);
    yield saveUserToken(action.payload.userToken);
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
  } catch(error) {
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO SAVE CONFIG -- CHECK SERVER CONSOLE', error);
  }
}

function* fetchConfig() {
  try {
    yield put({ type: CONFIG_ACTIONS.REQUEST_START });
    const config = yield getConfig();
    yield put({
      type: CONFIG_ACTIONS.SET_CONFIG,
      config,
    });
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
  } catch(error) {
    yield put({ type: CONFIG_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO GET CONFIG -- CHECK SERVER CONSOLE', error);
  }
}

function* configSaga() {
  yield takeLatest(CONFIG_ACTIONS.SAVE_CONFIG, saveConfig);
  yield takeLatest(CONFIG_ACTIONS.FETCH_CONFIG, fetchConfig);
}

export default configSaga;