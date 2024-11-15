import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  berth_statuses: {},
  user_roles: {},
  user_roles_arr: [],
  berths: [],
};

export const enumerationSlice = createSlice({
  name: "enumeration",
  initialState,
  reducers: {
    setBerthStatuses: (state, action) => {
      const statuses = action?.payload;

      for (let status of statuses) {
        state["berth_statuses"][status?.id] = status;
      }
    },
    setUserRoles: (state, action) => {
      const roles = action?.payload;

      for (let role of roles) {
        state["user_roles"][role?.id] = role;
      }

      state["user_roles_arr"] = roles;
    },
    setBerths: (state, action) => {
      state.berths = action?.payload;
    },
  },
});

export const { setBerthStatuses, setUserRoles, setBerths } =
  enumerationSlice.actions;

export default enumerationSlice.reducer;
