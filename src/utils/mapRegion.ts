import type { Region } from 'react-native-maps';
import type { Place } from '../data/places';
export const bucharestRegion: Region = {
  latitude: 44.436,
  longitude: 26.096,
  latitudeDelta: 0.115,
  longitudeDelta: 0.115,
};
export function regionForPlaces(
  items: Pick<Place, 'latitude' | 'longitude'>[],
): Region {
  if (!items.length) {
    return bucharestRegion;
  }
  const latitudes = items.map(p => p.latitude);
  const longitudes = items.map(p => p.longitude);
  const south = Math.min(...latitudes),
    north = Math.max(...latitudes);
  const west = Math.min(...longitudes),
    east = Math.max(...longitudes);
  return {
    latitude: (south + north) / 2,
    longitude: (west + east) / 2,
    latitudeDelta: Math.max(0.012, (north - south) * 1.5),
    longitudeDelta: Math.max(0.012, (east - west) * 1.5),
  };
}
export function regionForPlace(
  place: Pick<Place, 'latitude' | 'longitude'>,
): Region {
  return {
    latitude: place.latitude - 0.002,
    longitude: place.longitude,
    latitudeDelta: 0.014,
    longitudeDelta: 0.014,
  };
}
