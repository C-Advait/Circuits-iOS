import React, { useEffect, useState, useReducer, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";

import { Text, Button } from "react-native";

import Screen from "../components/Screen";
import Navheader from "../components/NavHeader";
import { IconButton } from "../components/buttons";
import { useTheme } from "../contexts/ThemeContext";
import routes from "../navigation/routes";
import AuxilaryCard from "../components/AuxiliaryCard";
import TimePickerModal from "../components/TimePickerModal";
import NumberPickerModal from "../components/NumberPickerModal";

import Receiver from "../events/Receiver";
import AppTextButton from "../components/buttons/AppTextButton";
import { useRoutineContext } from "../contexts/RoutineContext";
import EditableText from "../components/EditableText";
import {
  extractStartingPickerTime,
  extractStartingRounds,
} from "../utilities/extractStartingPickerValue";
import eventManager from "../events/eventManager";
import exerciseEditActions from "../actions/exerciseEditActions";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import NumberWheelPicker from "../components/NumberWheelPicker";

const MODAL_HEIGHT = 350;

function ExerciseEditScreen({ route }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { isRoutineEditing, isExerciseEditing, originalExercise } =
    route.params;

  const { contextExercises, setContextExercises } = useRoutineContext();
  const [exercise, setExercise] = useState(originalExercise);

  const [state, dispatch] = useReducer(reducer, initialState);

  const MODAL_CONTENT_ENUM = {
    NONE: "NONE",
    ROUNDS: {
      key: "numberOfRounds",
      title: "Number of rounds",
      subtitle: "Repetitions of the current exercise.",
    },
  };

  useEffect(() => {
    dispatch({ type: exerciseEditActions.INIT, params: originalExercise });
  }, []);

  const modalRef = useRef(null);

  const [contentType, setContentType] = useState(MODAL_CONTENT_ENUM.NONE);

  onModalChange = (isOpen) => {
    // If opening BottomSheet, save
    // values to which to revert when
    // cancelling.
    if (isOpen === 1) {
      dispatch({
        type: exerciseEditActions.SET_PREVIOUS,
        data: state[state.activeKey],
      });
    } else if (state.apply) {
      dispatch({ type: exerciseEditActions.TOGGLE_APPLY_FLAG });
    } else {
      dispatch({ type: exerciseEditActions.REVERT_PREVIOUS });
    }
  };

  return (
    <Screen style={{ flex: 1 }}>
      <Navheader
        style={styles.navPanel}
        LeftComponent={
          <IconButton
            iconName={"chevron-left"}
            IconFamily={Feather}
            iconSize={52}
            foregroundColor={theme.blue}
            onPress={() =>
              navigation.navigate(routes.ROUTINE_EDIT_SCREEN, {
                edit: isRoutineEditing,
              })
            }
          />
        }
        headerText={`Edit ${state.title}`}
        RightComponent={
          state.dirty ? (
            <AppTextButton
              onPress={() => handleSaveOnPress()}
              textStyle={{ fontWeight: "500" }}
            >
              {isExerciseEditing ? "Save" : "Create"}
            </AppTextButton>
          ) : null
        }
      />
      <View style={{ gap: 10, paddingHorizontal: 11 }}>
        <AuxilaryCard
          editable={false}
          bold={false}
          title={"Number of rounds"}
          InputComponent={() => (
            <Text
              style={{ color: "white" }}
              onPress={() => {
                dispatch({
                  type: exerciseEditActions.SET_ACTIVE_KEY,
                  key: MODAL_CONTENT_ENUM.ROUNDS.key,
                });
                dispatch({ type: exerciseEditActions.SET_PREVIOUS });
                setContentType(MODAL_CONTENT_ENUM.ROUNDS);
                modalRef.current?.expand();
              }}
            >
              {state.numberOfRounds}
            </Text>
          )}
        />
      </View>
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
        onChange={onModalChange}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{contentType.title}</Text>
          <Text style={styles.subtitle}>{contentType.subtitle}</Text>
        </View>
        {contentType.key === MODAL_CONTENT_ENUM.ROUNDS.key && (
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
        )}
        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => {
                dispatch({ type: exerciseEditActions.REVERT_PREVIOUS });
                modalRef.current?.close();
              }}
              color={theme.primary}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Apply"
              onPress={() => {
                dispatch({ type: exerciseEditActions.TOGGLE_APPLY_FLAG });
                modalRef.current?.close();
              }}
              color={theme.blue}
            />
          </View>
        </View>
      </BottomSheet>
    </Screen>
  );
}

const initialState = {
  title: "",
  apply: false,
  activeKey: "",
  workTime: 0,
  numberOfRounds: 1,
  restBetweenRounds: 0,
  breakBeforeNext: 0,
  previous: null,
  dirty: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case exerciseEditActions.INIT:
      return { ...state, ...action.params };
    case exerciseEditActions.SET_ACTIVE_KEY:
      return { ...state, activeKey: action.key };
    case exerciseEditActions.SET_NUMBER_ROUNDS:
      return { ...state, numberOfRounds: action.numberOfRounds };
    case exerciseEditActions.SET_PREVIOUS:
      return { ...state, previous: action.data };
    case exerciseEditActions.REVERT_PREVIOUS:
      return { ...state, [state.activeKey]: state.previous };
    case exerciseEditActions.FLAG_DIRTY:
      return { ...state, dirty: true };
    case exerciseEditActions.TOGGLE_APPLY_FLAG:
      return { ...state, apply: !state.apply };
  }
};
// <View style={styles.tile}>
//   <Text style={{ color: "white" }}>Rounds</Text>
//   <Text
//     style={{ color: "white" }}
//     onPress={() => {
//       dispatch({
//         type: exerciseEditActions.SET_ACTIVE_KEY,
//         key: MODAL_CONTENT_ENUM.ROUNDS.key
//       })
//       dispatch({ type: exerciseEditActions.SET_PREVIOUS })
//       setContentType(MODAL_CONTENT_ENUM.ROUNDS);
//       modalRef.current?.expand();
//     }}>{state.numberOfRounds}</Text>
// </View>

// onChange={(isOpen) => onChange(isOpen)}

// <AuxilaryCard
//   editable={false}
//   bold={false}
//   title={"Name"}
//   InputComponent={() => (
//     <EditableText
//       exercise={exercise}
//       onSubmit={(text) => {
//         updateTitle(text);
//         setInfoChanged(true);
//       }}
//     />
//   )}
// />
// <AuxilaryCard
//   editable={false}
//   bold={false}
//   title={"Work time"}
//   InputComponent={() => {
//     const [startingMinute, startingSecond] = extractStartingPickerTime(
//       originalExercise,
//       "workTime",
//     );

//     return (
//       <TimePickerModal
//         promptTitle="Work time"
//         promptSubtitle="Duration of the work round."
//         startingMinute={startingMinute}
//         startingSecond={startingSecond}
//         onSubmit={(minutes, seconds) => {
//           handleWorkTimeUpdate(minutes, seconds);
//         }}
//       />
//     );
//   }}
// />
// <AuxilaryCard
//   editable={false}
//   bold={false}
//   title={"Number of rounds"}
//   InputComponent={() => (
//     <NumberPickerModal
//       promptTitle="Number of rounds"
//       promptSubtitle="Repetitions of the current exercise."
//       startingNumber={extractStartingRounds(originalExercise)}
//       state={state}
//       dispatch={dispatch}
//     />
//   )}
// />
// <AuxilaryCard
//   editable={false}
//   bold={false}
//   title={"Rest between rounds"}
//   InputComponent={() => {
//     const [startingMinute, startingSecond] = extractStartingPickerTime(
//       originalExercise,
//       "restBetweenRounds",
//       " 0",
//       "30",
//     );

//     return (
//       <Receiver>
//         <TimePickerModal
//           promptTitle="Rest"
//           promptSubtitle="Duration of rest between subsequent rounds."
//           startingMinute={startingMinute}
//           startingSecond={startingSecond}
//           enabled={parseInt(extractStartingRounds(originalExercise)) > 1}
//         />
//       </Receiver>
//     );
//   }}
// />
// <AuxilaryCard
//   editable={false}
//   bold={false}
//   title={"Break until next exercise"}
//   InputComponent={() => {
//     const [startingMinute, startingSecond] = extractStartingPickerTime(
//       originalExercise,
//       "breakBeforeNext",
//       " 0",
//       "30",
//     );

//     return (
//       <TimePickerModal
//         promptTitle="Break"
//         promptSubtitle="Duration of break before next exercise."
//         startingMinute={startingMinute}
//         startingSecond={startingSecond}
//       />
//     );
//   }}
// />

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
    subtitle: {
      color: theme.text,
      fontSize: 17,
    },
    tile: {
      backgroundColor: "#333",
      height: 50,
      width: "90%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      borderRadius: 10,
    },
    title: {
      color: theme.primary,
      fontSize: 17,
      fontWeight: 500,
    },
  });

export default ExerciseEditScreen;
