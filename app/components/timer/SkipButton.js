import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { IconButton } from "../buttons";
import timerActions from "../../actions/timerActions";
import { useSettings } from "../../contexts/SettingsContext";

function SkipButton({ shouldSkipForward, dispatch, active = true }) {
  const { theme } = useSettings();

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
