import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import {
  Back,
  Badge,
  Body,
  Button,
  Filters,
  PlaceCard,
  Screen,
  Title,
} from '../components/UI';
import { Category, categoryLabels, places } from '../data/places';
import { images } from '../data/images';
import { RootParams, TabsParams } from '../navigation/types';
import { useGuide } from '../storage/GuideProvider';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { colors, serif } from '../theme';
import { shareText, openDirections } from '../utils/actions';
type TabProps<T extends keyof TabsParams> = CompositeScreenProps<
  BottomTabScreenProps<TabsParams, T>,
  NativeStackScreenProps<RootParams>
>;
export function ExploreScreen({ navigation }: TabProps<'Explore'>) {
  const [category, setCategory] = useState<Category>('All');
  const list = places.filter(
    p => category === 'All' || p.category === category,
  );
  return (
    <Screen scroll={false}>
      <FlatList
        data={list}
        keyExtractor={p => p.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <ImageBackground source={images.onboarding[0]} style={s.hero}>
              <LinearGradient
                colors={['#09090f22', colors.background]}
                style={StyleSheet.absoluteFill}
              />
              <Text style={s.eyebrow}>📍 BUCHAREST, ROMANIA</Text>
              <Title serifFont>Explore the City</Title>
              <Text style={s.subtitle}>
                {places.length} curated locations waiting for you
              </Text>
            </ImageBackground>
            <View style={s.header}>
              <Filters selected={category} onSelect={setCategory} />
              <Button
                secondary
                label="🎲  Random Category"
                onPress={() => {
                  const options: Category[] = [
                    'Historical',
                    'Parks',
                    'Museums',
                  ].filter(x => x !== category) as Category[];
                  setCategory(
                    options[Math.floor(Math.random() * options.length)],
                  );
                }}
              />
              <View style={s.row}>
                <Text style={s.section}>{categoryLabels[category]}</Text>
                <Text style={s.count}>{list.length} places</Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={s.cardWrap}>
            <PlaceCard
              place={item}
              onPress={() => navigation.navigate('Place', { id: item.id })}
            />
          </View>
        )}
      />
    </Screen>
  );
}
export function SavedScreen({ navigation }: TabProps<'Saved'>) {
  const { gutter } = useLayoutMetrics();
  const { data, toggleSaved } = useGuide();
  const list = places.filter(p => data.saved.includes(p.id));
  return (
    <Screen scroll={false}>
      {list.length ? (
        <FlatList
          data={list}
          keyExtractor={p => p.id}
          contentContainerStyle={s.savedList}
          ListHeaderComponent={
            <View style={s.savedHeader}>
              <Title>Saved Places</Title>
              <Body>{list.length} locations saved</Body>
            </View>
          }
          renderItem={({ item }) => (
            <PlaceCard
              place={item}
              onPress={() => navigation.navigate('Place', { id: item.id })}
              onRemove={() => toggleSaved(item.id)}
            />
          )}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[s.empty, { padding: gutter }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.emptyContent}>
            <Text style={s.emptyIcon}>🔖</Text>
            <Title serifFont>No Saved Places</Title>
            <Text style={s.emptyText}>
              Start exploring and save locations you want to revisit.
            </Text>
            <Button
              style={s.emptyButton}
              label="Explore Locations →"
              onPress={() => navigation.navigate('Explore')}
            />
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}
export function PlaceScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'Place'>) {
  const { narrow, heroHeight, gutter } = useLayoutMetrics();
  const place = places.find(p => p.id === route.params.id);
  const { data, toggleSaved } = useGuide();
  if (!place) {
    return (
      <Screen>
        <Back onPress={navigation.goBack} />
        <Title>Place not found</Title>
      </Screen>
    );
  }
  const saved = data.saved.includes(place.id);
  return (
    <Screen style={s.detailContent}>
      <ImageBackground
        source={place.image}
        style={[s.detailHero, { minHeight: heroHeight, padding: gutter }]}
      >
        <LinearGradient
          colors={['#09090f00', '#09090f44', colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <Back onPress={navigation.goBack} />
        <View style={s.detailTitle}>
          <Badge category={place.category} />
          <Text style={s.landmarkTitle}>{place.name}</Text>
        </View>
      </ImageBackground>
      <View style={[s.detailBody, { padding: gutter }]}>
        <View style={s.coordinateBox}>
          <Text style={s.pin}>📌</Text>
          <View style={s.flex}>
            <Text style={s.coordinateLabel}>COORDINATES</Text>
            <Text selectable style={s.coordinateValue}>
              {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
            </Text>
          </View>
        </View>
        <Body>{place.description}</Body>
        <View style={[s.actions, narrow && s.stackedActions]}>
          <Button
            style={s.flex}
            secondary
            label="↑ Share"
            onPress={() =>
              shareText(
                place.name,
                `${place.description}\n\n${place.latitude}, ${place.longitude}`,
              )
            }
          />
          <Button
            style={s.flex}
            secondary={!saved}
            label={saved ? '🔖 Saved' : '🔖 Save'}
            onPress={() => toggleSaved(place.id)}
          />
          <Button
            style={s.flex}
            secondary
            label="🗺️ Map"
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'Map',
                params: { placeId: place.id },
              })
            }
          />
        </View>
        <Button
          secondary
          label="Open directions ↗"
          onPress={() => openDirections(place)}
        />
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({
  list: { paddingBottom: 12 },
  hero: { minHeight: 210, justifyContent: 'flex-end', padding: 20, gap: 9 },
  eyebrow: {
    color: colors.yellow,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
  },
  subtitle: { color: '#b8b8c0', fontSize: 13 },
  header: { padding: 16, gap: 18 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  section: { color: colors.text, fontSize: 16, fontWeight: '700', flex: 1 },
  count: { fontSize: 12, color: colors.dim },
  cardWrap: { paddingHorizontal: 16 },
  savedList: { padding: 16 },
  savedHeader: { gap: 5, marginTop: 10, marginBottom: 22 },
  empty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 35,
    gap: 25,
  },
  emptyContent: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 24,
    flexGrow: 0,
    flexShrink: 0,
  },
  emptyButton: { alignSelf: 'center', maxWidth: '100%' },
  emptyIcon: { fontSize: 58, marginBottom: 12 },
  emptyText: {
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    color: colors.dim,
  },
  detailContent: { padding: 0, gap: 0 },
  detailHero: {
    minHeight: 260,
    gap: 36,
    padding: 20,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  detailTitle: { gap: 10 },
  landmarkTitle: {
    fontFamily: serif,
    fontSize: 29,
    color: colors.text,
    fontWeight: '700',
  },
  detailBody: { padding: 20, gap: 24 },
  coordinateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1d3865',
    backgroundColor: '#101528',
    borderRadius: 16,
  },
  pin: { fontSize: 22 },
  coordinateLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.blue,
    marginBottom: 5,
  },
  coordinateValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  stackedActions: { flexDirection: 'column' },
  actions: { flexDirection: 'row', gap: 8 },
  flex: { flex: 1 },
});
