import { useWindowDimensions } from 'react-native';
export function useLayoutMetrics() {
  const { width, height, fontScale } = useWindowDimensions();
  const narrow = width < 360 || fontScale > 1.25;
  const compact = narrow || height < 700;
  return {
    width,
    height,
    fontScale,
    narrow,
    compact,
    gutter: narrow ? 14 : 20,
    gap: compact ? 14 : 18,
    heroHeight: Math.max(190, Math.min(300, height * 0.36)),
  };
}
