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
import AuxiliaryCard from "../components/AuxiliaryCard";

import AppTextButton from "../components/buttons/AppTextButton";
import EditableText from "../components/EditableText";
import exerciseEditActions from "../actions/exerciseEditActions";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import NumberWheelPicker from "../components/NumberWheelPicker";
import TimeWheelPicker from "../components/TimeWheelPicker";
import { formatMinutesSeconds } from "../utilities/formatDuration";

import { EXERCISE_EDIT_MODAL } from "../config/ExerciseModalConfig";
import { confirmedNavigate } from "../alerts/discardExerciseEdits";
import { Exercise } from "../classes/Exercise";

const MODAL_HEIGHT = 350;

function ExerciseEditScreen({ route }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { isRoutineEditing, isExerciseEditing, referenceExercise: originalExercise } =
    route.params;

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: exerciseEditActions.INIT,
      payload: { ...originalExercise },
    });
  }, []);

  const modalRef = useRef(null);

  const [contentType, setContentType] = useState(EXERCISE_EDIT_MODAL.ROUNDS);

  const onModalChange = (isOpen) => {
    if (isOpen === 1) {
      // Opening modal; save value to which to possibly revert.
      dispatch({
        type: exerciseEditActions.SET_PREVIOUS,
        payload: state[state.activeKey],
      });
    } else {
      // Closing modal
      dispatch({ type: exerciseEditActions.TOGGLE_REFRESH_PICKER });

      // Either persist the change or revert it.
      if (state.apply) {
        dispatch({ type: exerciseEditActions.TOGGLE_APPLY_FLAG });
      } else {
        dispatch({ type: exerciseEditActions.REVERT_PREVIOUS });
      }
    }
  };

  // const onSave = () => {
  //   const exercise = new Exercise({
  //     ...originalExercise,
  //     workTime: state.workTime,
  //     numberOfRounds: state.numberOfRounds,
  //     restBetweenRounds: state.restBetweenRounds,
  //     breakBeforeNext: state.breakBeforeNext,
  //     title: state.title,
  //   });

  //   Object.assign(originalExercise, exercise);
  //   navigation.navigate(routes.ROUTINE_EDIT_SCREEN, { edit: isRoutineEditing });
  // };

  const InputModalButton = ({ text, contentKey, enabled = true }) => (
    <Text
      style={enabled ? styles.inputText : styles.disabled}
      onPress={
        enabled
          ? () => {
            dispatch({
              type: exerciseEditActions.SET_ACTIVE_KEY,
              payload: EXERCISE_EDIT_MODAL[contentKey]?.key,
            });
            dispatch({ type: exerciseEditActions.SET_PREVIOUS });
            dispatch({ type: exerciseEditActions.TOGGLE_REFRESH_PICKER });
            setContentType(EXERCISE_EDIT_MODAL[contentKey]);
            modalRef.current?.expand();
          }
          : () => null
      }
    >
      {text}
    </Text>
  );

  const goBack = () => navigation.navigate(routes.ROUTINE_EDIT_SCREEN, { edit: isRoutineEditing });

  const onSave = () => {
    const exercise = new Exercise({
      ...originalExercise,
      workTime: state.workTime,
      numberOfRounds: state.numberOfRounds,
      restBetweenRounds: state.restBetweenRounds,
      breakBeforeNext: state.breakBeforeNext,
      title: state.title,
    });

    Object.assign(originalExercise, exercise);

    if (!isExerciseEditing) { // Only trigger on a new exercise

      // Must update exerciseOrder of cooldown exercise to + 1
      const cooldown = contextExercises.find(ex => ex.tag === Tag.POSTROUTINE);
      if (cooldown && cooldown.exerciseOrder <= originalExercise.exerciseOrder) {
        cooldown.exerciseOrder = originalExercise.exerciseOrder + 1;
      }

      // Append to context array
      setContextExercises([...contextExercises, originalExercise]);
    }
  };

  const confirmDiscard = () => confirmedNavigate(goBack);

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
            onPress={state.dirty ? confirmDiscard : goBack}
          />
        }
        headerText={`Edit ${state.title}`}
        RightComponent={
          state.dirty ? (
            <AppTextButton onPress={onSave} textStyle={{ fontWeight: 300 }}>
              {isExerciseEditing ? "Save" : "Create"}
            </AppTextButton>
          ) : null
        }
      />
      <View style={{ gap: 10, paddingHorizontal: 11 }}>
        <AuxiliaryCard title="Name">
          <EditableText
            original={state.title}
            placeholder="Exercise Name"
            onSubmit={(text) => {
              dispatch({
                type: exerciseEditActions.SET_TITLE,
                payload: text,
              });
            }}
          />
        </AuxiliaryCard>
        <AuxiliaryCard title="Work time">
          <InputModalButton
            text={formatMinutesSeconds(state.workTime)}
            contentKey="WORK_TIME"
          />
        </AuxiliaryCard>
        <AuxiliaryCard title="Number of rounds">
          <InputModalButton text={state.numberOfRounds} contentKey="ROUNDS" />
        </AuxiliaryCard>
        <AuxiliaryCard title="Rest between rounds">
          <InputModalButton
            text={formatMinutesSeconds(state.restBetweenRounds)}
            contentKey="REST_TIME"
            enabled={state.numberOfRounds > 1}
          />
        </AuxiliaryCard>
        <AuxiliaryCard title="Break before next exercise">
          <InputModalButton
            text={formatMinutesSeconds(state.breakBeforeNext)}
            contentKey="BREAK_TIME"
          />
        </AuxiliaryCard>
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
        {contentType.key === EXERCISE_EDIT_MODAL.ROUNDS.key && (
          <NumberWheelPicker
            key={state.shouldRefreshPicker}
            number={state.numberOfRounds}
            onValueChange={(data) =>
              dispatch({
                type: exerciseEditActions.SET_ROUNDS,
                payload: data,
              })
            }
          />
        )}
        {contentType.key === EXERCISE_EDIT_MODAL.WORK_TIME.key && (
          <TimeWheelPicker
            key={state.shouldRefreshPicker}
            startingTime={state.workTime}
            onValueChange={(data) =>
              dispatch({
                type: exerciseEditActions.SET_WORK_TIME,
                payload: data,
              })
            }
          />
        )}
        {contentType.key === EXERCISE_EDIT_MODAL.REST_TIME.key && (
          <TimeWheelPicker
            key={state.shouldRefreshPicker}
            startingTime={state.restBetweenRounds}
            onValueChange={(data) =>
              dispatch({
                type: exerciseEditActions.SET_REST,
                payload: data,
              })
            }
          />
        )}
        {contentType.key === EXERCISE_EDIT_MODAL.BREAK_TIME.key && (
          <TimeWheelPicker
            key={state.shouldRefreshPicker}
            startingTime={state.breakBeforeNext}
            onValueChange={(data) =>
              dispatch({
                type: exerciseEditActions.SET_BREAK,
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
  workTime: 5,
  numberOfRounds: 1,
  restBetweenRounds: 0,
  breakBeforeNext: 5,
  previous: null,
  shouldRefreshPicker: false,
  dirty: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case exerciseEditActions.INIT:
      return { ...state, ...action.payload };

    case exerciseEditActions.SET_ACTIVE_KEY:
      return { ...state, activeKey: action.payload };

    case exerciseEditActions.SET_WORK_TIME:
      return { ...state, workTime: action.payload, dirty: true };

    case exerciseEditActions.SET_REST:
      return { ...state, restBetweenRounds: action.payload, dirty: true };

    case exerciseEditActions.SET_BREAK:
      return { ...state, breakBeforeNext: action.payload, dirty: true };

    case exerciseEditActions.SET_ROUNDS:
      return { ...state, numberOfRounds: action.payload, dirty: true };

    case exerciseEditActions.SET_TITLE:
      return { ...state, title: action.payload, dirty: true };

    case exerciseEditActions.SET_PREVIOUS:
      return { ...state, previous: action.payload };

    case exerciseEditActions.REVERT_PREVIOUS:
      return { ...state, [state.activeKey]: state.previous };

    case exerciseEditActions.TOGGLE_REFRESH_PICKER:
      return { ...state, shouldRefreshPicker: !state.shouldRefreshPicker };

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
    disabled: {
      color: theme.textDisabled,
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
    inputText: {
      color: theme.primary,
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
