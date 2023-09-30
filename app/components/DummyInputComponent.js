import React from "react";
import { Text, StyleSheet } from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import { PARAGRAPH_FONT_SIZE } from "../config/constants";

function DummyInputComponent({ text = "10 minutes" }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return <Text style={styles.body}>{text}</Text>;
}

const getStyles = (theme) =>
  StyleSheet.create({
    body: {
      fontSize: PARAGRAPH_FONT_SIZE,
      color: theme.text87,
    },
  });
export default DummyInputComponent;
