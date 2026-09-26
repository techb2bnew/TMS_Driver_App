import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import IconCircle from '../../components/IconCircle';
import Icon from '../../components/Icon';
import CustomButton from '../../components/CustomButton';
import RouteTimeline from '../../components/RouteTimeline';
import StatusUpdateSheet from '../../components/StatusUpdateSheet';
import AddExpenseSheet from '../../components/AddExpenseSheet';
import AlertModal from '../../components/AlertModal';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { accentColor, accentSoft, borderColor, cardBgSoft, textDark, textFaint, textMuted } from '../../constant/Color';
import { LOAD_STATUS_META, NEXT_LOAD_STATUS } from '../../constant/LoadStatus';
import { mockRoutes } from '../../mock/routes';
import { mockLoadDocuments } from '../../mock/loadDocuments';
import { addMockExpense } from '../../mock/expenses';
import { useLoads } from '../../context/LoadsContext';
import { formatCurrency, formatDate } from '../../utils/format';
import { safeOpenURL } from '../../utils/linking';
import { ExpensesText, LoadDetailText } from '../../constant/Constants';
import type { LoadFlowParamList } from '../../navigation/types';
import type { Expense, LoadDocumentType } from '../../types';

const DOCUMENT_ICON: Record<LoadDocumentType, string> = {
  rate_confirmation: 'file-document-outline',
  bol: 'file-certificate-outline',
  other: 'file-outline',
};

type Props = NativeStackScreenProps<LoadFlowParamList, 'LoadDetail'>;

function InfoTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoTile}>
      <Icon name={icon} size={18} color={textFaint} />
      <Text style={[style.fontSizeSmall, styles.infoTileLabel]}>{label}</Text>
      <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, { color: textDark }]}>{value}</Text>
    </View>
  );
}

export default function LoadDetailScreen({ route, navigation }: Props) {
  const { loadId } = route.params;
  const { getLoad, updateLoadStatus } = useLoads();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [expenseSheetVisible, setExpenseSheetVisible] = useState(false);
  const [expenseSuccessVisible, setExpenseSuccessVisible] = useState(false);
  const load = getLoad(loadId);
  const routeInfo = mockRoutes[loadId];
  const documents = mockLoadDocuments[loadId] ?? [];

  if (!load) return null;

  const meta = LOAD_STATUS_META[load.status];
  const next = NEXT_LOAD_STATUS[load.status];

  function callCustomer() {
    if (load?.customer_contact) safeOpenURL(`tel:${load.customer_contact.replace(/\s/g, '')}`);
  }

  async function confirmStatusChange(podPhotoUri?: string) {
    if (!next) return;
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    updateLoadStatus(loadId, next.status, podPhotoUri);
    setSheetVisible(false);
  }

  function handleAddExpense(input: Omit<Expense, 'id' | 'created_at' | 'status'>) {
    const expense: Expense = {
      id: `EX-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'pending',
      ...input,
    };
    addMockExpense(expense);
    setExpenseSuccessVisible(true);
  }

  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <ScreenHeader title={load.id} subtitle={load.customer_name} />

      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.statusRow]}>
        <StatusBadge label={meta.label} color={meta.color} />
        {load.status !== 'delivered' && load.status !== 'cancelled' && (
          <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{formatDate(load.created_at)}</Text>
        )}
      </View>

      <Card style={styles.section}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween]}>
          <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.flex]}>
            <IconCircle name="account" color={accentColor} backgroundColor={accentSoft} size={44} />
            <View style={styles.customerText}>
              <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>{load.customer_name}</Text>
              <Text style={[style.fontSizeSmall2x, { color: textMuted }]}>{load.customer_contact ?? LoadDetailText.noContactOnFile}</Text>
            </View>
          </View>
          {load.customer_contact && (
            <TouchableOpacity onPress={callCustomer} activeOpacity={0.8} style={styles.callButton}>
              <Icon name="phone" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </Card>

      {routeInfo && (
        <Card style={styles.section}>
          <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.cardHeaderRow]}>
            <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, { color: textDark }]}>{LoadDetailText.route}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RouteMap', { loadId })}>
              <Text style={[style.fontSizeSmall2x, style.fontWeightThin1x, { color: accentColor }]}>{LoadDetailText.viewFullRoute}</Text>
            </TouchableOpacity>
          </View>
          <RouteTimeline stops={routeInfo.stops} />
        </Card>
      )}

      <Card style={styles.section}>
        <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, styles.cardHeaderRow, { color: textDark }]}>
          {LoadDetailText.cargoDetails}
        </Text>
        <View style={[BaseStyle.flexDirectionRow, styles.infoGrid]}>
          <InfoTile icon="weight-kilogram" label={LoadDetailText.weight} value={`${load.weight_kg.toLocaleString('en-IN')} ${LoadDetailText.kgSuffix}`} />
          <InfoTile icon="currency-inr" label={LoadDetailText.rate} value={formatCurrency(load.rate)} />
        </View>
      </Card>

      {load.status === 'delivered' && load.pod_photo_uri && (
        <Card style={styles.section}>
          <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, styles.cardHeaderRow, { color: textDark }]}>
            {LoadDetailText.podTitle}
          </Text>
          <Image source={{ uri: load.pod_photo_uri }} style={styles.podImage} resizeMode="cover" />
        </Card>
      )}

      <Card style={styles.section}>
        <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, styles.cardHeaderRow, { color: textDark }]}>
          {LoadDetailText.documentsTitle}
        </Text>
        {documents.length === 0 ? (
          <Text style={[style.fontSizeSmall2x, { color: textMuted }]}>{LoadDetailText.noDocuments}</Text>
        ) : (
          documents.map(doc => (
            <View key={doc.id} style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.documentRow]}>
              <IconCircle name={DOCUMENT_ICON[doc.type]} color={accentColor} backgroundColor={accentSoft} size={36} iconSize={17} />
              <View style={styles.documentText}>
                <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, { color: textDark }]}>{doc.file_name}</Text>
                <Text style={[style.fontSizeSmall, { color: textMuted }]}>
                  {LoadDetailText.documentTypes[doc.type]} · {formatDate(doc.uploaded_at)}
                </Text>
              </View>
            </View>
          ))
        )}
      </Card>

      <CustomButton
        label={LoadDetailText.addExpense}
        variant="outline"
        onPress={() => setExpenseSheetVisible(true)}
        style={styles.section}
      />

      {next && (
        <CustomButton label={next.actionLabel} onPress={() => setSheetVisible(true)} style={styles.primaryAction} />
      )}

      <StatusUpdateSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onConfirm={confirmStatusChange}
        loadId={load.id}
        actionLabel={next?.actionLabel ?? ''}
        requiresPod={next?.status === 'delivered'}
      />

      <AddExpenseSheet
        visible={expenseSheetVisible}
        onClose={() => setExpenseSheetVisible(false)}
        onSubmit={handleAddExpense}
        loadId={load.id}
      />

      <AlertModal
        visible={expenseSuccessVisible}
        onClose={() => setExpenseSuccessVisible(false)}
        tone="success"
        title={ExpensesText.form.successTitle}
        message={ExpensesText.form.successMessage}
        confirmLabel={ExpensesText.form.doneLabel}
        onConfirm={() => setExpenseSuccessVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacings.xxLarge,
  },
  statusRow: {
    marginBottom: spacings.large,
  },
  section: {
    marginBottom: spacings.normalx,
  },
  customerText: {
    marginLeft: spacings.normalx,
    flexShrink: 1,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: accentColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderRow: {
    marginBottom: spacings.normalx,
  },
  infoGrid: {
    gap: spacings.normalx,
  },
  infoTile: {
    flex: 1,
    backgroundColor: cardBgSoft,
    borderRadius: 12,
    padding: spacings.normalx,
    borderWidth: 1,
    borderColor,
  },
  infoTileLabel: {
    color: textMuted,
    marginTop: spacings.small,
    marginBottom: spacings.xxsmall,
  },
  podImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: cardBgSoft,
  },
  documentRow: {
    marginBottom: spacings.normalx,
  },
  documentText: {
    marginLeft: spacings.normalx,
    flexShrink: 1,
  },
  primaryAction: {
    marginTop: spacings.normal,
  },
});
