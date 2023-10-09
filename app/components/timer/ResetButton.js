import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { IconButton } from "../buttons";

function ResetButton({ onPress }) {
  return (
    <IconButton
      iconName="restart"
      iconSize={80}
      IconFamily={MaterialCommunityIcons}
      foregroundColor="white"
      onPress={onPress}
    />
  );
}

export default ResetButton;
