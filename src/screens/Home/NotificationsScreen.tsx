import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import IconCircle from '../../components/IconCircle';
import EmptyState from '../../components/EmptyState';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { accentColor, accentSoft, borderColor, cardBg, okColor, okSoft, textDark, textFaint, textMuted, warnColor, warnSoft } from '../../constant/Color';
import { mockNotifications as initialNotifications } from '../../mock/notifications';
import type { NotificationItem } from '../../types';
import { formatDate, formatTime } from '../../utils/format';
import { NotificationsText } from '../../constant/Constants';

function iconFor(title: string): { name: string; color: string; bg: string } {
  if (title.toLowerCase().includes('settlement')) return { name: 'cash-check', color: okColor, bg: okSoft };
  if (title.toLowerCase().includes('assigned')) return { name: 'package-variant-closed', color: accentColor, bg: accentSoft };
  return { name: 'bell-outline', color: warnColor, bg: warnSoft };
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title={NotificationsText.title}
        subtitle={unreadCount > 0 ? `${unreadCount} ${NotificationsText.unreadSuffix}` : NotificationsText.allCaughtUp}
        rightIcon={unreadCount > 0 ? 'check-all' : undefined}
        onRightPress={markAllRead}
      />

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<EmptyState icon="bell-off-outline" title={NotificationsText.emptyTitle} subtitle={NotificationsText.emptySubtitle} />}
        renderItem={({ item }) => {
          const meta = iconFor(item.title);
          return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => markRead(item.id)} style={styles.row}>
              <IconCircle name={meta.name} color={meta.color} backgroundColor={meta.bg} size={42} />
              <View style={styles.rowText}>
                <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween]}>
                  <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, { color: textDark }]}>{item.title}</Text>
                  {!item.is_read && <View style={styles.unreadDot} />}
                </View>
                <Text style={[style.fontSizeSmall2x, styles.message]}>{item.message}</Text>
                <Text style={[style.fontSizeSmall, styles.time]}>
                  {formatDate(item.created_at)} · {formatTime(item.created_at)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacings.large,
    paddingBottom: spacings.xxLarge,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacings.normalx,
    backgroundColor: cardBg,
  },
  rowText: {
    flex: 1,
    marginLeft: spacings.normalx,
  },
  message: {
    color: textMuted,
    marginTop: spacings.xxsmall,
  },
  time: {
    color: textFaint,
    marginTop: spacings.small,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: accentColor,
  },
  separator: {
    height: 1,
    backgroundColor: borderColor,
  },
});
