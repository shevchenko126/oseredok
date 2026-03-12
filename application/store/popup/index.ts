import { AnyAction } from "redux";

import { initStore } from "./initStore";
import { IFilterType } from "./initStore.interface";

const popupReducer = (state = initStore, action: AnyAction) => {
    switch (action.type) {

        case "SET_OPEN_POPUP":

            return {
                ...state,
                previousPopup: state.currentPopup,
                eventTypeId: null,
                objectId: null,
                objectType: null,
                documentUrl: null,
                currentPopup: action.payload,
            };
        case "SET_POPUP_DOCUMENT_URL":
            return {
                ...state,
                documentUrl: action.payload,
                currentPopup: "document",
            };
            
        case "CLOSE_POPUP":
            return {
                ...state,
                eventTypeId: null,
                objectType: null,
                currentPopup: null
            };
            
        case "SET_OBJECT_POPUP":

            return {
                ...state,
                eventTypeId: action.payload.eventTypeId || null,
                objectId: action.payload.id,
                objectType: action.payload.type,
                currentPopup: action.payload.popup
            };
            
        case "SET_EVENT_TYPE_ID":

            return {
                ...state,
                eventTypeId: action.payload.eventTypeId
            };

        case "SET_PREVIOUS_POPUP":
            return {
                ...state,
                previousPopup: action.payload,
            };

        case "OPEN_PREVIOUS_POPUP":
            return {
                ...state,
                currentPopup: state.previousPopup,
                previousPopup: null
            };

        case "OPEN_FILTER_POPUP":
            return {
                ...state,
                currentPopup: "filter",
                filterType: action.payload as IFilterType,
            };

        case "SET_FILTER_STRING":
            return {
                ...state,
                filterString: action.payload,
                currentPopup: null
            };

        case "SET_SEARCH_KEYWORD":
            return {
                ...state,
                searchKeyword: action.payload
            };

        case "SET_OPEN_POPUP_WITH_EVENT_TYPE_ID":

            return {
                ...state,
                previousPopup: state.currentPopup,
                eventTypeId: action.payload.eventTypeId,
                currentPopup: action.payload.popup,
            };
        default:
            return state;
    }
};

export default popupReducer;
