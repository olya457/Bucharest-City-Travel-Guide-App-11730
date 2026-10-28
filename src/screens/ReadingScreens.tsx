import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Back, Body, Button, Screen, Title } from '../components/UI';
import articles from '../data/articles.json';
import facts from '../data/facts.json';
import { images } from '../data/images';
import { RootParams } from '../navigation/types';
import { Reveal } from '../components/Motion';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { colors, serif } from '../theme';
import { shareText } from '../utils/actions';
const articleImages = [
  images.onboarding[1],
  images.palace,
  images.church,
  images.king,
  images.cec,
  images.onboarding[2],
  images.onboarding[4],
];
export function BlogScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'Blog'>) {
  const { narrow } = useLayoutMetrics();
  return (
    <Screen>
      <View style={s.heading}>
        <Back onPress={navigation.goBack} />
        <Title>Bucharest Blog</Title>
        <Body>Stories, history & culture</Body>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Article', { id: articles[0].id })}
        style={s.featured}
      >
        <ImageBackground source={articleImages[0]} style={s.featuredImage}>
          <LinearGradient
            colors={['transparent', '#09090ff5']}
            style={StyleSheet.absoluteFill}
          />
          <Text style={s.featuredBadge}>✦ FEATURED</Text>
          <View style={s.featuredBottom}>
            <Text style={s.featuredTitle}>{articles[0].title}</Text>
            <View style={s.row}>
              <Text style={s.meta}>{articles[0].minutes} min read</Text>
              <Text style={s.read}>Read →</Text>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
      <Text style={s.section}>More Articles</Text>
      {articles.slice(1).map((article, index) => (
        <Reveal key={article.id} delay={index * 45} variant="slide">
          <Pressable
            accessibilityRole="button"
            key={article.id}
            onPress={() => navigation.navigate('Article', { id: article.id })}
            style={s.articleRow}
          >
            <View style={[s.thumbnail, narrow && s.smallThumbnail]}>
              <Image
                source={articleImages[index + 1]}
                resizeMode="cover"
                style={StyleSheet.absoluteFill}
              />
            </View>
            <View style={s.articleInfo}>
              <Text style={s.articleName}>{article.title}</Text>
              <View style={s.row}>
                <Text style={s.meta}>{article.minutes} min read</Text>
                <Text style={s.read}>Read →</Text>
              </View>
            </View>
          </Pressable>
        </Reveal>
      ))}
    </Screen>
  );
}
export function ArticleScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'Article'>) {
  const index = articles.findIndex(a => a.id === route.params.id);
  const article = articles[index];
  if (!article) {
    return (
      <Screen>
        <Back onPress={navigation.goBack} />
        <Title>Article not found</Title>
      </Screen>
    );
  }
  return (
    <Screen style={s.noPadding}>
      <ImageBackground source={articleImages[index]} style={s.articleHero}>
        <LinearGradient
          colors={['transparent', colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <Back onPress={navigation.goBack} />
        <View style={s.heading}>
          <Text style={s.read}>{article.minutes} min read</Text>
          <Title serifFont>{article.title}</Title>
        </View>
      </ImageBackground>
      <View style={s.articleBody}>
        {article.paragraphs.map((paragraph, i) => (
          <Body key={i}>{paragraph}</Body>
        ))}
        <Button
          secondary
          label="↑ Share Article"
          onPress={() =>
            shareText(article.title, article.paragraphs.join('\n\n'))
          }
        />
      </View>
    </Screen>
  );
}
const factCategories = [
  {
    name: 'Hidden History',
    icon: '📜',
    description: 'Secrets from centuries past',
    colors: ['#be9e20aa', '#28251fdd'],
    image: images.onboarding[1],
  },
  {
    name: 'Urban Curiosities',
    icon: '🔍',
    description: 'Strange facts about the city',
    colors: ['#386ad9bb', '#14223add'],
    image: images.palace,
  },
  {
    name: 'Local Legends',
    icon: '🌙',
    description: 'Myths and stories of Bucharest',
    colors: ['#9155d6bb', '#2b1732dd'],
    image: images.onboarding[2],
  },
];
export function FactsScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'Facts'>) {
  return (
    <Screen>
      <View style={s.heading}>
        <Back onPress={navigation.goBack} />
        <Title>Interesting Facts</Title>
        <Body>Discover what makes Bucharest unique</Body>
      </View>
      <Button
        label="🎲  Random Fact"
        onPress={() => navigation.navigate('RandomFact')}
      />
      {factCategories.map((c, index) => (
        <Reveal key={c.name} delay={index * 70}>
          <Pressable
            accessibilityRole="button"
            key={c.name}
            onPress={() =>
              navigation.navigate('FactList', { category: c.name })
            }
            style={s.category}
          >
            <ImageBackground source={c.image} style={s.categoryImage}>
              <LinearGradient
                colors={c.colors}
                style={StyleSheet.absoluteFill}
              />
              <Text style={s.categoryIcon}>{c.icon}</Text>
              <View style={s.row}>
                <Text style={s.section}>{c.name}</Text>
                <Text style={s.arrow}>→</Text>
              </View>
              <Text style={s.categoryDescription}>{c.description}</Text>
            </ImageBackground>
          </Pressable>
        </Reveal>
      ))}
    </Screen>
  );
}
export function FactListScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'FactList'>) {
  return (
    <Screen>
      <View style={s.topRow}>
        <Back onPress={navigation.goBack} />
        <Text style={s.section}>{route.params.category}</Text>
      </View>
      {facts
        .filter(f => f.category === route.params.category)
        .map(f => (
          <View key={f.id} style={s.factCard}>
            <View style={s.row}>
              <Text style={s.factBadge}>{f.category.toUpperCase()}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Share ${f.title}`}
                onPress={() => shareText(f.title, f.body)}
                style={s.shareSmall}
              >
                <Text style={s.meta}>↑ Share</Text>
              </Pressable>
            </View>
            <Text style={s.section}>{f.title}</Text>
            <Body>{f.body}</Body>
          </View>
        ))}
    </Screen>
  );
}
export function RandomFactScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'RandomFact'>) {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * facts.length),
  );
  const fact = facts[index];
  return (
    <Screen>
      <View style={s.topRow}>
        <Back onPress={navigation.goBack} />
        <Text style={s.section}>Random Fact</Text>
      </View>
      <Reveal
        replayKey={fact.id}
        variant="slide"
        style={[s.factCard, s.randomCard]}
      >
        <Text style={s.largeIcon}>
          {factCategories.find(c => c.name === fact.category)?.icon}
        </Text>
        <Text style={s.factBadge}>{fact.category.toUpperCase()}</Text>
        <Title serifFont>{fact.title}</Title>
        <Body>{fact.body}</Body>
        <View style={s.randomActions}>
          <Button
            secondary
            label="↑ Share this Fact"
            onPress={() => shareText(fact.title, fact.body)}
          />
          <Button
            label="🎲 Next Random Fact"
            onPress={() =>
              setIndex(
                i =>
                  (i + 1 + Math.floor(Math.random() * (facts.length - 1))) %
                  facts.length,
              )
            }
          />
        </View>
      </Reveal>
    </Screen>
  );
}
const s = StyleSheet.create({
  heading: { gap: 5 },
  featured: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featuredImage: {
    minHeight: 230,
    padding: 16,
    justifyContent: 'space-between',
  },
  featuredBadge: {
    backgroundColor: colors.yellow,
    color: '#111',
    fontSize: 10,
    fontWeight: '700',
    borderRadius: 20,
    padding: 6,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  featuredBottom: { gap: 14 },
  featuredTitle: {
    fontFamily: serif,
    fontSize: 23,
    fontWeight: '700',
    color: colors.text,
  },
  row: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  meta: { fontSize: 10, color: colors.muted },
  read: { fontSize: 12, fontWeight: '600', color: colors.yellow },
  section: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  articleRow: {
    minHeight: 110,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 21,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 100,
    flexShrink: 0,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  smallThumbnail: { width: 76 },
  articleInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
    gap: 16,
  },
  articleName: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.text,
  },
  noPadding: { padding: 0, gap: 0 },
  articleHero: {
    minHeight: 260,
    gap: 48,
    padding: 20,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  articleBody: { padding: 20, gap: 20 },
  category: { borderRadius: 22, overflow: 'hidden' },
  categoryImage: { minHeight: 125, padding: 20, gap: 7 },
  categoryIcon: { fontSize: 27 },
  categoryDescription: { fontSize: 12, color: '#d0c9d5' },
  arrow: { color: '#c5bfba', fontSize: 23 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  factCard: {
    padding: 20,
    gap: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 23,
  },
  factBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.yellow,
    backgroundColor: '#51451d',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 15,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  shareSmall: { padding: 9, backgroundColor: colors.raised, borderRadius: 11 },
  randomCard: { flexGrow: 1, borderColor: '#443b22', padding: 24 },
  largeIcon: { fontSize: 46, marginVertical: 14 },
  randomActions: { gap: 14, marginTop: 'auto', paddingTop: 40 },
});
