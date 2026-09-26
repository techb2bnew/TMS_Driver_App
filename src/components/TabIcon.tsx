import React from 'react';
import Icon from './Icon';
import { accentColor, textFaint } from '../constant/Color';

const TAB_ICONS = {
  Home: { active: 'view-dashboard', inactive: 'view-dashboard-outline' },
  Loads: { active: 'package-variant-closed', inactive: 'package-variant-closed' },
  Logs: { active: 'clipboard-text-clock', inactive: 'clipboard-text-clock-outline' },
  Profile: { active: 'account-circle', inactive: 'account-circle-outline' },
} as const;

type TabIconProps = {
  name: keyof typeof TAB_ICONS;
  focused: boolean;
};

export default function TabIcon({ name, focused }: TabIconProps) {
  const iconName = focused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive;
  return <Icon name={iconName} size={24} color={focused ? accentColor : textFaint} />;
}
