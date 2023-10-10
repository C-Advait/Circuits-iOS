import React, { useEffect } from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import timerActions from "../../actions/timerActions";

import playSound from "../../utilities/playSound"
import { COUNTDOWN_BEEP_SOUND, END_EXERCISE_SOUND } from "../../config/appConstants";

const NumericalTimer = ({ state, dispatch }) => {
  useEffect(() => {
    let interval;

    if (state.isPlaying) {
      interval = setInterval(() => {
        if (state.exerciseSecondsRemaining < 1) {
          dispatch({ type: timerActions.SKIP_FORWARD });
          clearInterval(interval);
        } else {
          dispatch({ type: timerActions.DECREMENT_TIMER });
        }
      }, 1000);
    } else if (state.exerciseSecondsRemaining !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // cleanup on component unmount
  }, [isPlaying, secondsRemaining]);

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

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
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
