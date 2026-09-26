import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from '../../components/Icon';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { accentColor, splashBgColor, splashText } from '../../constant/Color';
import { APP_NAME, SplashText } from '../../constant/Constants';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const SPLASH_DURATION = 2200;

export default function SplashScreen({ navigation }: Props) {
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.9)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(10)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, speed: 8, bounciness: 9 }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(textTranslate, { toValue: 0, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(
      Animated.parallel([
        Animated.timing(ringScale, { toValue: 1.6, duration: 1800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(ringOpacity, { toValue: 0.35, duration: 200, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0, duration: 1600, useNativeDriver: true }),
        ]),
      ]),
    ).start();

    Animated.timing(progress, {
      toValue: 1,
      duration: SPLASH_DURATION,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => navigation.replace('Login'), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [navigation, logoScale, logoOpacity, ringScale, ringOpacity, textOpacity, textTranslate, progress]);

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[BaseStyle.flex, BaseStyle.alignJustifyCenter, styles.container]}>
      <View style={styles.logoWrap}>
        <Animated.View
          style={[styles.ring, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]}
          pointerEvents="none"
        />
        <Animated.View style={[styles.logoCircle, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <Icon name="truck-fast-outline" size={36} color={accentColor} />
        </Animated.View>
      </View>

      <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textTranslate }] }}>
        <Text style={[style.fontSizeLarge, style.fontWeightMedium, styles.title]}>{APP_NAME}</Text>
        <Text style={[style.fontSizeSmall2x, styles.subtitle]}>{SplashText.subtitle}</Text>
      </Animated.View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: splashBgColor,
  },
  logoWrap: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacings.large,
  },
  ring: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: accentColor,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(233,69,69,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: splashText,
    marginBottom: spacings.xsmall,
    textAlign: 'center',
  },
  subtitle: {
    color: splashText,
    opacity: 0.55,
    textAlign: 'center',
  },
  progressTrack: {
    position: 'absolute',
    bottom: 64,
    width: 120,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 1.5,
    backgroundColor: accentColor,
  },
});
