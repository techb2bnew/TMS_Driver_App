import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import StatusBadge from '../../components/StatusBadge';
import IconCircle from '../../components/IconCircle';
import EmptyState from '../../components/EmptyState';
import AddExpenseSheet from '../../components/AddExpenseSheet';
import AlertModal from '../../components/AlertModal';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import {
  accentColor,
  accentSoft,
  dangerColor,
  dangerSoft,
  okColor,
  okSoft,
  textDark,
  textMuted,
  warnColor,
  warnSoft,
} from '../../constant/Color';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Expense, ExpenseStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { ExpensesText } from '../../constant/Constants';

const FILTERS: { key: ExpenseStatus | 'all'; label: string }[] = [
  { key: 'all', label: ExpensesText.filters.all },
  { key: 'pending', label: ExpensesText.filters.pending },
  { key: 'approved', label: ExpensesText.filters.approved },
  { key: 'rejected', label: ExpensesText.filters.rejected },
];

const STATUS_STYLE: Record<ExpenseStatus, { color: string; soft: string; icon: string }> = {
  pending: { color: warnColor, soft: warnSoft, icon: 'clock-outline' },
  approved: { color: okColor, soft: okSoft, icon: 'check-circle-outline' },
  rejected: { color: dangerColor, soft: dangerSoft, icon: 'close-circle-outline' },
};

function ExpenseRow({ item }: { item: Expense }) {
  const { color, soft, icon } = STATUS_STYLE[item.status];
  return (
    <Card style={styles.row}>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween]}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.flex]}>
          <IconCircle name={icon} color={color} backgroundColor={soft} size={40} iconSize={19} />
          <View style={styles.rowText}>
            <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, { color: textDark }]}>
              {ExpensesText.categories[item.category]}
            </Text>
            <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
        <View style={BaseStyle.alignItemsFlexEnd}>
          <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>{formatCurrency(item.amount)}</Text>
          <StatusBadge
            label={item.status === 'pending' ? ExpensesText.pendingLabel : item.status === 'approved' ? ExpensesText.approvedLabel : ExpensesText.rejectedLabel}
            color={color}
          />
        </View>
      </View>
    </Card>
  );
}

export default function ExpensesScreen() {
  const { driver } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<ExpenseStatus | 'all'>('all');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  useEffect(() => {
    if (!driver) return;
    let mounted = true;

    supabase
      .from('expenses')
      .select('id, category, amount, load_id, notes, status, created_at')
      .eq('created_by', driver.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (mounted) setExpenses(data ?? []);
      });

    return () => {
      mounted = false;
    };
  }, [driver]);

  const totalThisMonth = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filtered = useMemo(
    () => (filter === 'all' ? expenses : expenses.filter(e => e.status === filter)),
    [expenses, filter],
  );

  async function handleAddExpense(input: Omit<Expense, 'id' | 'created_at' | 'status'>) {
    if (!driver) return;
    const { data, error } = await supabase
      .from('expenses')
      .insert({ category: input.category, amount: input.amount, notes: input.notes, load_id: input.load_id, created_by: driver.id })
      .select('id, category, amount, load_id, notes, status, created_at')
      .single();

    if (error || !data) throw error ?? new Error('Insert failed');

    setExpenses(prev => [data, ...prev]);
    setSuccessVisible(true);
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title={ExpensesText.title}
        subtitle={ExpensesText.subtitle}
        rightIcon="plus"
        onRightPress={() => setShowAddSheet(true)}
      />

      <Card style={styles.summaryCard}>
        <Text style={[style.fontSizeLargeX, style.fontWeightBold, { color: accentColor }]}>{formatCurrency(totalThisMonth)}</Text>
        <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{ExpensesText.totalThisMonth}</Text>
      </Card>

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
        renderItem={({ item }) => <ExpenseRow item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="receipt-text-outline" title={ExpensesText.emptyTitle} subtitle={ExpensesText.emptySubtitle} />}
      />

      <AddExpenseSheet visible={showAddSheet} onClose={() => setShowAddSheet(false)} onSubmit={handleAddExpense} />

      <AlertModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        tone="success"
        title={ExpensesText.form.successTitle}
        message={ExpensesText.form.successMessage}
        confirmLabel={ExpensesText.form.doneLabel}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: accentSoft,
    alignItems: 'flex-start',
    marginBottom: spacings.large,
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
