import React, { useEffect, useState, useReducer } from "react";
import { StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { useNavigation } from "@react-navigation/core";

import routes from "../navigation/routes";

import LabelledIconButton from "../components/buttons/LabelledIconButton";
import { useSettings } from "../contexts/SettingsContext";
import { PlayPause, SkipButton, Timer } from "../components/timer";
import InfoWidget from "../components/timer/InfoWidget";
import ProgressSlider from "../components/timer/ProgressSlider";
import SuccessModal from "../components/timer/SuccessModal";

import { getExercisesForRoutine } from "../db/DBActions";
import { processExerciseList } from "../utilities/processExerciseList";
import { confirmedNavigate } from "../alerts/endRoutine";
import timerActions from "../actions/timerActions";
import { Tag } from "../classes/Exercise";
import { SkipTypes } from "../classes/SkipTypes";
import CountdownModal from "../components/timer/CountdownModal";

function TimerScreen({ route }) {
  const navigation = useNavigation();
  const { theme } = useSettings();
  const styles = getStyles(theme);

  const [state, dispatch] = useReducer(reducer, initialState);
  const [nextExerciseTitle, nextExerciseTag] = getNextExercise(state);

  useEffect(() => {
    dispatch({ type: timerActions.INIT_FROM_PARAMS, params: route.params });
    initTimerSequence(route.params, dispatch);
  }, []);

  useEffect(() => {
    if (state.routineComplete) {
      dispatch({ type: timerActions.CLOSE_SUCCESS_MODAL });
    }
  }, [state.routineComplete]);

  // Check header for length, and potentially truncate!
  return (
    <Screen>
      <CountdownModal
        visible={state.showCountdown}
        onClose={() => {
          dispatch({ type: timerActions.MARK_COUNTDOWN_COMPLETE });
          dispatch({ type: timerActions.TOGGLE_IS_PLAYING });
        }}
      />
      <View style={styles.topContainer}>
        <Text style={styles.routineTitle}>{state.title}</Text>
        <View style={styles.backButtonContainer}>
          <LabelledIconButton
            title={"End"}
            foregroundColor="white"
            onPress={() =>
              confirmedNavigate(() =>
                navigation.navigate(routes.ROUTINES_SCREEN),
              )
            }
            style={styles.backButton}
          />
        </View>
      </View>
      <Timer
        state={state}
        dispatch={dispatch}
        nextExerciseTag={nextExerciseTag}
      />
      <View style={styles.nextContainer}>
        <Text style={styles.upNext}>UP NEXT:</Text>
        <Text style={styles.nextExercise} numberOfLines={1}>
          {nextExerciseTitle}
        </Text>
      </View>
      <View style={styles.controlRow}>
        <SkipButton
          shouldSkipForward={false}
          dispatch={dispatch}
          active={state.currentIndex !== 0 && !state.routineComplete}
        />
        <PlayPause isPlaying={state.isPlaying} dispatch={dispatch} />
        <SkipButton
          shouldSkipForward={true}
          dispatch={dispatch}
          active={state.currentIndex !== state.intervals.length - 1}
        />
      </View>
      <View style={styles.progressRow}>
        <InfoWidget title="Round" state={state} />
        <InfoWidget title="Exercise" state={state} />
        <InfoWidget title="Loop" state={state} />
      </View>
      <View style={styles.sliderContainer}>
        <ProgressSlider
          elapsed={state.totalElapsedTime}
          total={state.totalDuration}
        />
      </View>
      <SuccessModal
        routineTitle={state.title}
        visible={state.showSuccess}
        dispatch={dispatch}
      />
    </Screen>
  );
}

function computeSkippedState(elapsedTime, intervals, oldIdx) {
  const newIdx = intervals.findIndex(
    (obj) => obj.startTime + obj.duration > elapsedTime,
  );
  return [
    newIdx,
    intervals[newIdx]?.currentLoop,
    Math.round(
      intervals[newIdx]?.duration -
        (elapsedTime - intervals[newIdx]?.startTime),
    ),
    newIdx > oldIdx,
  ];
}

function reducer(state, action) {
  switch (action.type) {
    case timerActions.INIT_FROM_PARAMS:
      return {
        ...state,
        ...action.params,
      };
    case timerActions.SET_EXERCISE_DATA:
      return {
        ...state,
        numberOfExercises: action.numberOfExercises,
        intervals: action.intervals,
        exerciseSecondsRemaining: action.initialDuration,
      };
    case timerActions.SKIP_FORWARD:
      // If we've reached the end of 'intervals', then either
      //   a) We need to restart from the beginning and
      //      increment currentLoop, or
      //   b) We are done the routine.
      if (state.routineComplete) return state;

      if (state.currentIndex === state.intervals.length - 1) {
        console.log("Routine is complete.");
        return {
          ...state,
          routineComplete: true,
        };
      } else {
        return {
          ...state,
          shouldResetTimer: true,
          currentIndex: state.currentIndex + 1,
          currentLoop: state.intervals[state.currentIndex + 1]?.currentLoop,
          exerciseSecondsRemaining:
            state.intervals[state.currentIndex + 1]?.duration,
          totalElapsedTime: state.intervals[state.currentIndex + 1]?.startTime,
        };
      }
    case timerActions.SKIP_BACKWARD:
      if (state.routineComplete || state.currentIndex === 0) return state;

      return {
        ...state,
        shouldResetTimer: true,
        currentIndex: state.currentIndex - 1,
        currentLoop: state.intervals[state.currentIndex - 1]?.currentLoop,
        exerciseSecondsRemaining:
          state.intervals[state.currentIndex - 1]?.duration,
        totalElapsedTime: state.intervals[state.currentIndex - 1]?.startTime,
      };
    case timerActions.SKIP_AMOUNT:
      console.log(
        `App was outside the foreground for ${action.payload} milliseconds`,
      );

      // Check if amount to skip is greater than remaining amount of time.
      // If so, end the routine.
      const totalTimeLeft = state.totalDuration - state.totalElapsedTime;
      console.log(
        `totalDuration: ${state.totalDuration}, totalTimeLeft: ${totalTimeLeft}`,
      );

      if (action.payload > totalTimeLeft) {
        return { ...state, routineComplete: true };
      }

      // If we've reached here, then there is still time
      // remaining in the routine. Set totalElapsedTime,
      // exerciseSecondsRemaining, figure out where along
      // the exercises we need to be, and ensure that the
      // ring timer is set appropriately.
      const [newIdx, loop, remainingTime, skippedBorder] = computeSkippedState(
        state.totalElapsedTime + action.payload,
        state.intervals,
        state.currentIndex,
      );

      return {
        ...state,
        totalElapsedTime: state.totalElapsedTime + action.payload,
        exerciseSecondsRemaining: remainingTime,
        currentIndex: newIdx,
        currentLoop: loop,
        skipData: skippedBorder
          ? SkipTypes.SKIPPED_BORDER
          : SkipTypes.SKIPPED_WITHIN,
      };
    case timerActions.ELAPSE:
      return {
        ...state,
        exerciseSecondsRemaining: state.exerciseSecondsRemaining - 1,
        totalElapsedTime: state.totalElapsedTime + 1,
      };
    case timerActions.TOGGLE_IS_PLAYING:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };
    case timerActions.RESET_TIMER:
      return {
        ...state,
        shouldResetTimer: true,
        exerciseSecondsRemaining: state.intervals[state.currentIndex]?.duration,
        totalElapsedTime: state.intervals[state.currentIndex]?.startTime,
      };
    case timerActions.MARK_TIMER_LOAD_COMPLETE:
      return {
        ...state,
        shouldResetTimer: false,
      };
    case timerActions.MARK_SKIP_COMPLETE:
      return {
        ...state,
        skipped: false,
      };
    case timerActions.MARK_COUNTDOWN_COMPLETE:
      return {
        ...state,
        showCountdown: false,
      };
    case timerActions.CLOSE_SUCCESS_MODAL:
      return {
        ...state,
        showSuccess: true,
      };
  }
}

const initTimerSequence = async ({ id, numberOfLoops }, dispatch) => {
  const exercises = await getExercisesForRoutine(id);
  const intervals = processExerciseList(exercises, numberOfLoops);

  dispatch({
    type: timerActions.SET_EXERCISE_DATA,
    numberOfExercises: exercises.length - 2,
    intervals: intervals,
    initialDuration: intervals[0]?.duration,
  });
};

// Returns [title, tag]
const getNextExercise = (state) => {
  if (state.currentIndex === state.intervals.length - 1) {
    return ["Finish", Tag.FINISH];
  }
  const nextIndex =
    state.currentIndex === state.intervals.length - 1
      ? 0
      : state.currentIndex + 1;
  const { title, tag } = state.intervals[nextIndex] || {};
  return [title, tag];
};

const initialState = {
  totalElapsedTime: 0,
  totalDuration: 0,

  exerciseSecondsRemaining: 0,
  isPlaying: false,

  intervals: [{ title: "", tag: "" }], // Might be causing Nan:Nan on startup
  currentIndex: 0,

  numberOfExercises: 0,

  currentLoop: 0,
  numberOfLoops: 1,

  skipped: SkipTypes.UNSKIPPED,

  shouldResetTimer: false,
  routineComplete: false,

  showCountdown: true,
  showSuccess: false,
};

const getStyles = (theme) =>
  StyleSheet.create({
    backButton: {
      backgroundColor: "rgba(255, 255, 255, 0.14)",
      width: 65,
      height: 35,
      borderRadius: 18,
    },
    backButtonContainer: {
      alignItems: "center",
      flexDirection: "row",
      height: "100%",
      position: "absolute",
      right: 22,
    },
    controlRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      gap: 46,
      marginBottom: 48,
    },
    nextContainer: {
      marginTop: 5,
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    nextExercise: {
      color: theme.secondary,
      fontWeight: "500",
      fontSize: 25,
      marginBottom: 48,
    },
    progressRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginHorizontal: 15,
      marginBottom: 16,
    },
    routineTitle: {
      color: theme.foreground,
      fontWeight: "bold",
      fontSize: 17,
    },
    sliderContainer: {
      marginHorizontal: 15,
    },
    topContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      marginBottom: 10,
    },
    upNext: {
      color: theme.primary,
      fontSize: 15,
    },
  });

export default TimerScreen;
