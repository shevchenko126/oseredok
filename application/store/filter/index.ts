import { AnyAction } from "redux";

import { initStore } from "./initStore";

const filterReducer = (state = initStore, action: AnyAction) => {
    switch (action.type) {
        case "SET_AUTO_TYPE":
            return {
                ...state,
                autoType: action.name,
            };
        case "SET_BODY":
            return {
                ...state,
                autoBody: action.name,
            };
        case "SET_AUTO_BRAND":
            return {
                ...state,
                autoBrand: action.name,
            };
        case "SET_BUDGET_FROM":
            return {
                ...state,
                budgetFrom: action.name,
            };
        case "SET_BUDGET_TO":
            return {
                ...state,
                budgetTo: action.name,
            };
        case "SET_YEAR_ISSUE_FROM":
            return {
                ...state,
                yearIssueFrom: action.name,
            };
        case "SET_YEAR_ISSUE_TO":
            return {
                ...state,
                yearIssueTo: action.name,
            };
        case "SET_MILEAGE_FROM":
            return {
                ...state,
                mileageFrom: action.name,
            };
        case "SET_MILEAGE_TO":
            return {
                ...state,
                mileageTo: action.name,
            };
        case "SET_DAMAGE_TYPE":
            return {
                ...state,
                damageType: action.name,
            };
        case "SET_VIN_OR_LOT":
            return {
                ...state,
                vinOrLot: action.name,
            };
        default:
            return state;
    }
};

export default filterReducer;
