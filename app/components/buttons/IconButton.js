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
  iconStyle,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.touchable,
        {
          height: iconSize,
          width: iconSize,
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
        iconStyle={iconStyle}
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
