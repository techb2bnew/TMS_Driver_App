import React, { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Icon from '../../components/Icon';
import RouteTimeline from '../../components/RouteTimeline';
import CustomButton from '../../components/CustomButton';
import AddStopSheet from '../../components/AddStopSheet';
import EmptyState from '../../components/EmptyState';
import AlertModal from '../../components/AlertModal';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { accentColor, accentSoft, borderColor, cardBg, dutyDrivingColor, okColor, textDark, textFaint, textMuted } from '../../constant/Color';
import { fetchRoute, addRouteStop } from '../../lib/routeStops';
import { fetchRoadRoute, type RoadRoute } from '../../lib/directions';
import { useLoads } from '../../context/LoadsContext';
import { useDutyGuard } from '../../hooks/useDutyGuard';
import { DutyGuardText, RouteMapText } from '../../constant/Constants';
import type { LoadFlowParamList } from '../../navigation/types';
import type { Route, RouteStop } from '../../types';

type Props = NativeStackScreenProps<LoadFlowParamList, 'RouteMap'>;

// Wide default view (roughly all of India) for when this load's stops
// haven't been geocoded yet — the map still shows, centered here until the
// driver's own location (via showsUserLocation) pulls it into focus.
const DEFAULT_REGION = { latitude: 22.5, longitude: 79, latitudeDelta: 15, longitudeDelta: 15 };

export default function RouteMapScreen({ route, navigation }: Props) {
  const { loadId } = route.params;
  const { getLoad } = useLoads();
  const load = getLoad(loadId);
  const { requireActiveDuty, blocked, dismissBlocked } = useDutyGuard();
  const [routeInfo, setRouteInfo] = useState<Route | null | undefined>(undefined);
  const [roadRoute, setRoadRoute] = useState<RoadRoute | null>(null);
  const [addStopVisible, setAddStopVisible] = useState(false);
  const mapRef = useRef<MapView>(null);

  function handleAddStopPress() {
    if (!requireActiveDuty()) return;
    setAddStopVisible(true);
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchRoute(loadId).then(result => {
      if (mounted) setRouteInfo(result);
    });
    return () => {
      mounted = false;
    };
  }, [loadId]);

  useEffect(() => {
    const stops = routeInfo?.stops.filter(s => s.lat !== 0 || s.lng !== 0) ?? [];
    if (stops.length < 2) {
      setRoadRoute(null);
      return;
    }
    let mounted = true;
    fetchRoadRoute(stops.map(s => ({ latitude: s.lat, longitude: s.lng }))).then(result => {
      if (mounted) setRoadRoute(result);
    });
    return () => {
      mounted = false;
    };
  }, [routeInfo]);

  if (!load) return null;

  async function handleAddStop(input: Omit<RouteStop, 'id' | 'status' | 'distanceFromPrevKm'>) {
    await addRouteStop(loadId, input);
    fetchRoute(loadId).then(setRouteInfo);
  }

  if (routeInfo === undefined) return null;

  if (!routeInfo) {
    return (
      <ScreenContainer scroll style={styles.scrollContent}>
        <ScreenHeader title={RouteMapText.title} subtitle={`${load.load_number} · ${load.pickup_location} → ${load.drop_location}`} />
        <EmptyState icon="map-marker-off-outline" title={RouteMapText.noRouteTitle} subtitle={RouteMapText.noRouteSubtitle} />
        <CustomButton
          label={RouteMapText.viewLoadDetails}
          variant="outline"
          onPress={() => navigation.navigate('LoadDetail', { loadId })}
          style={styles.footerButton}
        />
      </ScreenContainer>
    );
  }

  const mappableStops = routeInfo.stops.filter(s => s.lat !== 0 || s.lng !== 0);

  // Real road distance from the Directions API when available — the
  // DB-stored distanceFromPrevKm fields are only ever filled in manually by
  // dispatch, so they're 0 for the common case (no waypoints).
  let totalDistanceKm = routeInfo.totalDistanceKm;
  let remainingDistanceKm = routeInfo.remainingDistanceKm;
  if (roadRoute) {
    totalDistanceKm = Math.round(roadRoute.legDistancesKm.reduce((sum, km) => sum + km, 0));
    remainingDistanceKm = 0;
    for (let i = 1; i < mappableStops.length; i++) {
      if (mappableStops[i].status !== 'completed') {
        remainingDistanceKm += roadRoute.legDistancesKm[i - 1] ?? 0;
      }
    }
    remainingDistanceKm = Math.round(remainingDistanceKm);
  }
  const progressPercent = totalDistanceKm > 0 ? Math.round(((totalDistanceKm - remainingDistanceKm) / totalDistanceKm) * 100) : 0;

  function stopPinColor(status: RouteStop['status']) {
    if (status === 'completed') return okColor;
    if (status === 'current') return accentColor;
    return textFaint;
  }

  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <ScreenHeader title={RouteMapText.title} subtitle={`${load.load_number} · ${load.pickup_location} → ${load.drop_location}`} />

      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          showsUserLocation
          showsMyLocationButton
          followsUserLocation={mappableStops.length === 0}
          initialRegion={
            mappableStops.length > 0
              ? { latitude: mappableStops[0].lat, longitude: mappableStops[0].lng, latitudeDelta: 2, longitudeDelta: 2 }
              : DEFAULT_REGION
          }
          onMapReady={() => {
            if (mappableStops.length > 1) {
              mapRef.current?.fitToCoordinates(
                mappableStops.map(s => ({ latitude: s.lat, longitude: s.lng })),
                { edgePadding: { top: 40, right: 40, bottom: 40, left: 40 }, animated: false },
              );
            }
          }}
        >
          {mappableStops.length > 0 && (
            <>
              <Polyline
                coordinates={roadRoute?.path ?? mappableStops.map(s => ({ latitude: s.lat, longitude: s.lng }))}
                strokeColor={accentColor}
                strokeWidth={3}
              />
              {mappableStops.map(s => (
                <Marker
                  key={s.id}
                  coordinate={{ latitude: s.lat, longitude: s.lng }}
                  title={s.label}
                  description={s.address}
                  pinColor={stopPinColor(s.status)}
                />
              ))}
            </>
          )}
        </MapView>
      </View>

      {mappableStops.length === 0 && (
        <Text style={[style.fontSizeSmall1x, styles.noRouteNote]}>{RouteMapText.noCoordinatesNote}</Text>
      )}

      <Card style={styles.summaryCard}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.justifyContentSpaceBetween]}>
          <View style={BaseStyle.alignItemsFlexStart}>
            <Text style={[style.fontSizeLargeX, style.fontWeightBold, { color: textDark }]}>
              {remainingDistanceKm} km
            </Text>
            <Text style={[style.fontSizeSmall1x, styles.summaryLabel]}>{RouteMapText.remaining}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={BaseStyle.alignItemsFlexStart}>
            <Text style={[style.fontSizeLargeX, style.fontWeightBold, { color: textDark }]}>{totalDistanceKm} km</Text>
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

      <Card style={styles.stopsCard}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.stopsTitle]}>
          <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>{RouteMapText.stops}</Text>
          <TouchableOpacity onPress={handleAddStopPress}>
            <Text style={[style.fontSizeSmall1x, style.fontWeightThin1x, { color: accentColor }]}>{RouteMapText.addStop}</Text>
          </TouchableOpacity>
        </View>
        <RouteTimeline
          stops={routeInfo.stops}
          onStopPress={stop => navigation.navigate('StopDetails', { stop })}
        />
      </Card>

      <CustomButton
        label={RouteMapText.viewLoadDetails}
        variant="outline"
        onPress={() => navigation.navigate('LoadDetail', { loadId })}
        style={styles.footerButton}
      />

      <AddStopSheet
        visible={addStopVisible}
        onClose={() => setAddStopVisible(false)}
        onSubmit={handleAddStop}
        routeBias={mappableStops.length > 0 ? { latitude: mappableStops[0].lat, longitude: mappableStops[0].lng } : undefined}
      />

      <AlertModal
        visible={blocked}
        onClose={dismissBlocked}
        tone="error"
        title={DutyGuardText.title}
        message={DutyGuardText.message}
        confirmLabel={DutyGuardText.confirmLabel}
        onConfirm={dismissBlocked}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacings.xxLarge,
  },
  mapWrap: {
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: spacings.normalx,
  },
  map: {
    flex: 1,
  },
  noRouteNote: {
    color: textMuted,
    textAlign: 'center',
    marginBottom: spacings.normalx,
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
