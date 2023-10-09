import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import Icon from "./Icon";
import { PARAGRAPH_FONT_SIZE } from "../../config/appConstants";

function LabelledIconButton({
  onPress,
  iconName,
  iconSize = 40,
  IconFamily,
  foregroundColor,
  textColor = foregroundColor,
  title,
  style,
  textStyle,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.touchable, style]}
    >
      {iconName ? (
        <Icon
          size={iconSize}
          name={iconName}
          IconFamily={IconFamily}
          foregroundColor={foregroundColor}
          backgroundColor="transparent"
          hasBackground={true}
        />
      ) : null}
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: PARAGRAPH_FONT_SIZE,
  },
  touchable: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
  },
});

export default LabelledIconButton;
