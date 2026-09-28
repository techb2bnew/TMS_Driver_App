import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Icon from '../../components/Icon';
import AlertModal from '../../components/AlertModal';
import EmptyState from '../../components/EmptyState';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { accentColor, borderColor, textDark, textMuted } from '../../constant/Color';
import { DUTY_STATUS_META, DUTY_STATUS_ORDER } from '../../constant/DutyStatus';
import { useDutyStatus, DutyStatusRestrictedError } from '../../context/DutyStatusContext';
import type { DutyLogEntry, DutyStatus } from '../../types';
import { formatTime } from '../../utils/format';
import type { LogsStackParamList } from '../../navigation/types';
import { LogsText } from '../../constant/Constants';

type Props = NativeStackScreenProps<LogsStackParamList, 'LogsMain'>;

const DUTY_ICON: Record<DutyStatus, string> = {
  off_duty: 'power-sleep',
  sleeper: 'bed-outline',
  driving: 'steering',
  on_duty: 'clipboard-check-outline',
};

function DutyButton({ status, active, onPress }: { status: DutyStatus; active: boolean; onPress: () => void }) {
  const meta = DUTY_STATUS_META[status];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.dutyButton,
        BaseStyle.alignJustifyCenter,
        { borderColor: meta.color },
        active && { backgroundColor: meta.color },
      ]}
    >
      <Icon name={DUTY_ICON[status]} size={22} color={active ? '#FFFFFF' : meta.color} />
      <Text style={[style.fontSizeSmall2x, style.fontWeightMedium, styles.dutyButtonLabel, { color: active ? '#FFFFFF' : meta.color }]}>
        {meta.label}
      </Text>
    </TouchableOpacity>
  );
}

function LogRow({ entry }: { entry: DutyLogEntry }) {
  const meta = DUTY_STATUS_META[entry.status];

  return (
    <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.logRow]}>
      <View style={[styles.logIconWrap, { backgroundColor: `${meta.color}1F` }]}>
        <Icon name={DUTY_ICON[entry.status]} size={16} color={meta.color} />
      </View>
      <Text style={[style.fontSizeNormal1x, styles.logRowLabel]}>{meta.label}</Text>
      <Text style={[style.fontSizeSmall2x, styles.logRowTime]}>{formatTime(entry.changed_at)}</Text>
    </View>
  );
}

function renderSeparator() {
  return <View style={styles.separator} />;
}

export default function LogsScreen({ navigation }: Props) {
  const { status, log, setStatus } = useDutyStatus();
  const [restriction, setRestriction] = useState<{ minutes: number; km: number } | null>(null);
  const [saveError, setSaveError] = useState('');

  async function handleStatusPress(next: DutyStatus) {
    try {
      await setStatus(next);
    } catch (e) {
      if (e instanceof DutyStatusRestrictedError) {
        setRestriction({ minutes: e.remainingMinutes, km: e.remainingKm });
      } else {
        const message = e instanceof Error && e.message ? e.message : LogsText.saveErrorMessage;
        setSaveError(message);
      }
    }
  }

  return (
    <ScreenContainer>
      <Text style={[style.fontSizeLarge, style.fontWeightBold, { color: textDark, marginBottom: spacings.xsmall }]}>
        {LogsText.title}
      </Text>
      <Text style={[style.fontSizeSmall2x, { color: textMuted, marginBottom: spacings.xxLarge }]}>
        {LogsText.subtitle}
      </Text>

      <View style={styles.dutyGrid}>
        {DUTY_STATUS_ORDER.map(s => (
          <DutyButton key={s} status={s} active={status === s} onPress={() => handleStatusPress(s)} />
        ))}
      </View>

      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.sectionTitle]}>
        <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>{LogsText.todaysLog}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LogHistory')}>
          <Text style={[style.fontSizeSmall1x, style.fontWeightThin1x, { color: accentColor }]}>{LogsText.history}</Text>
        </TouchableOpacity>
      </View>

      {log.length === 0 ? (
        <Card style={styles.logCard}>
          <EmptyState icon="clock-outline" title={LogsText.emptyTitle} subtitle={LogsText.emptySubtitle} />
        </Card>
      ) : (
        <Card style={styles.logCard}>
          <FlatList
            data={log}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <LogRow entry={item} />}
            ItemSeparatorComponent={renderSeparator}
            scrollEnabled={false}
          />
        </Card>
      )}

      <AlertModal
        visible={restriction !== null}
        onClose={() => setRestriction(null)}
        tone="error"
        title={LogsText.breakRestrictedTitle}
        message={restriction ? LogsText.breakRestrictedMessage(restriction.minutes, restriction.km) : ''}
        confirmLabel={LogsText.breakRestrictedConfirm}
        onConfirm={() => setRestriction(null)}
      />

      <AlertModal
        visible={Boolean(saveError)}
        onClose={() => setSaveError('')}
        tone="error"
        title={LogsText.saveErrorTitle}
        message={saveError}
        confirmLabel={LogsText.breakRestrictedConfirm}
        onConfirm={() => setSaveError('')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  dutyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacings.xxLarge,
  },
  dutyButton: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: spacings.xLarge,
    marginBottom: spacings.normalx,
  },
  dutyButtonLabel: {
    marginTop: spacings.small,
  },
  sectionTitle: {
    marginBottom: spacings.normalx,
  },
  logCard: {
    marginBottom: spacings.xxLarge,
  },
  logRow: {
    paddingVertical: spacings.small2x,
  },
  logIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacings.normalx,
  },
  logRowLabel: {
    color: textDark,
    flex: 1,
  },
  logRowTime: {
    color: textMuted,
  },
  separator: {
    borderTopWidth: 1,
    borderColor,
  },
});
