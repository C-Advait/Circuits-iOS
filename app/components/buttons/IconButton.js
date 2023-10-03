import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import Icon from "./Icon";

function IconButton({
  onPress,
  iconName,
  iconSize = 60,
  IconFamily,
  foregroundColour,
  backgroundColour = "transparent",
  style,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.touchable,
        {
          height: 0.4 * iconSize,
          width: 0.4 * iconSize,
        },
        style,
      ]}
    >
      <Icon
        size={iconSize}
        name={iconName}
        IconFamily={IconFamily}
        foregroundColour={foregroundColour}
        backgroundColour={backgroundColour}
        hasBackground={true}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default IconButton;
