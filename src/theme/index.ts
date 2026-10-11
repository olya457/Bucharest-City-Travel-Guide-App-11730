import { Platform } from 'react-native';
export const colors = {
  background: '#09090f',
  surface: '#1a1a27',
  raised: '#272733',
  border: '#2b2b38',
  text: '#fafafa',
  muted: '#9291aa',
  dim: '#62617a',
  yellow: '#ffd21a',
  blue: '#65aaff',
  green: '#40df83',
  red: '#ff525b',
};
export const serif = Platform.select({ ios: 'Georgia', android: 'serif' });
