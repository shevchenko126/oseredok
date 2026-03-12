import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EventTypesListScreen from './List';
import EventTypesSingleScreen from './SingleEventType';
import type { RootStackParamList } from '../../navigation/types';
import { useTranslation } from '../../helpers/lang';

export type EventTypeStackParams = {
  EventTypesList: undefined;
  EventTypesSingle: { eventTypeId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const EventTypeStack = () => {
  const t = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        animation: route.params?.noAnim ? 'none' : 'default',
      })}
  >
      <Stack.Screen
        name="EventTypesList"
        component={EventTypesListScreen}
        options={{
          title: t('eventTypes'),
        }}
      />
      <Stack.Screen
        name="EventTypesSingle"
        component={EventTypesSingleScreen}
        options={{
          title: t('eventType'),
        }}
      />
    </Stack.Navigator>
  );
};

export default EventTypeStack;
