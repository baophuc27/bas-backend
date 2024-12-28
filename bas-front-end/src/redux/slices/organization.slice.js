import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name_vi: "",
  name_en: "",
  address: "",
  description: "",
  url_logo: "",
  orgId: "",
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
        state["logo_url"] =
          "https://api.vnemisoft.com/" + action?.payload?.logo;
      }
      if (action?.payload?.orgId) {
        state["orgId"] = action?.payload?.orgId;
      }
    },
  },
});

export const { setOrganizationData, resetState } = organizationSlice.actions;

export default organizationSlice.reducer;
