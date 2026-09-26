import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';

type StatusBadgeProps = {
  label: string;
  color: string;
};

export default function StatusBadge({ label, color }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, { backgroundColor: `${color}1A` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[style.fontSizeSmall1x, style.fontWeightThin1x, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingVertical: spacings.xsmall,
    paddingHorizontal: spacings.small2x,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacings.xsmall,
  },
});
