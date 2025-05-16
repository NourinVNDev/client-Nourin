
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage
import userReducer from "../Features/userSlice";
import managerReducer from "../Features/managerSlice";
import { combineReducers } from "redux";
import verifierReducer from "../Features/verifierSlice";
import adminReducer from "../Features/adminSlice";
// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  manager: managerReducer,
  verifier:verifierReducer,
  admin:adminReducer
});


const persistConfig = {
  key: "root",
  storage, 
  whitelist: ["user","manager","verifier","admin"],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;