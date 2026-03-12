
export enum IFilterType {
    EVENT_TYPES = "eventTypes",
    TASKS = "tasks",
    NOTES = "notes"
}

export default interface IPopupInitStore {
    currentPopup: string | null;
    previousPopup: string | null;
    eventTypeId: number | null;
    objectId: number | null;
    objectType: string | null;
    documentUrl: string | null;
    isBottomAddMenuOpen: boolean;
    filterType: IFilterType | null;
    filterString: string | null;
    searchKeyword: string | null;
}

