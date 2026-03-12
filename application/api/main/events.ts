
import { Config } from "react-native-config";
import { getToken } from "../../helpers/keychain";
import {
    ReadEventsApiV1EventsGetResponse,
    ReadEventApiV1EventsEventIdGetResponse,
    CreateNewEventApiV1EventsPostResponse,
    UpdateExistingEventApiV1EventsEventIdPutResponse,
    DeleteExistingEventApiV1EventsEventIdDeleteResponse,
    EventCreate,
    EventUpdate,
} from "../../dto/main/types.gen";

const API_MAIN_URL = Config && Config.API_MAIN_URL || "http://localhost:8001";


export const getEvents = async (page: number = 1, eventTypeId: number | null) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/events/?page=${page}${eventTypeId ? `&event_type_id=${eventTypeId}` : ''}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const data: ReadEventsApiV1EventsGetResponse = await response.json();

    return { data, error: false };

};


export const getSingleEvent = async (id: number) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/events/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const data: ReadEventApiV1EventsEventIdGetResponse = await response.json();

    return { data, error: false };

};


export const createEvent = async (obj: EventCreate) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/events/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    const data: CreateNewEventApiV1EventsPostResponse = await response.json();

    return { data, error: false };

};

export const updateEvent = async (id:number, obj: EventUpdate) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/events/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    const data: UpdateExistingEventApiV1EventsEventIdPutResponse = await response.json();

    return { data, error: false };

};

export const deleteEvent = async (id: number) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/events/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: DeleteExistingEventApiV1EventsEventIdDeleteResponse = await response.json();

    return { data, error: false };

};




export const pauseEvent = async (id: number, description: string) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/events/pause/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description }),
    });

    const data: Event = await response.json();

    return { data, error: false };
};

export const continueEvent = async (id: number, description: string) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/events/continue/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description }),
    });

    const data: Event = await response.json();

    return { data, error: false };
};

export const stopEvent = async (id: number, description: string) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/events/stop/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description }),
    });

    const data: Event = await response.json();

    return { data, error: false };
};