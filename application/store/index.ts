import { createStore, combineReducers } from "redux";

import filterReducer from "./filter";
import popupReducer from "./popup";
import userMessageReducer from "./userMessage";

export const store = createStore(
    combineReducers({
        filter: filterReducer,
        popup: popupReducer,
        userMessage: userMessageReducer,
    }),
);
