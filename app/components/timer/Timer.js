import React, { useEffect, useState } from "react";
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
import { SkipTypes } from "../../classes/SkipTypes";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const COUNTDOWN_DURATION = 3;
const MILLIS_IN_SECOND = 1000;

const Timer = ({ state, dispatch, nextExerciseTag }) => {
  // Detect when app moves to background.
  const [appState, setAppState] = useState(AppState.currentState);
  // Record time when app moves into background.
  const [backgroundTime, setBackgroundTime] = useState(null);
  // Array of timer IDs so we can cancel them after they're scheduled.
  const [timerIDs, setTimerIDs] = useState([]);

  const { playSound } = useSoundContext();
  const [isAnimationVisible, setIsAnimationVisible] = useState(true);

  const progress = useSharedValue(1);
  // Consider moving into state directly.
  const { title, tag } = state.intervals[state.currentIndex] || {};

  // Handle background / foreground changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    if (isAnimationVisible) {
      playSound(SOUNDS.BEGIN_REST.key);
    }
  }, [isAnimationVisible]);

  // Reload timer when flag set, then unset flag.
  useEffect(() => {
    if (state.shouldResetTimer) {
      progress.value = 1;
      dispatch({ type: timerActions.MARK_TIMER_LOAD_COMPLETE });

      const exerciseDuration = state.intervals[state.currentIndex]?.duration;

      if (state.isPlaying) {
        progress.value = withTiming(0, {
          duration: exerciseDuration * 1000,
          easing: Easing.linear,
        });
      }
    }
  }, [state.shouldResetTimer]);

  // Handle play / pause.
  useEffect(() => {
    // Can use exerciseSecondsRemaining?
    const exerciseDuration = state.exerciseSecondsRemaining;

    if (state.skipData === SkipTypes.SKIPPED_WITHIN) {
      // Stop progress for moment so it can reset to new duration.
      cancelAnimation(progress);
      dispatch({ type: timerActions.MARK_SKIP_COMPLETE });
    } else if (state.skipData === SkipTypes.SKIPPED_BORDER) {
      // Need to set progress.value if we've reached a new exercise.
      progress.value =
        exerciseDuration / state.intervals[state.currentIndex]?.duration;
      console.log(`state.skipData: ${state.skipData}`);
      console.log(`progressValue: ${progress.value}`);
      dispatch({ type: timerActions.MARK_SKIP_COMPLETE });
    }

    if (exerciseDuration && state.isPlaying) {
      progress.value = withTiming(0, {
        duration: exerciseDuration * 1000,
        easing: Easing.linear,
      });
    } else {
      cancelAnimation(progress);
    }
  }, [state.isPlaying, state.skipData]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = (1 - progress.value) * CIRCUMFERENCE;
    return {
      strokeDashoffset,
    };
  });

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      handleAppToForeground();
    } else if (nextAppState === "background") {
      handleAppLeavingForeground();
    }
    setAppState(nextAppState);
  };

  const handleAppToForeground = () => {
    const currentTime = new Date().getTime();

    if (backgroundTime) {
      const timeDifference = currentTime - backgroundTime;
      dispatch({
        type: timerActions.SKIP_AMOUNT,
        payload: timeDifference / MILLIS_IN_SECOND,
      });

      // Reset the backgroundTime
      setBackgroundTime(null);
    }

    // Clear scheduled sounds
    if (Array.isArray(timerIDs) && timerIDs.length > 0) {
      timerIDs.forEach((id) => {
        BackgroundTimer.clearTimeout(id);
      });
      setTimerIDs([]);
    }

    BackgroundTimer.stop();
  };

  const handleAppLeavingForeground = () => {
    dispatch({ type: timerActions.MARK_COUNTDOWN_COMPLETE });

    // Don't schedule sounds if timer's paused.
    if (!state.isPlaying) return;

    BackgroundTimer.start();

    setBackgroundTime(new Date().getTime());

    const newIDs = [];

    // Schedule sounds
    state.intervals.forEach((interval) => {
      // Too close to schedule the sound.
      if (interval.startTime - COUNTDOWN_DURATION < state.totalElapsedTime)
        return;

      const tag = interval.tag;
      const id = BackgroundTimer.setTimeout(
        () => {
          let soundKey;

          switch (tag) {
            // Tag.PREROUTINE is impossible, as nothing can come before it.
            case Tag.POSTROUTINE:
            case Tag.REST:
            case Tag.BREAK:
              soundKey = SOUNDS.BEGIN_REST.key;
              break;
            case Tag.WORKING:
              soundKey = SOUNDS.BEGIN_EXERCISE.key;
              break;
          }

          playSound(soundKey);
        },
        MILLIS_IN_SECOND * (interval.startTime - state.totalElapsedTime),
      );
      newIDs.push(id);
    });

    // Schedule completion sound
    const finalID = BackgroundTimer.setTimeout(
      () => {
        playSound(SOUNDS.COMPLETION.key);
      },
      MILLIS_IN_SECOND * (state.totalDuration - state.totalElapsedTime),
    );

    newIDs.push(finalID);

    setTimerIDs(newIDs);
  };

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
          <NumericalTimer
            state={state}
            dispatch={dispatch}
            nextExerciseTag={nextExerciseTag}
          />
          {state.routineComplete ? null : (
            <View style={{ transform: [{ translateY: 10 }] }}>
              <ResetButton
                onPress={() => dispatch({ type: timerActions.RESET_TIMER })}
              />
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
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
