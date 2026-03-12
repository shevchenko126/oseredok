import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NotesListScreen from './List';
import type { RootStackParamList } from '../../navigation/types';
import { useTranslation } from '../../helpers/lang';

export type NotesStackParams = {
  NotesList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const NotesStack = () => {
  const t = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        animation: route.params?.noAnim ? 'none' : 'default',
      })}
    >
      <Stack.Screen
        name="NotesList"
        component={NotesListScreen}
        options={{
          title: t('notes'),
        }}
      />
    </Stack.Navigator>
  );
};

export default NotesStack;

