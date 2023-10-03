import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import Icon from "./Icon";
import { PARAGRAPH_FONT_SIZE } from "../../config/appConstants";

function RoutineActionButton({
  onPress,
  iconName,
  iconSize = 50,
  IconFamily,
  foregroundColour,
  textColour = foregroundColour,
  title,
  style,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.touchable, style]}
    >
      <Icon
        size={iconSize}
        name={iconName}
        IconFamily={IconFamily}
        foregroundColour={foregroundColour}
        backgroundColour="transparent"
        hasBackground={true}
      />
      <Text style={[styles.text, { color: textColour }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: PARAGRAPH_FONT_SIZE,
  },
  touchable: {
    alignItems: "center",
    backgroundColor: "#ffffff0c",
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    paddingVertical: 10,
    width: "39%",
  },
});

export default RoutineActionButton;
