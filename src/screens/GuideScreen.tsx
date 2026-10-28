import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Body, Button, Screen, Title } from '../components/UI';
import { Reveal } from '../components/Motion';
import { resources } from '../data/resources';
import { RootParams, TabsParams } from '../navigation/types';
import { openExternal } from '../utils/actions';
import { s } from './TripScreens';
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParams, 'Guide'>,
  NativeStackScreenProps<RootParams>
>;
const advice = [
  [
    'Before you go',
    'Pick one neighbourhood and two or three main stops. Check opening days and booking requirements directly with each venue. Leave room for meals and slower crossings.',
  ],
  [
    'Getting around',
    'Keep your next address saved. Use marked pedestrian crossings. For longer transfers, check current public transport routes and tickets with the operator; this guide does not provide live transport data.',
  ],
  [
    'A day without mobile data',
    'Your place descriptions, walks, saved places, plan and notes are bundled or stored locally. Open your plan before setting out. External directions and linked resources require internet.',
  ],
  [
    'Travelling at your own pace',
    'Visit times are planning suggestions, not opening hours. Outdoor routes may include uneven surfaces, steps and busy crossings. Check accessibility with venues before visiting.',
  ],
];
export function GuideScreen({ navigation }: Props) {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>('Before you go');
  return (
    <Screen>
      <Text style={s.eyebrow}>GO A LITTLE DEEPER</Text>
      <Title serifFont>Your pocket guide</Title>
      <Body>Practical tips, local stories and a little curiosity.</Body>
      <View style={s.wrap}>
        <Button
          label="Read stories →"
          onPress={() => navigation.navigate('Blog')}
        />
        <Button
          secondary
          label="Discover facts →"
          onPress={() => navigation.navigate('Facts')}
        />
        <Button
          secondary
          label="Play the quiz →"
          onPress={() => navigation.navigate('Quiz')}
        />
      </View>
      <Title>Travel essentials</Title>
      {advice.map(([title, body]) => (
        <View key={title} style={s.card}>
          <Button
            secondary
            label={`${expanded === title ? '−' : '+'} ${title}`}
            onPress={() => setExpanded(expanded === title ? null : title)}
          />
          {expanded === title && (
            <Reveal variant="slide">
              <Body>{body}</Body>
            </Reveal>
          )}
        </View>
      ))}
      <Title>Watch & read elsewhere</Title>
      <Body>
        Selected links open outside this app on the publisher’s website or app.
        Internet required. Content belongs to its authors; these are independent
        resources, not endorsements or partnerships.
      </Body>
      <View style={s.wrap}>
        {['All', 'Video', 'Article', 'Visitor info'].map(f => (
          <Button
            key={f}
            secondary={filter !== f}
            label={f}
            onPress={() => setFilter(f)}
          />
        ))}
      </View>
      {resources
        .filter(r => filter === 'All' || r.kind === filter)
        .map((r, i) => (
          <Reveal key={r.id} delay={i * 40} variant="slide" style={s.card}>
            <Text style={s.eyebrow}>
              {r.kind.toUpperCase()} · {r.language}
            </Text>
            <Title>{r.title}</Title>
            <Text style={s.meta}>{r.publisher}</Text>
            <Body>{r.description}</Body>
            <Text selectable style={s.meta}>
              {r.url.replace('https://', '').split('/')[0]}
            </Text>
            <Button
              secondary
              label={
                r.kind === 'Video'
                  ? 'Watch on publisher site ↗'
                  : 'Open publisher site ↗'
              }
              onPress={() => openExternal(r.url)}
            />
          </Reveal>
        ))}
      <Body>
        Links reviewed 28 October 2026. Availability and visitor information may
        change.
      </Body>
    </Screen>
  );
}
