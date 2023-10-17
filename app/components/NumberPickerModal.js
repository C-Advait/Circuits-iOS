import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import NumberWheelPicker from "./NumberWheelPicker";

import { useTheme } from "../contexts/ThemeContext";
import InputModal from "./InputModal";
import eventManager from "../events/eventManager";
import exerciseEditActions from "../actions/exerciseEditActions";

function NumberPickerModal({
  promptTitle,
  promptSubtitle,
  startingNumber = " 1",
  state,
  dispatch,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // const [number, setNumber] = useState(startingNumber);
  const [previousNumber, setPreviousNumber] = useState();

  const modalRef = useRef(null);
  const [applyFlag, setApplyFlag] = useState(false);

  // useEffect(() => {
  //   console.log("about to emit from numberpicker", number);
  //   eventManager.emit("numberOfRounds", number);
  // }, [number]);

  onModalChange = (isOpen) => {
    // If opening BottomSheet, save
    // values to which to revert when
    // cancelling.
    if (isOpen === 1) {
      setPreviousNumber(state.numberOfRounds);
    } else if (applyFlag) {
      setApplyFlag(false);
    } else {
      dispatch({
        type: exerciseEditActions.SET_NUMBER_ROUNDS,
        numberOfRounds: previousNumber,
      });
    }
  };

  onCancel = () => {
    dispatch({
      type: exerciseEditActions.SET_NUMBER_ROUNDS,
      numberOfRounds: previousNumber,
    });
    modalRef.current?.close();
  };

  onApply = () => {
    setApplyFlag(true);
    // onSubmit(number);
    modalRef.current?.close();
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => modalRef.current?.expand()}
        style={styles.touchable}
      >
        <Text style={styles.text}>{state.numberOfRounds}</Text>
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
          number={state.numberOfRounds}
          onValueChange={(n) =>
            dispatch({
              type: exerciseEditActions.SET_NUMBER_ROUNDS,
              numberOfRounds: n,
            })
          }
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
