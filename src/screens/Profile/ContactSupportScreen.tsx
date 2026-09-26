import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import IconCircle from '../../components/IconCircle';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import AlertModal from '../../components/AlertModal';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import {
  accentColor,
  accentSoft,
  borderColor,
  dangerColor,
  inputBgColor,
  placeholderColor,
  textDark,
} from '../../constant/Color';
import { safeOpenURL } from '../../utils/linking';
import { ContactSupportText } from '../../constant/Constants';

const SUPPORT_CHANNELS = [
  { icon: 'phone-outline', label: ContactSupportText.supportPhoneLabel, action: () => safeOpenURL('tel:+911140001234') },
  { icon: 'email-outline', label: ContactSupportText.supportEmailLabel, action: () => safeOpenURL('mailto:support@tmsdriver.com') },
];

export default function ContactSupportScreen() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  async function handleSubmit() {
    if (!subject.trim() || !message.trim()) {
      setError(ContactSupportText.validationError);
      return;
    }
    setError('');
    setSubmitting(true);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 700));
    setSubmitting(false);
    setSubject('');
    setMessage('');
    setSuccessVisible(true);
  }

  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <ScreenHeader title={ContactSupportText.title} subtitle={ContactSupportText.subtitle} />

      <Card style={styles.channelsCard}>
        {SUPPORT_CHANNELS.map((channel, index) => (
          <TouchableOpacity
            key={channel.label}
            activeOpacity={0.7}
            onPress={channel.action}
            style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.channelRow, index > 0 && styles.channelDivider]}
          >
            <IconCircle name={channel.icon} color={accentColor} backgroundColor={accentSoft} size={36} iconSize={18} />
            <Text style={[style.fontSizeNormal1x, style.fontWeightThin1x, styles.channelLabel, { color: textDark }]}>
              {channel.label}
            </Text>
            <Text style={[style.fontSizeSmall1x, { color: accentColor }]}>{ContactSupportText.open}</Text>
          </TouchableOpacity>
        ))}
      </Card>

      <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, styles.formTitle, { color: textDark }]}>
        {ContactSupportText.sendMessage}
      </Text>

      <CustomTextInput
        leftIcon="text-box-outline"
        label={ContactSupportText.subjectLabel}
        placeholder={ContactSupportText.subjectPlaceholder}
        value={subject}
        onChangeText={setSubject}
      />

      <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, styles.label, { color: textDark }]}>{ContactSupportText.messageLabel}</Text>
      <TextInput
        multiline
        numberOfLines={5}
        placeholder={ContactSupportText.messagePlaceholder}
        placeholderTextColor={placeholderColor}
        value={message}
        onChangeText={setMessage}
        style={styles.messageInput}
        textAlignVertical="top"
      />
      {error ? <Text style={[style.fontSizeSmall, styles.errorText]}>{error}</Text> : null}

      <CustomButton label={ContactSupportText.submitRequest} onPress={handleSubmit} loading={submitting} style={styles.submitButton} />

      <AlertModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        tone="success"
        title={ContactSupportText.successTitle}
        message={ContactSupportText.successMessage}
        confirmLabel={ContactSupportText.doneLabel}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacings.xxLarge,
  },
  channelsCard: {
    marginBottom: spacings.xxLarge,
    paddingVertical: spacings.small,
    paddingHorizontal: spacings.large,
  },
  channelRow: {
    paddingVertical: spacings.normalx,
  },
  channelDivider: {
    borderTopWidth: 1,
    borderTopColor: borderColor,
  },
  channelLabel: {
    flex: 1,
    marginLeft: spacings.normalx,
  },
  formTitle: {
    marginBottom: spacings.normalx,
  },
  label: {
    marginBottom: spacings.xsmall,
  },
  messageInput: {
    borderWidth: 1.5,
    borderColor,
    borderRadius: 12,
    backgroundColor: inputBgColor,
    padding: spacings.normalx,
    minHeight: 120,
    color: textDark,
    fontSize: 14,
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
