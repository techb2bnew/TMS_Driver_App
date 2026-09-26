import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Icon from '../../components/Icon';
import RouteTimeline from '../../components/RouteTimeline';
import CustomButton from '../../components/CustomButton';
import AddStopSheet from '../../components/AddStopSheet';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { accentColor, accentSoft, borderColor, cardBg, dutyDrivingColor, textDark, textMuted } from '../../constant/Color';
import { mockRoutes, addMockRouteStop } from '../../mock/routes';
import { useLoads } from '../../context/LoadsContext';
import { safeOpenURL } from '../../utils/linking';
import { RouteMapText } from '../../constant/Constants';
import type { LoadFlowParamList } from '../../navigation/types';
import type { RouteStop } from '../../types';

type Props = NativeStackScreenProps<LoadFlowParamList, 'RouteMap'>;

function openNavigation(lat: number, lng: number, address: string) {
  const label = encodeURIComponent(address);
  const url = Platform.select({
    ios: `maps:0,0?q=${label}@${lat},${lng}`,
    android: `geo:0,0?q=${lat},${lng}(${label})`,
  });
  if (url) safeOpenURL(url);
}

export default function RouteMapScreen({ route, navigation }: Props) {
  const { loadId } = route.params;
  const { getLoad } = useLoads();
  const load = getLoad(loadId);
  const routeInfo = mockRoutes[loadId];
  const [addStopVisible, setAddStopVisible] = useState(false);
  const [, forceRefresh] = useState(0);

  if (!load || !routeInfo) return null;

  function handleAddStop(input: Omit<RouteStop, 'id' | 'status' | 'distanceFromPrevKm' | 'lat' | 'lng'>) {
    addMockRouteStop(loadId, {
      id: `${loadId}-stop-${Date.now()}`,
      status: 'upcoming',
      distanceFromPrevKm: 0,
      lat: 0,
      lng: 0,
      ...input,
    });
    forceRefresh(v => v + 1);
  }

  const progressPercent = Math.round(
    ((routeInfo.totalDistanceKm - routeInfo.remainingDistanceKm) / routeInfo.totalDistanceKm) * 100,
  );
  const nextStop = routeInfo.stops.find(s => s.status !== 'completed') ?? routeInfo.stops[routeInfo.stops.length - 1];

  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <ScreenHeader title={RouteMapText.title} subtitle={`${load.id} · ${load.pickup_location} → ${load.drop_location}`} />

      <Card style={styles.summaryCard}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.justifyContentSpaceBetween]}>
          <View style={BaseStyle.alignItemsFlexStart}>
            <Text style={[style.fontSizeLargeX, style.fontWeightBold, { color: textDark }]}>
              {routeInfo.remainingDistanceKm} km
            </Text>
            <Text style={[style.fontSizeSmall1x, styles.summaryLabel]}>{RouteMapText.remaining}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={BaseStyle.alignItemsFlexStart}>
            <Text style={[style.fontSizeLargeX, style.fontWeightBold, { color: textDark }]}>
              {routeInfo.estimatedDuration}
            </Text>
            <Text style={[style.fontSizeSmall1x, styles.summaryLabel]}>{RouteMapText.eta}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={BaseStyle.alignItemsFlexStart}>
            <Text style={[style.fontSizeLargeX, style.fontWeightBold, { color: textDark }]}>{routeInfo.totalDistanceKm} km</Text>
            <Text style={[style.fontSizeSmall1x, styles.summaryLabel]}>{RouteMapText.total}</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.progressCaptionRow]}>
          <Icon name="truck-fast-outline" size={14} color={dutyDrivingColor} />
          <Text style={[style.fontSizeSmall, styles.progressCaption]}>{progressPercent}{RouteMapText.tripCompleteSuffix}</Text>
        </View>
      </Card>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.navigateBar}
        onPress={() => openNavigation(nextStop.lat, nextStop.lng, nextStop.address)}
      >
        <Icon name="navigation-variant" size={20} color="#FFFFFF" />
        <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, styles.navigateBarText]}>
          {RouteMapText.navigateToPrefix}{nextStop.label}
        </Text>
        <Icon name="chevron-right" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <Card style={styles.stopsCard}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.stopsTitle]}>
          <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>{RouteMapText.stops}</Text>
          <TouchableOpacity onPress={() => setAddStopVisible(true)}>
            <Text style={[style.fontSizeSmall1x, style.fontWeightThin1x, { color: accentColor }]}>{RouteMapText.addStop}</Text>
          </TouchableOpacity>
        </View>
        <RouteTimeline
          stops={routeInfo.stops}
          onStopPress={stop => navigation.navigate('StopDetails', { loadId, stopId: stop.id })}
        />
      </Card>

      <CustomButton
        label={RouteMapText.viewLoadDetails}
        variant="outline"
        onPress={() => navigation.navigate('LoadDetail', { loadId })}
        style={styles.footerButton}
      />

      <AddStopSheet visible={addStopVisible} onClose={() => setAddStopVisible(false)} onSubmit={handleAddStop} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacings.xxLarge,
  },
  summaryCard: {
    marginBottom: spacings.normalx,
  },
  summaryLabel: {
    color: textMuted,
    marginTop: spacings.xxsmall,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: borderColor,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: accentSoft,
    marginTop: spacings.large,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: dutyDrivingColor,
  },
  progressCaptionRow: {
    marginTop: spacings.small,
  },
  progressCaption: {
    color: textMuted,
    marginLeft: spacings.xxsmall,
  },
  navigateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: accentColor,
    borderRadius: 14,
    paddingVertical: spacings.normalx,
    paddingHorizontal: spacings.large,
    marginBottom: spacings.normalx,
  },
  navigateBarText: {
    color: '#FFFFFF',
    flex: 1,
    marginLeft: spacings.normalx,
  },
  stopsCard: {
    marginBottom: spacings.normalx,
    backgroundColor: cardBg,
  },
  stopsTitle: {
    marginBottom: spacings.large,
  },
  footerButton: {
    marginTop: spacings.small,
  },
});
