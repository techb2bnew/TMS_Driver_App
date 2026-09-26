import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

// Single entry point for every icon in the app — one family
// (MaterialCommunityIcons) so the icon language stays consistent.
// Swap the underlying import here if the family ever changes.
export default function Icon({ name, size = 22, color = '#000', style }: IconProps) {
  return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
}
