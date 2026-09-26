import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheetModal from './BottomSheetModal';
import Chip from './Chip';
import CustomTextInput from './CustomTextInput';
import CustomButton from './CustomButton';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { dangerColor, textDark } from '../constant/Color';
import { AddStopText } from '../constant/Constants';
import type { RouteStop } from '../types';

type StopCategory = keyof typeof AddStopText.categories;

const CATEGORIES: StopCategory[] = ['fuel', 'rest', 'breakdown', 'other'];

type AddStopSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (stop: Omit<RouteStop, 'id' | 'status' | 'distanceFromPrevKm' | 'lat' | 'lng'>) => void;
};

export default function AddStopSheet({ visible, onClose, onSubmit }: AddStopSheetProps) {
  const [category, setCategory] = useState<StopCategory>('fuel');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setCategory('fuel');
    setAddress('');
    setNotes('');
    setError('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    if (!address.trim()) {
      setError(AddStopText.addressRequired);
      return;
    }
    setError('');
    setSubmitting(true);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    setSubmitting(false);

    onSubmit({
      type: 'waypoint',
      label: AddStopText.categories[category],
      address: address.trim(),
      city: '',
      eta: new Date().toISOString(),
      notes: notes.trim() || undefined,
    });
    reset();
    onClose();
  }

  return (
    <BottomSheetModal visible={visible} onClose={handleClose} title={AddStopText.title}>
      <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, styles.label, { color: textDark }]}>
        {AddStopText.categoryLabel}
      </Text>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.flexWrap, styles.categoryRow]}>
        {CATEGORIES.map(cat => (
          <Chip key={cat} label={AddStopText.categories[cat]} active={category === cat} onPress={() => setCategory(cat)} />
        ))}
      </View>

      <CustomTextInput
        label={AddStopText.addressLabel}
        placeholder={AddStopText.addressPlaceholder}
        value={address}
        onChangeText={setAddress}
      />

      <CustomTextInput
        label={AddStopText.notesLabel}
        placeholder={AddStopText.notesPlaceholder}
        value={notes}
        onChangeText={setNotes}
      />
      {error ? <Text style={[style.fontSizeSmall, styles.errorText]}>{error}</Text> : null}

      <CustomButton label={AddStopText.submit} onPress={handleSubmit} loading={submitting} style={styles.submitButton} />
    </BottomSheetModal>
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
