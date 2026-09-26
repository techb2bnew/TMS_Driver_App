import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import {
  accentColor,
  accentPressed,
  dangerColor,
  dangerSoft,
  disabledBg,
  disabledText,
  onAccent,
} from '../constant/Color';

type ButtonVariant = 'primary' | 'outline' | 'danger';

type CustomButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Every tappable primary action in the app goes through this — the small
// press-scale is the one animation touch that's worth repeating everywhere.
// `danger` deliberately stays a soft (not solid) fill: dangerColor is a
// status colour, not a second accent, so a destructive action reads as
// "flagged" rather than looking like the primary CTA the eye is trained on.
export default function CustomButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  style: styleOverride,
}: CustomButtonProps) {
  const isDisabled = disabled || loading;
  const [pressed, setPressed] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  function animateTo(value: number) {
    Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  }

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      onPressIn={() => {
        if (isDisabled) return;
        setPressed(true);
        animateTo(0.97);
      }}
      onPressOut={() => {
        setPressed(false);
        animateTo(1);
      }}
      style={[fullWidth && styles.fullWidth, styleOverride]}
    >
      <Animated.View
        style={[
          styles.base,
          BaseStyle.alignJustifyCenter,
          BaseStyle.flexDirectionRow,
          variantStyle(variant, isDisabled, pressed),
          { transform: [{ scale }] },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor(variant, isDisabled)} />
        ) : (
          <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textColor(variant, isDisabled) }]}>
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

function variantStyle(variant: ButtonVariant, isDisabled: boolean, pressed: boolean): ViewStyle {
  if (variant === 'outline') {
    return { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: isDisabled ? disabledBg : accentColor };
  }
  if (variant === 'danger') {
    return { backgroundColor: isDisabled ? disabledBg : dangerSoft };
  }
  return { backgroundColor: isDisabled ? disabledBg : pressed ? accentPressed : accentColor };
}

function textColor(variant: ButtonVariant, isDisabled: boolean): string {
  if (isDisabled) return disabledText;
  if (variant === 'outline') return accentColor;
  if (variant === 'danger') return dangerColor;
  return onAccent;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    padding: spacings.large,
  },
  // alignSelf (not width:'100%') so this fills a column parent without
  // fighting a sibling's flex:1 in a row parent (e.g. side-by-side dialog buttons).
  fullWidth: {
    alignSelf: 'stretch',
  },
});
