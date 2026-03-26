import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DocumentsListScreen from './List';
import type { RootStackParamList } from '../../../navigation/types';
import { useTranslation } from '../../../helpers/lang';

const Stack = createNativeStackNavigator<RootStackParamList>();

const DocumentsStack = () => {
  const t = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        animation: route.params?.noAnim ? 'none' : 'default',
      })}
    >
      <Stack.Screen
        name="DocumentsList"
        component={DocumentsListScreen}
        options={{
          title: t('documents'),
        }}
      />
    </Stack.Navigator>
  );
};

export default DocumentsStack;
