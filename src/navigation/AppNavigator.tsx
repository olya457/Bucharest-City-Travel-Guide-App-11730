import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootParams, TabsParams } from './types';
import { ExploreScreen, PlaceScreen } from '../screens/PlacesScreens';
import {
  BlogScreen,
  ArticleScreen,
  FactsScreen,
  FactListScreen,
  RandomFactScreen,
} from '../screens/ReadingScreens';
import {
  QuizIntroScreen,
  QuizGameScreen,
  QuizResultScreen,
} from '../screens/QuizScreens';
import { RoutesScreen, WalkScreen, MyTripScreen } from '../screens/TripScreens';
import { GuideScreen } from '../screens/GuideScreen';
import { BucharestScreen } from '../screens/BucharestScreen';
import { useReducedMotion } from '../components/Motion';
import { colors } from '../theme';
const Stack = createNativeStackNavigator<RootParams>();
const Tab = createBottomTabNavigator<TabsParams>();
const icons = {
  Explore: '🔭',
  Routes: '🧭',
  MyTrip: '✦',
  Bucharest: '🏛️',
  Guide: '📖',
};
type IconProps = { color: string };
function TabIcon({ name, color }: IconProps & { name: keyof TabsParams }) {
  return <Text style={[s.icon, { color }]}>{icons[name]}</Text>;
}
const tabIcons = {
  Explore: ({ color }: IconProps) => <TabIcon name="Explore" color={color} />,
  Routes: ({ color }: IconProps) => <TabIcon name="Routes" color={color} />,
  MyTrip: ({ color }: IconProps) => <TabIcon name="MyTrip" color={color} />,
  Bucharest: ({ color }: IconProps) => (
    <TabIcon name="Bucharest" color={color} />
  ),
  Guide: ({ color }: IconProps) => <TabIcon name="Guide" color={color} />,
};
function Tabs() {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: reduced ? 'none' : 'fade',
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: colors.yellow,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: '#10101b',
          borderTopColor: '#20202b',
          height: 60 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 9, letterSpacing: 0.2 },
        tabBarIcon: tabIcons[route.name],
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Routes" component={RoutesScreen} />
      <Tab.Screen
        name="MyTrip"
        component={MyTripScreen}
        options={{ title: 'My Trip' }}
      />
      <Tab.Screen name="Bucharest" component={BucharestScreen} />
      <Tab.Screen name="Guide" component={GuideScreen} />
    </Tab.Navigator>
  );
}
const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.yellow,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};
export function AppNavigator() {
  const reduced = useReducedMotion();
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: reduced ? 'none' : 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={Tabs} />
        <Stack.Screen name="Walk" component={WalkScreen} />
        <Stack.Screen name="Blog" component={BlogScreen} />
        <Stack.Screen name="Facts" component={FactsScreen} />
        <Stack.Screen name="Quiz" component={QuizIntroScreen} />
        <Stack.Screen name="Place" component={PlaceScreen} />
        <Stack.Screen name="Article" component={ArticleScreen} />
        <Stack.Screen name="FactList" component={FactListScreen} />
        <Stack.Screen name="RandomFact" component={RandomFactScreen} />
        <Stack.Screen
          name="QuizGame"
          component={QuizGameScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="QuizResult"
          component={QuizResultScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const s = StyleSheet.create({ icon: { fontSize: 21 } });
