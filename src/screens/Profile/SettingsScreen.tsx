import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Icon from '../../components/Icon';
import IconCircle from '../../components/IconCircle';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { accentColor, accentSoft, borderColor, disabledBg, textDark, textFaint, textMuted } from '../../constant/Color';
import { APP_NAME, SettingsText } from '../../constant/Constants';
import { safeOpenURL } from '../../utils/linking';

function ToggleRow({ icon, label, value, onValueChange }: { icon: string; label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.row]}>
      <IconCircle name={icon} color={accentColor} backgroundColor={accentSoft} size={36} iconSize={18} />
      <Text style={[style.fontSizeNormal1x, style.fontWeightThin1x, styles.rowLabel, { color: textDark }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: disabledBg, true: accentSoft }}
        thumbColor={value ? accentColor : '#FFFFFF'}
      />
    </View>
  );
}

function LinkRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.row]}>
      <IconCircle name={icon} color={accentColor} backgroundColor={accentSoft} size={36} iconSize={18} />
      <Text style={[style.fontSizeNormal1x, style.fontWeightThin1x, styles.rowLabel, { color: textDark }]}>{label}</Text>
      <Icon name="chevron-right" size={20} color={textFaint} />
    </TouchableOpacity>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={[style.fontSizeSmall1x, style.fontWeightThin1x, styles.sectionLabel]}>{label.toUpperCase()}</Text>;
}

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [tripAlerts, setTripAlerts] = useState(true);

  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <ScreenHeader title={SettingsText.title} />

      <SectionLabel label={SettingsText.preferences} />
      <Card style={styles.card}>
        <ToggleRow icon="bell-ring-outline" label={SettingsText.pushNotifications} value={pushEnabled} onValueChange={setPushEnabled} />
        <View style={styles.divider} />
        <ToggleRow icon="map-marker-alert-outline" label={SettingsText.tripAlerts} value={tripAlerts} onValueChange={setTripAlerts} />
      </Card>

      <SectionLabel label={SettingsText.support} />
      <Card style={styles.card}>
        <LinkRow icon="phone-in-talk-outline" label={SettingsText.contactDispatch} onPress={() => safeOpenURL('tel:+911140001234')} />
        <View style={styles.divider} />
        <LinkRow icon="help-circle-outline" label={SettingsText.helpCentre} onPress={() => {}} />
        <View style={styles.divider} />
        <LinkRow icon="alert-octagon-outline" label={SettingsText.reportIssue} onPress={() => {}} />
      </Card>

      <SectionLabel label={SettingsText.about} />
      <Card style={styles.card}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.row]}>
          <Text style={[style.fontSizeNormal1x, style.fontWeightThin1x, { color: textDark }]}>{APP_NAME}</Text>
          <Text style={[style.fontSizeSmall2x, { color: textMuted }]}>{SettingsText.version}</Text>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacings.xxLarge,
  },
  sectionLabel: {
    color: textFaint,
    letterSpacing: 0.5,
    marginBottom: spacings.small,
    marginTop: spacings.small,
  },
  card: {
    marginBottom: spacings.large,
    paddingVertical: spacings.small,
    paddingHorizontal: spacings.large,
  },
  row: {
    paddingVertical: spacings.normalx,
  },
  rowLabel: {
    flex: 1,
    marginLeft: spacings.normalx,
  },
  divider: {
    height: 1,
    backgroundColor: borderColor,
  },
});
