import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { spacings } from '../constant/Fonts';
import { borderColor, cardBg, shadowColor } from '../constant/Color';

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function Card({ children, style: styleOverride }: CardProps) {
  return <View style={[styles.card, styleOverride]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor,
    padding: spacings.large,
    shadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
