import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from './Icon';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { accentColor, borderColor, dutyDrivingColor, okColor, textDark, textFaint, textMuted } from '../constant/Color';
import type { RouteStop } from '../types';
import { formatTime } from '../utils/format';
import { RouteTimelineText } from '../constant/Constants';

const STOP_ICON: Record<RouteStop['type'], string> = {
  pickup: 'package-variant-closed',
  waypoint: 'map-marker-radius',
  drop: 'flag-checkered',
};

function stopColor(status: RouteStop['status']) {
  if (status === 'completed') return okColor;
  if (status === 'current') return accentColor;
  return textFaint;
}

type RouteTimelineProps = {
  stops: RouteStop[];
  onStopPress?: (stop: RouteStop) => void;
};

export default function RouteTimeline({ stops, onStopPress }: RouteTimelineProps) {
  return (
    <View>
      {stops.map((stop, index) => {
        const isLast = index === stops.length - 1;
        const color = stopColor(stop.status);
        const content = (
          <View style={[BaseStyle.flexDirectionRow, styles.row]}>
            <View style={styles.railColumn}>
              <View style={[styles.dot, { borderColor: color }, stop.status !== 'upcoming' && { backgroundColor: color }]}>
                <Icon name={STOP_ICON[stop.type]} size={14} color={stop.status === 'upcoming' ? color : '#FFFFFF'} />
              </View>
              {!isLast && <View style={[styles.line, { backgroundColor: stop.status === 'completed' ? okColor : borderColor }]} />}
            </View>

            <View style={[BaseStyle.flex, styles.textColumn, !isLast && styles.textColumnSpacing]}>
              <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween]}>
                <Text style={[style.fontSizeSmall1x, style.fontWeightThin1x, styles.eyebrow, { color }]}>
                  {stop.label.toUpperCase()}
                </Text>
                <Text style={[style.fontSizeSmall, { color: textMuted }]}>{formatTime(stop.eta)}</Text>
              </View>
              <Text style={[style.fontSizeNormal1x, style.fontWeightThin1x, { color: textDark }]}>{stop.address}</Text>
              <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{stop.city}</Text>
              {stop.notes && (
                <Text style={[style.fontSizeSmall, styles.notes, { color: textFaint }]}>{stop.notes}</Text>
              )}
              {stop.distanceFromPrevKm > 0 && (
                <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.distanceRow]}>
                  <Icon name="road-variant" size={13} color={dutyDrivingColor} />
                  <Text style={[style.fontSizeSmall, styles.distanceText]}>{stop.distanceFromPrevKm} {RouteTimelineText.kmFromPreviousSuffix}</Text>
                </View>
              )}
            </View>
          </View>
        );

        if (!onStopPress) return <View key={stop.id}>{content}</View>;

        return (
          <TouchableOpacity key={stop.id} activeOpacity={0.7} onPress={() => onStopPress(stop)}>
            {content}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-start',
  },
  railColumn: {
    alignItems: 'center',
    width: 32,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 36,
    marginVertical: spacings.xxsmall,
  },
  textColumn: {
    marginLeft: spacings.normalx,
    paddingBottom: spacings.large,
  },
  textColumnSpacing: {
    marginBottom: spacings.xxsmall,
  },
  eyebrow: {
    letterSpacing: 0.5,
  },
  notes: {
    marginTop: spacings.xxsmall,
    fontStyle: 'italic',
  },
  distanceRow: {
    marginTop: spacings.small,
  },
  distanceText: {
    color: textMuted,
    marginLeft: spacings.xxsmall,
  },
});
