import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import EditableText from "./EditableText";
import { PARAGRAPH_FONT_SIZE } from "../config/constants";

function AuxiliaryCard({ accentColour, title }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={[styles.accent, { backgroundColor: accentColour }]} />
      <View style={styles.contentContainer}>
        <EditableText placeholder="Warmup" style={styles.header}>
          {title}
        </EditableText>
        <Text style={styles.body}>10 minutes</Text>
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: theme.tileBackground,
      borderRadius: 8,
      flexDirection: "row",
      height: 42,
      marginHorizontal: 16,
    },
    contentContainer: {
      alignContent: "center",
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
      padding: 10,
    },
    accent: {
      width: 3,
      height: "98%",
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
    header: {
      color: theme.text87,
      fontSize: PARAGRAPH_FONT_SIZE,
    },
    subtitle: {
      fontSize: 18,
      marginTop: 5,
    },
    body: {
      fontSize: PARAGRAPH_FONT_SIZE,
      color: theme.text87,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
  });

export default AuxiliaryCard;
