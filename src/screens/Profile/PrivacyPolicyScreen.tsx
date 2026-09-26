import React from 'react';
import { StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import LegalContent from '../../components/LegalContent';
import { spacings } from '../../constant/Fonts';
import { PRIVACY_POLICY_SECTIONS } from '../../mock/legal';
import { PrivacyPolicyText } from '../../constant/Constants';

export default function PrivacyPolicyScreen() {
  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <ScreenHeader title={PrivacyPolicyText.title} />
      <LegalContent sections={PRIVACY_POLICY_SECTIONS} updatedAt={PrivacyPolicyText.updatedAt} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacings.xxLarge,
  },
});
