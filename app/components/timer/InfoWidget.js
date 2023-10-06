import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

function InfoWidget({ title, current, total }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

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
      backgroundColor: theme.secondaryBackground,
      borderRadius: 12,
      gap: 4,
      paddingVertical: 8,
      width: "29%",
    },
    progress: {
      color: theme.primary,
      fontSize: 27,
      fontWeight: 500,
    },
    title: {
      color: theme.secondary,
      fontSize: 17,
    },
  });

export default InfoWidget;
