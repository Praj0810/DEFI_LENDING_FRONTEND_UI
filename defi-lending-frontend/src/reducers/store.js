import { combineReducers, configureStore } from "@reduxjs/toolkit";
//import getDefaultMiddleware from '@reduxjs/toolkit';

import tokenReducer from "./stateReducer";

const rootReducer = combineReducers({
    token: tokenReducer,
})

const store = configureStore({ 
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),});

export default store;