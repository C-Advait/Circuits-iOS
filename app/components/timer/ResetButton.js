import React from "react";
import { Feather } from "../SafeIcons";

import { IconButton } from "../buttons";

function ResetButton({ onPress }) {
  return (
    <IconButton
      iconName="rotate-ccw"
      iconSize={60}
      IconFamily={Feather}
      foregroundColor="white"
      onPress={onPress}
    />
  );
}

export default ResetButton;
