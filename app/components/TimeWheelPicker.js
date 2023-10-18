import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../contexts/ThemeContext";

const UNIT_OFFSET = 48;
const GAP_REDUCTION = 50;
// Offsetting the seconds by GAP + UNIT is just a hair off.
const ADJUSTMENT = 2;

// Theme must be passed in by consumer.
// This is because the current component
// is only ever consumed by components wrapped
// in <Portal>. <Portal> is known to not work
// with context.
const TimeWheelPicker = ({ startingTime = 60, onValueChange }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const items = [...Array(60).keys()];

  const [selectedMinute, setSelectedMinute] = useState(
    Math.floor(startingTime / 60),
  );
  const [selectedSecond, setSelectedSecond] = useState(startingTime % 60);
  const [filteredSeconds, setFilteredSeconds] = useState(items.slice(5));
  const key = filteredSeconds.length;
  console.log("key: ", key);

  return (
    <View style={styles.container}>
      <View style={styles.pickersContainer}>
        <View style={styles.overlay} />
        <Picker
          selectedValue={selectedMinute}
          style={styles.minutesPicker}
          selectionColor={theme.tertiaryTranslucentBackground}
          onValueChange={(itemValue) => {
            console.log("itemValue: ", itemValue);
            setSelectedMinute(itemValue);
            if (itemValue === 0) {
              setFilteredSeconds(items.slice(5)); // starts from ' 5'
              if (selectedSecond < 5) {
                setSelectedSecond(5);
              }
            } else {
              console.log(
                "itemValue isn't 0, reset filteredSeconds to items (length ",
                items.length,
                ")",
              );
              setFilteredSeconds(items); // reset to the full range
            }
            onValueChange(itemValue * 60 + selectedSecond);
          }}
          color={theme.primary}
          itemStyle={{
            color: theme.primary,
            backgroundColor: "transparent",
          }}
        >
          {items.map((item) => (
            <Picker.Item
              key={item}
              label={item.toString().padStart(2, " ")}
              value={item}
            />
          ))}
        </Picker>
        <View style={styles.unitContainer} pointerEvents="none">
          <Text style={styles.unit}>min</Text>
        </View>
        <Picker
          key={key}
          selectedValue={selectedSecond}
          style={styles.secondsPicker}
          selectionColor={theme.tertiaryTranslucentBackground}
          onValueChange={(itemValue) => {
            setSelectedSecond(itemValue);
            onValueChange(selectedMinute * 60 + itemValue);
          }}
          itemStyle={{ color: theme.primary }}
        >
          {filteredSeconds.map((item) => (
            <Picker.Item
              key={item}
              label={item.toString().padStart(2, " ")}
              value={item}
            />
          ))}
        </Picker>
        <View
          style={[
            styles.unitContainer,
            {
              transform: [
                { translateX: -(GAP_REDUCTION + UNIT_OFFSET + ADJUSTMENT) },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.unit}>sec</Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    overlay: {
      position: "absolute",
      borderRadius: 8,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      height: 32,
      width: "80%",
      top: "77%",
      left: "18%",
      zIndex: 3,
    },
    minutesPicker: {
      color: "white",
      width: 130,
      height: 120,
    },
    pickersContainer: {
      flexDirection: "row",
      width: "60%",
      height: "100%",
      marginRight: "8%",
    },
    secondsPicker: {
      width: 130,
      height: 120,
      transform: [{ translateX: -GAP_REDUCTION }],
    },
    unitContainer: {
      backgroundColor: theme.tertiaryBackground,
      height: 80,
      justifyContent: "center",
      top: 68,
      transform: [{ translateX: -UNIT_OFFSET }],
      zIndex: 2,
    },
    unit: {
      fontSize: 17,
      color: theme.primary,
    },
  });

export default TimeWheelPicker;
