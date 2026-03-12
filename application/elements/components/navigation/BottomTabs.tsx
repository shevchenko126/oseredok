import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../helpers/lang';

import Home from '../../screens/Home';
import Search from '../../screens/Search';
import Bookings from '../../screens/Bookings';
import Profile from '../../screens/ProfileScreens/Profile';

type TabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomTabs() {
  const t = useTranslation();
  const labels: Record<keyof TabParamList, string> = {
    Home: t('home'),
    Search: t('search'),
    Bookings: t('bookings'),
    Profile: t('profile'),
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1d4ed8',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabel: labels[route.name],
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof TabParamList, 'home' | 'search' | 'event-note' | 'person'> = {
            Home: 'home',
            Search: 'search',
            Bookings: 'event-note',
            Profile: 'person',
          };
          return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Bookings" component={Bookings} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}