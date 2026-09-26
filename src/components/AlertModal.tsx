import React from 'react';
import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Icon from './Icon';
import CustomButton from './CustomButton';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import {
  accentSoft,
  cardBg,
  dangerColor,
  dangerSoft,
  okColor,
  okSoft,
  scrim,
  textBody,
  textDark,
} from '../constant/Color';
import { AlertModalText } from '../constant/Constants';

type AlertTone = 'error' | 'success' | 'info';

type AlertModalProps = {
  visible: boolean;
  onClose: () => void;
  tone?: AlertTone;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

const TONE_META: Record<AlertTone, { icon: string; color: string; bg: string }> = {
  error: { icon: 'alert-circle-outline', color: dangerColor, bg: dangerSoft },
  success: { icon: 'check-circle-outline', color: okColor, bg: okSoft },
  info: { icon: 'information-outline', color: dangerColor, bg: accentSoft },
};

// The one non-native "alert" every screen uses — for messages that aren't
// tied to a single form field (invalid login, submit confirmations, success
// states) so nothing in the app falls back to the OS Alert.alert().
export default function AlertModal({
  visible,
  onClose,
  tone = 'info',
  title,
  message,
  confirmLabel = AlertModalText.defaultConfirmLabel,
  onConfirm,
  secondaryLabel,
  onSecondary,
}: AlertModalProps) {
  const meta = TONE_META[tone];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[BaseStyle.flex, BaseStyle.alignJustifyCenter, styles.backdrop]}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
                <Icon name={meta.icon} size={30} color={meta.color} />
              </View>
              <Text style={[style.fontSizeMedium1x, style.fontWeightMedium, styles.title, { color: textDark }]}>
                {title}
              </Text>
              <Text style={[style.fontSizeNormal1x, styles.message, { color: textBody }]}>{message}</Text>

              <CustomButton label={confirmLabel} onPress={onConfirm ?? onClose} />

              {secondaryLabel && (
                <CustomButton label={secondaryLabel} variant="outline" onPress={onSecondary ?? onClose} style={styles.secondaryButton} />
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
    backgroundColor: cardBg,
    borderRadius: 20,
    padding: spacings.xxLarge,
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacings.large,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacings.small,
  },
  message: {
    textAlign: 'center',
    marginBottom: spacings.xxLarge,
  },
  secondaryButton: {
    marginTop: spacings.normalx,
  },
});
