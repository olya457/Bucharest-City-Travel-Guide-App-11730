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

// Only ordinary secure web links are accepted. No scripts, embedded media or downloaded copies.
export async function openExternal(url: string) {
  if (!/^https:\/\/[a-z0-9.-]+(?:[/?#]|$)/i.test(url)) {
    Alert.alert(
      'Link unavailable',
      'This resource does not have a supported web address.',
    );
    return;
  }
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      'Could not open link',
      'Check your internet connection and try again.',
    );
  }
}
