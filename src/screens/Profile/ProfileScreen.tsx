import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import Icon from '../../components/Icon';
import IconCircle from '../../components/IconCircle';
import ConfirmModal from '../../components/ConfirmModal';
import AlertModal from '../../components/AlertModal';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import {
  accentColor,
  accentSoft,
  borderColor,
  cardBg,
  dangerColor,
  dangerSoft,
  okColor,
  textDark,
  textFaint,
  warnColor,
} from '../../constant/Color';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME, APP_VERSION, ProfileText } from '../../constant/Constants';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

function SectionLabel({ label }: { label: string }) {
  return <Text style={[style.fontSizeSmall1x, style.fontWeightThin1x, styles.sectionLabel]}>{label.toUpperCase()}</Text>;
}

function MenuRow({ icon, label, onPress, tone = 'default' }: { icon: string; label: string; onPress: () => void; tone?: 'default' | 'danger' }) {
  const danger = tone === 'danger';
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.menuRow]}>
      <IconCircle
        name={icon}
        color={danger ? dangerColor : accentColor}
        backgroundColor={danger ? dangerSoft : accentSoft}
        size={36}
        iconSize={18}
      />
      <Text style={[style.fontSizeNormal1x, style.fontWeightThin1x, styles.menuLabel, { color: danger ? dangerColor : textDark }]}>
        {label}
      </Text>
      <Icon name="chevron-right" size={20} color={textFaint} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }: Props) {
  const { driver, logout, deleteAccount } = useAuth();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteSuccessVisible, setDeleteSuccessVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  if (!driver) return null;

  const initials = driver.full_name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  async function confirmDelete() {
    await deleteAccount();
    setDeleteConfirmVisible(false);
    setDeleteSuccessVisible(true);
  }

  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <View>
        <View style={[BaseStyle.alignItemsCenter, styles.header]}>
          <View style={[styles.avatar, BaseStyle.alignJustifyCenter]}>
            <Text style={[style.fontSizeLargeX, style.fontWeightBold, { color: accentColor }]}>{initials}</Text>
          </View>
          <Text style={[style.fontSizeLarge, style.fontWeightBold, { color: textDark, marginTop: spacings.normalx }]}>
            {driver.full_name}
          </Text>
          <View style={styles.statusBadgeWrap}>
            <StatusBadge label={driver.status === 'active' ? 'Active' : 'Inactive'} color={driver.status === 'active' ? okColor : warnColor} />
          </View>
        </View>

        <Card style={styles.section}>
          <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.infoRow]}>
            <IconCircle name="card-account-details-outline" color={accentColor} backgroundColor={accentSoft} size={36} iconSize={18} />
            <View style={styles.infoTextWrap}>
              <Text style={[style.fontSizeSmall1x, styles.infoLabel]}>{ProfileText.licenseLabel}</Text>
              <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, styles.infoValue]}>{driver.license_number}</Text>
            </View>
          </View>
          <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.infoRow]}>
            <IconCircle name="phone-outline" color={accentColor} backgroundColor={accentSoft} size={36} iconSize={18} />
            <View style={styles.infoTextWrap}>
              <Text style={[style.fontSizeSmall1x, styles.infoLabel]}>{ProfileText.phoneLabel}</Text>
              <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, styles.infoValue]}>{driver.phone}</Text>
            </View>
          </View>
          <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.infoRowLast]}>
            <IconCircle name="truck-outline" color={accentColor} backgroundColor={accentSoft} size={36} iconSize={18} />
            <View style={styles.infoTextWrap}>
              <Text style={[style.fontSizeSmall1x, styles.infoLabel]}>{ProfileText.truckLabel}</Text>
              <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, styles.infoValue]}>{driver.truck_number ?? ProfileText.truckUnassigned}</Text>
            </View>
          </View>
        </Card>

        <SectionLabel label={ProfileText.accountSection} />
        <Card style={styles.menuCard}>
          <MenuRow icon="wallet-outline" label={ProfileText.earnings} onPress={() => navigation.navigate('Earnings')} />
          <View style={styles.menuDivider} />
          <MenuRow icon="receipt-text-outline" label={ProfileText.expenses} onPress={() => navigation.navigate('Expenses')} />
          <View style={styles.menuDivider} />
          <MenuRow icon="cog-outline" label={ProfileText.settings} onPress={() => navigation.navigate('Settings')} />
        </Card>

        <SectionLabel label={ProfileText.legalSection} />
        <Card style={styles.menuCard}>
          <MenuRow icon="shield-check-outline" label={ProfileText.privacyPolicy} onPress={() => navigation.navigate('PrivacyPolicy')} />
          <View style={styles.menuDivider} />
          <MenuRow icon="file-document-outline" label={ProfileText.termsOfService} onPress={() => navigation.navigate('TermsOfService')} />
          <View style={styles.menuDivider} />
          <MenuRow icon="lifebuoy" label={ProfileText.contactSupport} onPress={() => navigation.navigate('ContactSupport')} />
        </Card>

        <SectionLabel label={ProfileText.dangerSection} />
        <Card style={styles.menuCard}>
          <MenuRow icon="account-remove-outline" label={ProfileText.deleteAccount} tone="danger" onPress={() => setDeleteConfirmVisible(true)} />
        </Card>

        <Card style={styles.menuCard}>
          <MenuRow icon="logout" label={ProfileText.logOut} tone="danger" onPress={() => setLogoutConfirmVisible(true)} />
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={[style.fontSizeSmall1x, style.fontWeightThin1x, styles.footerText]}>{APP_NAME}</Text>
        <Text style={[style.fontSizeSmall, styles.footerVersion]}>Version {APP_VERSION}</Text>
      </View>

      <ConfirmModal
        visible={deleteConfirmVisible}
        onClose={() => setDeleteConfirmVisible(false)}
        onConfirm={confirmDelete}
        icon="account-remove-outline"
        title={ProfileText.deleteTitle}
        message={ProfileText.deleteMessage}
        confirmLabel={ProfileText.deleteAccount}
        tone="danger"
      />

      <ConfirmModal
        visible={logoutConfirmVisible}
        onClose={() => setLogoutConfirmVisible(false)}
        onConfirm={() => {
          setLogoutConfirmVisible(false);
          logout();
        }}
        icon="logout"
        title={ProfileText.logoutTitle}
        message={ProfileText.logoutMessage}
        confirmLabel={ProfileText.logOut}
      />

      <AlertModal
        visible={deleteSuccessVisible}
        onClose={logout}
        tone="success"
        title={ProfileText.deleteSuccessTitle}
        message={ProfileText.deleteSuccessMessage}
        confirmLabel={ProfileText.doneLabel}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: spacings.large,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacings.large,
  },
  footerText: {
    color: textFaint,
  },
  footerVersion: {
    color: textFaint,
    opacity: 0.7,
    marginTop: 2,
  },
  header: {
    marginBottom: spacings.xxLarge,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: accentSoft,
  },
  statusBadgeWrap: {
    marginTop: spacings.small,
  },
  section: {
    marginBottom: spacings.large,
  },
  sectionLabel: {
    color: textFaint,
    letterSpacing: 0.5,
    marginBottom: spacings.small,
  },
  infoRow: {
    paddingVertical: spacings.normalx,
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
  },
  infoRowLast: {
    paddingVertical: spacings.normalx,
  },
  infoTextWrap: {
    flex: 1,
    marginLeft: spacings.normalx,
  },
  infoLabel: {
    color: textFaint,
    marginBottom: 2,
  },
  infoValue: {
    color: textDark,
  },
  menuCard: {
    marginBottom: spacings.large,
    paddingVertical: spacings.small,
    paddingHorizontal: spacings.large,
    backgroundColor: cardBg,
  },
  menuRow: {
    paddingVertical: spacings.normalx,
  },
  menuLabel: {
    flex: 1,
    marginLeft: spacings.normalx,
  },
  menuDivider: {
    height: 1,
    backgroundColor: borderColor,
  },
});
