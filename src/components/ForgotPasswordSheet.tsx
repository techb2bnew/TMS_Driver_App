import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheetModal from './BottomSheetModal';
import CustomTextInput from './CustomTextInput';
import CustomButton from './CustomButton';
import Icon from './Icon';
import { BaseStyle } from '../constant/Style';
import { spacings, style } from '../constant/Fonts';
import { okColor, textBody, textMuted } from '../constant/Color';
import { ForgotPasswordText } from '../constant/Constants';

type ForgotPasswordSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ForgotPasswordSheet({ visible, onClose }: ForgotPasswordSheetProps) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setPhone('');
      setError('');
      setSent(false);
    }, 250);
  }

  async function handleSend() {
    if (!phone.trim()) {
      setError(ForgotPasswordText.phoneRequiredError);
      return;
    }
    setError('');
    setSubmitting(true);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 700));
    setSubmitting(false);
    setSent(true);
  }

  return (
    <BottomSheetModal visible={visible} onClose={handleClose} title={ForgotPasswordText.title}>
      {sent ? (
        <>
          <View style={BaseStyle.alignJustifyCenter}>
            <Icon name="email-check-outline" size={40} color={okColor} />
          </View>
          <Text style={[style.fontSizeNormal1x, styles.successText]}>
            {ForgotPasswordText.sentMessage}
          </Text>
          <CustomButton label={ForgotPasswordText.doneLabel} onPress={handleClose} style={styles.actionSpacing} />
        </>
      ) : (
        <>
          <Text style={[style.fontSizeNormal1x, styles.message]}>
            {ForgotPasswordText.enterMessage}
          </Text>
          <CustomTextInput
            leftIcon="phone-outline"
            label={ForgotPasswordText.phoneLabel}
            placeholder={ForgotPasswordText.phonePlaceholder}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            error={error}
          />
          <CustomButton label={ForgotPasswordText.sendResetLink} onPress={handleSend} loading={submitting} style={styles.actionSpacing} />
        </>
      )}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  message: {
    color: textBody,
    marginBottom: spacings.large,
  },
  successText: {
    color: textMuted,
    textAlign: 'center',
    marginTop: spacings.normalx,
    marginBottom: spacings.large,
  },
  actionSpacing: {
    marginTop: spacings.small,
  },
});
