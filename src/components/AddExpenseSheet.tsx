import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CenterSheetModal from './CenterSheetModal';
import Chip from './Chip';
import CustomTextInput from './CustomTextInput';
import CustomButton from './CustomButton';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { dangerColor, textDark } from '../constant/Color';
import { ExpensesText } from '../constant/Constants';
import type { Expense, ExpenseCategory } from '../types';

const CATEGORIES: ExpenseCategory[] = ['Fuel', 'Tolls', 'Maintenance', 'Insurance', 'Other'];

type AddExpenseSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'id' | 'created_at' | 'status'>) => Promise<void>;
  // The real load id (FK value) — kept separate from `loadLabel` so the
  // sheet can show a friendly "LD-1042" title without storing that string
  // where the database expects a uuid.
  loadId?: string;
  loadLabel?: string;
};

export default function AddExpenseSheet({ visible, onClose, onSubmit, loadId, loadLabel }: AddExpenseSheetProps) {
  const [category, setCategory] = useState<ExpenseCategory>('Fuel');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setCategory('Fuel');
    setAmount('');
    setNotes('');
    setError('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    const numericAmount = Number(amount);
    if (!amount.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError(ExpensesText.form.amountRequired);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ category, amount: numericAmount, notes: notes.trim(), load_id: loadId ?? null });
      reset();
      onClose();
    } catch (err) {
      // Surface the real Postgres/RLS error (e.g. a missing column or a
      // policy rejection) instead of a generic message — much faster to
      // diagnose than guessing from a silent failure.
      console.error('Expense submit failed', err);
      const message = err instanceof Error && err.message ? err.message : ExpensesText.form.submitError;
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CenterSheetModal
      visible={visible}
      onClose={handleClose}
      title={loadLabel ? `${ExpensesText.form.title} — ${loadLabel}` : ExpensesText.form.title}
    >
      <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, styles.label, { color: textDark }]}>
        {ExpensesText.form.categoryLabel}
      </Text>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.flexWrap, styles.categoryRow]}>
        {CATEGORIES.map(cat => (
          <Chip key={cat} label={ExpensesText.categories[cat]} active={category === cat} onPress={() => setCategory(cat)} />
        ))}
      </View>

      <CustomTextInput
        label={ExpensesText.form.amountLabel}
        placeholder={ExpensesText.form.amountPlaceholder}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <CustomTextInput
        label={ExpensesText.form.notesLabel}
        placeholder={ExpensesText.form.notesPlaceholder}
        value={notes}
        onChangeText={setNotes}
      />
      {error ? <Text style={[style.fontSizeSmall, styles.errorText]}>{error}</Text> : null}

      <CustomButton label={ExpensesText.form.submit} onPress={handleSubmit} loading={submitting} style={styles.submitButton} />
    </CenterSheetModal>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacings.small,
  },
  categoryRow: {
    marginBottom: spacings.normalx,
  },
  errorText: {
    color: dangerColor,
    marginBottom: spacings.normalx,
  },
  submitButton: {
    marginTop: spacings.small,
  },
});
