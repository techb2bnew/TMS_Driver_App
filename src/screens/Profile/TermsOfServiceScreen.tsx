import React from 'react';
import { StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import LegalContent from '../../components/LegalContent';
import { spacings } from '../../constant/Fonts';
import { TERMS_OF_SERVICE_SECTIONS } from '../../mock/legal';
import { TermsOfServiceText } from '../../constant/Constants';

export default function TermsOfServiceScreen() {
  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <ScreenHeader title={TermsOfServiceText.title} />
      <LegalContent sections={TERMS_OF_SERVICE_SECTIONS} updatedAt={TermsOfServiceText.updatedAt} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacings.xxLarge,
  },
});
