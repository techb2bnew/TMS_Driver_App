import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icon from './Icon';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { cardBg, scrim, textDark, textFaint } from '../constant/Color';

type CenterSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  // A ScrollView clips any absolutely-positioned overlay inside it (e.g. an
  // autocomplete dropdown) instead of letting it float over the fields
  // below — pass false for a sheet that needs that overlay behaviour, since
  // its own content is short enough to never need scrolling anyway.
  scrollable?: boolean;
};

// The centered dialog every form/action sheet uses (Add Expense, Add Stop,
// confirm delivery, forgot password) — same "never a bottom sheet" design
// brief as ConfirmModal/AlertModal, just with scrollable form content.
export default function CenterSheetModal({ visible, onClose, title, children, scrollable = true }: CenterSheetModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[BaseStyle.flex, BaseStyle.alignJustifyCenter, styles.backdrop]}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.header]}>
                <Text style={[style.fontSizeMedium1x, style.fontWeightMedium, { color: textDark }]}>{title}</Text>
                <TouchableOpacity onPress={onClose} hitSlop={8}>
                  <Icon name="close" size={22} color={textFaint} />
                </TouchableOpacity>
              </View>
              {scrollable ? (
                <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
              ) : (
                children
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: scrim,
    paddingHorizontal: spacings.xxLarge,
  },
  card: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: cardBg,
    borderRadius: 20,
    paddingHorizontal: spacings.large,
    paddingTop: spacings.large,
    paddingBottom: spacings.xxLarge,
  },
  header: {
    marginBottom: spacings.large,
  },
});
