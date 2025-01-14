export const SESSION_DURATION = 1000 * 60 * 60; // 1 hour
export const SPECIAL_PAGE_DURATION = 1000 * 60 * 60 * 6; // 6 hours

import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducers } from "./root.reducer";

const persistConfig = {
  key: "bas_dev",
  version: 1,
  storage,
  whitelist: [
    "user",
    "pageConfig",
    "organization",
    "habour",
    "berth",
    "dialog",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
