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
import TimeWheelPicker from "../components/TimeWheelPicker";
import { formatMinutesSeconds } from "../utilities/formatDuration";

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
    WORK_TIME: {
      key: "workTime",
      title: "Work time",
      subtitle: "Duration of the work round.",
    },
  };

  useEffect(() => {
    dispatch({ type: exerciseEditActions.INIT, payload: originalExercise });
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
        payload: state[state.activeKey],
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
          title={"Work time"}
          InputComponent={() => (
            <Text
              style={{ color: "white" }}
              onPress={() => {
                dispatch({
                  type: exerciseEditActions.SET_ACTIVE_KEY,
                  payload: MODAL_CONTENT_ENUM.WORK_TIME.key,
                });
                dispatch({ type: exerciseEditActions.SET_PREVIOUS });
                setContentType(MODAL_CONTENT_ENUM.WORK_TIME);
                modalRef.current?.expand();
              }}
            >
              {formatMinutesSeconds(state.workTime)}
            </Text>
          )}
        />
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
                  payload: MODAL_CONTENT_ENUM.ROUNDS.key,
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
            onValueChange={(data) =>
              dispatch({
                type: exerciseEditActions.SET_ROUNDS,
                payload: data,
              })
            }
          />
        )}
        {contentType.key === MODAL_CONTENT_ENUM.WORK_TIME.key && (
          <TimeWheelPicker
            key={state.workTime}
            startingTime={state.workTime}
            onValueChange={(data) =>
              dispatch({
                type: exerciseEditActions.SET_WORK_TIME,
                payload: data,
              })
            }
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
      return { ...state, ...action.payload };

    case exerciseEditActions.SET_ACTIVE_KEY:
      return { ...state, activeKey: action.payload };

    case exerciseEditActions.SET_WORK_TIME:
      return { ...state, workTime: action.payload };

    case exerciseEditActions.SET_BREAK:
      return { ...state, breakBeforeNext: action.payload };

    case exerciseEditActions.SET_ROUNDS:
      return { ...state, numberOfRounds: action.payload };

    case exerciseEditActions.TITLE:
      return { ...state, title: action.payload };

    case exerciseEditActions.SET_PREVIOUS:
      console.log(
        "setting previous",
        "activeKey",
        state.activeKey,
        "payload: ",
        action.payload,
      );
      return { ...state, previous: action.payload };

    case exerciseEditActions.REVERT_PREVIOUS:
      console.log(
        "reverting",
        "activeKey",
        state.activeKey,
        "payload: ",
        action.payload,
      );
      return { ...state, [state.activeKey]: state.previous };

    case exerciseEditActions.FLAG_DIRTY:
      return { ...state, dirty: true };

    case exerciseEditActions.TOGGLE_APPLY_FLAG:
      return { ...state, apply: !state.apply };
  }
};

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
