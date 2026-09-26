import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EarningsScreen from '../screens/Profile/EarningsScreen';
import ExpensesScreen from '../screens/Profile/ExpensesScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import PrivacyPolicyScreen from '../screens/Profile/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/Profile/TermsOfServiceScreen';
import ContactSupportScreen from '../screens/Profile/ContactSupportScreen';
import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Earnings" component={EarningsScreen} />
      <Stack.Screen name="Expenses" component={ExpensesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
    </Stack.Navigator>
  );
}
