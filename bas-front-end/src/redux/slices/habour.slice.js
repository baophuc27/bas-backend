import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name_vi: "",
  name_en: "",
  address: "",
  description: "",
  weather_widget_url: "",
  weather_widget_dashboard_url: "",
};

export const habourSlice = createSlice({
  name: "habour",
  initialState,
  reducers: {
    setHabourData: (state, action) => {
      state["name_vi"] = action?.payload?.name;
      state["name_en"] = action?.payload?.nameEn || action?.payload?.name;
      state["address"] = action?.payload?.address;
      state["description"] = action?.payload?.description;
      state["weather_widget_url"] = action?.payload?.weatherWidgetUrl;
      state["weather_widget_dashboard_url"] =
        action?.payload?.weatherWidgetDashboardUrl;
    },
  },
});

export const { setHabourData } = habourSlice.actions;

export default habourSlice.reducer;
