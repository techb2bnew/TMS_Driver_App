import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import Chip from '../../components/Chip';
import IconCircle from '../../components/IconCircle';
import Icon from '../../components/Icon';
import EmptyState from '../../components/EmptyState';
import { BaseStyle } from '../../constant/Style';
import { spacings, style } from '../../constant/Fonts';
import { appBg, cardBgSoft, textDark, textFaint, textMuted } from '../../constant/Color';
import { LOAD_STATUS_META } from '../../constant/LoadStatus';
import { useLoads } from '../../context/LoadsContext';
import type { Load, LoadStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import type { LoadsStackParamList } from '../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadsText } from '../../constant/Constants';

type Props = NativeStackScreenProps<LoadsStackParamList, 'LoadsMain'>;

const FILTERS: { key: LoadStatus | 'all'; label: string }[] = [
  { key: 'all', label: LoadsText.filters.all },
  { key: 'assigned', label: LoadsText.filters.assigned },
  { key: 'picked_up', label: LoadsText.filters.pickedUp },
  { key: 'in_transit', label: LoadsText.filters.inTransit },
  { key: 'delivered', label: LoadsText.filters.delivered },
];

function LoadCard({ load, onPress }: { load: Load; onPress: () => void }) {
  const meta = LOAD_STATUS_META[load.status];

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.cardTop]}>
          <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter]}>
            <IconCircle name="package-variant-closed" color={meta.color} backgroundColor={`${meta.color}1A`} size={38} iconSize={18} />
            <Text style={[style.fontSizeNormal2x, style.fontWeightMedium, styles.loadId, { color: textDark }]}>{load.load_number}</Text>
          </View>
          <StatusBadge label={meta.label} color={meta.color} />
        </View>

        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.routeRow]}>
          <Icon name="map-marker-outline" size={15} color={textFaint} />
          <Text style={[style.fontSizeSmall2x, styles.routeText]} numberOfLines={1}>
            {load.pickup_location} → {load.drop_location}
          </Text>
        </View>

        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween]}>
          <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{load.customer_name}</Text>
          <Text style={[style.fontSizeSmall1x, { color: textMuted }]}>{formatDate(load.created_at)}</Text>
        </View>

        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.cardBottom]}>
          <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter]}>
            <Icon name="weight-kilogram" size={14} color={textFaint} />
            <Text style={[style.fontSizeSmall1x, styles.weightText]}>{load.weight_kg.toLocaleString('en-IN')} {LoadsText.kgSuffix}</Text>
          </View>
          <Text style={[style.fontSizeNormal1x, style.fontWeightMedium, { color: textDark }]}>{formatCurrency(load.rate)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function LoadsScreen({ navigation }: Props) {
  const { loads } = useLoads();
  const [filter, setFilter] = useState<LoadStatus | 'all'>('all');

  const filteredLoads = useMemo(
    () => (filter === 'all' ? loads : loads.filter(l => l.status === filter)),
    [loads, filter],
  );

  return (
    <SafeAreaView style={[BaseStyle.flex, { backgroundColor: appBg }]}>
      <View style={styles.header}>
        <Text style={[style.fontSizeLarge, style.fontWeightBold, { color: textDark }]}>{LoadsText.title}</Text>
        <Text style={[style.fontSizeSmall2x, { color: textMuted }]}>{loads.length} {LoadsText.loadsAssignedSuffix}</Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTERS}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <Chip label={item.label} active={filter === item.key} onPress={() => setFilter(item.key)} />
        )}
        style={styles.filterRow}
      />

      <FlatList
        data={filteredLoads}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <LoadCard load={item} onPress={() => navigation.navigate('LoadDetail', { loadId: item.id })} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="package-variant" title={LoadsText.emptyTitle} subtitle={LoadsText.emptySubtitle} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacings.large,
    paddingTop: spacings.large,
    paddingBottom: spacings.normalx,
  },
  filterRow: {
    flexGrow: 0,
    marginBottom: spacings.normalx,
  },
  filterList: {
    paddingHorizontal: spacings.large,
  },
  list: {
    paddingHorizontal: spacings.large,
    paddingBottom: spacings.xxLarge,
    flexGrow: 1,
  },
  card: {
    marginBottom: spacings.normalx,
  },
  cardTop: {
    marginBottom: spacings.normalx,
  },
  loadId: {
    marginLeft: spacings.normalx,
  },
  routeRow: {
    marginBottom: spacings.small,
  },
  routeText: {
    color: textDark,
    marginLeft: spacings.xxsmall,
    flexShrink: 1,
  },
  cardBottom: {
    marginTop: spacings.small,
    paddingTop: spacings.small,
    borderTopWidth: 1,
    borderTopColor: cardBgSoft,
  },
  weightText: {
    color: textMuted,
    marginLeft: spacings.xxsmall,
  },
});
