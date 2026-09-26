import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from './Icon';

type IconCircleProps = {
  name: string;
  color: string;
  backgroundColor: string;
  size?: number;
  iconSize?: number;
};

export default function IconCircle({ name, color, backgroundColor, size = 44, iconSize }: IconCircleProps) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
      ]}
    >
      <Icon name={name} size={iconSize ?? size * 0.5} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
