import { Config } from 'react-native-config';
import { getToken } from '../../helpers/keychain';

export interface NotificationDto {
  id?: number | string;
  title?: string;
  description?: string;
  message?: string;
  body?: string;
  created_on?: string;
  created_at?: string;
  sent_at?: string;
  is_read?: boolean;
  read?: boolean;
}

export interface NotificationsResponse {
  items?: NotificationDto[];
  results?: NotificationDto[];
  data?: NotificationDto[];
  notifications?: NotificationDto[];
  next?: string | null;
  previous?: string | null;
  page?: number;
  total_pages?: number;
  totalPages?: number;
  pagination?: {
    next?: number | null;
    next_page?: number | null;
  };
}

const API_MAIN_URL = (Config && (Config as any).API_MAIN_URL) || 'http://localhost:8001';

interface NotificationsResult {
  data: NotificationsResponse | NotificationDto[] | null;
  error: boolean;
  status?: number;
}

const buildUrl = (page: number) => `${API_MAIN_URL}/api/v1/notifications/?page=${page}`;

export const getNotifications = async (page: number = 1): Promise<NotificationsResult> => {
  const token = await getToken();
  if (!token) throw new Error('No token');

  const response = await fetch(buildUrl(page), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      return { data: null, error: true, status: response.status };
    }

    const message = await response.text();
    throw new Error(message || 'Failed to load notifications');
  }

  const data = (await response.json()) as NotificationsResponse | NotificationDto[];

  return { data, error: false, status: response.status };
};
