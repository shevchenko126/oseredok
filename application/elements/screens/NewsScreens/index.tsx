import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NewsListScreen from './List';
import type { RootStackParamList } from '../../../navigation/types';
import { useTranslation } from '../../../helpers/lang';

const Stack = createNativeStackNavigator<RootStackParamList>();

const NewsStack = () => {
  const t = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        animation: route.params?.noAnim ? 'none' : 'default',
      })}
    >
      <Stack.Screen
        name="NewsList"
        component={NewsListScreen}
        options={{
          title: t('news'),
        }}
      />
    </Stack.Navigator>
  );
};

export default NewsStack;
