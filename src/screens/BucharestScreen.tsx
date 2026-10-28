import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Body, Button, Screen, Title } from '../components/UI';
import { images } from '../data/images';
import { places } from '../data/places';
import { RootParams, TabsParams } from '../navigation/types';
import { colors, serif } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParams, 'Bucharest'>,
  NativeStackScreenProps<RootParams>
>;
const chapters = [
  {
    label: 'Architecture',
    title: 'Look up. There is a story.',
    description:
      'Grand concert halls, ornate palaces and quiet courtyards: discover the city through its buildings.',
    ids: ['athenaeum', 'cec', 'church'],
  },
  {
    label: 'Green spaces',
    title: 'Find a slower rhythm.',
    description:
      'Leave room between city sights for gardens, lakeside paths and a little time outdoors.',
    ids: ['cismigiu', 'king', 'botanical'],
  },
  {
    label: 'Culture',
    title: 'Get to know Romania.',
    description:
      'Explore art, village traditions and the stories behind everyday objects in the city’s museums.',
    ids: ['art', 'village', 'peasant'],
  },
];

export function BucharestScreen({ navigation }: Props) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const chapter = chapters[chapterIndex];
  return (
    <Screen>
      <ImageBackground
        source={images.athenaeum}
        style={s.hero}
        imageStyle={s.heroImage}
      >
        <LinearGradient colors={['#09090f00', '#09090fef']} style={s.heroShade}>
          <Text style={s.eyebrow}>MEET THE CITY · ROMANIA</Text>
          <Text accessibilityRole="header" style={s.heroTitle}>
            Bucharest
          </Text>
          <Text style={s.heroBody}>
            Grand avenues. Hidden courtyards. Your next discovery.
          </Text>
        </LinearGradient>
      </ImageBackground>
      <View style={s.facts}>
        {[
          ['LOCAL NAME', 'București'],
          ['COUNTRY', 'Romania'],
          ['LANGUAGE', 'Romanian'],
        ].map(([label, value]) => (
          <View key={label} style={s.fact}>
            <Text style={s.factLabel}>{label}</Text>
            <Text style={s.factValue}>{value}</Text>
          </View>
        ))}
      </View>
      <Title serifFont>A city of contrasts</Title>
      <Body>
        Romania’s capital brings monumental buildings, intimate churches, leafy
        parks and lively streets together. Take your time: the small details are
        part of the experience.
      </Body>
      <Text style={s.eyebrow}>THREE WAYS TO DISCOVER IT</Text>
      <View style={s.tabs}>
        {chapters.map((item, index) => (
          <Button
            key={item.label}
            label={item.label}
            secondary={index !== chapterIndex}
            onPress={() => setChapterIndex(index)}
          />
        ))}
      </View>
      <Title>{chapter.title}</Title>
      <Body>{chapter.description}</Body>
      {chapter.ids.map((id, index) => {
        const place = places.find(item => item.id === id)!;
        return (
          <View key={id} style={s.card}>
            <Image
              source={place.image}
              style={s.photo}
              accessibilityLabel={place.name}
            />
            <View style={s.cardBody}>
              <Text style={s.eyebrow}>
                0{index + 1} · {place.category.toUpperCase()}
              </Text>
              <Title>{place.name}</Title>
              <Body>{place.description}</Body>
              <Button
                secondary
                label="Discover this place →"
                accessibilityLabel={`Discover ${place.name}`}
                onPress={() => navigation.navigate('Place', { id })}
              />
            </View>
          </View>
        );
      })}
      <View style={s.invitation}>
        <Text style={s.eyebrow}>MAKE IT YOUR OWN</Text>
        <Title serifFont>Turn curiosity into a walk</Title>
        <Body>
          Choose a route, save your favourite places and explore at your own
          pace.
        </Body>
        <Button
          label="Explore city walks →"
          onPress={() => navigation.navigate('Routes')}
        />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { height: 310, justifyContent: 'flex-end' },
  heroImage: { borderRadius: 24 },
  heroShade: { padding: 22, paddingTop: 80, borderRadius: 24, gap: 10 },
  eyebrow: {
    color: colors.yellow,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  heroTitle: { color: colors.text, fontFamily: serif, fontSize: 43 },
  heroBody: { color: colors.text, fontSize: 15, lineHeight: 23 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  fact: {
    flex: 1,
    minWidth: 90,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 13,
    gap: 7,
  },
  factLabel: { color: colors.muted, fontSize: 9, letterSpacing: 1 },
  factValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photo: { width: '100%', height: 190 },
  cardBody: { padding: 18, gap: 12 },
  invitation: {
    padding: 20,
    borderRadius: 22,
    backgroundColor: colors.surface,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
