import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { IconButton } from "../buttons";

function SkipButton({ shouldSkipForward }) {
  return (
    <IconButton
      iconName={
        shouldSkipForward ? "md-play-skip-forward" : "md-play-skip-back"
      }
      iconSize={70}
      foregroundColor="white"
      IconFamily={Ionicons}
      onPress={() => {
        if (shouldSkipForward) {
          console.log("Skipping next");
        } else {
          console.log("Skipping previous");
        }
      }}
    />
  );
}

export default SkipButton;
