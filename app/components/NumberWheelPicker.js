import React from "react";
import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

const items = [...Array(99).keys()].map((i) =>
  i < 10 ? ` ${i + 1}` : (i + 1).toString(),
);

function NumberWheelPicker({ number, setNumber, theme }) {
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={number}
        style={styles.picker}
        selectionColor={theme.tertiaryTranslucentBackground}
        onValueChange={(itemValue) => setNumber(itemValue)}
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
