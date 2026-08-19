import React, { useEffect, useRef } from "react";
import { AppState, View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  Easing,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { Circle, G, Svg, Defs, LinearGradient, Stop } from "react-native-svg";
import BackgroundTimer from "react-native-background-timer";

import NumericalTimer from "./NumericalTimer";
import ResetButton from "./ResetButton";

import { CIRCLE_SIZE, CIRCUMFERENCE, STROKE_WIDTH } from "./timerConstants";
import { getMovingEndColor, getFixedEndColor } from "../../config/gradients";
import timerActions from "../../actions/timerActions";
import { SOUNDS } from "../../config/sounds";
import { useSoundContext } from "../../contexts/SoundContext";
import { Tag } from "../../classes/Exercise";
import { getElapsedAtTime } from "../../utilities/timerClock";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const COUNTDOWN_DURATION = 3;
const MILLIS_IN_SECOND = 1000;
// iOS expires ordinary background tasks after roughly 30 seconds.
const MAX_BACKGROUND_SOUND_DELAY_SECONDS = 28;

const Timer = ({ state, dispatch, nextExerciseTag }) => {
  const { playSound, stopSound } = useSoundContext();
  const progress = useSharedValue(1);
  const { title, tag } = state.intervals[state.currentIndex] || {};
  const stateRef = useRef(state);
  const playSoundRef = useRef(playSound);
  const timerIDsRef = useRef([]);
  const lastTransitionCueRef = useRef(null);
  const completionPlayedInBackgroundRef = useRef(false);
  const initialCountdownSoundPlayedRef = useRef(false);
  const previousIsPlayingRef = useRef(state.isPlaying);

  stateRef.current = state;
  playSoundRef.current = playSound;

  useEffect(() => {
    if (state.showCountdown && !initialCountdownSoundPlayedRef.current) {
      initialCountdownSoundPlayedRef.current = true;
      playSound(SOUNDS.BEGIN_REST.key);
    }
  }, [state.showCountdown]);

  useEffect(() => {
    if (
      previousIsPlayingRef.current &&
      !state.isPlaying &&
      !state.routineComplete
    ) {
      stopSound();
    }
    previousIsPlayingRef.current = state.isPlaying;
  }, [state.isPlaying, state.routineComplete]);

  useEffect(() => {
    const clearScheduledSounds = () => {
      timerIDsRef.current.forEach((id) => BackgroundTimer.clearTimeout(id));
      timerIDsRef.current = [];
    };

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        clearScheduledSounds();
        dispatch({ type: timerActions.RESYNC_CLOCK, now: Date.now() });
        return;
      }

      if (nextAppState !== "background") return;

      dispatch({ type: timerActions.MARK_COUNTDOWN_COMPLETE });

      const snapshot = stateRef.current;
      if (!snapshot.isPlaying || snapshot.routineComplete) return;

      const now = Date.now();
      const elapsedAtBackground = getElapsedAtTime(snapshot, now);
      const newIDs = [];

      snapshot.intervals.forEach((interval, index) => {
        if (index === 0) return;

        const cueTime = interval.startTime - COUNTDOWN_DURATION;
        if (cueTime <= elapsedAtBackground) return;

        const cueDelay = cueTime - elapsedAtBackground;
        if (cueDelay > MAX_BACKGROUND_SOUND_DELAY_SECONDS) return;

        const soundKey = getSoundToPlay(interval.tag);
        if (!soundKey) return;

        const id = BackgroundTimer.setTimeout(() => {
          lastTransitionCueRef.current = index;
          playSoundRef.current(soundKey);
        }, MILLIS_IN_SECOND * cueDelay);

        newIDs.push(id);
      });

      const completionDelay = snapshot.totalDuration - elapsedAtBackground;
      if (
        completionDelay > 0 &&
        completionDelay <= MAX_BACKGROUND_SOUND_DELAY_SECONDS
      ) {
        const finalID = BackgroundTimer.setTimeout(() => {
          completionPlayedInBackgroundRef.current = true;
          playSoundRef.current(SOUNDS.COMPLETION.key);
        }, MILLIS_IN_SECOND * completionDelay);
        newIDs.push(finalID);
      }

      timerIDsRef.current = newIDs;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      clearScheduledSounds();
    };
  }, []);

  useEffect(() => {
    const intervalDuration = state.intervals[state.currentIndex]?.duration || 0;
    const remaining = Math.max(0, state.exerciseSecondsRemaining);

    cancelAnimation(progress);
    progress.value = intervalDuration ? remaining / intervalDuration : 0;

    if (remaining && state.isPlaying) {
      progress.value = withTiming(0, {
        duration: remaining * MILLIS_IN_SECOND,
        easing: Easing.linear,
      });
    }
  }, [
    state.currentIndex,
    state.isPlaying,
    state.clockRevision,
    state.routineComplete,
  ]);

  useEffect(() => {
    if (!state.isPlaying || state.routineComplete) return;

    const nextIndex = state.currentIndex + 1;
    if (state.exerciseSecondsRemaining > COUNTDOWN_DURATION) {
      if (lastTransitionCueRef.current === nextIndex) {
        lastTransitionCueRef.current = null;
      }
      return;
    }

    if (
      nextIndex >= state.intervals.length ||
      lastTransitionCueRef.current === nextIndex
    ) {
      return;
    }

    const soundKey = getSoundToPlay(nextExerciseTag);
    if (soundKey) {
      lastTransitionCueRef.current = nextIndex;
      playSound(soundKey);
    }
  }, [
    state.currentIndex,
    state.exerciseSecondsRemaining,
    state.isPlaying,
    state.routineComplete,
    nextExerciseTag,
  ]);

  useEffect(() => {
    if (!state.routineComplete) return;

    if (!completionPlayedInBackgroundRef.current) {
      playSound(SOUNDS.COMPLETION.key);
    }
    completionPlayedInBackgroundRef.current = false;
  }, [state.routineComplete]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = (1 - progress.value) * CIRCUMFERENCE;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} fill="transparent">
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={getMovingEndColor(tag)} />
            <Stop offset="100%" stopColor={getFixedEndColor(tag)} />
          </LinearGradient>
        </Defs>
        <G rotation="-90" origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}>
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={CIRCLE_SIZE / 2 - STROKE_WIDTH}
            strokeWidth={STROKE_WIDTH}
            stroke="rgba(255, 255, 255, 0.11)"
          />
          <AnimatedCircle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={CIRCLE_SIZE / 2 - STROKE_WIDTH}
            strokeWidth={STROKE_WIDTH}
            stroke="url(#gradient)"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
      {!state.showCountdown ? (
        <View style={styles.overlay}>
          <Text
            style={[styles.title, styleExerciseTitle(title)]}
            numberOfLines={2}
          >
            {state.routineComplete ? "" : title}
          </Text>
          <NumericalTimer state={state} />
          {state.routineComplete ? null : (
            <View style={{ transform: [{ translateY: 10 }] }}>
              <ResetButton
                onPress={() =>
                  dispatch({ type: timerActions.RESET_TIMER, now: Date.now() })
                }
              />
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

const getSoundToPlay = (tag) => {
  switch (tag) {
    case Tag.POSTROUTINE:
    case Tag.REST:
    case Tag.BREAK:
      return SOUNDS.BEGIN_REST.key;
    case Tag.WORKING:
    case Tag.PREROUTINE:
      return SOUNDS.BEGIN_EXERCISE.key;
    default:
      return null;
  }
};

const EXERCISE_TITLE_RESIZE_THRESHOLD = 10;

const styleExerciseTitle = (title) => {
  let ret = { fontSize: 27 };

  if (title?.length > EXERCISE_TITLE_RESIZE_THRESHOLD) {
    ret.fontSize = 24;
  }

  return ret;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  overlay: {
    alignSelf: "center",
    width: 0.5 * CIRCLE_SIZE,
    height: 0.65 * CIRCLE_SIZE,
    position: "absolute",
    gap: 10,
    top: CIRCLE_SIZE / 3 - 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 27,
    fontWeight: "500",
    textAlign: "center",
  },
  timer: {
    fontSize: 20,
    color: "white",
    marginBottom: 10,
  },
});

export default Timer;
