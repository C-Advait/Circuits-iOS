import React, { useEffect } from "react";
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
  const sound = getSoundToPlay(nextExerciseTag);

  useEffect(() => {
    let interval;

    if (state.isPlaying) {
      interval = setInterval(() => {
        if (state.exerciseSecondsRemaining < TIMER_UPDATE_INTERVAL / 1000) {
          dispatch({ type: timerActions.SKIP_FORWARD });
          playSound(sound);
          clearInterval(interval);
        } else {
          if (
            1 < state.exerciseSecondsRemaining &&
            state.exerciseSecondsRemaining <= 4 &&
            Number.isInteger(state.exerciseSecondsRemaining)
          ) {
            playSound(COUNTDOWN_BEEP_SOUND);
          }
          dispatch({ type: timerActions.ELAPSE });
        }
      }, TIMER_UPDATE_INTERVAL);
    } else if (state.exerciseSecondsRemaining !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // cleanup on component unmount
  }, [state.isPlaying, state.exerciseSecondsRemaining]);

  return (
    <View style={styles.container}>
      <Text style={[styles.timerText, styles.placeholder]}>88:88</Text>
      <Text style={styles.timerText}>
        {state.routineComplete
          ? ""
          : formatTime(state.exerciseSecondsRemaining)}
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
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""
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
