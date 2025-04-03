import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  berthFormValues: {},
};

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
    setBerthFormValues: (state, action) => {
      state.berthFormValues = action?.payload;
    },
  },
});

export const { setStatuses, setBerthFormValues } = berthSlice.actions;

export default berthSlice.reducer;
