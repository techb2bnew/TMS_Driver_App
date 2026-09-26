import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacings, style } from '../constant/Fonts';
import { textBody, textDark, textFaint } from '../constant/Color';
import { LegalContentText } from '../constant/Constants';
import type { LegalSection } from '../mock/legal';

type LegalContentProps = {
  sections: LegalSection[];
  updatedAt: string;
};

export default function LegalContent({ sections, updatedAt }: LegalContentProps) {
  return (
    <View>
      <Text style={[style.fontSizeSmall1x, styles.updated]}>{LegalContentText.updatedPrefix}{updatedAt}</Text>
      {sections.map(section => (
        <View key={section.heading} style={styles.section}>
          <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>{section.heading}</Text>
          <Text style={[style.fontSizeNormal1x, styles.body]}>{section.body}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  updated: {
    color: textFaint,
    marginBottom: spacings.xxLarge,
  },
  section: {
    marginBottom: spacings.xxLarge,
  },
  body: {
    color: textBody,
    marginTop: spacings.small,
    lineHeight: 21,
  },
});
