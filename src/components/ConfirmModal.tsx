import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Icon from './Icon';
import CustomButton from './CustomButton';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { accentSoft, cardBg, dangerColor, dangerSoft, scrim, textBody, textDark } from '../constant/Color';
import { ConfirmModalText } from '../constant/Constants';

type ConfirmModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  icon: string;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
};

// The one centered Cancel/Confirm dialog every destructive or session action
// uses (Delete Account, Logout, ...) — never a bottom sheet, per design brief.
export default function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  icon,
  title,
  message,
  confirmLabel,
  cancelLabel = ConfirmModalText.defaultCancelLabel,
  tone = 'default',
}: ConfirmModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const danger = tone === 'danger';

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={submitting ? undefined : onClose}>
        <View style={[BaseStyle.flex, BaseStyle.alignJustifyCenter, styles.backdrop]}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: danger ? dangerSoft : accentSoft }]}>
                <Icon name={icon} size={28} color={danger ? dangerColor : textDark} />
              </View>
              <Text style={[style.fontSizeMedium1x, style.fontWeightMedium, styles.title, { color: textDark }]}>
                {title}
              </Text>
              <Text style={[style.fontSizeNormal1x, styles.message, { color: textBody }]}>{message}</Text>

              <View style={[BaseStyle.flexDirectionRow, styles.actions]}>
                <CustomButton
                  label={cancelLabel}
                  onPress={onClose}
                  variant="outline"
                  disabled={submitting}
                  fullWidth={false}
                  style={BaseStyle.flex}
                />
                <CustomButton
                  label={confirmLabel}
                  onPress={handleConfirm}
                  variant={danger ? 'danger' : 'primary'}
                  loading={submitting}
                  fullWidth={false}
                  style={BaseStyle.flex}
                />
              </View>
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
    lineHeight: 20,
  },
  actions: {
    gap: spacings.normalx,
    width: '100%',
  },
});
