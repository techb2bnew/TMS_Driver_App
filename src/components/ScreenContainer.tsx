import React from 'react';
import { ScrollView, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseStyle } from '../constant/Style';
import { spacings } from '../constant/Fonts';
import { appBg, splashBgColor } from '../constant/Color';

type ScreenContainerProps = {
  children: React.ReactNode;
  tone?: 'light' | 'dark';
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Every screen sits on this so the safe-area handling and background colour
// are set once instead of per screen.
export default function ScreenContainer({ children, tone = 'light', scroll = false, style: styleOverride }: ScreenContainerProps) {
  const dark = tone === 'dark';
  const Wrapper = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[BaseStyle.flex, { backgroundColor: dark ? splashBgColor : appBg }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <Wrapper
        style={scroll ? BaseStyle.flex : [BaseStyle.flex, styles.padded, styleOverride]}
        contentContainerStyle={scroll ? [styles.padded, styleOverride] : undefined}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  padded: {
    paddingHorizontal: spacings.large,
    paddingTop: spacings.large,
  },
});
