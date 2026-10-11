import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { places } from '../data/places';
export type QuizResult = { score: number; date: string };
type Data = { onboarded: boolean; saved: string[]; results: QuizResult[] };
const initial: Data = { onboarded: false, saved: [], results: [] };
const key = '@bucharest/guide/v1';
export function parseData(value: string | null): Data {
  if (!value) {
    return initial;
  }
  const data = JSON.parse(value);
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid saved data');
  }
  return {
    onboarded: data.onboarded === true,
    saved: Array.isArray(data.saved)
      ? [
          ...new Set<string>(
            data.saved.filter((id: unknown) => places.some(p => p.id === id)),
          ),
        ]
      : [],
    results: Array.isArray(data.results)
      ? data.results
          .filter(
            (r: QuizResult) =>
              r &&
              Number.isInteger(r.score) &&
              r.score >= 0 &&
              r.score <= 5 &&
              typeof r.date === 'string',
          )
          .slice(-100)
      : [],
  };
}
const Context = createContext<{
  data: Data;
  ready: boolean;
  completeOnboarding: () => void;
  toggleSaved: (id: string) => void;
  addResult: (score: number) => void;
} | null>(null);
export function GuideProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(initial);
  const [ready, setReady] = useState(false);
  const current = useRef(initial);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key)
      .then(parseData)
      .then(d => {
        if (active) {
          current.current = d;
          setData(d);
        }
      })
      .catch(() =>
        Alert.alert(
          'Storage unavailable',
          'Your saved guide could not be loaded. Please restart the app to try again.',
        ),
      )
      .finally(() => {
        if (active) {
          setReady(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);
  const update = (transform: (d: Data) => Data) => {
    const next = transform(current.current);
    current.current = next;
    setData(next);
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(key, JSON.stringify(next)))
      .catch(() => {
        Alert.alert(
          'Could not save',
          'This change is available for this session. Device storage could not be updated.',
        );
      });
  };
  return (
    <Context.Provider
      value={{
        data,
        ready,
        completeOnboarding: () => update(d => ({ ...d, onboarded: true })),
        toggleSaved: id =>
          update(d => ({
            ...d,
            saved: d.saved.includes(id)
              ? d.saved.filter(x => x !== id)
              : [...d.saved, id],
          })),
        addResult: score =>
          update(d => ({
            ...d,
            results: [
              ...d.results,
              { score, date: new Date().toISOString() },
            ].slice(-100),
          })),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useGuide() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('GuideProvider required');
  }
  return context;
}
