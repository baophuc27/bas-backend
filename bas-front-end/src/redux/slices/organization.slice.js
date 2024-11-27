import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name_vi: "",
  name_en: "",
  address: "",
  description: "",
  logo_url: "",
};

export const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganizationData: (state, action) => {
      if (action?.payload?.name) {
        state["name_vi"] = action?.payload?.name;
      }

      if (action?.payload?.nameEn) {
        state["name_en"] = action?.payload?.nameEn;
      }

      if (action?.payload?.address) {
        state["address"] = action?.payload?.address;
      }

      if (action?.payload?.description) {
        state["description"] = action?.payload?.description;
      }

      if (action?.payload?.logo) {
        state["logo_url"] = action?.payload?.logo;
      }
    },
  },
});

export const { setOrganizationData, resetState } = organizationSlice.actions;

export default organizationSlice.reducer;
