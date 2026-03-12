import { Config } from 'react-native-config';
import { getToken } from '../helpers/keychain';

const API_NOTIFICATION_URL = (Config && Config.API_NOTIFICATION_URL) || 'http://localhost:8003';

interface RegisterDevicePayload {
  token: string;
  platform: string;
}

export const registerDevice = async (payload: RegisterDevicePayload) => {

  try {
    const authToken = await getToken();
    if (!authToken) throw new Error('No auth token');

    const response = await fetch(`${API_NOTIFICATION_URL}/api/v1/devices/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_id: payload.token,
        platform: payload.platform,
      }),
    });

    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }

    return { error: false } as const;
  } catch (error) {
    console.error('Failed to register device token', error);
    return { error: true } as const;
  }
};
