import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import NotificationBell from '../../components/NotificationBell';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import Icon from '../../components/Icon';
import IconCircle from '../../components/IconCircle';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import {
  accentColor,
  accentSoft,
  cardBg,
  cardBgSoft,
  okColor,
  okSoft,
  textDark,
  textFaint,
  textMuted,
} from '../../constant/Color';
import { DUTY_STATUS_META } from '../../constant/DutyStatus';
import { HomeText } from '../../constant/Constants';
import { LOAD_STATUS_META } from '../../constant/LoadStatus';
import { mockNotifications } from '../../mock/notifications';
import { mockSettlements } from '../../mock/settlements';
import { useAuth } from '../../context/AuthContext';
import { useDutyStatus } from '../../context/DutyStatusContext';
import { useLoads } from '../../context/LoadsContext';
import { formatCurrency } from '../../utils/format';
import type { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

export default function HomeScreen({ navigation }: Props) {
  const { driver } = useAuth();
  const { status } = useDutyStatus();
  const { loads } = useLoads();
  const unreadCount = mockNotifications.filter(n => !n.is_read).length;

  const activeLoad = loads.find(l => l.status !== 'delivered' && l.status !== 'cancelled');
  const deliveredThisWeek = loads.filter(l => l.status === 'delivered').length;
  const pendingEarnings = mockSettlements
    .filter(s => s.status === 'unpaid')
    .reduce((sum, s) => sum + s.amount, 0);

  const firstName = driver?.full_name.split(' ')[0] ?? HomeText.defaultDriverName;
  const dutyMeta = DUTY_STATUS_META[status];

  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.header]}>
        <View>
          <Text style={[style.fontSizeSmall2x, { color: textMuted }]}>{HomeText.welcomeBack}</Text>
          <Text style={[style.fontSizeLarge, style.fontWeightBold, { color: textDark }]}>{firstName} 👋</Text>
        </View>
        <NotificationBell unreadCount={unreadCount} onPress={() => navigation.navigate('Notifications')} />
      </View>

      <Card style={styles.dutyCard}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween]}>
          <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.flex]}>
            <View style={[styles.dutyIconWrap, { backgroundColor: `${dutyMeta.color}1F` }]}>
              <Icon name="steering" size={22} color={dutyMeta.color} />
            </View>
            <View style={styles.dutyText}>
              <Text style={[style.fontSizeSmall2x, { color: textMuted }]}>{HomeText.currentStatus}</Text>
              <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: dutyMeta.color }]}>
                {dutyMeta.label}
              </Text>
            </View>
          </View>
          <View style={[styles.pulseDot, { backgroundColor: dutyMeta.color }]} />
        </View>
      </Card>

      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.sectionHeaderRow]}>
        <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>
          {activeLoad ? HomeText.currentLoad : HomeText.allCaughtUp}
        </Text>
        {activeLoad && (
          <TouchableOpacity onPress={() => navigation.navigate('RouteMap', { loadId: activeLoad.id })}>
            <Text style={[style.fontSizeSmall1x, style.fontWeightThin1x, { color: accentColor }]}>{HomeText.viewRoute}</Text>
          </TouchableOpacity>
        )}
      </View>

      {activeLoad ? (
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('LoadDetail', { loadId: activeLoad.id })}>
          <Card>
            <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.loadCardTop]}>
              <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter]}>
                <IconCircle name="package-variant-closed" color={accentColor} backgroundColor={accentSoft} size={40} />
                <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, styles.loadId, { color: textDark }]}>
                  {activeLoad.id}
                </Text>
              </View>
              <StatusBadge label={LOAD_STATUS_META[activeLoad.status].label} color={LOAD_STATUS_META[activeLoad.status].color} />
            </View>

            <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.routeRow]}>
              <Icon name="map-marker" size={16} color={okColor} />
              <Text style={[style.fontSizeNormal1x, styles.routeText]}>{activeLoad.pickup_location}</Text>
              <Icon name="arrow-right" size={14} color={textFaint} style={styles.routeArrow} />
              <Icon name="flag-checkered" size={16} color={accentColor} />
              <Text style={[style.fontSizeNormal1x, styles.routeText]}>{activeLoad.drop_location}</Text>
            </View>

            <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.loadFooter]}>
              <Text style={[style.fontSizeSmall2x, { color: textMuted }]}>{activeLoad.customer_name}</Text>
              <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter]}>
                <Text style={[style.fontSizeSmall2x, style.fontWeightMedium, { color: textDark }]}>{HomeText.viewDetails}</Text>
                <Icon name="chevron-right" size={16} color={textFaint} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      ) : (
        <Card>
          <View style={BaseStyle.alignJustifyCenter}>
            <Icon name="check-decagram-outline" size={28} color={okColor} />
            <Text style={[style.fontSizeNormal1x, styles.emptyText]}>{HomeText.noActiveLoad}</Text>
          </View>
        </Card>
      )}

      <View style={[BaseStyle.flexDirectionRow, styles.statsRow]}>
        <Card style={[BaseStyle.flex, styles.statCard]}>
          <IconCircle name="truck-check-outline" color={okColor} backgroundColor={okSoft} size={36} iconSize={18} />
          <Text style={[style.fontSizeLargeX, style.fontWeightBold, styles.statValue, { color: textDark }]}>{deliveredThisWeek}</Text>
          <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{HomeText.delivered}</Text>
        </Card>
        <Card style={[BaseStyle.flex, styles.statCard, styles.statCardGap]}>
          <IconCircle name="wallet-outline" color={accentColor} backgroundColor={accentSoft} size={36} iconSize={18} />
          <Text style={[style.fontSizeLargeX, style.fontWeightBold, styles.statValue, { color: textDark }]}>
            {formatCurrency(pendingEarnings)}
          </Text>
          <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{HomeText.pendingPayout}</Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacings.xxLarge,
  },
  header: {
    marginBottom: spacings.large,
  },
  dutyCard: {
    backgroundColor: cardBgSoft,
    marginBottom: spacings.xxLarge,
  },
  dutyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dutyText: {
    marginLeft: spacings.normalx,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionHeaderRow: {
    marginBottom: spacings.normalx,
  },
  loadCardTop: {
    marginBottom: spacings.normalx,
  },
  loadId: {
    marginLeft: spacings.normalx,
  },
  routeRow: {
    marginBottom: spacings.normalx,
    flexWrap: 'wrap',
  },
  routeText: {
    color: textDark,
    marginLeft: spacings.xxsmall,
    marginRight: spacings.small,
  },
  routeArrow: {
    marginRight: spacings.small,
  },
  loadFooter: {
    paddingTop: spacings.normalx,
    borderTopWidth: 1,
    borderTopColor: cardBgSoft,
  },
  emptyText: {
    color: textMuted,
    textAlign: 'center',
    marginTop: spacings.small,
  },
  statsRow: {
    marginTop: spacings.xxLarge,
  },
  statCard: {
    backgroundColor: cardBg,
    alignItems: 'flex-start',
  },
  statCardGap: {
    marginLeft: spacings.normalx,
  },
  statValue: {
    marginTop: spacings.normalx,
    marginBottom: spacings.xxsmall,
  },
});
