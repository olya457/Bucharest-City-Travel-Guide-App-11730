import { MotionProvider } from './src/components/Motion';
import React, { useCallback, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GuideProvider, useGuide } from './src/storage/GuideProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen, SplashScreen } from './src/screens/WelcomeScreens';
function Content() {
  const { data, ready } = useGuide();
  const [loaded, setLoaded] = useState(false);
  const finish = useCallback(() => setLoaded(true), []);
  if (!loaded || !ready) {
    return <SplashScreen onComplete={finish} />;
  }
  return data.onboarded ? <AppNavigator /> : <OnboardingScreen />;
}
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <MotionProvider>
        <GuideProvider>
          <Content />
        </GuideProvider>
      </MotionProvider>
    </SafeAreaProvider>
  );
}
