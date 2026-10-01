import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { DutyStatusProvider } from '../context/DutyStatusContext';
import { LoadsProvider } from '../context/LoadsContext';
import { MessagesProvider } from '../context/MessagesContext';
import { NotificationsProvider } from '../context/NotificationsContext';
import { useAuth } from '../context/AuthContext';
import { BaseStyle } from '../constant/Style';
import { splashBgColor } from '../constant/Color';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // Restoring a persisted Supabase session is async — hold on a blank frame
  // (same tone as the splash) rather than flashing the Login screen first.
  if (isLoading) {
    return <View style={[BaseStyle.flex, { backgroundColor: splashBgColor }]} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App">
            {() => (
              <NotificationsProvider>
                <MessagesProvider>
                  <LoadsProvider>
                    <DutyStatusProvider>
                      <AppNavigator />
                    </DutyStatusProvider>
                  </LoadsProvider>
                </MessagesProvider>
              </NotificationsProvider>
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
