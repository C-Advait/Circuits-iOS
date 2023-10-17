import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { IconButton } from "../buttons";
import timerActions from "../../actions/timerActions";
import { useTheme } from "../../contexts/ThemeContext";

function SkipButton({ shouldSkipForward, dispatch, active = true }) {
  const { theme } = useTheme();

  return (
    <IconButton
      iconName={
        shouldSkipForward ? "md-play-skip-forward" : "md-play-skip-back"
      }
      iconSize={70}
      foregroundColor={active ? theme.primary : theme.tertiary}
      IconFamily={Ionicons}
      onPress={() => {
        if (!active) return;

        if (shouldSkipForward) {
          dispatch({ type: timerActions.SKIP_FORWARD });
        } else {
          dispatch({ type: timerActions.SKIP_BACKWARD });
        }
      }}
    />
  );
}

export default SkipButton;
