import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from './Icon';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { cardBgSoft, textFaint, textMuted } from '../constant/Color';

type EmptyStateProps = {
  icon: string;
  title: string;
  subtitle?: string;
};

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={[BaseStyle.alignJustifyCenter, styles.container]}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={32} color={textFaint} />
      </View>
      <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, styles.title]}>{title}</Text>
      {subtitle && <Text style={[style.fontSizeSmall2x, styles.subtitle]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacings.ExtraLarge,
    paddingHorizontal: spacings.xxLarge,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: cardBgSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacings.normalx,
  },
  title: {
    color: textMuted,
    textAlign: 'center',
    marginBottom: spacings.xsmall,
  },
  subtitle: {
    color: textFaint,
    textAlign: 'center',
  },
});
