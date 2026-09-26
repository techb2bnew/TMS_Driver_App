import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from './Icon';
import { BaseStyle } from '../constant/Style';
import { style } from '../constant/Fonts';
import { borderColor, cardBg, dangerColor, onAccent, textDark } from '../constant/Color';
import { NotificationBellText } from '../constant/Constants';

type NotificationBellProps = {
  unreadCount: number;
  onPress: () => void;
};

export default function NotificationBell({ unreadCount, onPress }: NotificationBellProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.circle, BaseStyle.alignJustifyCenter]}
    >
      <Icon name="bell-outline" size={20} color={textDark} />
      {unreadCount > 0 && (
        <View style={[styles.badge, BaseStyle.alignJustifyCenter]}>
          <Text style={[style.fontSizeExtraExtraSmall, style.fontWeightMedium, { color: onAccent }]}>
            {unreadCount > 9 ? NotificationBellText.overflowLabel : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cardBg,
    borderWidth: 1,
    borderColor,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: dangerColor,
  },
});
