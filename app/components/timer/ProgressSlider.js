import React, { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";

import parseTime from "../../utilities/parseTime";
import { useTheme } from "../../contexts/ThemeContext";

function ProgressSlider({ elapsed, total }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <>
      <Slider
        containerStyle={{ height: 20 }}
        disabled={true}
        thumbStyle={styles.thumbStyle}
        minimumTrackStyle={styles.leftTrack}
        maximumTrackStyle={styles.rightTrack}
        value={elapsed / total}
      />
      <View style={styles.timeBox}>
        <Text style={styles.time}>{parseTime(Math.round(elapsed))}</Text>
        <Text style={styles.time}>
          -{parseTime(Math.round(total - elapsed))}
        </Text>
      </View>
    </>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    leftTrack: {
      backgroundColor: theme.secondary,
    },
    rightTrack: {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
    },
    thumbStyle: {
      backgroundColor: "transparent",
      width: 6,
      height: 10,
    },
    time: {
      fontSize: 13,
      color: theme.secondary,
    },
    timeBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
  });

export default ProgressSlider;
