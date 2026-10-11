import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from 'react-native';
const MotionContext = createContext(true);
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let mounted = true;
    let changed = false;
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      value => {
        changed = true;
        setReduced(value);
      },
    );
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (mounted && !changed) {
          setReduced(value);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);
  return (
    <MotionContext.Provider value={reduced}>{children}</MotionContext.Provider>
  );
}
export function useReducedMotion() {
  return useContext(MotionContext);
}
export function Reveal({
  children,
  style,
  delay = 0,
  replayKey,
  variant = 'rise',
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  replayKey?: string | number | boolean;
  variant?: 'rise' | 'zoom' | 'slide';
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: variant === 'zoom' ? 540 : 420,
      delay: Math.min(delay, 250),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced, delay, replayKey, variant]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [variant === 'rise' ? 18 : 0, 0],
              }),
            },
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [variant === 'slide' ? 18 : 0, 0],
              }),
            },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [variant === 'zoom' ? 0.94 : 1, 1],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
export function usePressMotion() {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      scale.stopAnimation();
      scale.setValue(1);
    }
    return () => scale.stopAnimation();
  }, [reduced, scale]);
  const animate = (toValue: number) => {
    if (reduced) {
      return;
    }
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 32,
      bounciness: 5,
    }).start();
  };
  return { scale, pressIn: () => animate(0.97), pressOut: () => animate(1) };
}
