import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import timerActions from "../../actions/timerActions";

import { Tag } from "../../classes/Exercise";
import { SOUNDS } from "../../config/sounds";
import { useSoundContext } from "../../contexts/SoundContext";

const NumericalTimer = ({ state, dispatch, nextExerciseTag }) => {
  const transitionSound = getSoundToPlay(nextExerciseTag);
  const { playSound, pauseSound } = useSoundContext();

  const [exerciseSecondsRemaining, setExerciseSecondsRemaining] = useState(
    state.intervals[state.currentIndex]?.duration,
  );

  const EPS = 0.01; // Tolerance for elapsedTime === 1.

  useEffect(() => {
    setExerciseSecondsRemaining(state.exerciseSecondsRemaining);
  }, [state.shouldResetTimer, state.exerciseSecondsRemaining]);

  useEffect(() => {
    if (exerciseSecondsRemaining <= 3) {
      if (transitionSound) playSound(transitionSound);
    }
  }, [exerciseSecondsRemaining]);

  useEffect(() => {
    let startTime;
    let lastUpdateTime;
    let rafID;
    let pausedDuration = 0;
    let pauseStartTime;

    function frame() {
      const currentTime = Date.now();
      let elapsedTime = (currentTime - startTime - pausedDuration) / 1000;

      lastUpdateTime = currentTime;

      if (state.isPlaying) {
        if (exerciseSecondsRemaining < EPS) {
          dispatch({ type: timerActions.SKIP_FORWARD });
          cancelAnimationFrame(rafID);
        } else {
          if (Math.abs(elapsedTime - 1) <= EPS) {
            setExerciseSecondsRemaining((prev) => prev - 1);
            dispatch({ type: timerActions.ELAPSE });
            elapsedTime -= 1;
          } else {
            rafID = requestAnimationFrame(frame);
          }
        }
      } else if (exerciseSecondsRemaining > 0) {
        pauseStartTime = currentTime;
        cancelAnimationFrame(rafID);
      }
    }

    if (state.isPlaying) {
      if (pauseStartTime) {
        pausedDuration += Date.now() - pauseStartTime;
        pauseStartTime = null;
      }

      startTime = startTime || Date.now();
      lastUpdateTime = lastUpdateTime || startTime;
      rafID = requestAnimationFrame(frame);
    } else {
      pauseSound(transitionSound);
    }

    return () => cancelAnimationFrame(rafID);
  }, [state.isPlaying, exerciseSecondsRemaining]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {state.routineComplete ? "" : formatTime(exerciseSecondsRemaining)}
      </Text>
    </View>
  );
};

// Choose appropriate sound based on upcoming tag.
// Can always switch to DB after this.
const getSoundToPlay = (tag) => {
  switch (tag) {
    case Tag.REST:
    case Tag.BREAK:
    case Tag.POSTROUTINE:
      return SOUNDS.BEGIN_REST.key;
    case Tag.WORKING:
    case Tag.PREROUTINE:
      return SOUNDS.BEGIN_EXERCISE.key;
    case Tag.FINISH:
      // Responsibility of success animation.
      return null;
  }
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.ceil(time % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  timerText: {
    textAlign: "center",
    color: "white",
    fontSize: 55,
    fontVariant: ["tabular-nums"],
  },
});

export default NumericalTimer;
