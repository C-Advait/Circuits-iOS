import React from "react";
import { View, Text, StyleSheet } from "react-native";
const NumericalTimer = ({ state }) => {
  const exerciseSecondsRemaining = state.exerciseSecondsRemaining;

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {state.routineComplete ? "" : formatTime(exerciseSecondsRemaining)}
      </Text>
    </View>
  );
};

const formatTime = (time) => {
  const roundedTime = Math.max(0, Math.ceil(time));
  const minutes = Math.floor(roundedTime / 60);
  const seconds = roundedTime % 60;
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
