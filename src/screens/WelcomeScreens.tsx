import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import { Reveal } from '../components/Motion';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { images } from '../data/images';
import { colors, serif } from '../theme';
import { Button } from '../components/UI';
import { useGuide } from '../storage/GuideProvider';
const loadingHtml = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:transparent;overflow:hidden}.track{height:3px;background:#25252d;border-radius:5px;margin:12px auto;width:180px}.bar{height:3px;background:linear-gradient(90deg,#2563eb,#ffd21a);animation:load 4s linear forwards;border-radius:5px}@keyframes load{from{width:0}to{width:100%}}@media(prefers-reduced-motion:reduce){.bar{animation:none;width:100%}}p{font:10px -apple-system,Arial;color:#66647f;letter-spacing:1px;text-align:center}</style></head><body><div class="track"><div class="bar"></div></div><p>Loading...</p><script>setTimeout(()=>window.ReactNativeWebView.postMessage('complete'),4000)</script></body></html>`;
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { height, width, compact, gutter } = useLayoutMetrics();
  useEffect(() => {
    const fallback = setTimeout(onComplete, 5500);
    return () => clearTimeout(fallback);
  }, [onComplete]);
  return (
    <SafeAreaView style={s.splash}>
      <LinearGradient
        colors={['#24200d44', colors.background, '#111d4544']}
        style={StyleSheet.absoluteFill}
      />
      <Reveal variant="zoom" style={[s.splashCenter, { padding: gutter }]}>
        <Image
          source={images.logo}
          style={[
            s.logo,
            compact && s.compactLogo,
            {
              width: Math.min(255, height * 0.31, width * 0.62),
              height: Math.min(255, height * 0.31, width * 0.62),
            },
          ]}
        />
        <Text style={[s.brand, compact && s.smallBrand]}>Bucharest</Text>
        <Text style={s.tagline}>TRAVEL GUIDE</Text>
        <View style={s.accent} />
      </Reveal>
      <View style={s.loader}>
        <WebView
          source={{ html: loadingHtml }}
          opaque={false}
          scrollEnabled={false}
          style={s.web}
          onMessage={event => {
            if (event.nativeEvent.data === 'complete') {
              onComplete();
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
const slides = [
  [
    'Discover Bucharest',
    'Your all-in-one guide to the most vibrant city in Eastern Europe. Explore hidden gems, iconic landmarks, and everything in between.',
  ],
  [
    'Explore Interesting Places',
    'Browse historical landmarks, peaceful parks, world-class museums, and unique cultural sites across Bucharest.',
  ],
  [
    'Navigate with the Map',
    'Find locations on our interactive Bucharest map. Filter by category and tap any marker for a quick preview.',
  ],
  [
    'Learn About the City',
    'Read curated articles, discover historical facts, uncover urban curiosities, and hear local legends.',
  ],
  [
    'Save, Explore & Play',
    'Build your day, reorder stops and mark places visited. Your plan, notes and guide stay available offline; maps and linked media need internet.',
  ],
];
export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const { completeOnboarding } = useGuide();
  const { height, compact, gutter } = useLayoutMetrics();
  return (
    <SafeAreaView style={s.splash}>
      <ScrollView contentContainerStyle={s.onboarding} bounces={false}>
        <Reveal replayKey={index} variant="zoom">
          <ImageBackground
            source={images.onboarding[index]}
            style={[
              s.onboardingImage,
              { height: Math.min(470, height * (compact ? 0.4 : 0.54)) },
            ]}
          >
            <LinearGradient
              colors={['transparent', '#09090f22', colors.background]}
              locations={[0, 0.55, 1]}
              style={StyleSheet.absoluteFill}
            />
            <Pressable
              accessibilityRole="button"
              onPress={completeOnboarding}
              style={s.skip}
            >
              <Text style={s.skipText}>Skip</Text>
            </Pressable>
          </ImageBackground>
        </Reveal>
        <View style={s.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[s.dot, i === index && s.activeDot]} />
          ))}
        </View>
        <Reveal
          replayKey={index}
          variant="slide"
          style={[s.copy, { padding: gutter }]}
        >
          <Text style={[s.heading, compact && s.smallHeading]}>
            {slides[index][0]}
          </Text>
          <Text style={s.description}>{slides[index][1]}</Text>
        </Reveal>
        <View
          style={[
            s.continue,
            { padding: gutter },
            compact && s.compactContinue,
          ]}
        >
          <Button
            label={index === 4 ? '✦ Start Exploring' : 'Continue →'}
            onPress={() =>
              index === 4 ? completeOnboarding() : setIndex(index + 1)
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  splash: { flex: 1, backgroundColor: colors.background },
  splashCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  compactLogo: { marginBottom: 28 },
  compactContinue: { paddingTop: 16 },
  logo: { borderRadius: 26, marginBottom: 65 },
  smallBrand: { fontSize: 36 },
  smallHeading: { fontSize: 23 },
  brand: { color: 'white', fontFamily: serif, fontSize: 44, fontWeight: '700' },
  tagline: {
    color: colors.yellow,
    letterSpacing: 5,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  accent: { height: 3, width: 60, backgroundColor: '#2864ef', marginTop: 27 },
  loader: { height: 64, marginBottom: 10 },
  web: { backgroundColor: 'transparent' },
  onboarding: { flexGrow: 1 },
  onboardingImage: { width: '100%' },
  skip: {
    position: 'absolute',
    top: 48,
    right: 20,
    backgroundColor: '#252b2c77',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  skipText: { fontSize: 12, color: 'white' },
  dots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: -7,
  },
  dot: { width: 7, height: 7, borderRadius: 5, backgroundColor: '#35353d' },
  activeDot: { width: 23, backgroundColor: colors.yellow },
  copy: { padding: 26, gap: 15 },
  heading: {
    fontSize: 26,
    color: colors.text,
    fontFamily: serif,
    fontWeight: '700',
  },
  description: { fontSize: 14, lineHeight: 25, color: colors.muted },
  continue: { padding: 24, paddingTop: 30, marginTop: 'auto' },
});
