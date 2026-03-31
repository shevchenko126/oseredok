import { Config } from 'react-native-config';
import { getToken } from '../../helpers/keychain';

const API_URL = (Config && (Config as any).API_AUTH_URL) || 'http://localhost:8000';

export interface Account {
  id: number;
  appartment_id: number;
  balance: string;
}

export interface Envelope {
  id: number;
  building_id: number;
  title: string;
  link: string;
  created_by_id: number | null;
  created_at: string | null;
}

export interface PaymentIn {
  id: number;
  building_id: number;
  description: string | null;
  amount: string;
  is_approved: boolean;
  file_id: string | null;
  created_by_id: number | null;
  created_at: string | null;
}

export interface PaymentInCreate {
  building_id: number;
  description?: string | null;
  amount: string;
  file_id?: string | null;
}

export interface PaymentOut {
  id: number;
  building_id: number;
  description: string | null;
  amount: string;
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

export const uploadPaymentFile = async (asset: { uri?: string; fileName?: string | null; type?: string | null }) => {
  try {
    const token = await getToken();
    const formData = new FormData();
    formData.append('file', {
      uri: asset.uri,
      name: asset.fileName ?? `photo_${Date.now()}.jpg`,
      type: asset.type ?? 'image/jpeg',
    } as any);
    const res = await fetch(`${API_URL}/api/v1/storage/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) return { data: null, error: true };
    const data: { uuid: string; filename: string; file_type: string } = await res.json();
    return { data, error: false };
  } catch {
    return { data: null, error: true };
  }
};

export const createPaymentIn = async (payload: PaymentInCreate) => {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_URL}/api/v1/finance/payments-in/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { data: null, error: true };
    const data: PaymentIn = await res.json();
    return { data, error: false };
  } catch {
    return { data: null, error: true };
  }
};

export const getAccountByApartment = async (appartment_id: number) => {
  try {
    const headers = await authHeaders();
    const res = await fetch(
      `${API_URL}/api/v1/finance/accounts/by-appartment/${appartment_id}/`,
      { headers },
    );
    if (!res.ok) return { data: null, error: true };
    const data: Account = await res.json();
    return { data, error: false };
  } catch {
    return { data: null, error: true };
  }
};

export const getEnvelopes = async (building_id: number, page = 1) => {
  try {
    const headers = await authHeaders();
    const res = await fetch(
      `${API_URL}/api/v1/finance/envelopes/?building_id=${building_id}&page=${page}`,
      { headers },
    );
    if (!res.ok) return { data: null, error: true };
    const data: PaginatedResponse<Envelope> = await res.json();
    return { data, error: false };
  } catch {
    return { data: null, error: true };
  }
};

export const getPaymentsIn = async (building_id: number, page = 1) => {
  try {
    const headers = await authHeaders();
    const res = await fetch(
      `${API_URL}/api/v1/finance/payments-in/?building_id=${building_id}&page=${page}`,
      { headers },
    );
    if (!res.ok) return { data: null, error: true };
    const data: PaginatedResponse<PaymentIn> = await res.json();
    return { data, error: false };
  } catch {
    return { data: null, error: true };
  }
};

export const getPaymentsOut = async (building_id: number, page = 1) => {
  try {
    const headers = await authHeaders();
    const res = await fetch(
      `${API_URL}/api/v1/finance/payments-out/?building_id=${building_id}&page=${page}`,
      { headers },
    );
    if (!res.ok) return { data: null, error: true };
    const data: PaginatedResponse<PaymentOut> = await res.json();
    return { data, error: false };
  } catch {
    return { data: null, error: true };
  }
};
