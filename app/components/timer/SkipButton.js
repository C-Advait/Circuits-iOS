import React from "react";
import { Button } from "react-native";

function SkipButton({ shouldSkipForward }) {
  return (
    <Button
      title={shouldSkipForward ? "Next" : "Previous"}
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
