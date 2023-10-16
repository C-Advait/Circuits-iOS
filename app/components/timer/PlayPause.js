import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import timerActions from "../../actions/timerActions";

const BUTTON_SIZE = 50;

function PlayPause({ isPlaying, dispatch }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        dispatch({ type: timerActions.TOGGLE_IS_PLAYING });
      }}
      style={styles.background}
    >
      <Ionicons
        name={isPlaying ? "ios-pause" : "ios-play"}
        size={30}
        color="black"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: BUTTON_SIZE / 2,
    height: BUTTON_SIZE,
    justifyContent: "center",
    paddingLeft: 3,
    width: BUTTON_SIZE,
  },
});

export default PlayPause;
