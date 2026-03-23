import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from './Profile';
import EditProfileScreen from './Edit';
import NotificationsScreen from './Notifications';
import DeleteAccountScreen from './DeleteAccount';
import type { RootStackParamList } from '../../../navigation/types';
import { useTranslation } from '../../../helpers/lang';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProfileStack = () => {
  const t = useTranslation();

  return (
    <Stack.Navigator
    // screenOptions={{ animation: 'default' }}
      screenOptions={({ route }) => ({
        animation: route.params?.noAnim ? 'none' : 'default',
      })}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('profile'),
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: t('editProfile'),
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{
          title: t('deleteAccount'),
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: t('notifications'),
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
