import { Config } from "react-native-config";
import { getToken, saveToken } from "../../helpers/keychain";
import {
    ReadNotesApiV1NotesGetResponse,
    ReadNoteApiV1NotesNoteIdGetResponse,
    CreateNewNoteApiV1NotesPostResponse,
    UpdateExistingNoteApiV1NotesNoteIdPutResponse,
    DeleteExistingNoteApiV1NotesNoteIdDeleteResponse,
    NoteCreate,
    NoteUpdate,
} from "../../dto/main/types.gen";

const API_MAIN_URL = (Config && (Config as any).API_MAIN_URL) || "http://localhost:8001";

export interface INotesFilters {
    order_by?: string;
    order?: string;
    is_completed?: boolean;
    is_deadline?: boolean;
    is_attachements?: boolean;
    title?: string;
    search?: string | null;
}

export const getNotes = async (page: number = 1, eventTypeId?: number, filters: INotesFilters = {}) => {
    try {
        const token = await getToken();
        if (!token) throw new Error("No token");

        const qp: Record<string, string> = { page: String(page) };

        if (eventTypeId) {
            qp.event_type_id = String(eventTypeId);
        }

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                qp[key] = String(value);
            }
        });

        const queryParams = new URLSearchParams(qp);

        const response = await fetch(`${API_MAIN_URL}/api/v1/notes/?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 403) {
            await saveToken('');
            return { data: null, error: true, status: 403 };
        }

        if (!response.ok) {
            return { data: null, error: true, status: response.status };
        }

        const data: ReadNotesApiV1NotesGetResponse = await response.json();
        return { data, error: false, status: response.status };
    } catch (error) {
        console.warn('Failed to fetch notes', error);
        await saveToken('');
        return { data: null, error: true, status: null };
    }
};

export const getSingleNote = async (id: number) => {
    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/notes/${id}/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data: ReadNoteApiV1NotesNoteIdGetResponse = await response.json();
    return { data, error: false };
};

export const createNote = async (obj: NoteCreate) => {
    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/notes/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
    });

    const data: CreateNewNoteApiV1NotesPostResponse = await response.json();
    return { data, error: false };
};

export const updateNote = async (id: number, obj: NoteUpdate) => {
    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/notes/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
    });

    const data: UpdateExistingNoteApiV1NotesNoteIdPutResponse = await response.json();
    return { data, error: false };
};

export const deleteNote = async (id: number) => {
    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/notes/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data: DeleteExistingNoteApiV1NotesNoteIdDeleteResponse = await response.json();
    return { data, error: false };
};

