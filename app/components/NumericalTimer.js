import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

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
          if (prevSeconds <= 1) {
            clearInterval(interval);
            return 0;
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
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(secondsRemaining)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  timerText: {
    fontSize: 60,
    color: "white",
  },
});

export default NumericalTimer;
