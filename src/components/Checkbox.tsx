import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { accentColor, authBorderColor, authMutedColor, borderStrong, textBody } from '../constant/Color';

type CheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  label: string;
  tone?: 'light' | 'dark';
};

export default function Checkbox({ checked, onToggle, label, tone = 'light' }: CheckboxProps) {
  const dark = tone === 'dark';

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter]}>
      <Icon
        name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
        size={20}
        color={checked ? accentColor : dark ? authBorderColor : borderStrong}
      />
      <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, styles.label, { color: dark ? authMutedColor : textBody }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  label: {
    marginLeft: spacings.small,
  },
});
