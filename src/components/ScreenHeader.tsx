import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { cardBg, textDark, textMuted } from '../constant/Color';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightIcon?: string;
  onRightPress?: () => void;
  tone?: 'light' | 'dark';
};

// The custom header every nested screen uses instead of the native-stack
// header — keeps full control over icon family, spacing and colour.
export default function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  rightIcon,
  onRightPress,
  tone = 'light',
}: ScreenHeaderProps) {
  const navigation = useNavigation();
  const dark = tone === 'dark';

  return (
    <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.container]}>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.flex]}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={[styles.iconButton, dark && styles.iconButtonDark]}
            hitSlop={8}
          >
            <Icon name="chevron-left" size={26} color={dark ? '#FFFFFF' : textDark} />
          </TouchableOpacity>
        )}
        <View style={styles.titleBlock}>
          <Text
            numberOfLines={1}
            style={[style.fontSizeMedium2x, style.fontWeightMedium, { color: dark ? '#FFFFFF' : textDark }]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text numberOfLines={1} style={[style.fontSizeSmall1x, { color: dark ? 'rgba(255,255,255,0.6)' : textMuted }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightIcon && (
        <TouchableOpacity
          onPress={onRightPress}
          activeOpacity={0.7}
          style={[styles.iconButton, dark && styles.iconButtonDark]}
          hitSlop={8}
        >
          <Icon name={rightIcon} size={22} color={dark ? '#FFFFFF' : textDark} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacings.large,
    paddingTop: spacings.normalx,
    paddingBottom: spacings.large,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cardBg,
    marginRight: spacings.normalx,
  },
  iconButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  titleBlock: {
    flexShrink: 1,
  },
});
