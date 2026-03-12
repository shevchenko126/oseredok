import IPopupInitStore from "./initStore.interface";

export const initStore: IPopupInitStore = {
    currentPopup: null,
    previousPopup: null,
    objectId: null,
    objectType: null,
    documentUrl: null,
    isBottomAddMenuOpen: false,
    filterType: null,
    eventTypeId: null,
    filterString: null,
    searchKeyword: null,
};
