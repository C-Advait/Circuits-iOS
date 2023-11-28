import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useAppContext } from "../../contexts/AppContext";
import { WheelPicker } from 'react-native-wheel-picker-android';

const MINIMUM_SECONDS = 5;
const ITEM_FONT_SIZE = 18;

const TimeWheelPicker = ({
  startingTime = 60,
  onValueChange,
  increment5Seconds = false,
}) => {
  const { theme } = useAppContext();
  const styles = getStyles(theme);

  // These are indices.
  const [selectedMinute, setSelectedMinute] = useState(
    Math.floor(startingTime / 60),
  );
  const [selectedSecond, setSelectedSecond] = useState(startingTime % 60);

  const items = [...Array(60).keys()].map(String);  // Convert to string array
  const [filteredSeconds, setFilteredSeconds] = useState(
    increment5Seconds
      ? items.filter((value) => parseInt(value) % 5 === 0)
      : startingTime >= 60
        ? items
        : items.slice(5),
  );

  const handleMinuteChange = (index) => {
    const minuteValue = parseInt(items[index]);
    onValueChange(minuteValue * 60 + selectedSecond);
    setSelectedMinute(minuteValue);

    if (minuteValue === 0 && !increment5Seconds) {
      // Min 5s requirement if incrementFiveSeconds === false
      setFilteredSeconds(items.slice(MINIMUM_SECONDS)); // starts from ' 5'

      if (selectedSecond < MINIMUM_SECONDS) {
        // Move to legal range
        setSelectedSecond(MINIMUM_SECONDS);
        onValueChange(minuteValue * 60 + MINIMUM_SECONDS);
      }
    } else {
      increment5Seconds
        ? setFilteredSeconds(items.filter((value) => value % 5 === 0))
        : setFilteredSeconds(items); // reset to the full range
    }
  }

  const handleSecondChange = (index) => {
    const secondValue = parseInt(filteredSeconds[index]);
    console.log(`handling second change. index: ${index} secondValue: ${secondValue}`);

    setSelectedSecond(secondValue);
    onValueChange(selectedMinute * 60 + secondValue);
  };

  const getInitialSeconds = () => {
    if (increment5Seconds) {
      return Math.floor((startingTime % 60) / 5)
    } else if (filteredSeconds.length < 60) {
      return startingTime % 60 - MINIMUM_SECONDS
    } else {
      return startingTime % 60;
    }
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      <WheelPicker
        data={items}
        initPosition={Math.floor(startingTime / 60)}
        onItemSelected={handleMinuteChange}
        selectedItemTextColor={theme.primary}
        selectedItemTextSize={ITEM_FONT_SIZE}
        itemTextSize={ITEM_FONT_SIZE}
        style={styles.wheelPicker}
      />
      <WheelPicker
        data={filteredSeconds}
        initPosition={getInitialSeconds()}
        onItemSelected={handleSecondChange}
        selectedItemTextColor={theme.primary}
        selectedItemTextSize={ITEM_FONT_SIZE}
        itemTextSize={ITEM_FONT_SIZE}
        style={styles.wheelPicker}
      />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    overlay: {
      position: "absolute",
      borderRadius: 8,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      height: 32,
      top: "35%",
      width: "100%",
      zIndex: 3,
    },
    unit: {
      fontSize: 17,
      color: theme.primary,
    },
    wheelPicker: {
      height: 200,
      width: 125,
      alignSelf: "center",
    },
  });

export default TimeWheelPicker;
