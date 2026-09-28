import React, { useEffect, useState } from 'react';
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
import { fetchRoute, syncStopsForLoadStatus } from '../../lib/routeStops';
import { supabase } from '../../lib/supabase';
import { submitPodPhoto } from '../../lib/podUpload';
import { useAuth } from '../../context/AuthContext';
import { useLoads } from '../../context/LoadsContext';
import { useDutyGuard } from '../../hooks/useDutyGuard';
import { formatCurrency, formatDate } from '../../utils/format';
import { safeOpenURL } from '../../utils/linking';
import { DutyGuardText, ExpensesText, LoadDetailText } from '../../constant/Constants';
import type { LoadFlowParamList } from '../../navigation/types';
import type { Expense, LoadDocument, LoadDocumentType, PodDocument, Route as RouteInfo } from '../../types';

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
  const { driver } = useAuth();
  const { getLoad, updateLoadStatus } = useLoads();
  const { requireActiveDuty, blocked, dismissBlocked } = useDutyGuard();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [expenseSheetVisible, setExpenseSheetVisible] = useState(false);
  const [expenseSuccessVisible, setExpenseSuccessVisible] = useState(false);
  const [documents, setDocuments] = useState<LoadDocument[]>([]);
  const [podDocuments, setPodDocuments] = useState<PodDocument[]>([]);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const load = getLoad(loadId);

  useEffect(() => {
    let mounted = true;

    fetchRoute(loadId).then(result => {
      if (mounted) setRouteInfo(result);
    });

    supabase
      .from('load_documents')
      .select('id, load_id, type, file_url, uploaded_at')
      .eq('load_id', loadId)
      .order('uploaded_at', { ascending: false })
      .then(({ data }) => {
        if (mounted) setDocuments(data ?? []);
      });

    supabase
      .from('pod_documents')
      .select('id, load_id, file_url, uploaded_at')
      .eq('load_id', loadId)
      .order('uploaded_at', { ascending: false })
      .then(({ data }) => {
        if (mounted) setPodDocuments(data ?? []);
      });

    return () => {
      mounted = false;
    };
  }, [loadId]);

  if (!load) return null;

  const meta = LOAD_STATUS_META[load.status];
  const next = NEXT_LOAD_STATUS[load.status];
  const latestPod = podDocuments[0];

  function callCustomer() {
    if (load?.customer_contact) safeOpenURL(`tel:${load.customer_contact.replace(/\s/g, '')}`);
  }

  function handlePrimaryActionPress() {
    if (!requireActiveDuty()) return;
    setSheetVisible(true);
  }

  function handleAddExpensePress() {
    if (!requireActiveDuty()) return;
    setExpenseSheetVisible(true);
  }

  async function confirmStatusChange(podPhotoUri?: string) {
    if (!next) return;
    const changedToStatus = next.status;
    await updateLoadStatus(loadId, changedToStatus);
    // Close right away — `next` (and the sheet's actionLabel/requiresPod
    // props) recompute from load.status as soon as the line above updates
    // it, so leaving the sheet open through the awaits below would briefly
    // show the *following* action's confirmation (e.g. "Confirm Delivery"
    // flashing right after "Start Trip") before it finally closes.
    setSheetVisible(false);
    await syncStopsForLoadStatus(loadId, changedToStatus);
    setRouteInfo(await fetchRoute(loadId));
    if (podPhotoUri) {
      const fileUrl = await submitPodPhoto(loadId, podPhotoUri);
      setPodDocuments(prev => [{ id: `local-${Date.now()}`, load_id: loadId, file_url: fileUrl, uploaded_at: new Date().toISOString() }, ...prev]);
    }
  }

  async function handleAddExpense(input: Omit<Expense, 'id' | 'created_at' | 'status'>) {
    if (!driver) return;
    const { error } = await supabase
      .from('expenses')
      .insert({ category: input.category, amount: input.amount, notes: input.notes, load_id: input.load_id, created_by: driver.id });

    if (error) throw error;
    setExpenseSuccessVisible(true);
  }

  return (
    <ScreenContainer scroll style={styles.scrollContent}>
      <ScreenHeader title={load.load_number} subtitle={load.customer_name} />

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

      {load.status === 'delivered' && latestPod && (
        <Card style={styles.section}>
          <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, styles.cardHeaderRow, { color: textDark }]}>
            {LoadDetailText.podTitle}
          </Text>
          <Image source={{ uri: latestPod.file_url }} style={styles.podImage} resizeMode="cover" />
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
            <TouchableOpacity
              key={doc.id}
              activeOpacity={0.7}
              onPress={() => safeOpenURL(doc.file_url)}
              style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.documentRow]}
            >
              <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.flex]}>
                <IconCircle name={DOCUMENT_ICON[doc.type]} color={accentColor} backgroundColor={accentSoft} size={36} iconSize={17} />
                <View style={styles.documentText}>
                  <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, { color: textDark }]}>
                    {LoadDetailText.documentTypes[doc.type]}
                  </Text>
                  <Text style={[style.fontSizeSmall, { color: textMuted }]}>{formatDate(doc.uploaded_at)}</Text>
                </View>
              </View>
              <Icon name="open-in-new" size={16} color={textFaint} />
            </TouchableOpacity>
          ))
        )}
      </Card>

      <CustomButton
        label={LoadDetailText.addExpense}
        variant="outline"
        onPress={handleAddExpensePress}
        style={styles.section}
      />

      {next && (
        <CustomButton label={next.actionLabel} onPress={handlePrimaryActionPress} style={styles.primaryAction} />
      )}

      <StatusUpdateSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onConfirm={confirmStatusChange}
        loadId={load.load_number}
        actionLabel={next?.actionLabel ?? ''}
        requiresPod={next?.status === 'delivered'}
      />

      <AddExpenseSheet
        visible={expenseSheetVisible}
        onClose={() => setExpenseSheetVisible(false)}
        onSubmit={handleAddExpense}
        loadId={load.id}
        loadLabel={load.load_number}
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

      <AlertModal
        visible={blocked}
        onClose={dismissBlocked}
        tone="error"
        title={DutyGuardText.title}
        message={DutyGuardText.message}
        confirmLabel={DutyGuardText.confirmLabel}
        onConfirm={dismissBlocked}
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
