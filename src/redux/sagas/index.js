import { all } from 'redux-saga/effects';
import userSaga from './userSaga';
import loginSaga from './loginSaga';
import configSaga from './configSaga';
import hueSaga from './hueSaga';

export default function* rootSaga() {
  yield all([
    userSaga(),
    loginSaga(),
    configSaga(),
    hueSaga(),
    // watchIncrementAsync()
  ]);
}
