import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';
import CenterSheetModal from './CenterSheetModal';
import Chip from './Chip';
import CustomTextInput from './CustomTextInput';
import CustomButton from './CustomButton';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { borderColor, cardBg, dangerColor, inputBgColor, placeholderColor, textDark } from '../constant/Color';
import { AddStopText } from '../constant/Constants';
import { geocodeAddress } from '../lib/geocode';
import type { RouteStop } from '../types';

type StopCategory = keyof typeof AddStopText.categories;

const CATEGORIES: StopCategory[] = ['fuel', 'rest', 'breakdown', 'other'];

type AddStopSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (stop: Omit<RouteStop, 'id' | 'status' | 'distanceFromPrevKm'>) => void;
  // Route's approximate area (e.g. its midpoint) — biases suggestions
  // toward places this trip actually passes through.
  routeBias?: { latitude: number; longitude: number };
};

export default function AddStopSheet({ visible, onClose, onSubmit, routeBias }: AddStopSheetProps) {
  const [category, setCategory] = useState<StopCategory>('fuel');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);

  function reset() {
    setCategory('fuel');
    setAddress('');
    setNotes('');
    setError('');
    setPickedLocation(null);
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
    // Already have coordinates if the driver picked a suggestion — only
    // geocode when they typed a location freely instead.
    const location = pickedLocation ?? (await geocodeAddress(address));
    setSubmitting(false);

    onSubmit({
      type: 'waypoint',
      label: AddStopText.categories[category],
      address: address.trim(),
      city: '',
      eta: new Date().toISOString(),
      notes: notes.trim() || undefined,
      lat: location?.lat ?? 0,
      lng: location?.lng ?? 0,
    });
    reset();
    onClose();
  }

  return (
    <CenterSheetModal visible={visible} onClose={handleClose} title={AddStopText.title} scrollable={false}>
      <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, styles.label, { color: textDark }]}>
        {AddStopText.categoryLabel}
      </Text>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.flexWrap, styles.categoryRow]}>
        {CATEGORIES.map(cat => (
          <Chip key={cat} label={AddStopText.categories[cat]} active={category === cat} onPress={() => setCategory(cat)} />
        ))}
      </View>

      <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, styles.label, { color: textDark }]}>
        {AddStopText.addressLabel}
      </Text>
      <View style={styles.placesWrap}>
        <GooglePlacesAutocomplete
          placeholder={AddStopText.addressPlaceholder}
          fetchDetails
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="handled"
          textInputProps={{
            value: address,
            onChangeText: (text: string) => {
              setAddress(text);
              setPickedLocation(null);
            },
            placeholderTextColor: placeholderColor,
          }}
          onPress={(data, details) => {
            setAddress(data.description);
            const location = details?.geometry?.location;
            setPickedLocation(location ? { lat: location.lat, lng: location.lng } : null);
          }}
          onFail={() => {}}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'en',
            components: 'country:in',
            ...(routeBias
              ? { location: `${routeBias.latitude},${routeBias.longitude}`, radius: 200000 }
              : {}),
          }}
          styles={{
            container: styles.placesContainer,
            textInputContainer: styles.placesInputContainer,
            textInput: styles.placesInput,
            listView: styles.placesList,
            row: styles.placesRow,
            description: { color: textDark },
            separator: { backgroundColor: borderColor, height: 1 },
          }}
        />
      </View>

      <CustomTextInput
        label={AddStopText.notesLabel}
        placeholder={AddStopText.notesPlaceholder}
        value={notes}
        onChangeText={setNotes}
      />
      {error ? <Text style={[style.fontSizeSmall, styles.errorText]}>{error}</Text> : null}

      <CustomButton label={AddStopText.submit} onPress={handleSubmit} loading={submitting} style={styles.submitButton} />
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
  placesWrap: {
    marginBottom: spacings.normalx,
    zIndex: 10,
    elevation: 10,
  },
  placesContainer: {
    flex: 0,
  },
  placesInputContainer: {
    backgroundColor: 'transparent',
  },
  placesInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor,
    backgroundColor: inputBgColor,
    paddingHorizontal: spacings.normalx,
    fontSize: 14,
    color: textDark,
  },
  // Absolutely positioned so the suggestion list floats over the fields
  // below (Notes, the submit button) instead of pushing them down and
  // growing the whole popup's height.
  placesList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    maxHeight: 220,
    borderWidth: 1,
    borderColor,
    borderRadius: 12,
    backgroundColor: cardBg,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  placesRow: {
    paddingVertical: spacings.small2x,
    paddingHorizontal: spacings.normalx,
  },
  errorText: {
    color: dangerColor,
    marginBottom: spacings.normalx,
  },
  submitButton: {
    marginTop: spacings.small,
  },
});
