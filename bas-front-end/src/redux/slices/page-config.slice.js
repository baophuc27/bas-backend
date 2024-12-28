import { createSlice } from "@reduxjs/toolkit";
import { breadcrumbs } from "setup/breadcrumbs";

const initialState = {
  titleId: "",
  titleParams: {},
  showsBreadcrumbs: true,
  featureBreadcrumbs: {},
  pageBreadcrumbs: {},
};

export const pageConfigSlice = createSlice({
  name: "page-config",
  initialState,
  reducers: {
    setPageTitle: (state, action) => {
      const { id, params = {} } = action?.payload;

      state.titleId = id;
      state.titleParams = params;
      state.showsBreadcrumbs = true;
    },
    hideBreadcrumbs: (state) => {
      state.showsBreadcrumbs = false;
    },
    setBreadcrumbsList: (state, action) => {
      const { id } = action?.payload;
      console.log("id", id);
      const [featureId, pageId] = id?.split(":");

      state.featureBreadcrumbs = breadcrumbs?.[featureId] || {};
      state.pageBreadcrumbs = breadcrumbs?.[featureId]?.[pageId] || {};
    },
  },
});

export const { setPageTitle, hideBreadcrumbs, setBreadcrumbsList } =
  pageConfigSlice.actions;

export default pageConfigSlice.reducer;
