import React, { useEffect } from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";

import playSound from "../../utilities/playSound"
import { COUNTDOWN_BEEP_SOUND, END_EXERCISE_SOUND, REST_SOUND } from "../../config/appConstants";


const NumericalTimer = ({
  isPlaying,
  secondsRemaining,
  setSecondsRemaining,
}) => {
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSecondsRemaining((prevSeconds) => {
          if (prevSeconds < 1) {  // Modified condition here
            clearInterval(interval); // Clear interval here
            return 0;
          }
          if (prevSeconds === 1) {
            playSound(END_EXERCISE_SOUND);
          }
          if (1 < prevSeconds && prevSeconds <= 4) {
            playSound(COUNTDOWN_BEEP_SOUND); 
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (!isPlaying && secondsRemaining !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // cleanup on component unmount
  }, [isPlaying, secondsRemaining]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.timerText, styles.placeholder]}>88:88</Text>
      <Text style={styles.timerText}>{formatTime(secondsRemaining)}</Text>
    </View>
  );
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
