import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSettings } from "../../contexts/SettingsContext";

const { width } = Dimensions.get("window");

const UNIT_OFFSET = width * 0.21;
const GAP_REDUCTION = width * 0.2;
const ADJUSTMENT = -6;

const MINIMUM_SECONDS = 5;

// Theme must be passed in by consumer.
// This is because the current component
// is only ever consumed by components wrapped
// in <Portal>. <Portal> is known to not work
// with context.
const TimeWheelPicker = ({ startingTime = 60, onValueChange, increment5Seconds = false }) => {
  const { theme } = useSettings();
  const styles = getStyles(theme);

  const items = [...Array(60).keys()];

  const [selectedMinute, setSelectedMinute] = useState(
    Math.floor(startingTime / 60),
  );
  const [selectedSecond, setSelectedSecond] = useState(startingTime % 60);
  const [filteredSeconds, setFilteredSeconds] = useState(
    increment5Seconds ? items.filter(value => value % 5 === 0) :
      startingTime >= 60 ? items : items.slice(5),
  );
  const key = filteredSeconds.length;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.pickersContainer}>
        <View style={styles.overlay} />
        <Picker
          selectedValue={selectedMinute}
          selectionColor={theme.tertiaryTranslucentBackground}
          style={styles.minutesPicker}
          onValueChange={(itemValue) => {
            onValueChange(itemValue * 60 + selectedSecond);
            setSelectedMinute(itemValue);

            if (itemValue === 0 && !increment5Seconds) { // Min 5s requirement if incrementFiveSeconds === false
              setFilteredSeconds(items.slice(MINIMUM_SECONDS)); // starts from ' 5'

              if (selectedSecond < MINIMUM_SECONDS) {
                // Move to legal range
                setSelectedSecond(MINIMUM_SECONDS);
                onValueChange(itemValue * 60 + MINIMUM_SECONDS);
              }
            } else {
              increment5Seconds ? setFilteredSeconds(items.filter(value => value % 5 === 0)) : setFilteredSeconds(items) // reset to the full range
            }
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
          <Text style={styles.unit} pointerEvents="none">
            min
          </Text>
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
          <Text style={styles.unit} pointerEvents="none">
            sec
          </Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
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
    minutesPicker: {
      color: "white",
      width: "60%",
      height: 120,
    },
    pickersContainer: {
      flexDirection: "row",
      width: "85%",
      height: "100%",
    },
    secondsPicker: {
      width: "55%",
      height: 120,
      transform: [{ translateX: -GAP_REDUCTION }],
    },
    unitContainer: {
      // backgroundColor: theme.tertiaryBackground,
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
