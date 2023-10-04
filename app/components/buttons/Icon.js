import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DEFAULT_CIRCLE_SIZE = 50;

function Icon({
  size,
  name,
  IconFamily = MaterialCommunityIcons,
  foregroundcolor,
  backgroundcolor,
  hasBackground = true,
  iconStyle: style,
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
        style,
      ]}
    >
      <IconFamily
        name={name}
        backgroundColor={backgroundcolor}
        color={foregroundcolor}
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
