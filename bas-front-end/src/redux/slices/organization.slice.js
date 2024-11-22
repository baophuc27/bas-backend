import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null, // Thêm orgId vào state
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
      if (action?.payload?.id) {
        state["id"] = action?.payload?.id; // Lưu orgId
      }
      if (action?.payload?.name) {
        state["name_vi"] = action?.payload?.name;
      }

      if (action?.payload?.nameEn) {
        state["name_en"] = action?.payload?.nameEn || action?.payload?.name;
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

export const { setOrganizationData } = organizationSlice.actions;

export default organizationSlice.reducer;
