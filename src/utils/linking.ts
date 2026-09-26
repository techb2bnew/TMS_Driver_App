import { Linking } from 'react-native';

// Wraps Linking.openURL so a device/simulator without a phone dialer, mail
// client, or maps app (very common on the iOS Simulator) fails silently
// instead of surfacing an uncaught promise rejection to the user.
export function safeOpenURL(url: string) {
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) return Linking.openURL(url);
    })
    .catch(() => {});
}
