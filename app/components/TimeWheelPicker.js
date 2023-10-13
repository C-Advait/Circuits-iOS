import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const UNIT_OFFSET = 48;
const GAP_REDUCTION = 50;
// Offsetting the seconds by GAP + UNIT is just a hair off.
const ADJUSTMENT = 2;

// Theme must be passed in by consumer.
// This is because the current component
// is only ever consumed by components wrapped
// in <Portal>. <Portal> is known to not work
// with context.
const TimeWheelPicker = ({
  theme,
  selectedMinute,
  setSelectedMinute,
  selectedSecond,
  setSelectedSecond,
}) => {
  const styles = getStyles(theme);

  const items = [...Array(60).keys()].map((i) =>
    i < 10 ? ` ${i}` : i.toString(),
  );

  const [filteredSeconds, setFilteredSeconds] = useState(items.slice(5));

  const key = filteredSeconds.length;

  return (
    <View style={styles.container}>
      <View style={styles.pickersContainer}>
        <View style={styles.overlay} />
        <Picker
          selectedValue={selectedMinute}
          style={styles.minutesPicker}
          selectionColor={theme.tertiaryTranslucentBackground}
          onValueChange={(itemValue) => {
            setSelectedMinute(itemValue);
            if (itemValue === " 0") {
              setFilteredSeconds(items.slice(5)); // starts from '05'
              if (parseInt(selectedSecond) < 5) {
                setSelectedSecond(" 5");
              }
            } else {
              setFilteredSeconds(items); // reset to the full range
            }
          }}
          color={theme.primary}
          itemStyle={{
            color: theme.primary,
            backgroundColor: "transparent",
          }}
        >
          {items.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
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
          onValueChange={(itemValue) => setSelectedSecond(itemValue)}
          itemStyle={{ color: theme.primary }}
        >
          {filteredSeconds.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
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
