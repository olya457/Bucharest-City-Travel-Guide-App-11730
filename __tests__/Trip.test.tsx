import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GuideProvider,
  parseData,
  useGuide,
} from '../src/storage/GuideProvider';
import { reorder, tripSummary, normalizeSearch } from '../src/utils/trip';
import { walks } from '../src/data/routes';
import { practical } from '../src/data/practical';
import { places } from '../src/data/places';
import { resources } from '../src/data/resources';
import { MyTripScreen, WalkScreen } from '../src/screens/TripScreens';
import { Button } from '../src/components/UI';
import { openExternal } from '../src/utils/actions';
import { Alert, Linking } from 'react-native';

jest.mock('react-native-maps', () => ({
  __esModule: true,
  default: 'MapView',
  Marker: 'Marker',
}));
beforeEach(() => jest.clearAllMocks());

test('old saved data migrates without losing favourites and corrupt trip IDs are removed', () => {
  const old = parseData(
    JSON.stringify({
      onboarded: true,
      saved: ['palace'],
      trip: ['palace', null, 'unknown', 'palace'],
      visited: ['cec', 9],
      notes: 4,
    }),
  );
  expect(old).toMatchObject({
    onboarded: true,
    saved: ['palace'],
    trip: ['palace'],
    visited: ['cec'],
    notes: '',
  });
  expect(parseData(JSON.stringify({ saved: ['cec'] })).saved).toEqual(['cec']);
});
test('stop order has safe boundaries, and duration changes with the itinerary', () => {
  expect(reorder(['palace', 'cec'], 'palace', -1)).toEqual(['palace', 'cec']);
  expect(reorder(['palace', 'cec'], 'missing', 1)).toEqual(['palace', 'cec']);
  expect(reorder(['palace', 'cec'], 'cec', -1)).toEqual(['cec', 'palace']);
  expect(tripSummary([]).totalMinutes).toBe(0);
  expect(tripSummary(['cec']).totalMinutes).toBe(practical.cec.minutes);
  expect(tripSummary(['cec', 'palace']).walkingMinutes).toBeGreaterThan(0);
  expect(normalizeSearch('Cișmigiu')).toBe('cismigiu');
});
test('curated routes and practical records reference actual locations', () => {
  const ids = new Set(places.map(p => p.id));
  expect(walks.length).toBeGreaterThanOrEqual(5);
  for (const w of walks) {
    expect(new Set(w.stops).size).toBe(w.stops.length);
    expect(w.stops.every(id => ids.has(id))).toBe(true);
  }
  for (const p of places) {
    expect(practical[p.id].address.length).toBeGreaterThan(5);
    expect(practical[p.id].minutes).toBeGreaterThan(0);
    expect(practical[p.id].source).toMatch(/^https:\/\//);
  }
  expect(
    resources.filter(r => r.kind === 'Video').length,
  ).toBeGreaterThanOrEqual(2);
});
test('trip edits, notes and visited state survive a reload; clearing preserves favourites', async () => {
  let guide: ReturnType<typeof useGuide>;
  function Probe() {
    guide = useGuide();
    return null;
  }
  let app: Renderer.ReactTestRenderer;
  await act(async () => {
    app = Renderer.create(
      <GuideProvider>
        <Probe />
      </GuideProvider>,
    );
  });
  await act(async () => {
    guide!.addToTrip(['cec', 'palace']);
    guide!.addToTrip(['cec']);
    guide!.moveStop('palace', -1);
    guide!.toggleVisited('palace');
    guide!.setNotes('Meet at 10');
    guide!.toggleSaved('cec');
  });
  expect(guide!.data.trip).toEqual(['palace', 'cec']);
  const payload = (AsyncStorage.setItem as jest.Mock).mock.calls.at(-1)[1];
  await act(async () => app!.unmount());
  (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(payload);
  await act(async () => {
    app = Renderer.create(
      <GuideProvider>
        <Probe />
      </GuideProvider>,
    );
  });
  expect(guide!.data).toMatchObject({
    trip: ['palace', 'cec'],
    visited: ['palace'],
    notes: 'Meet at 10',
  });
  await act(async () => guide!.clearTrip());
  expect(guide!.data).toMatchObject({
    trip: [],
    notes: '',
    saved: ['cec'],
    visited: ['palace'],
  });
  await act(async () => app!.unmount());
});
test('walk adds all stops and opens the trip, and empty trip has working entry points', async () => {
  const navigation = { navigate: jest.fn(), goBack: jest.fn() };
  let app: Renderer.ReactTestRenderer;
  await act(async () => {
    app = Renderer.create(
      <GuideProvider>
        <WalkScreen
          navigation={navigation as never}
          route={{ params: { id: 'old-town' } } as never}
        />
      </GuideProvider>,
    );
  });
  await act(async () =>
    app!.root
      .findAllByType(Button)
      .find(b => b.props.label === 'Add walk to My Trip →')!
      .props.onPress(),
  );
  expect(navigation.navigate).toHaveBeenCalledWith('Main', {
    screen: 'MyTrip',
  });
  expect(
    JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls.at(-1)[1]).trip,
  ).toEqual(walks[0].stops);
  await act(async () => app!.unmount());
  await act(async () => {
    app = Renderer.create(
      <GuideProvider>
        <MyTripScreen navigation={navigation as never} route={{} as never} />
      </GuideProvider>,
    );
  });
  await act(async () =>
    app!.root
      .findAllByType(Button)
      .find(b => b.props.label === 'Choose a walk →')!
      .props.onPress(),
  );
  expect(navigation.navigate).toHaveBeenCalledWith('Routes');
  await act(async () => app!.unmount());
});
test('external resources reject unsafe schemes and explain opening failures', async () => {
  const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  // eslint-disable-next-line no-script-url
  await openExternal('javascript:alert(1)');
  expect(open).not.toHaveBeenCalled();
  await openExternal(resources[0].url);
  expect(open).toHaveBeenCalledWith(resources[0].url);
  open.mockRejectedValueOnce(new Error('offline'));
  await openExternal(resources[0].url);
  expect(alert).toHaveBeenLastCalledWith(
    'Could not open link',
    expect.any(String),
  );
  open.mockRestore();
  alert.mockRestore();
});

test('search accepts unaccented names and filters can be reset after no results', async () => {
  const { ExploreScreen } = require('../src/screens/PlacesScreens');
  const { TextInput, FlatList } = require('react-native');
  let app: Renderer.ReactTestRenderer;
  await act(async () => {
    app = Renderer.create(
      <ExploreScreen navigation={{ navigate: jest.fn() }} />,
    );
  });
  await act(async () =>
    app!.root.findByType(TextInput).props.onChangeText('cismigiu'),
  );
  expect(
    app!.root.findByType(FlatList).props.data.map((p: { id: string }) => p.id),
  ).toEqual(['cismigiu']);
  await act(async () =>
    app!.root.findByType(TextInput).props.onChangeText('no-such-place'),
  );
  expect(app!.root.findByType(FlatList).props.data).toHaveLength(0);
  await act(async () =>
    app!.root
      .findAllByType(Button)
      .find(b => b.props.label === 'Reset filters')!
      .props.onPress(),
  );
  expect(app!.root.findByType(FlatList).props.data).toHaveLength(40);
  await act(async () => app!.unmount());
});
