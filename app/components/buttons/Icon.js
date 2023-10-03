import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DEFAULT_CIRCLE_SIZE = 50;

function Icon({
  size,
  name,
  IconFamily = MaterialCommunityIcons,
  foregroundColour,
  backgroundColour,
  hasBackground = true,
}) {
  return (
    <View
      style={[
        styles.circle,
        hasBackground
          ? {
              width: size / 2,
              height: size / 2,
              borderRadius: size / 2,
            }
          : {
              height: "auto",
              width: "auto",
            },
      ]}
    >
      <IconFamily
        name={name}
        backgroundColor={backgroundColour}
        color={foregroundColour}
        size={size / 2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    borderRadius: DEFAULT_CIRCLE_SIZE / 2,
    height: DEFAULT_CIRCLE_SIZE,
    justifyContent: "center",
    width: DEFAULT_CIRCLE_SIZE,
  },
});

export default Icon;
