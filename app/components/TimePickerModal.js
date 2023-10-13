import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { useTheme } from "../contexts/ThemeContext";
import TimeWheelPicker from "./TimeWheelPicker";

const MODAL_HEIGHT = 390;

function TimePicker() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BottomSheet
      index={1}
      snapPoints={[MODAL_HEIGHT, MODAL_HEIGHT]}
      enablePanDownToClose={true}
      backdropComponent={BottomSheetBackdrop}
      backgroundStyle={{ backgroundColor: theme.tertiaryBackground }}
      handleStyle={{
        backgroundColor: theme.secondaryBackground,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleIndicatorStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        width: 90,
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Warmup</Text>
        <Text style={styles.subtitle}>Duration of the something or other.</Text>
      </View>
      <TimeWheelPicker />
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => console.log("Cancel")}
            color={theme.primary}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Apply"
            onPress={() => console.log("Apply")}
            color={theme.blue}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    buttonContainer: {
      marginHorizontal: 16,
      marginTop: 12,
    },
    footer: {
      backgroundColor: theme.secondaryBackground,
      bottom: 0,
      flexDirection: "row",
      height: 65,
      justifyContent: "space-between",
      position: "absolute",
      width: "100%",
    },
    header: {
      backgroundColor: theme.secondaryBackground,
      paddingBottom: 18,
      paddingHorizontal: 22,
      paddingTop: 10,
      gap: 2,
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

export default TimePicker;
