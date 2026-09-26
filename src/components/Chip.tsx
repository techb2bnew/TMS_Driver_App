import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { spacings, style } from '../constant/Fonts';
import { accentColor, borderColor, cardBg, textBody, onAccent } from '../constant/Color';

type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export default function Chip({ label, active = false, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
    >
      <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, { color: active ? onAccent : textBody }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacings.small,
    paddingHorizontal: spacings.normalx,
    borderRadius: 999,
    marginRight: spacings.small2x,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: accentColor,
    borderColor: accentColor,
  },
  chipInactive: {
    backgroundColor: cardBg,
    borderColor: borderColor,
  },
});
