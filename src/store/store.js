import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { myMemoApi } from "services/mymemo-api";
import { userApi } from "services/user-api";
import userSlice, { actionLogoutSucceeded } from "./user-slice";

const combinedReducer = combineReducers({
  userSlice,
  [myMemoApi.reducerPath]: myMemoApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const rootReducer = (state, action) => {
  if (actionLogoutSucceeded.match(action)) {
    // reset state on logout
    state = undefined;
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(myMemoApi.middleware)
      .concat(userApi.middleware),
});

export default store;
