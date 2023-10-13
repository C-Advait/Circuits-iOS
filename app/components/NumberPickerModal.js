import React, { useState, useEffect, useRef } from "react";
import { Button, View, StyleSheet, Text } from "react-native";
import NumberWheelPicker from "./NumberWheelPicker";
import { Portal } from "react-native-portalize";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useTheme } from "../contexts/ThemeContext";

const MODAL_HEIGHT = 390;

function NumberPickerModal({
  promptTitle,
  promptSubtitle,
  startingNumber = " 1",
  onApply,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [number, setNumber] = useState(startingNumber);
  const [previousNumber, setPreviousNumber] = useState();

  const modalRef = useRef(null);
  const [applyFlag, setApplyFlag] = useState(false);

  // useEffect(() => {
  //   console.log("Inside useEffect: ", number)
  //   onValueChange?.(number);
  // }, [number])

  return (
    <>
      <Text
        style={styles.activationButton}
        onPress={() => modalRef.current?.expand()}
      >
        {number}
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
              setPreviousNumber(number);
            } else if (applyFlag) {
              setApplyFlag(false);
            } else {
              setNumber(previousNumber);
            }
          }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{promptTitle}</Text>
            <Text style={styles.subtitle}>{promptSubtitle}</Text>
          </View>
          <NumberWheelPicker
            number={number}
            setNumber={setNumber}
            theme={theme}
          />
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => {
                  setNumber(previousNumber);
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
                  onApply(number);
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

export default NumberPickerModal;
