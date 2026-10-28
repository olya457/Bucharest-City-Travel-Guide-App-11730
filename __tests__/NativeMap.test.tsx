import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { MapScreen } from '../src/screens/MapScreen';
import { Filters, Button } from '../src/components/UI';
import { places } from '../src/data/places';

jest.mock('react-native-maps', () => ({
  __esModule: true,
  default: 'MapView',
  Marker: 'MapMarker',
}));

test('native map filters real markers and opens the selected location', async () => {
  const navigation = { navigate: jest.fn(), setParams: jest.fn() };
  let app: Renderer.ReactTestRenderer;
  await act(async () => {
    app = Renderer.create(
      <MapScreen
        navigation={navigation as never}
        route={{ key: 'map', name: 'Map' } as never}
      />,
    );
  });
  expect(app!.root.findAllByType('MapMarker' as never)).toHaveLength(
    places.length,
  );
  await act(async () => app!.root.findByType(Filters).props.onSelect('Parks'));
  const markers = app!.root.findAllByType('MapMarker' as never);
  expect(markers).toHaveLength(
    places.filter(p => p.category === 'Parks').length,
  );
  const selected = places.find(p => p.id === markers[0].props.identifier)!;
  expect(markers[0].props.coordinate).toEqual({
    latitude: selected.latitude,
    longitude: selected.longitude,
  });
  await act(async () => markers[0].props.onPress());
  await act(async () => app!.root.findByType(Button).props.onPress());
  expect(navigation.navigate).toHaveBeenCalledWith('Place', {
    id: selected.id,
  });
  await act(async () => app!.unmount());
});

test('opening a location from details centers its native map', async () => {
  const navigation = { navigate: jest.fn(), setParams: jest.fn() };
  let app: Renderer.ReactTestRenderer;
  await act(async () => {
    app = Renderer.create(
      <MapScreen
        navigation={navigation as never}
        route={
          { key: 'map', name: 'Map', params: { placeId: 'palace' } } as never
        }
      />,
    );
  });
  const region = app!.root.findByType('MapView' as never).props.region;
  expect(region.longitude).toBe(places[0].longitude);
  expect(navigation.setParams).toHaveBeenCalledWith({ placeId: undefined });
  expect(app!.root.findByType(Button).props.label).toBe('Details →');
  await act(async () => app!.unmount());
});

test('trip map shows only requested stops and can return to the full catalogue', async () => {
  const navigation = { navigate: jest.fn(), setParams: jest.fn() };
  let app: Renderer.ReactTestRenderer;
  await act(async () => {
    app = Renderer.create(
      <MapScreen
        navigation={navigation as never}
        route={{ params: { stopIds: ['cec', 'church', 'missing'] } } as never}
      />,
    );
  });
  expect(
    app!.root
      .findAllByType('MapMarker' as never)
      .map(m => m.props.identifier)
      .sort(),
  ).toEqual(['cec', 'church']);
  expect(navigation.setParams).toHaveBeenCalledWith({ stopIds: undefined });
  await act(async () => app!.root.findByType(Button).props.onPress());
  expect(app!.root.findAllByType('MapMarker' as never)).toHaveLength(
    places.length,
  );
  await act(async () => app!.unmount());
});
