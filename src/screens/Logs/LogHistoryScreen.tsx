import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { textDark, textFaint, textMuted } from '../../constant/Color';
import { DUTY_STATUS_META, DUTY_STATUS_ORDER } from '../../constant/DutyStatus';
import { buildDutyHistory, type DutyDaySummary } from '../../utils/dutyHistory';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { LogHistoryText } from '../../constant/Constants';

function DayCard({ day }: { day: DutyDaySummary }) {
  const totalHours = DUTY_STATUS_ORDER.reduce((sum, s) => sum + day.hours[s], 0);

  return (
    <Card style={styles.card}>
      <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>
        {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
      </Text>

      {totalHours <= 0 ? (
        <Text style={[style.fontSizeSmall2x, styles.noData, { color: textFaint }]}>{LogHistoryText.noData}</Text>
      ) : (
        <>
          <View style={styles.bar}>
            {DUTY_STATUS_ORDER.map(s => {
              const width = (day.hours[s] / totalHours) * 100;
              if (width <= 0) return null;
              return <View key={s} style={{ width: `${width}%`, backgroundColor: DUTY_STATUS_META[s].color }} />;
            })}
          </View>

          <View style={[BaseStyle.flexDirectionRow, styles.legend]}>
            {DUTY_STATUS_ORDER.map(s => (
              <View key={s} style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.legendItem]}>
                <View style={[styles.legendDot, { backgroundColor: DUTY_STATUS_META[s].color }]} />
                <Text style={[style.fontSizeSmall, { color: textMuted }]}>
                  {DUTY_STATUS_META[s].label} {day.hours[s]}{LogHistoryText.hoursSuffix}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </Card>
  );
}

export default function LogHistoryScreen() {
  const { driver } = useAuth();
  const [history, setHistory] = useState<DutyDaySummary[]>([]);

  useEffect(() => {
    if (!driver) return;
    let mounted = true;

    supabase
      .from('duty_logs')
      .select('id, status, changed_at')
      .eq('driver_id', driver.id)
      .order('changed_at', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        if (mounted) setHistory(buildDutyHistory(data ?? []));
      });

    return () => {
      mounted = false;
    };
  }, [driver]);

  return (
    <ScreenContainer>
      <ScreenHeader title={LogHistoryText.title} subtitle={LogHistoryText.subtitle} />
      <FlatList
        data={history}
        keyExtractor={item => item.date}
        renderItem={({ item }) => <DayCard day={item} />}
        contentContainerStyle={styles.list}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: spacings.xxLarge,
  },
  card: {
    marginBottom: spacings.normalx,
  },
  noData: {
    marginTop: spacings.normalx,
  },
  bar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: spacings.normalx,
    marginBottom: spacings.normalx,
  },
  legend: {
    flexWrap: 'wrap',
  },
  legendItem: {
    marginRight: spacings.normalx,
    marginBottom: spacings.xxsmall,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacings.xxsmall,
  },
});
