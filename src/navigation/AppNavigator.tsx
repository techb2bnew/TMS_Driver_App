import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabIcon from '../components/TabIcon';
import { style } from '../constant/Fonts';
import { accentColor, cardBg, borderColor, textFaint } from '../constant/Color';
import HomeStackNavigator from './HomeStackNavigator';
import LoadsStackNavigator from './LoadsStackNavigator';
import LogsStackNavigator from './LogsStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

export type AppTabParamList = {
  Home: undefined;
  Loads: undefined;
  Logs: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const renderHomeIcon = ({ focused }: { focused: boolean }) => <TabIcon name="Home" focused={focused} />;
const renderLoadsIcon = ({ focused }: { focused: boolean }) => <TabIcon name="Loads" focused={focused} />;
const renderLogsIcon = ({ focused }: { focused: boolean }) => <TabIcon name="Logs" focused={focused} />;
const renderProfileIcon = ({ focused }: { focused: boolean }) => <TabIcon name="Profile" focused={focused} />;

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: textFaint,
        tabBarLabelStyle: style.fontSizeExtraSmall,
        tabBarStyle: {
          backgroundColor: cardBg,
          borderTopColor: borderColor,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ tabBarIcon: renderHomeIcon }} />
      <Tab.Screen name="Loads" component={LoadsStackNavigator} options={{ tabBarIcon: renderLoadsIcon }} />
      <Tab.Screen name="Logs" component={LogsStackNavigator} options={{ tabBarIcon: renderLogsIcon }} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ tabBarIcon: renderProfileIcon }} />
    </Tab.Navigator>
  );
}
