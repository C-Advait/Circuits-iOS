import React from "react";
import { StyleSheet, View } from "react-native";
import { useAppContext } from "../../contexts/AppContext";
import { WheelPicker } from "react-native-wheel-picker-android";

const items = [...Array(99).keys()].map((i) => String(i + 1).padStart(2, " "));
const ITEM_FONT_SIZE = 18;

function NumberWheelPicker({ number, onValueChange }) {
  const { theme } = useAppContext();

  const handleItemSelected = (index) => {
    const newNumber = parseInt(items[index]);
    onValueChange(newNumber);
  }

  return (
    <View style={styles.pickerContainer}>
      <WheelPicker
        data={items}
        initPosition={number}
        onItemSelected={handleItemSelected}
        selectedItemTextColor={theme.primary}
        selectedItemTextSize={ITEM_FONT_SIZE}
        itemTextSize={ITEM_FONT_SIZE}
        style={styles.wheelPicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  wheelPicker: {
    height: 200,
    width: 125,
    alignSelf: "center",
  },
});

export default NumberWheelPicker;
