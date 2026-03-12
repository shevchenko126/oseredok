import { Config } from "react-native-config";
import { getToken, saveToken } from "../../helpers/keychain";
import {
    ReadTasksApiV1TasksGetResponse,
    ReadTaskApiV1TasksTaskIdGetResponse,
    CreateNewTaskApiV1TasksPostResponse,
    UpdateExistingTaskApiV1TasksTaskIdPutResponse,
    DeleteExistingTaskApiV1TasksTaskIdDeleteResponse,
    TaskCreate,
    TaskUpdate,
} from "../../dto/main/types.gen";

const API_MAIN_URL = (Config && (Config as any).API_MAIN_URL) || "http://localhost:8001";

export interface ITasksFilters {
    order_by?: string;
    order?: string;
    is_completed?: boolean;
    is_deadline?: boolean;
    search?: string | null;
}

export const getTasks = async (page: number = 1, eventTypeId?: number, filters: ITasksFilters = {}) => {
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

        const response = await fetch(`${API_MAIN_URL}/api/v1/tasks/?${queryParams.toString()}`, {
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

        const data: ReadTasksApiV1TasksGetResponse = await response.json();
        return { data, error: false, status: response.status };
    } catch (error) {
        console.warn('Failed to fetch tasks', error);
        await saveToken('');
        return { data: null, error: true, status: null };
    }
};

export const getSingleTask = async (id: number) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/tasks/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const data: ReadTaskApiV1TasksTaskIdGetResponse = await response.json();

    return { data, error: false };

};


export const createTask = async (obj: TaskCreate) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    const data: CreateNewTaskApiV1TasksPostResponse = await response.json();

    return { data, error: false };

};

export const updateTask = async (id:number, obj: TaskUpdate) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/tasks/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    const data: UpdateExistingTaskApiV1TasksTaskIdPutResponse = await response.json();

    return { data, error: false };

};

export const deleteTask = async (id: number) => {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_MAIN_URL}/api/v1/tasks/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: DeleteExistingTaskApiV1TasksTaskIdDeleteResponse = await response.json();

    return { data, error: false };

};
