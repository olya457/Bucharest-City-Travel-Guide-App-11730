import { Alert, Linking, Platform, Share } from 'react-native';
import { Place } from '../data/places';
export async function shareText(title: string, body: string) {
  try {
    await Share.share({ title, message: `${title}\n\n${body}` });
  } catch {
    Alert.alert('Unable to share', 'Please try again.');
  }
}
export async function openDirections(place: Place) {
  const coordinate = `${place.latitude},${place.longitude}`;
  const url =
    Platform.OS === 'ios'
      ? `https://maps.apple.com/?daddr=${coordinate}&q=${encodeURIComponent(
          place.name,
        )}`
      : `https://www.google.com/maps/dir/?api=1&destination=${coordinate}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      'Unable to open maps',
      'Please open your maps app and enter the displayed coordinates.',
    );
  }
}
