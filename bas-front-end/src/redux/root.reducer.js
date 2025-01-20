import { combineReducers } from "redux";
import berthReducer from "./slices/berth.slice";
import dialogReducer from "./slices/dialog.slice";
import enumerationReducer from "./slices/enumeration.slice";
import habourReducer from "./slices/habour.slice";
import organizationReducer from "./slices/organization.slice";
import pageConfigReducer from "./slices/page-config.slice";
import userReducer from "./slices/user.slice";
import deviceReducer from "./slices/device.slice";

export const rootReducers = combineReducers({
  user: userReducer,
  pageConfig: pageConfigReducer,
  organization: organizationReducer,
  berth: berthReducer,
  habour: habourReducer,
  enumeration: enumerationReducer,
  dialog: dialogReducer,
  device: deviceReducer,
});
