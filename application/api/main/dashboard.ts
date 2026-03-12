
import { Config } from "react-native-config";
import { getToken } from "../../helpers/keychain";
import {
    ReadTotalDashboardApiV1DashboardGetResponse
} from "../../dto/main/types.gen";

const API_MAIN_URL = Config && Config.API_MAIN_URL || "http://localhost:8001";


export const getDashboardTotal = async () => {

    const token = await getToken();
    if (!token) throw new Error("No token");


    const response = await fetch(`${API_MAIN_URL}/api/v1/dashboard/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const data: ReadTotalDashboardApiV1DashboardGetResponse = await response.json();

    return { data, error: false };

};


export const getDashboardEventType = async (event_type_id: number) => {

    const token = await getToken();
    if (!token) throw new Error("No token");


    const response = await fetch(`${API_MAIN_URL}/api/v1/dashboard/?event_type_id=${event_type_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const data: ReadTotalDashboardApiV1DashboardGetResponse = await response.json();

    return { data, error: false };

};
