import React from "react";
import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../contexts/ThemeContext";

const items = [...Array(99).keys()].map((i) =>
  i < 10 ? ` ${i + 1}` : (i + 1).toString(),
);

function NumberWheelPicker({ number, onValueChange }) {
  const { theme } = useTheme();

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={number}
        style={styles.picker}
        selectionColor={theme.tertiaryTranslucentBackground}
        onValueChange={onValueChange}
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
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    alignItems: "center",
  },
  picker: {
    color: "white",
    width: 300,
    height: 120,
  },
});

export default NumberWheelPicker;
