
import { Config } from "react-native-config";
import { getToken, saveToken } from "../../helpers/keychain";
import {
    ReadEventTypesApiV1EventTypesGetResponse,
    ReadEventTypeApiV1EventTypesEventTypeIdGetResponse,
    CreateNewEventTypeApiV1EventTypesPostResponse,
    UpdateExistingEventTypeApiV1EventTypesEventTypeIdPutResponse,
    DeleteExistingEventTypeApiV1EventTypesEventTypeIdDeleteResponse,
    EventTypeCreate,
    EventTypeUpdate,
    ReadEventTypeEventsApiV1EventTypesEventTypeIdEventsGetResponse
} from "../../dto/main/types.gen";

const API_MAIN_URL = Config && Config.API_MAIN_URL || "http://localhost:8001";
export interface IFilters {
    order_by?: string;
    order?: string;
    duration?: number;
    is_tasks?: boolean;
    is_notes?: boolean;
    search?: string | null;
}
export const getEventTypes = async (page: number = 1, filters: IFilters = {}) => {

  try {
    const token = await getToken();
    if (!token) throw new Error("No token");

    const qp: Record<string, string> = { page: String(page) };
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        qp[key] = String(value);
      }
    });
    const queryParams = new URLSearchParams(qp);

    console.log('request url:', `${API_MAIN_URL}/api/v1/event-types/?${queryParams.toString()}`);
    const response = await fetch(`${API_MAIN_URL}/api/v1/event-types/?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Проверка на статус 403
    if (response.status === 403) {
      console.warn('403 Forbidden – clearing token');
      await saveToken('');
      return { data: null, error: true, status: 403 };
    }

    if (!response.ok) {
      console.error(`Request failed with status ${response.status}`);
      return { data: null, error: true, status: response.status };
    }

    const data: ReadEventTypesApiV1EventTypesGetResponse = await response.json();
    return { data, error: false };

  } catch (error) {
    console.error('Error fetching event types:', error);
    await saveToken('');
    return { data: null, error: true, status: null };
  }
};


export const getSingleEventType = async (id: number) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/event-types/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const data: ReadEventTypeApiV1EventTypesEventTypeIdGetResponse = await response.json();

    return { data, error: false };

};

export const getEventsByEventType = async (id: number, page: number = 1) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/event-types/${id}/events/?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const data: ReadEventTypeEventsApiV1EventTypesEventTypeIdEventsGetResponse = await response.json();

    return { data, error: false };

};

export const createEventType = async (obj: EventTypeCreate) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/event-types/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    const data: CreateNewEventTypeApiV1EventTypesPostResponse = await response.json();

    return { data, error: false };

};

export const updateEventType = async (id:number, obj: EventTypeUpdate) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/event-types/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    const data: UpdateExistingEventTypeApiV1EventTypesEventTypeIdPutResponse = await response.json();

    return { data, error: false };

};

export const deleteEventType = async (id: number, newId: number | null) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/event-types/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ new_event_type_id: newId }),
    });

    const data: DeleteExistingEventTypeApiV1EventTypesEventTypeIdDeleteResponse = await response.json();

    return { data, error: false };

};