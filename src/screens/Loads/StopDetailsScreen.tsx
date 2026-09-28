import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import IconCircle from '../../components/IconCircle';
import Icon from '../../components/Icon';
import CustomButton from '../../components/CustomButton';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { accentColor, accentSoft, cardBgSoft, okColor, okSoft, textDark, textFaint, textMuted } from '../../constant/Color';
import type { LoadFlowParamList } from '../../navigation/types';
import { formatTime } from '../../utils/format';
import { safeOpenURL } from '../../utils/linking';
import { StopDetailsText } from '../../constant/Constants';

type Props = NativeStackScreenProps<LoadFlowParamList, 'StopDetails'>;

const STOP_TYPE_ICON = {
  pickup: 'package-variant-closed',
  waypoint: 'map-marker-radius',
  drop: 'flag-checkered',
} as const;

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.detailRow]}>
      <Icon name={icon} size={18} color={textFaint} />
      <Text style={[style.fontSizeSmall2x, styles.detailLabel]}>{label}</Text>
      <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, styles.detailValue]}>{value}</Text>
    </View>
  );
}

export default function StopDetailsScreen({ route }: Props) {
  const { stop } = route.params;

  function openMaps() {
    const label = encodeURIComponent(stop.address);
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${stop.lat},${stop.lng}`,
      android: `geo:0,0?q=${stop.lat},${stop.lng}(${label})`,
    });
    if (url) safeOpenURL(url);
  }

  function callContact() {
    if (stop.contactPhone) safeOpenURL(`tel:${stop.contactPhone.replace(/\s/g, '')}`);
  }

  const completed = stop.status === 'completed';

  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <ScreenHeader title={stop.label} subtitle={stop.city} />

      <Card style={styles.section}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter]}>
          <IconCircle
            name={STOP_TYPE_ICON[stop.type]}
            color={completed ? okColor : accentColor}
            backgroundColor={completed ? okSoft : accentSoft}
            size={48}
          />
          <View style={styles.addressText}>
            <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>{stop.address}</Text>
            <Text style={[style.fontSizeSmall2x, { color: textMuted }]}>{stop.city}</Text>
          </View>
        </View>

        {stop.notes && (
          <View style={styles.notesBox}>
            <Icon name="information-outline" size={16} color={textMuted} />
            <Text style={[style.fontSizeSmall2x, styles.notesText]}>{stop.notes}</Text>
          </View>
        )}
      </Card>

      <Card style={styles.section}>
        <DetailRow icon="clock-outline" label={StopDetailsText.eta} value={formatTime(stop.eta)} />
        <DetailRow icon="road-variant" label={StopDetailsText.distanceFromPrevious} value={`${stop.distanceFromPrevKm} ${StopDetailsText.kmSuffix}`} />
        {stop.contactName && <DetailRow icon="account-outline" label={StopDetailsText.contact} value={stop.contactName} />}
        {stop.contactPhone && <DetailRow icon="phone-outline" label={StopDetailsText.phone} value={stop.contactPhone} />}
      </Card>

      <View style={[BaseStyle.flexDirectionRow, styles.actionsRow]}>
        <CustomButton
          label={StopDetailsText.openInMaps}
          onPress={openMaps}
          variant="outline"
          style={BaseStyle.flex}
        />
        {stop.contactPhone && (
          <TouchableOpacity onPress={callContact} activeOpacity={0.85} style={styles.callButton}>
            <Icon name="phone" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacings.xxLarge,
  },
  section: {
    marginBottom: spacings.normalx,
  },
  addressText: {
    marginLeft: spacings.normalx,
    flexShrink: 1,
  },
  notesBox: {
    flexDirection: 'row',
    marginTop: spacings.large,
    padding: spacings.normalx,
    backgroundColor: cardBgSoft,
    borderRadius: 10,
  },
  notesText: {
    color: textMuted,
    marginLeft: spacings.small,
    flexShrink: 1,
  },
  detailRow: {
    paddingVertical: spacings.small2x,
  },
  detailLabel: {
    color: textMuted,
    marginLeft: spacings.normalx,
    flex: 1,
  },
  detailValue: {
    color: textDark,
  },
  actionsRow: {
    gap: spacings.normalx,
  },
  callButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: accentColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
