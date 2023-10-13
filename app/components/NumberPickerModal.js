import React, { useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import NumberWheelPicker from "./NumberWheelPicker";

import { useTheme } from "../contexts/ThemeContext";
import InputModal from "./InputModal";

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
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => modalRef.current?.expand()}
        style={styles.touchable}
      >
        <Text style={styles.text}>{number}</Text>
      </TouchableOpacity>

      <InputModal
        onChange={onModalChange}
        onCancel={onCancel}
        onApply={onApply}
        promptTitle={promptTitle}
        promptSubtitle={promptSubtitle}
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
    text: {
      color: theme.primary,
      fontSize: 15,
    },
    touchable: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
  });

export default NumberPickerModal;
