import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionCompleteDialogs: {},
  errorDialogs: {},
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setCurrentErrorDialog: (state, action) => {
      const { berthId, errorCode } = action?.payload;

      state["errorDialogs"][berthId] = errorCode;
    },

    setCurrentSessionCompleteDialog: (state, action) => {
      const { berthId } = action?.payload;

      state["sessionCompleteDialogs"][berthId] = true;
    },

    resetErrorDialog: (state) => {
      state.errorDialogs = {};
    },
    resetSessionCompleteDialog: (state) => {
      state.sessionCompleteDialogs = {};
    },
  },
});

export const {
  setCurrentErrorDialog,
  setCurrentSessionCompleteDialog,
  resetErrorDialog,
  resetSessionCompleteDialog,
} = dialogSlice.actions;

export default dialogSlice.reducer;
