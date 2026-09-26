import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import StatusBadge from '../../components/StatusBadge';
import IconCircle from '../../components/IconCircle';
import EmptyState from '../../components/EmptyState';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { accentColor, accentSoft, okColor, okSoft, textDark, textMuted, warnColor, warnSoft } from '../../constant/Color';
import { mockSettlements } from '../../mock/settlements';
import type { Settlement, SettlementStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { EarningsText } from '../../constant/Constants';

const FILTERS: { key: SettlementStatus | 'all'; label: string }[] = [
  { key: 'all', label: EarningsText.filters.all },
  { key: 'paid', label: EarningsText.filters.paid },
  { key: 'unpaid', label: EarningsText.filters.unpaid },
];

function SettlementRow({ item }: { item: Settlement }) {
  const paid = item.status === 'paid';
  return (
    <Card style={styles.row}>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween]}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.flex]}>
          <IconCircle
            name={paid ? 'cash-check' : 'cash-clock'}
            color={paid ? okColor : warnColor}
            backgroundColor={paid ? okSoft : warnSoft}
            size={40}
            iconSize={19}
          />
          <View style={styles.rowText}>
            <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, { color: textDark }]}>{item.load_id}</Text>
            <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
        <View style={BaseStyle.alignItemsFlexEnd}>
          <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>{formatCurrency(item.amount)}</Text>
          <StatusBadge label={paid ? EarningsText.paidLabel : EarningsText.unpaidLabel} color={paid ? okColor : warnColor} />
        </View>
      </View>
    </Card>
  );
}

export default function EarningsScreen() {
  const [filter, setFilter] = useState<SettlementStatus | 'all'>('all');

  const totalPaid = mockSettlements.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.amount, 0);
  const totalPending = mockSettlements.filter(s => s.status === 'unpaid').reduce((sum, s) => sum + s.amount, 0);

  const filtered = useMemo(
    () => (filter === 'all' ? mockSettlements : mockSettlements.filter(s => s.status === filter)),
    [filter],
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={EarningsText.title} subtitle={EarningsText.subtitle} />

      <View style={[BaseStyle.flexDirectionRow, styles.summaryRow]}>
        <Card style={[BaseStyle.flex, styles.summaryCard]}>
          <Text style={[style.fontSizeLargeX, style.fontWeightBold, { color: okColor }]}>{formatCurrency(totalPaid)}</Text>
          <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{EarningsText.totalPaid}</Text>
        </Card>
        <Card style={[BaseStyle.flex, styles.summaryCard, styles.summaryCardGap]}>
          <Text style={[style.fontSizeLargeX, style.fontWeightBold, { color: accentColor }]}>{formatCurrency(totalPending)}</Text>
          <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{EarningsText.pending}</Text>
        </Card>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTERS}
        keyExtractor={item => item.key}
        renderItem={({ item }) => <Chip label={item.label} active={filter === item.key} onPress={() => setFilter(item.key)} />}
        style={styles.filterRow}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <SettlementRow item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="cash-remove" title={EarningsText.emptyTitle} subtitle={EarningsText.emptySubtitle} />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    marginBottom: spacings.large,
  },
  summaryCard: {
    backgroundColor: accentSoft,
    alignItems: 'flex-start',
  },
  summaryCardGap: {
    marginLeft: spacings.normalx,
    backgroundColor: okSoft,
  },
  filterRow: {
    flexGrow: 0,
    marginBottom: spacings.normalx,
  },
  list: {
    paddingBottom: spacings.xxLarge,
    flexGrow: 1,
  },
  row: {
    marginBottom: spacings.normalx,
  },
  rowText: {
    marginLeft: spacings.normalx,
  },
});
