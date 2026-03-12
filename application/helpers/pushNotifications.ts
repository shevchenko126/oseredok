import '@react-native-firebase/app';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { registerDevice } from '../api/devices';

type NotificationEvent = 'deadline_ended' | string;

export type PushNotificationPayload = {
  notification_event?: NotificationEvent;
  title?: string;
  message?: string;
  link?: string;
  task_id?: string;
};

export const requestPushPermissionAndGetToken = async (): Promise<string | null> => {
  try {
    const authStatus = await messaging().requestPermission({
      alert: true,
      badge: true,
      sound: true,
    });

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      return null;
    }

    const token = await messaging().getToken();

    registerDevice({
      token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
    });

    return token;
  } catch (error) {
    console.warn('Failed to request push permission', error);
    return null;
  }
};

export const getPlatformName = () => (Platform.OS === 'ios' ? 'ios' : 'android');

export const extractNotificationPayload = (
  message: FirebaseMessagingTypes.RemoteMessage | null,
): PushNotificationPayload | null => {
  if (!message) return null;

  return {
    notification_event: message.data?.notification_event as NotificationEvent | undefined,
    title: message.notification?.title || message.data?.title as string | undefined,
    message: message.notification?.body || message.data?.message as string | undefined,
    link: message.data?.link as string | undefined,
    task_id: message.data?.task_id as string | undefined,
  };
};

export const resolveNotificationAction = (
  message: FirebaseMessagingTypes.RemoteMessage | null,
): { type: 'OPEN_TASK'; taskId: number } | null => {
  const payload = extractNotificationPayload(message);

  console.log('Resolved notification payload:', payload);
  if (!payload?.notification_event) {
    return null;
  }

  if (payload.notification_event === "deadline_ended") {
    const taskIdString = payload.task_id || '';
    const taskId = parseInt(taskIdString, 10);
    if (!Number.isNaN(taskId)) {
      return { type: 'OPEN_TASK', taskId } as const;
    }
  }

  return null;
};
export const subscribeTokenRefresh = () =>
  messaging().onTokenRefresh(async (token) => {
    registerDevice({
      token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
    });
    
    return token;
  });