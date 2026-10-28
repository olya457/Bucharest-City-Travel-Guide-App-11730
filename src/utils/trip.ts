import { Place, places } from '../data/places';
import { practical } from '../data/practical';
export function validIds(value: unknown): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (id): id is string =>
              typeof id === 'string' && places.some(p => p.id === id),
          ),
        ),
      ]
    : [];
}
export function reorder(ids: string[], id: string, direction: -1 | 1) {
  const index = ids.indexOf(id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= ids.length) {
    return ids;
  }
  const next = [...ids];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
export function distanceKm(a: Place, b: Place) {
  const rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad;
  const dLon = (b.longitude - a.longitude) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitude * rad) *
      Math.cos(b.latitude * rad) *
      Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
export function tripSummary(ids: string[]) {
  const stops = validIds(ids).map(id => places.find(p => p.id === id)!);
  const directKm = stops.reduce(
    (sum, p, i) => sum + (i ? distanceKm(stops[i - 1], p) : 0),
    0,
  );
  const walkingMinutes = Math.ceil(((directKm * 1.35) / 4) * 60);
  const visitMinutes = stops.reduce(
    (sum, p) => sum + practical[p.id].minutes,
    0,
  );
  return {
    stops,
    directKm,
    walkingMinutes,
    visitMinutes,
    totalMinutes: visitMinutes + walkingMinutes,
  };
}
export function duration(minutes: number) {
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ''}`
    : `${minutes}m`;
}
export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
