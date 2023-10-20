import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  Easing,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { Circle, G, Svg, Defs, LinearGradient, Stop } from "react-native-svg";

import NumericalTimer from "./NumericalTimer";
import ResetButton from "./ResetButton";

import {
  CIRCLE_SIZE,
  CIRCUMFERENCE,
  RING_STARTING_OFFSET,
  STROKE_WIDTH,
} from "./timerConstants";
import { getMovingEndColor, getFixedEndColor } from "../../config/gradients";
import timerActions from "../../actions/timerActions";
import CountdownModal from "./CountdownModal";
import { SOUNDS } from "../../config/sounds";
import { useSoundContext } from "../../contexts/SoundContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Timer = ({ state, dispatch, nextExerciseTag }) => {
  const { playSound, pauseSound } = useSoundContext();
  const [isAnimationVisible, setIsAnimationVisible] = useState(true);

  const progress = useSharedValue(1);
  // Consider moving into state directly.
  const { title, tag } = state.intervals[state.currentIndex] || {};

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

    if (exerciseDuration && state.isPlaying) {
      progress.value = withTiming(0, {
        duration: exerciseDuration * 1000,
        easing: Easing.linear,
      });
    } else {
      cancelAnimation(progress);
    }
  }, [state.isPlaying]);

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
      <CountdownModal
        playSound={playSound}
        isAnimationVisible={isAnimationVisible}
        setIsAnimationVisible={setIsAnimationVisible}
        onClose={() => {
          dispatch({ type: timerActions.TOGGLE_IS_PLAYING });
        }}
      />
      {!isAnimationVisible ? (
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
            <View>
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
    top: CIRCLE_SIZE / 3 - 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 27,
    fontWeight: 500,
    textAlign: "center",
  },
  timer: {
    fontSize: 20,
    color: "white",
    marginBottom: 10,
  },
});

export default Timer;
