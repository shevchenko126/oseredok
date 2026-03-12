import { AnyAction } from "redux";

import { initStore } from "./initStore";

const filterReducer = (state = initStore, action: AnyAction) => {
    switch (action.type) {
        case "SET_SUCCESS_MESSAGE":
            return {
                ...state,
                successMessage: action.payload,
            };
        case "SET_ERROR_MESSAGE":
            return {
                ...state,
                errorMessage: action.payload,
            };
        case "SET_INFO_MESSAGE":
            return {
                ...state,
                infoMessage: action.payload,
            };
        case "CLEAR_MESSAGES":
            return {
                ...state,
                successMessage: "",
                errorMessage: "",
                infoMessage: "",
            };
        default:
            return state;
    }
};

export default filterReducer;
