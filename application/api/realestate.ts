import { Config } from 'react-native-config';
import { getToken } from '../helpers/keychain';

const API_URL = (Config && Config.API_AUTH_URL) || 'http://localhost:8000';

export interface Building {
  id: number;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  description?: string | null;
  is_active: boolean;
}

export interface Apartment {
  id: number;
  number: string;
  floor: number;
  rooms: number;
  area: number;
  building_id?: number | null;
  is_active: boolean;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
}

export const getBuildings = async (): Promise<{ data: PaginatedResponse<Building> | null; error: boolean }> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/api/v1/buildings/?page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const data: PaginatedResponse<Building> = await response.json();
    return { data, error: false };
  } catch (error) {
    console.error('getBuildings error:', error);
    return { data: null, error: true };
  }
};

export const getApartmentsByBuilding = async (
  building_id: number,
): Promise<{ data: PaginatedResponse<Apartment> | null; error: boolean }> => {
  try {
    const token = await getToken();
    const response = await fetch(
      `${API_URL}/api/v1/appartments/?building_id=${building_id}&page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const data: PaginatedResponse<Apartment> = await response.json();
    return { data, error: false };
  } catch (error) {
    console.error('getApartmentsByBuilding error:', error);
    return { data: null, error: true };
  }
};

export const setupBuilding = async (
  building_id: number,
  apartment_id: number,
  is_owner: boolean,
): Promise<{ data: unknown | null; error: boolean }> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/api/v1/auth/setup-building/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ building_id, apartment_id, is_owner }),
    });
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const data = await response.json();
    return { data, error: false };
  } catch (error) {
    console.error('setupBuilding error:', error);
    return { data: null, error: true };
  }
};
