import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TasksListScreen from './List';
import type { RootStackParamList } from '../../../navigation/types';
import { useTranslation } from '../../../helpers/lang';

export type TaskStackParams = {
  TasksList: undefined;
  TasksSingle: { eventTypeId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const TaskStack = () => {
  const t = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        animation: route.params?.noAnim ? 'none' : 'default',
      })}
    >
      <Stack.Screen
        name="TasksList"
        component={TasksListScreen}
        options={{
          title: t('tasks'),
        }}
      />
    </Stack.Navigator>
  );
};

export default TaskStack;
