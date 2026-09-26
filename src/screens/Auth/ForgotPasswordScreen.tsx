import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from '../../components/Icon';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import AlertModal from '../../components/AlertModal';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { splashBgColor, splashText } from '../../constant/Color';
import { APP_NAME, ForgotPasswordText } from '../../constant/Constants';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentVisible, setSentVisible] = useState(false);

  async function handleSend() {
    if (!phone.trim()) {
      setError(ForgotPasswordText.phoneRequiredError);
      return;
    }
    setError('');
    setSubmitting(true);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 700));
    setSubmitting(false);
    setSentVisible(true);
  }

  return (
    <KeyboardAvoidingView
      style={[BaseStyle.flex, styles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.brandBlock}>
          <View style={styles.logoCircle}>
            <Icon name="lock-reset" size={30} color="#FFFFFF" />
          </View>
          <Text style={[style.fontSizeMedium1x, style.fontWeightBold, styles.appName]}>{APP_NAME}</Text>
        </View>

        <View style={styles.headingBlock}>
          <Text style={[style.fontSizeLargeXX, style.fontWeightBold, styles.title]}>{ForgotPasswordText.title}</Text>
          <Text style={[style.fontSizeNormal1x, styles.subtitle]}>{ForgotPasswordText.enterMessage}</Text>
        </View>

        <View style={styles.form}>
          <CustomTextInput
            tone="dark"
            label={ForgotPasswordText.phoneLabel}
            placeholder={ForgotPasswordText.phonePlaceholder}
            keyboardType="phone-pad"
            maxLength={16}
            value={phone}
            onChangeText={setPhone}
            error={error}
          />
        </View>

        <CustomButton label={ForgotPasswordText.sendResetLink} onPress={handleSend} loading={submitting} style={styles.submitButton} />
      </ScrollView>

      <AlertModal
        visible={sentVisible}
        onClose={() => navigation.goBack()}
        tone="success"
        title={ForgotPasswordText.title}
        message={ForgotPasswordText.sentMessage}
        confirmLabel={ForgotPasswordText.doneLabel}
        onConfirm={() => navigation.goBack()}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: splashBgColor,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacings.xxLarge,
    paddingVertical: spacings.ExtraLarge,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: spacings.ExtraLarge2x,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(233,69,69,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacings.normal,
  },
  appName: {
    color: splashText,
    letterSpacing: 0.3,
  },
  headingBlock: {
    marginBottom: spacings.ExtraLarge,
  },
  title: {
    color: splashText,
    marginBottom: spacings.xsmall,
  },
  subtitle: {
    color: splashText,
    opacity: 0.6,
  },
  form: {
    marginBottom: spacings.ExtraLarge,
  },
  submitButton: {
    marginBottom: spacings.ExtraLarge2x,
  },
});
