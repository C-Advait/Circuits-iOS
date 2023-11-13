import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useAppContext } from "../../contexts/AppContext";
import { Tag } from "../../classes/Exercise";

function InfoWidget({ title, state }) {
  const { theme } = useAppContext();
  const styles = getStyles(theme);

  let current, total;

  if (title === "Loop" && state.numberOfLoops === 1) return null;

  if (
    state.intervals[state.currentIndex]?.tag === Tag.PREROUTINE ||
    state.intervals[state.currentIndex]?.tag === Tag.POSTROUTINE
  ) {
    current = "-";
    total = "-";
  }

  switch (title) {
    case "Round":
      if (typeof current === "undefined")
        current = state.intervals[state.currentIndex]?.currentRound;
      if (typeof total === "undefined")
        total = state.intervals[state.currentIndex]?.numberOfRounds;
      break;
    case "Exercise":
      if (typeof current === "undefined")
        // exerciseOrder is 0-indexed, but warmups always exist.
        current = state.intervals[state.currentIndex]?.exerciseOrder;
      if (typeof total === "undefined") total = state?.numberOfExercises;
      break;
    case "Loop":
      if (typeof current === "undefined") current = state?.currentLoop;
      if (typeof total === "undefined") total = state?.numberOfLoops;
      break;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.progress}>
        {current} / {total}
      </Text>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1,
      backgroundColor: theme.secondaryBackground,
      borderRadius: 12,
      paddingVertical: 8,
      justifyContent: "center",
      width: "29%",
      gap: 4,
    },
    progress: {
      color: theme.primary,
      fontSize: 25,
      fontWeight: "500",
    },
    specialChar: {
      alignSelf: "center",
      fontSize: 20,
      fontWeight: "light",
      lineHeight: 30, // Matching the fontSize of the surrounding text
      marginBottom: 30 - 20 / 2,
    },
    title: {
      color: theme.secondary,
      fontSize: 17,
    },
  });

export default InfoWidget;
