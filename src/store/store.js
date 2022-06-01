import {
  configureStore,
} from '@reduxjs/toolkit';
import {
  combineReducers,
} from 'redux';

import sliceMemos from './memos';
import sliceUser from './user';

const reducer = combineReducers({
  sliceUser,
  sliceMemos,
});

const store = configureStore({
  reducer,
});

export default store;