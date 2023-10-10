import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { IconButton } from "../buttons";

function SkipButton({
  shouldSkipForward,
  maxIndex,
  currentIndex,
  setCurrentIndex,
}) {
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
          setCurrentIndex(Math.min(currentIndex + 1, maxIndex));
        } else {
          setCurrentIndex(Math.max(currentIndex - 1, 0));
        }
      }}
    />
  );
}

export default SkipButton;
