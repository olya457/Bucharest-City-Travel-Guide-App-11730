import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Back, Body, Button, Screen, Title } from '../components/UI';
import { ProgressBar, Reveal } from '../components/Motion';
import { walks } from '../data/routes';
import { places } from '../data/places';
import { practical } from '../data/practical';
import { useGuide } from '../storage/GuideProvider';
import { RootParams, TabsParams } from '../navigation/types';
import { duration, tripSummary } from '../utils/trip';
import { shareText } from '../utils/actions';
import { colors } from '../theme';
type TabProps<T extends keyof TabsParams> = CompositeScreenProps<
  BottomTabScreenProps<TabsParams, T>,
  NativeStackScreenProps<RootParams>
>;
export function RoutesScreen({ navigation }: TabProps<'Routes'>) {
  const [theme, setTheme] = useState('All');
  const { data } = useGuide();
  return (
    <Screen>
      <Text style={s.eyebrow}>CURATED CITY WALKS</Text>
      <Title serifFont>Find your kind of day</Title>
      <Body>
        Six ways to discover Bucharest. Adapt any walk to your own pace.
      </Body>
      <View style={s.wrap}>
        {['All', 'Short', 'Outdoors', 'Culture'].map(t => (
          <Button
            key={t}
            label={t}
            secondary={theme !== t}
            onPress={() => setTheme(t)}
          />
        ))}
      </View>
      {walks
        .filter(
          w =>
            theme === 'All' ||
            (theme === 'Short'
              ? tripSummary(w.stops).totalMinutes <= 240
              : theme === 'Outdoors'
              ? ['Outdoors', 'Free stops'].includes(w.theme)
              : ['Culture', 'Rainy day', 'Architecture'].includes(w.theme)),
        )
        .map((walk, index) => {
          const summary = tripSummary(walk.stops);
          const done = walk.stops.filter(id =>
            data.visited.includes(id),
          ).length;
          return (
            <Reveal key={walk.id} delay={index * 45} variant="slide">
              <View style={[s.card, s.walkCard]}>
                <LinearGradient
                  pointerEvents="none"
                  colors={
                    index % 2 ? ['#20302e', '#151b23'] : ['#302c46', '#171923']
                  }
                  style={StyleSheet.absoluteFill}
                />
                <Text style={s.icon}>{walk.icon}</Text>
                <Text style={s.eyebrow}>{walk.theme.toUpperCase()}</Text>
                <Title>{walk.title}</Title>
                <Body>{walk.subtitle}</Body>
                <Text style={s.meta}>
                  {walk.stops.length} stops · about{' '}
                  {duration(summary.totalMinutes)}
                </Text>
                {done > 0 && (
                  <>
                    <Text style={s.meta}>
                      {done}/{walk.stops.length} visited
                    </Text>
                    <ProgressBar
                      value={done / walk.stops.length}
                      label="Walk progress"
                    />
                  </>
                )}
                <Button
                  label="Explore this walk →"
                  onPress={() => navigation.navigate('Walk', { id: walk.id })}
                />
              </View>
            </Reveal>
          );
        })}
    </Screen>
  );
}
export function WalkScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'Walk'>) {
  const walk = walks.find(w => w.id === route.params.id);
  const { data, addToTrip, toggleVisited } = useGuide();
  if (!walk) {
    return (
      <Screen>
        <Back onPress={navigation.goBack} />
        <Title>Walk not found</Title>
      </Screen>
    );
  }
  const summary = tripSummary(walk.stops);
  const done = walk.stops.filter(id => data.visited.includes(id)).length;
  return (
    <Screen>
      <Back onPress={navigation.goBack} />
      <Text style={s.icon}>{walk.icon}</Text>
      <Title serifFont>{walk.title}</Title>
      <Body>{walk.subtitle}</Body>
      <View style={s.card}>
        <Text style={s.eyebrow}>YOUR WALK AT A GLANCE</Text>
        <Title>About {duration(summary.totalMinutes)}</Title>
        <Body>
          {duration(summary.visitMinutes)} at stops + roughly{' '}
          {duration(summary.walkingMinutes)} between stops. Walking allowance is
          estimated from straight-line distances with a 35% margin, not a routed
          journey. Add breaks and check crossings locally.
        </Body>
        <Body>{walk.tips}</Body>
      </View>
      <Button
        label={
          walk.stops.every(id => data.trip.includes(id))
            ? 'Open My Trip →'
            : 'Add walk to My Trip →'
        }
        onPress={() => {
          addToTrip(walk.stops);
          navigation.navigate('Main', { screen: 'MyTrip' });
        }}
      />
      <Text style={s.meta}>
        {done} of {walk.stops.length} visited
      </Text>
      <ProgressBar value={done / walk.stops.length} label="Visited stops" />
      {done === walk.stops.length && (
        <Reveal variant="zoom" style={s.card}>
          <Title>✦ Walk complete!</Title>
          <Body>Your discoveries are saved on this device.</Body>
        </Reveal>
      )}
      {summary.stops.map((place, i) => (
        <Reveal key={place.id} delay={i * 30} style={s.card}>
          <Text style={s.eyebrow}>
            STOP {String(i + 1).padStart(2, '0')} ·{' '}
            {practical[place.id].minutes} MIN
          </Text>
          <Title>{place.name}</Title>
          <Body>{practical[place.id].tip}</Body>
          <Button
            secondary
            label="View place →"
            onPress={() => navigation.navigate('Place', { id: place.id })}
          />
          <Button
            secondary={!data.visited.includes(place.id)}
            label={
              data.visited.includes(place.id)
                ? '✓ Visited · undo'
                : 'Mark as visited'
            }
            onPress={() => toggleVisited(place.id)}
          />
        </Reveal>
      ))}
      <Title>Make the most of it</Title>
      {walk.highlights.map(t => (
        <Body key={t}>• {t}</Body>
      ))}
    </Screen>
  );
}
export function MyTripScreen({ navigation }: TabProps<'MyTrip'>) {
  const { data, moveStop, removeFromTrip, toggleVisited, setNotes, clearTrip } =
    useGuide();
  const [section, setSection] = useState<'Plan' | 'Saved'>('Plan');
  const summary = tripSummary(data.trip);
  const done = data.trip.filter(id => data.visited.includes(id)).length;
  const list =
    section === 'Plan'
      ? summary.stops
      : places.filter(p => data.saved.includes(p.id));
  return (
    <Screen>
      <Text style={s.eyebrow}>MAKE IT YOURS</Text>
      <Title serifFont>My Trip</Title>
      <Body>Your day, your pace. Plans and notes stay on this device.</Body>
      <View style={s.wrap}>
        {(['Plan', 'Saved'] as const).map(t => (
          <Button
            key={t}
            label={`${t} (${
              t === 'Plan' ? data.trip.length : data.saved.length
            })`}
            secondary={section !== t}
            onPress={() => setSection(t)}
          />
        ))}
      </View>
      {section === 'Plan' && data.trip.length > 0 && (
        <Reveal style={s.card} replayKey={done}>
          <Title>About {duration(summary.totalMinutes)}</Title>
          <Body>
            {duration(summary.visitMinutes)} visiting + an estimated{' '}
            {duration(summary.walkingMinutes)} walking. Travel allowance uses
            straight-line distance plus 35%; actual streets, breaks and access
            may add time.
          </Body>
          <Text style={s.meta}>
            {done}/{data.trip.length} visited
          </Text>
          <ProgressBar
            value={done / data.trip.length}
            label="My Trip progress"
          />
          {done === data.trip.length && <Title>✦ A day well explored</Title>}
        </Reveal>
      )}
      {!list.length && (
        <Reveal variant="zoom" style={s.card}>
          <Text style={s.icon}>✦</Text>
          <Title>
            {section === 'Plan'
              ? 'Your next adventure starts here'
              : 'Keep a little inspiration'}
          </Title>
          <Body>
            {section === 'Plan'
              ? 'Choose a curated walk or add individual places. You can change the order at any time.'
              : 'Tap Save on a place to find it here.'}
          </Body>
          <Button
            label="Discover places →"
            onPress={() => navigation.navigate('Explore')}
          />
          <Button
            secondary
            label="Choose a walk →"
            onPress={() => navigation.navigate('Routes')}
          />
        </Reveal>
      )}
      {list.map((p, i) => (
        <Reveal
          key={p.id}
          replayKey={`${i}-${data.visited.includes(p.id)}`}
          variant="slide"
          style={s.card}
        >
          <Text style={s.eyebrow}>
            {section === 'Plan' ? `${i + 1}. ` : ''}
            {practical[p.id].area.toUpperCase()} · {practical[p.id].minutes} MIN
          </Text>
          <Title>{p.name}</Title>
          <Body>{practical[p.id].address}</Body>
          <Button
            secondary
            label="Place details →"
            onPress={() => navigation.navigate('Place', { id: p.id })}
          />
          {section === 'Plan' && (
            <>
              <Button
                secondary={!data.visited.includes(p.id)}
                label={
                  data.visited.includes(p.id)
                    ? '✓ Visited · undo'
                    : 'Mark as visited'
                }
                onPress={() => toggleVisited(p.id)}
              />
              <View style={s.wrap}>
                {i > 0 && (
                  <Button
                    secondary
                    accessibilityLabel={`Move ${p.name} earlier`}
                    label="↑ Earlier"
                    onPress={() => moveStop(p.id, -1)}
                  />
                )}
                {i < list.length - 1 && (
                  <Button
                    secondary
                    accessibilityLabel={`Move ${p.name} later`}
                    label="↓ Later"
                    onPress={() => moveStop(p.id, 1)}
                  />
                )}
                <Button
                  secondary
                  label="Remove"
                  accessibilityLabel={`Remove ${p.name} from trip`}
                  onPress={() => removeFromTrip(p.id)}
                />
              </View>
            </>
          )}
        </Reveal>
      ))}
      {section === 'Plan' && (
        <>
          <Title>Notes for the day</Title>
          <TextInput
            multiline
            maxLength={2000}
            value={data.notes}
            onChangeText={setNotes}
            placeholder="A meeting point, a café, a reminder…"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Trip notes"
            style={[s.input, s.notes]}
          />
          <Body>Saved automatically · {data.notes.length}/2000</Body>
          {data.trip.length > 0 && (
            <>
              <Button
                label="Share my plan ↗"
                onPress={() =>
                  shareText(
                    'My Bucharest day',
                    summary.stops
                      .map(
                        (p, i) =>
                          `${i + 1}. ${p.name} — ${practical[p.id].address}`,
                      )
                      .join('\n') + (data.notes ? `\n\n${data.notes}` : ''),
                  )
                }
              />
              <Button
                secondary
                label="Clear plan and notes"
                onPress={() =>
                  Alert.alert(
                    'Clear this plan?',
                    'Saved places and visited history will stay. The current stop list and notes will be removed.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Clear plan',
                        style: 'destructive',
                        onPress: clearTrip,
                      },
                    ],
                  )
                }
              />
            </>
          )}
          <Body>
            Offline: place information, walks, notes and progress. External
            directions, videos, websites and external directions need a
            connection.
          </Body>
        </>
      )}
    </Screen>
  );
}
export const s = StyleSheet.create({
  walkCard: { overflow: 'hidden' },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    gap: 14,
  },
  eyebrow: {
    color: colors.yellow,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  icon: { fontSize: 42, color: colors.yellow },
  meta: { color: colors.text, fontSize: 13, lineHeight: 21 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    minHeight: 52,
  },
  notes: { minHeight: 120, textAlignVertical: 'top' },
});
