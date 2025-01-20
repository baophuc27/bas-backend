import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devices: [],
  loading: false,
  error: null,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    getDevicesStart: (state) => {
      state.loading = true;
    },
    getDevicesSuccess: (state, action) => {
      state.loading = false;
      state.devices = action.payload;
      state.error = null;
    },
    getDevicesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getDevicesStart, getDevicesSuccess, getDevicesFailure } = deviceSlice.actions;
export default deviceSlice.reducer;
