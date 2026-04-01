import { Config } from 'react-native-config';
import { getToken } from '../../helpers/keychain';

const API_URL = (Config && (Config as any).API_AUTH_URL) || 'http://localhost:8000';

export interface Document {
  id: number;
  building_id: number;
  title: string;
  file_id: string | null;
  created_by_id: number | null;
  created_at: string | null;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  total_pages: number;
}

const authHeaders = async () => {
  const token = await getToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getDocuments = async (building_id: number, page = 1) => {
  try {
    const headers = await authHeaders();
    const res = await fetch(
      `${API_URL}/api/v1/documents/?building_id=${building_id}&page=${page}`,
      { headers },
    );
    if (!res.ok) return { data: null, error: true };
    const data: PaginatedResponse<Document> = await res.json();
    return { data, error: false };
  } catch {
    return { data: null, error: true };
  }
};

export const getFileUrl = (file_id: string): string =>
  `${API_URL}/api/v1/storage/${file_id}/`;
