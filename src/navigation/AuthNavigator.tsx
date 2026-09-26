import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Auth/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
// Forgot-password flow is built (screens/Auth/ForgotPasswordScreen.tsx) but
// paused for now — uncomment the import, the route below, and the
// Stack.Screen entry (plus the link in LoginScreen.tsx) to resume it.
// import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  // Kept in the type even though the route below is commented out, so the
  // still-present ForgotPasswordScreen.tsx keeps type-checking cleanly.
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
}
