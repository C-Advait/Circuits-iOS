import React, { useState, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Portal } from "react-native-portalize";

import { useTheme } from "../contexts/ThemeContext";
import TimeWheelPicker from "./TimeWheelPicker";

const MODAL_HEIGHT = 390;

function TimePickerModal({
  startingMinute = "10",
  startingSecond = " 0",
  enabled = true,
  promptTitle,
  promptSubtitle,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const modalRef = useRef(null);

  const [selectedMinute, setSelectedMinute] = useState(startingMinute);
  const [selectedSecond, setSelectedSecond] = useState(startingSecond);

  const [previousMinute, setPreviousMinute] = useState();
  const [previousSecond, setPreviousSecond] = useState();

  const [applyFlag, setApplyFlag] = useState(false);

  return (
    <>
      <Text
        style={enabled ? styles.activationButton : styles.disabledButton}
        onPress={() => (enabled ? modalRef.current?.expand() : null)}
      >
        {`${selectedMinute}m ${selectedSecond}s`}
      </Text>

      <Portal>
        <BottomSheet
          ref={modalRef}
          index={-1}
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
          onChange={(isOpen) => {
            // If opening BottomSheet, save
            // values to which to revert when
            // cancelling.
            if (isOpen === 1) {
              setPreviousMinute(selectedMinute);
              setPreviousSecond(selectedSecond);
            } else if (applyFlag) {
              setApplyFlag(false);
            } else {
              setSelectedMinute(previousMinute);
              setSelectedSecond(previousSecond);
            }
          }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{promptTitle}</Text>
            <Text style={styles.subtitle}>{promptSubtitle}</Text>
          </View>
          <TimeWheelPicker
            theme={theme}
            selectedMinute={selectedMinute}
            setSelectedMinute={setSelectedMinute}
            selectedSecond={selectedSecond}
            setSelectedSecond={setSelectedSecond}
          />
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => {
                  setSelectedMinute(previousMinute);
                  setSelectedSecond(previousSecond);
                  modalRef.current?.close();
                }}
                color={theme.primary}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Apply"
                onPress={() => {
                  setApplyFlag(true);
                  modalRef.current?.close();
                }}
                color={theme.blue}
              />
            </View>
          </View>
        </BottomSheet>
      </Portal>
    </>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    activationButton: {
      color: theme.primary,
      fontSize: 15,
    },
    buttonContainer: {
      marginHorizontal: 16,
      marginTop: 12,
    },
    disabledButton: {
      color: theme.textDisabled,
      fontSize: 15,
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

export default TimePickerModal;
