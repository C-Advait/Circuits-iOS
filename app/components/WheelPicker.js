import React from "react";

import { StyleSheet, Text, View } from "react-native";
import { DatePicker } from "react-native-wheel-pick-2";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { useSettings } from "../contexts/ThemeContext";

const MODAL_HEIGHT = 390;

function WheelPicker() {
  const { theme } = useSettings();
  const styles = getStyles(theme);

  return (
    <BottomSheet
      index={1}
      snapPoints={[MODAL_HEIGHT, MODAL_HEIGHT]}
      enablePanDownToClose={true}
      backdropComponent={BottomSheetBackdrop}
      backgroundStyle={{ backgroundColor: theme.tertiaryBackground }}
      handleIndicatorStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        width: 90,
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Warmup</Text>
        <Text style={styles.subtitle}>Duration of the something or other.</Text>
      </View>
      <DatePicker
        style={styles.picker}
        mode="countdown"
        textColor={theme.primary}
        selectedValue="item4"
        // pickerData={['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7']}
        onDateChange={(value) => {
          console.log(value);
        }}
      />
      <View>
        <Text>This is where the cancel and apply will go</Text>
      </View>
    </BottomSheet>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    header: {
      paddingBottom: 18,
      paddingHorizontal: 22,
      paddingTop: 12,
    },
    picker: {
      backgroundColor: "#333",
      width: "100%",
      height: 215,
      alignSelf: "center",
    },
    subtitle: {
      color: theme.text,
      fontSize: 17,
    },
    title: {
      color: theme.primary,
      fontSize: 17,
      fontWeight: 500,
    },
  });

export default WheelPicker;
