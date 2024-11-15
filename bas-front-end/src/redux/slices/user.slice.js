import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: {},
  isLoggedIn: false,
  token: "",
  refreshToken: "",
  roleId: 3,
  permissions: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.auth = action?.payload;
      state.isLoggedIn = true;
      state.token = action?.payload?.token;
      state.refreshToken = action?.payload?.refreshToken;
      state.roleId = action?.payload?.roleId;
      if (action?.payload?.permissions) {
        state.permissions = action?.payload?.permissions;
      }
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.auth = null;
      state.token = null;
      state.refreshToken = null;
      state.roleId = 3;
      state.permissions = [];
    },
    updateInfo: (state, action) => {
      const { avatar, fullName } = action?.payload;

      state["auth"]["auth"]["avatar"] = avatar;
      state["auth"]["auth"]["fullName"] = fullName;
    },
  },
});

export const { logIn, logOut, updateInfo } = userSlice.actions;

export default userSlice.reducer;
