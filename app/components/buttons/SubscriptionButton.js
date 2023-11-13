import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useAppContext } from "../../contexts/AppContext";
import {
  PARAGRAPH_FONT_SIZE,
  PARAGRAPH_FONT_WEIGHT,
} from "../../config/appConstants";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

function SubscriptionButton({
  enabled,
  purchased,
  onPress = () => null,
  titleText,
  priceText,
}) {
  const { theme } = useAppContext();
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
        <View style={styles.planView}>
          <Text style={styles.planText}>{titleText}</Text>
          {purchased ? (
            <Ionicons
              name="checkmark"
              color={theme.blue}
              size={20}
              style={styles.checkmark}
            />
          ) : null}
        </View>
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
    planView: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    priceText: {
      marginTop: 4,
      fontSize: 15,
      fontWeight: "500",
      color: theme.secondary,
    },
    gradientBorder: {
      borderRadius: 12,
      padding: 3,
      overflow: "hidden",
    },
  });

export default SubscriptionButton;
