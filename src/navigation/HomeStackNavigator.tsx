import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import NotificationsScreen from '../screens/Home/NotificationsScreen';
import LoadDetailScreen from '../screens/Loads/LoadDetailScreen';
import RouteMapScreen from '../screens/Loads/RouteMapScreen';
import StopDetailsScreen from '../screens/Loads/StopDetailsScreen';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="LoadDetail" component={LoadDetailScreen} />
      <Stack.Screen name="RouteMap" component={RouteMapScreen} />
      <Stack.Screen name="StopDetails" component={StopDetailsScreen} />
    </Stack.Navigator>
  );
}
