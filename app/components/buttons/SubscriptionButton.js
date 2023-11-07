import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useSettings } from "../../contexts/SettingsContext";
import {
  PARAGRAPH_FONT_SIZE,
  PARAGRAPH_FONT_WEIGHT,
} from "../../config/appConstants";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function SubscriptionButton({
  enabled,
  onPress = () => null,
  titleText,
  priceText,
}) {
  const { theme } = useSettings();
  const styles = getStylesActive(theme);

  return (
    <LinearGradient
      colors={enabled ? [theme.blue, "#49DCC2"] : ["#38383A", "#38383A"]}
      style={styles.gradientBorder}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <TouchableWithoutFeedback
        style={[styles.planButton]}
        onPress={() => onPress()}
      >
        <Text style={styles.planText}>{titleText}</Text>
        <Text style={styles.priceText}>{priceText}</Text>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const getStylesActive = (theme) =>
  StyleSheet.create({
    planButton: {
      padding: 10,
      backgroundColor: theme.tertiaryBackground,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    planText: {
      fontSize: PARAGRAPH_FONT_SIZE,
      fontWeight: PARAGRAPH_FONT_WEIGHT,
      color: theme.primary,
    },
    priceText: {
      marginTop: 4,
      fontSize: 15,
      fontWeight: 500,
      color: theme.secondary,
    },
    gradientBorder: {
      borderRadius: 12,
      padding: 3,
      overflow: "hidden",
    },
  });

export default SubscriptionButton;
