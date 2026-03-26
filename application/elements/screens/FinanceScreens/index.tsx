import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FinanceListScreen from './List';
import type { RootStackParamList } from '../../../navigation/types';
import { useTranslation } from '../../../helpers/lang';

const Stack = createNativeStackNavigator<RootStackParamList>();

const FinanceStack = () => {
  const t = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        animation: route.params?.noAnim ? 'none' : 'default',
      })}
    >
      <Stack.Screen
        name="FinanceList"
        component={FinanceListScreen}
        options={{
          title: t('finance'),
        }}
      />
    </Stack.Navigator>
  );
};

export default FinanceStack;
