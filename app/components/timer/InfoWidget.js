import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSettings } from "../../contexts/SettingsContext";

function InfoWidget({ title, current, total }) {
  const { theme } = useSettings();
  const styles = getStyles(theme);

  if (title === "Loop" && total === 1) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.progress}>
        {current}
        <Text style={styles.specialChar}> / </Text>
        {total}
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
      fontWeight: 500,
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
