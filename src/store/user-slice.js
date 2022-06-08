import { createSlice } from "@reduxjs/toolkit";
import {
  getUserFromLocalStorage,
  getApiTokenFromLocalStorage,
  putApiTokenToLocalStorage,
  putUserToLocalStorage,
  clearUserDataFromLocalStorage,
} from "services/local-storage";

const updateUserLoginState = (state, action) => {
  const { token, ...user } = action.payload;
  state.user = user;
  state.isLoggedIn = true;
  putUserToLocalStorage(user);
  putApiTokenToLocalStorage(token);
};

const slice = createSlice({
  name: "userSlice",
  initialState: {
    user: getUserFromLocalStorage(),
    isLoggedIn: !!getApiTokenFromLocalStorage(),
  },
  reducers: {
    // Actions
    actionLoginSucceeded: (state, action) => {
      updateUserLoginState(state, action);
    },
    actionSignupSucceeded: (state, action) => {
      updateUserLoginState(state, action);
    },
    actionLogoutSucceeded: (state) => {
      clearUserDataFromLocalStorage();
      state.user = getUserFromLocalStorage();
      state.isLoggedIn = false;
    },
  },
});

// Actions
export const {
  actionLoginSucceeded,
  actionLogoutSucceeded,
  actionSignupSucceeded,
} = slice.actions;

export default slice.reducer;

// selectors
export const selectCurrentUser = (state) => state.userSlice;
