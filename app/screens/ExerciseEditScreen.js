import React, { useEffect, useState, useReducer, useRef } from "react";
import {
  Keyboard,
  View,
  StyleSheet,
  Text,
  Button,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import Navheader from "../components/NavHeader";
import { IconButton } from "../components/buttons";
import { useSettings } from "../contexts/SettingsContext";
import routes from "../navigation/routes";
import AuxiliaryCard from "../components/AuxiliaryCard";

import AppTextButton from "../components/buttons/AppTextButton";
import EditableText from "../components/EditableText";
import exerciseEditActions from "../actions/exerciseEditActions";
import { formatMinutesSeconds } from "../utilities/formatDuration";
import { Exercise, Tag } from "../classes/Exercise";
import { EXERCISE_EDIT_MODAL } from "../config/ExerciseModalConfig";
import { confirmedNavigate } from "../alerts/discardExerciseEdits";
import { useRoutineContext } from "../contexts/RoutineContext";
import {
  PICKER_BUTTON_FONT_SIZE,
  PICKER_BUTTON_FONT_WEIGHT,
} from "../config/appConstants";
import {
  NumberWheelPicker,
  TimeWheelPicker,
  BottomSheetHandle,
} from "../components/pickers";
import Constants from "expo-constants";

const MODAL_HEIGHT = 350;

function ExerciseEditScreen({ route }) {
  const navigation = useNavigation();
  const { theme } = useSettings();
  const styles = getStyles(theme);
  const {
    isRoutineEditing,
    isExerciseEditing,
    referenceExercise: originalExercise,
  } = route.params;
  const [state, dispatch] = useReducer(reducer, initialState);
  const modalRef = useRef(null);
  const nameFieldRef = useRef(null);
  const [contentType, setContentType] = useState(EXERCISE_EDIT_MODAL.ROUNDS);
  const { contextExercises, setContextExercises } = useRoutineContext();

  useEffect(() => {
    dispatch({
      type: exerciseEditActions.INIT,
      payload: { ...originalExercise },
    });
  }, []);
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
    }
  };
  const InputModalButton = ({ title, text, contentKey, enabled = true }) => (
    <View style={{ marginTop: 10 }}>
      <AuxiliaryCard
        title={title}
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
                Keyboard.dismiss();
                modalRef.current?.expand();
              }
            : () => null
        }
      >
        <Text style={enabled ? styles.inputText : styles.disabled}>{text}</Text>
      </AuxiliaryCard>
    </View>
  );

  const goBack = () =>
    navigation.navigate(routes.ROUTINE_EDIT_SCREEN, { edit: isRoutineEditing });

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

    if (!isExerciseEditing) {
      // Only trigger on a new exercise
      // Must update exerciseOrder of cooldown exercise to + 1
      const cooldown = contextExercises.find(
        (ex) => ex.tag === Tag.POSTROUTINE,
      );
      if (
        cooldown &&
        cooldown.exerciseOrder <= originalExercise.exerciseOrder
      ) {
        cooldown.exerciseOrder = originalExercise.exerciseOrder + 1;
      }
      // Append to context array
      setContextExercises([...contextExercises, originalExercise]);
    }

    navigation.navigate(routes.ROUTINE_EDIT_SCREEN, { edit: isRoutineEditing });
  };

  const confirmDiscard = () => confirmedNavigate(goBack);

  return (
    <View style={styles.container}>
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
          state.dirty || !isExerciseEditing ? (
            <AppTextButton onPress={onSave} textStyle={{ fontWeight: 300 }}>
              {isExerciseEditing ? "Save" : "Create"}
            </AppTextButton>
          ) : null
        }
      />
      <ScrollView style={{ flex: 1, paddingHorizontal: 11 }}>
        <View style={{ marginTop: 10 }}>
          <AuxiliaryCard
            title="Name"
            onPress={() => nameFieldRef.current.activate()}
          >
            <EditableText
              ref={nameFieldRef}
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
        </View>
        <InputModalButton
          title="Work time"
          text={formatMinutesSeconds(state.workTime)}
          contentKey="WORK_TIME"
        />
        <InputModalButton
          title="Number of rounds"
          text={state.numberOfRounds}
          contentKey="ROUNDS"
        />
        <InputModalButton
          title="Rest between rounds"
          text={formatMinutesSeconds(state.restBetweenRounds)}
          contentKey="REST_TIME"
          enabled={state.numberOfRounds > 1}
        />
        <InputModalButton
          title="Break before next exercise"
          text={formatMinutesSeconds(state.breakBeforeNext)}
          contentKey="BREAK_TIME"
        />
      </ScrollView>
      <BottomSheet
        ref={modalRef}
        index={-1}
        snapPoints={[MODAL_HEIGHT, MODAL_HEIGHT]}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        backdropComponent={BottomSheetBackdrop}
        handleComponent={() => (
          <BottomSheetHandle
            title={contentType.title}
            subtitle={contentType.subtitle}
          />
        )}
        backgroundStyle={{ backgroundColor: theme.tertiaryBackground }}
        onChange={onModalChange}
      >
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
                modalRef.current?.close();
              }}
              color={theme.blue}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

const initialState = {
  title: "",
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
  }
};

const getStyles = (theme) =>
  StyleSheet.create({
    buttonContainer: {
      marginHorizontal: 16,
      marginTop: 12,
    },
    container: {
      backgroundColor: theme.background,
      flex: 1,
      height: "100%",
      paddingTop: Constants.statusBarHeight,
    },
    disabled: {
      color: theme.textDisabled,
    },
    footer: {
      backgroundColor: theme.secondaryBackground,
      bottom: 0,
      flexDirection: "row",
      height: 75,
      justifyContent: "space-between",
      position: "absolute",
      width: "100%",
    },
    inputText: {
      fontSize: PICKER_BUTTON_FONT_SIZE,
      fontWeight: PICKER_BUTTON_FONT_WEIGHT,
      color: theme.text87,
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
  });

export default ExerciseEditScreen;
