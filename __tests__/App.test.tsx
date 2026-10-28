import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';
import {
  GuideProvider,
  parseData,
  useGuide,
} from '../src/storage/GuideProvider';
import { questions, sampleQuestions } from '../src/data/quiz';
import { QuizGameScreen } from '../src/screens/QuizScreens';
import { Button } from '../src/components/UI';
import { places } from '../src/data/places';
import articles from '../src/data/articles.json';
import facts from '../src/data/facts.json';

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});

test('first launch waits for splash and persists completed onboarding', async () => {
  let app: Renderer.ReactTestRenderer;
  await act(async () => {
    app = Renderer.create(<App />);
  });
  expect(app!.root.findAllByType('WebView' as never)).toHaveLength(1);
  await act(async () => {
    jest.advanceTimersByTime(3999);
  });
  expect(app!.root.findAllByType(Button)).toHaveLength(0);
  await act(async () => {
    app!.root
      .findByType('WebView' as never)
      .props.onMessage({ nativeEvent: { data: 'complete' } });
  });
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      app!.root.findByType(Button).props.onPress();
    });
  }
  expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
    '@bucharest/guide/v1',
    expect.stringContaining('"onboarded":true'),
  );
  expect(app!.root.findAllByType('AppNavigator' as never)).toHaveLength(1);
  await act(async () => app!.unmount());
});

test('saved places persist, reload and can be removed', async () => {
  let guide: ReturnType<typeof useGuide>;
  function Probe() {
    guide = useGuide();
    return null;
  }
  let app: Renderer.ReactTestRenderer;
  await act(async () => {
    app = Renderer.create(
      <GuideProvider>
        <Probe />
      </GuideProvider>,
    );
  });
  expect(guide!.data.saved).toEqual([]);
  await act(async () => guide!.toggleSaved('palace'));
  const payload = (AsyncStorage.setItem as jest.Mock).mock.calls.at(-1)[1];
  await act(async () => app!.unmount());
  (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(payload);
  await act(async () => {
    app = Renderer.create(
      <GuideProvider>
        <Probe />
      </GuideProvider>,
    );
  });
  expect(guide!.data.saved).toEqual(['palace']);
  await act(async () => guide!.toggleSaved('palace'));
  expect(guide!.data.saved).toEqual([]);
  await act(async () => app!.unmount());
});

test('saved data excludes invalid records and duplicate place identifiers', () => {
  expect(
    parseData(
      JSON.stringify({
        saved: ['palace', 'palace', 'missing'],
        results: [
          { score: 9, date: 'today' },
          { score: 4, date: 'today' },
        ],
      }),
    ),
  ).toEqual({
    onboarded: false,
    trip: [],
    visited: [],
    notes: '',
    saved: ['palace'],
    results: [{ score: 4, date: 'today' }],
  });
});

test('quiz draws five unique questions from the full twenty question bank', () => {
  expect(questions).toHaveLength(20);
  for (let i = 0; i < 30; i++) {
    const sample = sampleQuestions();
    expect(sample).toHaveLength(5);
    expect(new Set(sample.map(q => q.question)).size).toBe(5);
  }
  expect(
    questions.every(
      q => q.answers.length === 4 && q.correct >= 0 && q.correct < 4,
    ),
  ).toBe(true);
});

test('quiz times out, locks answers, finishes and saves the actual result', async () => {
  const navigation = { replace: jest.fn(), goBack: jest.fn() };
  let app: Renderer.ReactTestRenderer;
  await act(async () => {
    app = Renderer.create(
      <GuideProvider>
        <QuizGameScreen
          navigation={navigation as never}
          route={{ key: 'quiz', name: 'QuizGame' } as never}
        />
      </GuideProvider>,
    );
  });
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      jest.advanceTimersByTime(15000);
    });
    const answers = app!.root.findAll(
      p =>
        p.props.accessibilityRole === 'button' &&
        p.props.accessibilityState?.disabled === true,
    );
    expect(answers.length).toBeGreaterThanOrEqual(4);
    await act(async () => app!.root.findByType(Button).props.onPress());
  }
  expect(navigation.replace).toHaveBeenCalledWith('QuizResult', { score: 0 });
  const payload = JSON.parse(
    (AsyncStorage.setItem as jest.Mock).mock.calls.at(-1)[1],
  );
  expect(payload.results).toHaveLength(1);
  expect(payload.results[0].score).toBe(0);
  await act(async () => app!.unmount());
});

test('all provided content is available with unique identifiers and local images', () => {
  expect(places).toHaveLength(40);
  expect(articles).toHaveLength(7);
  expect(facts).toHaveLength(18);
  expect(new Set(places.map(p => p.id)).size).toBe(40);
  expect(
    places.every(p => p.image && p.latitude > 44 && p.longitude > 26),
  ).toBe(true);
});
