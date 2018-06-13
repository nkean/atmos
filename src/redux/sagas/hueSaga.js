import { put, takeLatest } from 'redux-saga/effects';
import { CONFIG_ACTIONS } from '../actions/configActions';
import { HUE_ACTIONS } from '../actions/hueActions';
import { USER_ACTIONS } from '../actions/userActions';
import { getLights, getToken } from '../requests/hueRequests';

function* fetchLights(action) {
  try {
    yield put({ type: HUE_ACTIONS.REQUEST_START });
    const lights = yield getLights(action.payload.bridgeIP, action.payload.userToken);
    yield put({
      type: CONFIG_ACTIONS.UPDATE_LIGHTS,
      lights,
    });
    yield put({ type: HUE_ACTIONS.REQUEST_DONE });
  } catch (error) {
    yield put({ type: HUE_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO GET LIGHTS FROM HUE BRIDGE', error);
  }
}

function* fetchToken(action) {
  try {
    yield put({ type: HUE_ACTIONS.REQUEST_START });
    const token = yield getToken(action.payload.bridgeIP, action.payload.userName);
    yield put({
      type: USER_ACTIONS.SET_USER,
      user: {
        token,
      },
    });
    yield put({ type: HUE_ACTIONS.REQUEST_DONE });
  } catch (error) {
    yield put({ type: HUE_ACTIONS.REQUEST_DONE });
    console.log('FAILED TO GET TOKEN FROM HUE BRIDGE', error);
  }
}

function* hueSaga() {
  yield takeLatest(HUE_ACTIONS.FETCH_TOKEN, fetchToken);
  yield takeLatest(HUE_ACTIONS.GET_LIGHTS, fetchLights);
}

export default hueSaga;
