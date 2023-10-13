import React, { useState, useEffect, useRef } from "react";
import { Button, View, StyleSheet, Text } from "react-native";
import NumberWheelPicker from "./NumberWheelPicker";
import { Portal } from "react-native-portalize";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useTheme } from "../contexts/ThemeContext";
import InputModal from "./InputModal";

const MODAL_HEIGHT = 390;

function NumberPickerModal({
  promptTitle,
  promptSubtitle,
  startingNumber = " 1",
  onSubmit,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [number, setNumber] = useState(startingNumber);
  const [previousNumber, setPreviousNumber] = useState();

  const modalRef = useRef(null);
  const [applyFlag, setApplyFlag] = useState(false);

  onModalChange = (isOpen) => {
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
  };

  onCancel = () => {
    setNumber(previousNumber);
    modalRef.current?.close();
  };

  onApply = () => {
    setApplyFlag(true);
    onSubmit(number);
    modalRef.current?.close();
  };

  return (
    <>
      <Text
        style={styles.activationButton}
        onPress={() => modalRef.current?.expand()}
      >
        {number}
      </Text>

      <InputModal
        onChange={onModalChange}
        onCancel={onCancel}
        onApply={onApply}
        promptTitle={promptTitle}
        promptSubitle={promptSubtitle}
        ref={modalRef}
      >
        <NumberWheelPicker
          number={number}
          setNumber={setNumber}
          theme={theme}
        />
      </InputModal>
    </>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    activationButton: {
      color: theme.primary,
      fontSize: 15,
    },
  });

export default NumberPickerModal;
