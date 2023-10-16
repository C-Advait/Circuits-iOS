import React, { useState, useRef } from "react";

import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import TimeWheelPicker from "./TimeWheelPicker";
import InputModal from "./InputModal";

function TimePickerModal({
  startingMinute = "10",
  startingSecond = " 0",
  enabled = true,
  promptTitle,
  promptSubtitle,
  data,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const modalRef = useRef(null);

  const [selectedMinute, setSelectedMinute] = useState(startingMinute);
  const [selectedSecond, setSelectedSecond] = useState(startingSecond);

  const [previousMinute, setPreviousMinute] = useState();
  const [previousSecond, setPreviousSecond] = useState();

  const [applyFlag, setApplyFlag] = useState(false);

  // Required to listen to state changes in
  // other pickers.
  if (data) {
    enabled = data !== " 1";
  }

  const onModalChange = (isOpen) => {
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
  };

  const onCancel = () => {
    setSelectedMinute(previousMinute);
    setSelectedSecond(previousSecond);
    modalRef.current?.close();
  };

  const onApply = () => {
    setApplyFlag(true);
    modalRef.current?.close();
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => (enabled ? modalRef.current?.expand() : null)}
        style={styles.touchable}
      >
        <Text style={enabled ? styles.active : styles.disabled}>
          {`${selectedMinute}m ${selectedSecond}s`}
        </Text>
      </TouchableOpacity>

      <InputModal
        onChange={onModalChange}
        onCancel={onCancel}
        onApply={onApply}
        promptTitle={promptTitle}
        promptSubitle={promptSubtitle}
        ref={modalRef}
      >
        <TimeWheelPicker
          theme={theme}
          selectedMinute={selectedMinute}
          setSelectedMinute={setSelectedMinute}
          selectedSecond={selectedSecond}
          setSelectedSecond={setSelectedSecond}
        />
      </InputModal>
    </>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    active: {
      color: theme.primary,
      fontSize: 15,
    },
    disabled: {
      color: theme.textDisabled,
      fontSize: 15,
    },
    touchable: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
  });

export default TimePickerModal;
