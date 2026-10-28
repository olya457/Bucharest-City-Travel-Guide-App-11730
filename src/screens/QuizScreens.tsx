import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  BackHandler,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { Back, Body, Button, Screen, Title } from '../components/UI';
import { sampleQuestions } from '../data/quiz';
import { images } from '../data/images';
import { RootParams } from '../navigation/types';
import { ProgressBar, Reveal } from '../components/Motion';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { colors, serif } from '../theme';
import { useGuide } from '../storage/GuideProvider';
type IntroProps = NativeStackScreenProps<RootParams, 'Quiz'>;
export function QuizIntroScreen({ navigation }: IntroProps) {
  const { narrow, compact, gutter } = useLayoutMetrics();
  const { data } = useGuide();
  return (
    <Screen style={s.noPadding}>
      <ImageBackground
        source={images.onboarding[0]}
        style={[s.hero, compact && s.compactHero]}
      >
        <LinearGradient
          colors={['#09090f22', colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={s.brain}>🧠</Text>
      </ImageBackground>
      <View style={[s.intro, { padding: gutter }]}>
        <Back onPress={navigation.goBack} />
        <Title serifFont>Bucharest Knowledge Quiz</Title>
        <Body>
          Think you know Bucharest? Test your knowledge with 5 questions about
          Romania’s fascinating capital city.
        </Body>
        <View style={s.tiles}>
          {[
            '❓  5 Questions',
            '✅  4 Answers Each',
            '🎯  1 Correct Answer',
            '⏱️  Timed Questions',
          ].map(label => (
            <View key={label} style={[s.tile, narrow && s.wideTile]}>
              <Text style={s.tileText}>{label}</Text>
            </View>
          ))}
        </View>
        <Button
          label="⚡ Start Quiz"
          onPress={() => navigation.navigate('QuizGame')}
        />
        {data.results.length > 0 && (
          <Text style={s.history}>
            Best score: {Math.max(...data.results.map(r => r.score))}/5 ·{' '}
            {data.results.length} quizzes completed
          </Text>
        )}
      </View>
    </Screen>
  );
}
export function QuizGameScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'QuizGame'>) {
  const [questions] = useState(() => sampleQuestions());
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(15);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const answered = useRef(false);
  const advancing = useRef(false);
  const deadline = useRef(Date.now() + 15000);
  const { addResult } = useGuide();
  const focused = useIsFocused();
  const current = questions[index];
  const choose = (answer: number) => {
    if (answered.current) {
      return;
    }
    answered.current = true;
    setSelected(answer);
    if (answer === current.correct) {
      setScore(s => s + 1);
    }
  };
  useEffect(() => {
    answered.current = false;
    advancing.current = false;
    setSelected(null);
    setSeconds(15);
    deadline.current = Date.now() + 15000;
  }, [index]);
  useEffect(() => {
    if (selected !== null || !focused) {
      return;
    }
    const tick = () => {
      const left = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setSeconds(left);
      if (left === 0 && !answered.current) {
        answered.current = true;
        setSelected(-1);
      }
    };
    const timer = setInterval(tick, 200);
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') {
        tick();
      }
    });
    return () => {
      clearInterval(timer);
      listener.remove();
    };
  }, [selected, index, focused]);
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert('Leave quiz?', 'Your current quiz will not be saved.', [
        { text: 'Keep playing', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]);
      return true;
    });
    return () => sub.remove();
  }, [navigation]);
  const next = () => {
    if (selected === null || advancing.current) {
      return;
    }
    advancing.current = true;
    if (index === 4) {
      addResult(score);
      navigation.replace('QuizResult', { score });
    } else {
      setIndex(i => i + 1);
    }
  };
  return (
    <Screen>
      <View style={s.quizHeader}>
        <Text style={s.questionNumber}>Question {index + 1} of 5</Text>
        <Text
          accessibilityLiveRegion="polite"
          style={[
            s.timer,
            {
              color: seconds <= 5 ? colors.red : colors.green,
              borderColor: seconds <= 5 ? colors.red : colors.green,
            },
          ]}
        >
          ◷ {seconds}
        </Text>
      </View>
      <ProgressBar value={index / 5} label="Quiz progress" />
      <Reveal replayKey={index} variant="slide" style={s.questionBox}>
        <Text style={s.question}>{current.question}</Text>
      </Reveal>
      <Reveal replayKey={index} delay={60} style={s.answers}>
        {current.answers.map((answer, i) => {
          const correct = selected !== null && i === current.correct;
          const wrong = selected === i && i !== current.correct;
          return (
            <Pressable
              key={answer}
              accessibilityRole="button"
              accessibilityState={{
                disabled: selected !== null,
                selected: selected === i,
              }}
              disabled={selected !== null}
              onPress={() => choose(i)}
              style={[s.answer, correct && s.correct, wrong && s.wrong]}
            >
              <Text style={[s.letter, correct && s.green, wrong && s.red]}>
                {correct ? '✓' : wrong ? '✕' : String.fromCharCode(65 + i)}
              </Text>
              <Text style={[s.answerText, correct && s.green, wrong && s.red]}>
                {answer}
              </Text>
            </Pressable>
          );
        })}
      </Reveal>
      {selected !== null && (
        <Reveal variant="zoom" style={s.feedback}>
          <Text accessibilityLiveRegion="polite" style={s.feedbackText}>
            {selected === -1
              ? 'Time’s up.'
              : selected === current.correct
              ? 'Correct!'
              : 'Not quite.'}{' '}
            Correct answer: {current.answers[current.correct]}.
          </Text>
          <Button
            label={index === 4 ? 'See Results →' : 'Next Question →'}
            onPress={next}
          />
        </Reveal>
      )}
    </Screen>
  );
}
export function QuizResultScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'QuizResult'>) {
  const { score } = route.params;
  const { compact, gutter } = useLayoutMetrics();
  return (
    <Screen
      style={[s.results, { padding: gutter }, compact && s.compactResults]}
    >
      <Reveal
        variant="zoom"
        delay={100}
        style={[s.scoreCircle, compact && s.smallCircle]}
      >
        <Text style={s.score}>{score}/5</Text>
        <Text style={s.history}>CORRECT</Text>
      </Reveal>
      <Title>
        {score === 5
          ? 'Perfect score! 🏆'
          : score >= 3
          ? 'Well done! ⭐'
          : 'Keep exploring! ✨'}
      </Title>
      <Text style={s.resultText}>
        You answered {score} out of 5 questions correctly.
      </Text>
      <View style={s.stats}>
        <View style={s.stat}>
          <Text style={[s.statNumber, s.green]}>{score}</Text>
          <Text style={s.history}>CORRECT</Text>
        </View>
        <View style={s.stat}>
          <Text style={[s.statNumber, s.red]}>{5 - score}</Text>
          <Text style={s.history}>INCORRECT</Text>
        </View>
      </View>
      <View style={s.resultActions}>
        <Button
          label="🔄 Try Again"
          onPress={() => navigation.replace('QuizGame')}
        />
        <Button
          secondary
          label="Explore Bucharest →"
          onPress={() => navigation.navigate('Main', { screen: 'Explore' })}
        />
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({
  noPadding: { padding: 0, gap: 0 },
  compactHero: { minHeight: 140 },
  wideTile: { width: '100%' },
  smallCircle: { width: 112, height: 112, borderRadius: 56 },
  hero: { minHeight: 210, padding: 24, justifyContent: 'flex-end' },
  brain: { fontSize: 36 },
  intro: { padding: 24, gap: 18 },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 12,
  },
  tile: {
    width: '47%',
    flexGrow: 1,
    minHeight: 67,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  tileText: { color: colors.text, fontSize: 13, lineHeight: 22 },
  history: { color: colors.dim, fontSize: 11, textAlign: 'center' },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  questionNumber: { color: colors.yellow, fontSize: 13, fontWeight: '600' },
  timer: {
    fontSize: 19,
    fontWeight: '700',
    borderWidth: 2,
    borderRadius: 22,
    padding: 6,
  },
  track: {
    height: 4,
    backgroundColor: colors.raised,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: { height: 4, backgroundColor: colors.yellow },
  questionBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    borderRadius: 23,
    marginVertical: 3,
  },
  question: {
    fontFamily: serif,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.text,
  },
  answers: { gap: 11 },
  answer: {
    flexDirection: 'row',
    gap: 13,
    alignItems: 'center',
    padding: 16,
    minHeight: 63,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
  },
  letter: {
    backgroundColor: '#ffffff0c',
    borderRadius: 17,
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
    color: colors.text,
    fontWeight: '700',
    fontSize: 12,
    overflow: 'hidden',
  },
  answerText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 21,
  },
  correct: { backgroundColor: '#142f23', borderColor: '#277a4a' },
  wrong: { backgroundColor: '#35191d', borderColor: '#96383e' },
  green: { color: colors.green },
  red: { color: colors.red },
  feedback: { gap: 16 },
  feedbackText: { fontSize: 13, color: colors.muted, lineHeight: 22 },
  compactResults: { gap: 18 },
  results: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 26,
  },
  scoreCircle: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 9,
    borderColor: '#2a63ea',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 8,
  },
  score: {
    fontFamily: serif,
    fontSize: 35,
    color: colors.text,
    fontWeight: '700',
  },
  resultText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: colors.muted,
  },
  stats: { flexDirection: 'row', gap: 14, width: '100%' },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 22,
    borderRadius: 20,
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: { fontSize: 29, fontWeight: '800' },
  resultActions: { width: '100%', gap: 12 },
});
