import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const berthSlice = createSlice({
  name: "berth",
  initialState,
  reducers: {
    setStatuses: (state, action) => {
      const statuses = action?.payload;

      for (let status of statuses) {
        state[status?.id] = status;
      }
    },
  },
});

export const { setStatuses } = berthSlice.actions;

export default berthSlice.reducer;
