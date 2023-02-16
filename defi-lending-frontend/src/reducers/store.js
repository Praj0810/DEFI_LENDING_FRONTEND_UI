import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./stateReducer";

const rootReducer = combineReducers({
    token: tokenReducer,
})

const store = configureStore({ reducer: rootReducer });

export default store;