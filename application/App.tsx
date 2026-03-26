import React, { useEffect, useCallback, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsStack from './elements/screens/NewsScreens';
import FinanceStack from './elements/screens/FinanceScreens';
import DocumentsStack from './elements/screens/DocumentsScreens';
import ProfileStack from './elements/screens/ProfileScreens';
import type { RootStackParamList } from './navigation/types';
import StartScreen from './elements/screens/auth/StartScreen';
import LoadingScreen from './elements/screens/tech/Loading';
import { getToken } from './helpers/keychain';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import ReduxProvider from './store/ReduxProvider';
import { AllPopups } from './elements/popups/AllPopups';
import * as Keychain from 'react-native-keychain';
import { AuthContext } from './helpers/auth';
import BottomMenu from './elements/components/navigation/BottomMenu';
import { navigationRef } from './navigation/navigationRef';
import {
  LanguageContext,
  DEFAULT_LANGUAGE,
  resolveLanguageCode,
  type LanguageCode,
} from './helpers/lang';
import { getMe } from './api/auth';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { resolveNotificationAction } from './helpers/pushNotifications';
import { store } from './store';
import notifee, { EventType as NotifeeEventType } from '@notifee/react-native';

enableScreens();

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);
  const [language, setLanguageState] = React.useState<LanguageCode>(DEFAULT_LANGUAGE);

  const changeLanguage = useCallback<React.Dispatch<React.SetStateAction<LanguageCode>>>((next) => {
    setLanguageState((prev) => {
      const nextValue = typeof next === 'function' ? next(prev) : next;
      return resolveLanguageCode(nextValue);
    });
  }, []);

  const logout = useCallback(async () => {
    await Keychain.resetGenericPassword();
    setIsAuth(false);
    changeLanguage(DEFAULT_LANGUAGE);
  }, [changeLanguage]);

  const loadToken = useCallback(async () => {
    const token = await getToken();
    setIsAuth(token !== null);
  }, []);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    if (!isAuth) return;

    let cancelled = false;
    (async () => {
      try {
        const { data } = await getMe();
        if (!cancelled && data?.language) {
          changeLanguage(resolveLanguageCode(data.language));
        }
      } catch (error) {
        console.error('Load language failed', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuth, changeLanguage]);

  const languageContextValue = useMemo(
    () => ({ language, setLanguage: changeLanguage }),
    [language, changeLanguage],
  );

  const openTaskFromNotification = useCallback((taskId: number) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('Finance');
    }

    store.dispatch({
      type: 'SET_OBJECT_POPUP',
      payload: {
        id: taskId,
        type: 'task',
        popup: 'TaskForm',
      },
    });
  }, []);

  const handleNotification = useCallback(
    (message: FirebaseMessagingTypes.RemoteMessage | { data?: Record<string, any> } | null) => {
      const action = resolveNotificationAction(message as any);

      console.log('Handling notification action:', action);
      if (!action) return;

      if (action.type === 'OPEN_TASK') {
        openTaskFromNotification(action.taskId);
      }
    },
    [openTaskFromNotification],
  );

  useEffect(() => {
    if (!isAuth) return;

    const unsubscribeOpen = messaging().onNotificationOpenedApp(handleNotification);

    messaging()
      .getInitialNotification()
      .then(handleNotification)
      .catch((error) => console.warn('Failed to fetch initial notification', error));

    return () => {
      unsubscribeOpen();
    };
  }, [handleNotification, isAuth]);



  useEffect(() => {
    if (!isAuth) return;

    const unsubNotifeeForeground = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === NotifeeEventType.PRESS || type === NotifeeEventType.ACTION_PRESS) {
        const data = detail.notification?.data;
        if (data) {
          handleNotification({ data });
        }
      }
    });

    notifee
      .getInitialNotification()
      .then((initial) => {
        const data = initial?.notification?.data;
        if (data) {
          handleNotification({ data });
        }
      })
      .catch((e) => console.warn('Notifee getInitialNotification failed', e));

    const unsub = messaging().onMessage(async (remoteMessage) => {
      const title = remoteMessage.notification?.title ?? 'Notification';
      const body = remoteMessage.notification?.body ?? '';

      console.log('Displaying local notification:', remoteMessage );

      await notifee.displayNotification({
        title,
        body,
        ios: {
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
        },
        data: remoteMessage.data,
      });
    });

    return () => {
      unsub();
      unsubNotifeeForeground();
    };
  }, [isAuth, handleNotification]);


  if (isAuth === null) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <LanguageContext.Provider value={languageContextValue}>
          <AuthContext.Provider value={{ logout, isAuth: Boolean(isAuth) }}>
            <NavigationContainer ref={navigationRef}>
                  {isAuth ? (
                    <>
                      <RootStack.Navigator
                        initialRouteName="News"
                        screenOptions={{ headerShown: false }}
                      >
                        <RootStack.Screen
                          name="News"
                          component={NewsStack}
                          options={({ route }) => ({
                            headerShown: false,
                            animation: route.params?.noAnim ? 'none' : 'default',
                          })}
                        />
                        <RootStack.Screen
                          name="Finance"
                          component={FinanceStack}
                          options={({ route }) => ({
                            headerShown: false,
                            animation: route.params?.noAnim ? 'none' : 'default',
                          })}
                        />
                        <RootStack.Screen
                          name="Documents"
                          component={DocumentsStack}
                          options={({ route }) => ({
                            headerShown: false,
                            animation: route.params?.noAnim ? 'none' : 'default',
                          })}
                        />
                        <RootStack.Screen
                          name="Profile"
                          component={ProfileStack}
                          options={({ route }) => ({
                            headerShown: false,
                            animation: route.params?.noAnim ? 'none' : 'default',
                          })}
                        />
                      </RootStack.Navigator>
                      <BottomMenu />
                    </>
                ) : (
                  <StartScreen onAuth={() => setIsAuth(true)} />
                )}
              <AllPopups />
            </NavigationContainer>
          </AuthContext.Provider>
        </LanguageContext.Provider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
