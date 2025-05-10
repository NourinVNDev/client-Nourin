// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Local storage
// import userReducer from "../Features/userSlice";
// import managerReducer from "../Features/managerSlice";
// import verifierReducer from '../Features/verifierSlice'
// import { combineReducers } from "redux";


// const rootReducer = combineReducers({
//   user: userReducer,
//   manager: managerReducer,
//   verifier:verifierReducer
// });


// const persistConfig = {
//   key: "root",
//   storage, 

// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);


// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       immutableCheck: false,
//       serializableCheck: false,
//     }),
// });


// export const persistor = persistStore(store);

// // Infer types
// export type reduxStore = typeof store;  
// export type RootState = ReturnType<reduxStore["getState"]>;
// export type AppDispatch = reduxStore["dispatch"];


import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage
import userReducer from "../Features/userSlice";
import managerReducer from "../Features/managerSlice";
import { combineReducers } from "redux";
import verifierReducer from "../Features/verifierSlice";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  manager: managerReducer,
  verifier:verifierReducer
});

// Persist config
const persistConfig = {
  key: "root",
  storage, // Uses local storage
  whitelist: ["user","manager"], // Persist only the user reducer
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for redux-persist
    }),
});

// Persistor
export const persistor = persistStore(store);

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;