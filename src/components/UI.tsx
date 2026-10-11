import React from 'react';
import {
  Animated,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Reveal, usePressMotion } from './Motion';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, serif } from '../theme';
import {
  Category,
  categoryIcons,
  categoryLabels,
  categories,
  Place,
} from '../data/places';
export function Screen({
  children,
  scroll = true,
  style,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const focused = useIsFocused();
  const layout = useLayoutMetrics();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <Reveal replayKey={focused} style={styles.fill}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { padding: layout.gutter, gap: layout.gap },
              style,
            ]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.fill, style]}>{children}</View>
        )}
      </Reveal>
    </SafeAreaView>
  );
}
export function Title({
  children,
  serifFont = false,
}: {
  children: React.ReactNode;
  serifFont?: boolean;
}) {
  const { narrow } = useLayoutMetrics();
  return (
    <Text
      style={[
        styles.title,
        narrow && styles.smallTitle,
        serifFont && styles.serif,
      ]}
    >
      {children}
    </Text>
  );
}
export function Body({ children }: { children: React.ReactNode }) {
  return <Text style={styles.body}>{children}</Text>;
}
export function Button({
  label,
  onPress,
  secondary = false,
  style,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const { scale, pressIn, pressOut } = usePressMotion();
  const { narrow } = useLayoutMetrics();
  return (
    <Pressable
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        { opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <Animated.View
        style={[
          styles.buttonInner,
          narrow && styles.smallButton,
          { transform: [{ scale }] },
        ]}
      >
        <LinearGradient
          pointerEvents="none"
          colors={secondary ? ['#23232d', '#19191f'] : ['#f5c910', '#ffdc42']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={[styles.buttonText, secondary && { color: colors.text }]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
export function Badge({ category }: { category: Exclude<Category, 'All'> }) {
  const tint =
    category === 'Parks'
      ? colors.green
      : category === 'Museums'
      ? colors.blue
      : colors.yellow;
  return (
    <Text style={[styles.badge, { color: tint, backgroundColor: `${tint}22` }]}>
      {categoryLabels[category].toUpperCase()}
    </Text>
  );
}
export function Filters({
  selected,
  onSelect,
  compact = false,
}: {
  selected: Category;
  onSelect: (c: Category) => void;
  compact?: boolean;
}) {
  const { narrow } = useLayoutMetrics();
  const renderCategory = (category: Category) => {
    const active = selected === category;
    return (
      <Pressable
        key={category}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        onPress={() => onSelect(category)}
        style={({ pressed }) => [
          styles.filter,
          compact ? styles.compact : styles.categoryTile,
          active && styles.selectedCategory,
          pressed && styles.pressedCategory,
        ]}
      >
        {active && (
          <LinearGradient
            pointerEvents="none"
            colors={['#ffe45b', '#f5c910']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Text style={compact ? styles.smallIcon : styles.icon}>
          {categoryIcons[category]}
        </Text>
        <Text
          style={[
            styles.filterText,
            !compact && styles.categoryLabel,
            active ? styles.activeFilterText : styles.inactiveFilterText,
          ]}
        >
          {category}
        </Text>
      </Pressable>
    );
  };
  if (compact) {
    return (
      <ScrollView
        horizontal
        style={styles.filterScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {categories.map(renderCategory)}
      </ScrollView>
    );
  }
  const rows = narrow
    ? [categories.slice(0, 2), categories.slice(2)]
    : [categories];
  return (
    <View style={styles.categoryGrid}>
      {rows.map((row, index) => (
        <View key={index} style={styles.categoryRow}>
          {row.map(renderCategory)}
        </View>
      ))}
    </View>
  );
}
export function PlaceCard({
  place,
  onPress,
  onRemove,
}: {
  place: Place;
  onPress: () => void;
  onRemove?: () => void;
}) {
  return (
    <Reveal style={styles.card} variant="rise">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${place.name}`}
        onPress={onPress}
      >
        <ImageBackground source={place.image} style={styles.cardImage}>
          <LinearGradient
            colors={['transparent', '#09090fee']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.badgeRow}>
            <Badge category={place.category} />
          </View>
          <Text style={styles.placeTitle}>{place.name}</Text>
        </ImageBackground>
        <View style={styles.cardBody}>
          <Text style={styles.coordinates}>
            📍 {place.latitude.toFixed(4)}° N · {place.longitude.toFixed(4)}° E
          </Text>
          <Text numberOfLines={2} style={styles.preview}>
            {place.description}
          </Text>
        </View>
      </Pressable>
      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${place.name} from saved places`}
          onPress={onRemove}
          style={styles.remove}
        >
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      )}
    </Reveal>
  );
}
export function Back({
  onPress,
  label = 'Back',
}: {
  onPress: () => void;
  label?: string;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.back}>
      <Text style={styles.backText}>← {label}</Text>
    </Pressable>
  );
}
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
  content: { padding: 20, paddingBottom: 32, gap: 18, flexGrow: 1 },
  smallTitle: { fontSize: 22 },
  smallButton: { paddingHorizontal: 10, paddingVertical: 14 },
  title: { fontSize: 25, fontWeight: '800', color: colors.text },
  serif: { fontFamily: serif, fontWeight: '700' },
  body: { fontSize: 14, lineHeight: 25, color: colors.muted },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
    minHeight: 52,
    flexGrow: 0,
    flexShrink: 0,
  },
  buttonInner: {
    minHeight: 52,
    borderRadius: 18,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#08090c',
    textAlign: 'center',
  },
  filterScroll: { flexGrow: 0, flexShrink: 0 },
  filters: { gap: 8, paddingVertical: 3 },
  filter: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryGrid: { gap: 10 },
  categoryRow: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  categoryTile: {
    flex: 1,
    minWidth: 0,
    minHeight: 84,
    paddingHorizontal: 6,
    paddingVertical: 14,
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryLabel: { fontWeight: '600', textAlign: 'center', lineHeight: 16 },
  selectedCategory: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
  },
  pressedCategory: { opacity: 0.8 },
  compact: {
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 4,
  },
  filterText: { fontSize: 11 },
  activeFilterText: { color: '#111' },
  inactiveFilterText: { color: colors.muted },
  icon: { fontSize: 22 },
  smallIcon: { fontSize: 12 },
  badge: {
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cardImage: { minHeight: 170, justifyContent: 'flex-end', padding: 13 },
  badgeRow: { position: 'absolute', right: 10, top: 12, maxWidth: '70%' },
  placeTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardBody: { padding: 15, gap: 8 },
  coordinates: { fontSize: 10, color: colors.blue },
  preview: { fontSize: 12, lineHeight: 19, color: colors.muted },
  remove: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 9,
    borderRadius: 12,
    backgroundColor: colors.red,
  },
  removeText: { fontSize: 11, fontWeight: '600', color: 'white' },
  back: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#272a2bbd',
  },
  backText: { color: colors.text, fontWeight: '600', fontSize: 13 },
});
