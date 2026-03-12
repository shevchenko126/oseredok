import React from 'react';
import { getMe } from '../api/auth';
import { Text } from 'react-native';

export const NOTIFICATION_VALUES = [true, false] as const;

export type NotificationValue = (typeof NOTIFICATION_VALUES)[number];

export const DEFAULT_NOTIFICATION: NotificationValue = true;

interface NotificationContextValue {
  notification: NotificationValue;
  setNotification: React.Dispatch<React.SetStateAction<NotificationValue>>;
}

export const NotificationContext = React.createContext<NotificationContextValue>({
  notification: DEFAULT_NOTIFICATION,
  setNotification: () => undefined,
});

export const useNotification = () => {
  const { notification, setNotification } = React.useContext(NotificationContext);
  return { notification, setNotification };
};

export const NotificationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [notification, setNotification] = React.useState<NotificationValue>(DEFAULT_NOTIFICATION);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const meReq = await getMe(); // ожидаем { is_notifications_enabled: boolean }
        const me = meReq.data;
        if (!cancelled && typeof me?.is_notifications_enabled === 'boolean') {
          setNotification(!!me.is_notifications_enabled);
        }
      } catch (e) {
        console.warn('Failed to load default notification value', e);
        // оставим DEFAULT_NOTIFICATION
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = React.useMemo(
    () => ({ notification, setNotification, hydrated }),
    [notification, hydrated]
  );

  return (
    <NotificationContext.Provider value={value}>
      <Text>1111</Text>
      {children}
    </NotificationContext.Provider>
  );
};