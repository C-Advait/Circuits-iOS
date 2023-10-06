import React from "react";
import { Button } from "react-native";

function PlayPause({ isPlaying, setIsPlaying }) {
  return (
    <Button
      title={isPlaying ? "Pause" : "Play"}
      onPress={() => setIsPlaying((prev) => !prev)}
    />
  );
}

export default PlayPause;
