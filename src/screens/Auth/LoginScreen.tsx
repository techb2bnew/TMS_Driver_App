import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from '../../components/Icon';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import Checkbox from '../../components/Checkbox';
import AlertModal from '../../components/AlertModal';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { splashBgColor, splashText } from '../../constant/Color';
import { APP_NAME, LoginText } from '../../constant/Constants';
import { useAuth, InvalidCredentialsError } from '../../context/AuthContext';
// Forgot-password flow (ForgotPasswordScreen + AuthNavigator route) is built
// but paused for now — resume by uncommenting there and the link below.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = LoginText.emailRequired;
    else if (!EMAIL_REGEX.test(email.trim())) next.email = LoginText.emailInvalid;
    if (!password) next.password = LoginText.passwordRequired;
    else if (password.length < 4) next.password = LoginText.passwordTooShort;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      if (e instanceof InvalidCredentialsError) {
        setErrorVisible(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[BaseStyle.flex, styles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.brandBlock}>
          <View style={styles.logoCircle}>
            <Icon name="truck-fast-outline" size={30} color="#FFFFFF" />
          </View>
          <Text style={[style.fontSizeMedium1x, style.fontWeightBold, styles.appName]}>{APP_NAME}</Text>
        </View>

        <View style={styles.headingBlock}>
          <Text style={[style.fontSizeLargeXX, style.fontWeightBold, styles.title]}>{LoginText.title}</Text>
          <Text style={[style.fontSizeNormal1x, styles.subtitle]}>{LoginText.subtitle}</Text>
        </View>

        <View style={styles.form}>
          <CustomTextInput
            tone="dark"
            label={LoginText.emailLabel}
            placeholder={LoginText.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
          <CustomTextInput
            tone="dark"
            label={LoginText.passwordLabel}
            placeholder={LoginText.passwordPlaceholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <Checkbox tone="dark" checked={rememberMe} onToggle={() => setRememberMe(v => !v)} label={LoginText.rememberMe} />
          {/* Forgot password link — paused, see note at top of file
          <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween]}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, styles.forgotLink]}>{LoginText.forgotPassword}</Text>
            </TouchableOpacity>
          </View>
          */}
        </View>

        <CustomButton label={LoginText.signIn} onPress={handleLogin} loading={submitting} style={styles.submitButton} />

        <Text style={[style.fontSizeSmall1x, styles.footerNote]}>
          {LoginText.footerLine1}{'\n'}{LoginText.footerLine2}
        </Text>
      </ScrollView>

      <AlertModal
        visible={errorVisible}
        onClose={() => setErrorVisible(false)}
        tone="error"
        title={LoginText.errorTitle}
        message={LoginText.errorMessage}
        confirmLabel={LoginText.errorConfirm}
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
  footerNote: {
    color: splashText,
    opacity: 0.4,
    textAlign: 'center',
    lineHeight: 18,
  },
});
