import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { Badge, Button, Filters, Screen } from '../components/UI';
import { Category, places } from '../data/places';
import { RootParams, TabsParams } from '../navigation/types';
import {
  bucharestRegion,
  regionForPlace,
  regionForPlaces,
} from '../utils/mapRegion';
import { Reveal } from '../components/Motion';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { validIds } from '../utils/trip';
import { colors } from '../theme';
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParams, 'Map'>,
  NativeStackScreenProps<RootParams>
>;
export function MapScreen({ route, navigation }: Props) {
  const { height, narrow, gutter } = useLayoutMetrics();
  const [region, setRegion] = useState(bucharestRegion);
  const [tripIds, setTripIds] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>('All');
  const [selected, setSelected] = useState<string | undefined>(
    route.params?.placeId,
  );
  useEffect(() => {
    if (route.params?.placeId) {
      setCategory('All');
      setTripIds([]);
      setSelected(route.params.placeId);
      const target = places.find(p => p.id === route.params?.placeId);
      if (target) {
        setRegion(regionForPlace(target));
      }
      navigation.setParams({ placeId: undefined });
    }
  }, [route.params?.placeId, navigation]);
  useEffect(() => {
    if (route.params?.stopIds) {
      const ids = validIds(route.params.stopIds);
      setTripIds(ids);
      setCategory('All');
      setSelected(undefined);
      setRegion(regionForPlaces(places.filter(p => ids.includes(p.id))));
      navigation.setParams({ stopIds: undefined });
    }
  }, [route.params?.stopIds, navigation]);
  const filtered = useMemo(
    () =>
      places.filter(
        p =>
          (category === 'All' || p.category === category) &&
          (!tripIds.length || tripIds.includes(p.id)),
      ),
    [category, tripIds],
  );
  const place = places.find(p => p.id === selected);
  return (
    <Screen scroll={false}>
      <View style={s.filters}>
        {tripIds.length > 0 && (
          <Button
            secondary
            label="My Trip stops · show all places"
            onPress={() => {
              setTripIds([]);
              setCategory('All');
              setRegion(regionForPlaces(places));
            }}
          />
        )}
        <Filters
          compact
          selected={category}
          onSelect={c => {
            setTripIds([]);
            setCategory(c);
            setSelected(undefined);
            setRegion(
              regionForPlaces(
                places.filter(p => c === 'All' || p.category === c),
              ),
            );
          }}
        />
      </View>
      <View style={s.map}>
        <MapView
          style={StyleSheet.absoluteFill}
          region={region}
          onRegionChangeComplete={setRegion}
          userInterfaceStyle="dark"
          showsCompass
          showsScale
          showsUserLocation={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          loadingEnabled
          loadingBackgroundColor={colors.background}
          loadingIndicatorColor={colors.yellow}
          onPress={event => {
            if (event.nativeEvent.action !== 'marker-press') {
              setSelected(undefined);
            }
          }}
          mapPadding={{
            top: 16,
            left: 16,
            right: 16,
            bottom: place ? Math.min(height * 0.4, 230) : 24,
          }}
        >
          {filtered.map(item => (
            <Marker
              key={item.id}
              identifier={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={
                tripIds.length
                  ? `${tripIds.indexOf(item.id) + 1}. ${item.name}`
                  : item.name
              }
              pinColor={
                item.category === 'Parks'
                  ? colors.green
                  : item.category === 'Museums'
                  ? colors.blue
                  : colors.yellow
              }
              onPress={() => {
                setSelected(item.id);
                setRegion(regionForPlace(item));
              }}
            />
          ))}
        </MapView>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show all locations in this category"
          onPress={() => {
            setSelected(undefined);
            setRegion(regionForPlaces(filtered));
          }}
          style={s.reset}
        >
          <Text style={s.resetIcon}>⌖</Text>
        </Pressable>
        {place && (
          <Reveal
            replayKey={place.id}
            style={[
              s.preview,
              {
                left: gutter,
                right: gutter,
                maxHeight: Math.max(140, height * 0.4),
              },
            ]}
          >
            <ScrollView
              contentContainerStyle={s.previewContent}
              showsVerticalScrollIndicator={false}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close place preview"
                onPress={() => setSelected(undefined)}
                style={s.close}
              >
                <Text style={s.closeText}>×</Text>
              </Pressable>
              <View style={s.row}>
                {place.illustrated ? (
                  <Text style={s.closeText}>◇</Text>
                ) : (
                  <Image source={place.image} style={s.image} />
                )}
                <View style={s.info}>
                  <Text style={s.name}>{place.name}</Text>
                  <Badge category={place.category} />
                </View>
              </View>
              <View style={[s.row, narrow && s.stackedRow]}>
                <Text
                  numberOfLines={2}
                  style={[s.description, narrow && s.fullDescription]}
                >
                  {place.description}
                </Text>
                <Button
                  label="Details →"
                  onPress={() => navigation.navigate('Place', { id: place.id })}
                />
              </View>
            </ScrollView>
          </Reveal>
        )}
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({
  filters: { paddingHorizontal: 15, paddingVertical: 9 },
  map: { flex: 1 },
  reset: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetIcon: { fontSize: 28, color: colors.yellow },
  preview: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    borderRadius: 23,
    padding: 13,
    paddingTop: 22,
    backgroundColor: '#0f101bee',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  previewContent: { gap: 12, paddingTop: 6 },
  stackedRow: { flexDirection: 'column', alignItems: 'stretch' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  image: { width: 70, height: 70, borderRadius: 16 },
  info: { flex: 1, gap: 8, paddingRight: 12 },
  name: { fontSize: 14, fontWeight: '700', color: colors.text },
  fullDescription: { flex: 0 },
  description: { flex: 1, fontSize: 12, lineHeight: 19, color: colors.muted },
  close: {
    position: 'absolute',
    right: 6,
    top: 1,
    paddingHorizontal: 9,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    zIndex: 1,
  },
  closeText: { color: colors.muted, fontSize: 24 },
});
