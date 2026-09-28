import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View, Text } from 'react-native';
import Icon from './Icon';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import {
  authBorderColor,
  authInputBg,
  authLinkColor,
  authMutedColor,
  borderColor,
  borderStrong,
  dangerColor,
  inputBgColor,
  inputFocusBg,
  placeholderColor,
  textDark,
  textFaint,
  whiteColor,
} from '../constant/Color';

type CustomTextInputProps = TextInputProps & {
  label?: string;
  error?: string;
  tone?: 'light' | 'dark';
  leftIcon?: string;
};

// The one text input every screen reuses — auth screens pass tone="dark",
// everything else (Loads, Profile, Logs) uses the light default.
export default function CustomTextInput({
  label,
  error,
  tone = 'light',
  leftIcon,
  secureTextEntry,
  style: styleOverride,
  ...rest
}: CustomTextInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const dark = tone === 'dark';

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            style.fontSizeSmall2x,
            style.fontWeightThin1x,
            dark ? styles.labelDark : styles.labelLight,
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputRow,
          BaseStyle.flexDirectionRow,
          BaseStyle.alignItemsCenter,
          dark ? styles.inputRowDark : styles.inputRowLight,
          focused && (dark ? styles.inputRowDarkFocused : styles.inputRowLightFocused),
          error && styles.inputRowError,
        ]}
      >
        {leftIcon && (
          <Icon name={leftIcon} size={18} color={dark ? authLinkColor : textFaint} style={styles.leftIcon} />
        )}
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={placeholderColor}
          onFocus={e => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[
            styles.input,
            style.fontSizeNormal2x,
            dark ? styles.inputTextDark : styles.inputTextLight,
            styleOverride,
          ]}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden(v => !v)} hitSlop={8}>
            <Icon name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={dark ? authLinkColor : textFaint} />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={[style.fontSizeSmall, styles.errorText]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacings.large,
  },
  labelLight: {
    color: textDark,
    marginBottom: spacings.small,
  },
  labelDark: {
    color: authMutedColor,
    marginBottom: spacings.small,
  },
  inputRow: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: spacings.normalx,
  },
  inputRowLight: {
    backgroundColor: inputBgColor,
    borderColor: borderColor,
  },
  inputRowLightFocused: {
    backgroundColor: inputFocusBg,
    borderColor: borderStrong,
  },
  inputRowDark: {
    backgroundColor: authInputBg,
    borderColor: authBorderColor,
  },
  inputRowDarkFocused: {
    backgroundColor: authInputBg,
    borderColor: authLinkColor,
  },
  inputRowError: {
    borderColor: dangerColor,
  },
  leftIcon: {
    marginRight: spacings.small,
  },
  input: {
    flex: 1,
    paddingVertical: spacings.medium,
  },
  inputTextLight: {
    color: textDark,
  },
  inputTextDark: {
    color: whiteColor,
  },
  errorText: {
    color: dangerColor,
    marginTop: spacings.xsmall,
  },
});
