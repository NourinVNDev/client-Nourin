import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage
import userReducer from "../Features/userSlice";
import managerReducer from "../Features/managerSlice";
import { combineReducers } from "redux";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  manager: managerReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage, 
  // whitelist: ["user","manager"],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false, // Disable serializability check for redux-persist
    }),
});


export const persistor = persistStore(store);

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
