import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogsScreen from '../screens/Logs/LogsScreen';
import LogHistoryScreen from '../screens/Logs/LogHistoryScreen';
import type { LogsStackParamList } from './types';

const Stack = createNativeStackNavigator<LogsStackParamList>();

export default function LogsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogsMain" component={LogsScreen} />
      <Stack.Screen name="LogHistory" component={LogHistoryScreen} />
    </Stack.Navigator>
  );
}
