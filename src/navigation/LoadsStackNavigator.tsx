import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadsScreen from '../screens/Loads/LoadsScreen';
import LoadDetailScreen from '../screens/Loads/LoadDetailScreen';
import RouteMapScreen from '../screens/Loads/RouteMapScreen';
import StopDetailsScreen from '../screens/Loads/StopDetailsScreen';
import type { LoadsStackParamList } from './types';

const Stack = createNativeStackNavigator<LoadsStackParamList>();

export default function LoadsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoadsMain" component={LoadsScreen} />
      <Stack.Screen name="LoadDetail" component={LoadDetailScreen} />
      <Stack.Screen name="RouteMap" component={RouteMapScreen} />
      <Stack.Screen name="StopDetails" component={StopDetailsScreen} />
    </Stack.Navigator>
  );
}
