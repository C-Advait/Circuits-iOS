import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
      <View style={styles.overlay} />
      <Picker
        selectedValue={selectedMinute}
        style={styles.minutesPicker}
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
        selectionColor={theme.tertiaryTranslucentBackground}
        itemStyle={{
          color: theme.primary,
          backgroundColor: "transparent",
        }}
      >
        {items.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
      <View style={styles.unitContainer}>
        <Text style={styles.unit}>min</Text>
      </View>
      <Picker
        key={key}
        selectedValue={selectedSecond}
        style={styles.secondsPicker}
        onValueChange={(itemValue) => setSelectedSecond(itemValue)}
        selectionColor={theme.tertiaryTranslucentBackground}
        itemStyle={{ color: theme.primary }}
      >
        {filteredSeconds.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
      <View style={styles.unitContainer}>
        <Text style={styles.unit}>sec</Text>
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    overlay: {
      position: "absolute",
      borderRadius: 8,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      height: 32,
      width: "53%",
      top: "77%",
      left: "23%",
      zIndex: 3,
    },
    minutesPicker: {
      color: "white",
      width: 85,
      height: 120,
      paddingLeft: 0,
    },
    secondsPicker: {
      width: 85,
      height: 120,
    },
    unitContainer: {
      backgroundColor: theme.tertiaryBackground,
      height: 80,
      justifyContent: "center",
      padding: 5,
      top: 50,
      transform: [{ translateX: -30 }],
      zIndex: 2,
    },
    unit: {
      fontSize: 17,
      color: theme.primary,
    },
  });

export default TimeWheelPicker;
