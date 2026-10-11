import { places } from '../src/data/places';
import {
  bucharestRegion,
  regionForPlace,
  regionForPlaces,
} from '../src/utils/mapRegion';

test('all supplied coordinates fit into the overview region', () => {
  const region = regionForPlaces(places);
  for (const place of places) {
    expect(Math.abs(place.latitude - region.latitude)).toBeLessThan(
      region.latitudeDelta / 2,
    );
    expect(Math.abs(place.longitude - region.longitude)).toBeLessThan(
      region.longitudeDelta / 2,
    );
  }
});
test('single and empty categories always have a usable map region', () => {
  expect(regionForPlaces([])).toEqual(bucharestRegion);
  const single = regionForPlaces([places[0]]);
  expect(single.latitudeDelta).toBeGreaterThan(0);
  expect(single.longitudeDelta).toBeGreaterThan(0);
  const focused = regionForPlace(places[0]);
  expect(Math.abs(focused.latitude - places[0].latitude)).toBeLessThan(
    focused.latitudeDelta / 2,
  );
  expect(focused.longitude).toBe(places[0].longitude);
});
