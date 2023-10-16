import React, { useEffect, useState } from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import timerActions from "../../actions/timerActions";
import { TIMER_UPDATE_INTERVAL } from "./timerConstants";

import playSound from "../../utilities/playSound";
import {
  COUNTDOWN_BEEP_SOUND,
  BEGIN_EXERCISE_SOUND,
  REST_SOUND,
} from "../../config/appConstants";
import { Tag } from "../../classes/Exercise";

const NumericalTimer = ({ state, dispatch, nextExerciseTag }) => {
  const transitionSound = getSoundToPlay(nextExerciseTag);

  console.log(state.intervals[state.currentIndex]?.duration);
  const [exerciseSecondsRemaining, setExerciseSecondsRemaining] = useState(
    state.intervals[state.currentIndex]?.duration,
  );
  const EPS = 0.01; // Tolerance for elapsedTime === 1.

  useEffect(() => {
    setExerciseSecondsRemaining(state.exerciseSecondsRemaining);
  }, [state.shouldResetTimer, state.exerciseSecondsRemaining]);

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
            if (exerciseSecondsRemaining === 1) {
              playSound(transitionSound);
            } else if (
              1 < exerciseSecondsRemaining &&
              exerciseSecondsRemaining <= 4
            ) {
              playSound(COUNTDOWN_BEEP_SOUND);
            }
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
    }

    return () => cancelAnimationFrame(rafID);
  }, [state.isPlaying, exerciseSecondsRemaining]);

  return (
    <View style={styles.container}>
      <Text style={[styles.timerText, styles.placeholder]}>88:88</Text>
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
      return REST_SOUND;
    case Tag.WORKING:
    case Tag.PREROUTINE:
    case Tag.POSTROUTINE:
    case Tag.FINISH:
      return BEGIN_EXERCISE_SOUND;
  }
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.ceil(time % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  timerText: {
    position: "absolute",
    fontSize: 60,
    right: -(width - 60) * 0.25,
    left: 4 - (width - 60) * 0.25,
    color: "white",
  },
  placeholder: {
    color: "transparent",
  },
});

export default NumericalTimer;
