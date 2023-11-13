import React from "react";
import { Text, StyleSheet } from "react-native";

import { useAppContext } from "../contexts/AppContext";
import { PARAGRAPH_FONT_SIZE } from "../config/appConstants";

function DummyInputComponent({ text = "10 minutes", disabled = false }) {
  const { theme } = useAppContext();
  const styles = disabled ? getStylesDisabled(theme) : getStylesActive(theme);
  return <Text style={[styles.body]}>{text}</Text>;
}

const getStylesActive = (theme) =>
  StyleSheet.create({
    body: {
      fontSize: PARAGRAPH_FONT_SIZE,
      color: theme.text87,
    },
  });

const getStylesDisabled = (theme) =>
  StyleSheet.create({
    body: {
      fontSize: PARAGRAPH_FONT_SIZE,
      color: theme.textDisabled,
    },
  });

export default DummyInputComponent;
