import React, { useEffect, useReducer } from "react";
import { StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { useNavigation } from "@react-navigation/core";

import routes from "../navigation/routes";

import LabelledIconButton from "../components/buttons/LabelledIconButton";
import { useAppContext } from "../contexts/AppContext";
import { PlayPause, SkipButton, Timer } from "../components/timer";
import InfoWidget from "../components/timer/InfoWidget";
import ProgressSlider from "../components/timer/ProgressSlider";
import SuccessModal from "../components/timer/SuccessModal";

import { getExercisesForRoutine } from "../db/DBActions";
import { processExerciseList } from "../utilities/processExerciseList";
import { confirmedNavigate } from "../alerts/endRoutine";
import timerActions from "../actions/timerActions";
import { Tag } from "../classes/Exercise";
import CountdownModal from "../components/timer/CountdownModal";
import { advanceTimerTo } from "../utilities/timerClock";

const CLOCK_INTERVAL_MS = 100;

function TimerScreen({ route }) {
  const navigation = useNavigation();
  const { theme } = useAppContext();
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

  useEffect(() => {
    if (!state.isPlaying || state.routineComplete) return;

    const tick = () => dispatch({ type: timerActions.TICK, now: Date.now() });
    const intervalID = setInterval(tick, CLOCK_INTERVAL_MS);

    return () => clearInterval(intervalID);
  }, [state.isPlaying, state.routineComplete]);

  // Check header for length, and potentially truncate!
  return (
    <Screen>
      <CountdownModal
        visible={state.showCountdown}
        onClose={() => {
          dispatch({ type: timerActions.MARK_COUNTDOWN_COMPLETE });
          dispatch({ type: timerActions.TOGGLE_IS_PLAYING, now: Date.now() });
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
                navigation.popTo(routes.ROUTINES_SCREEN),
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
        routineID={state.id}
        routineTitle={state.title}
        visible={state.showSuccess}
        dispatch={dispatch}
      />
    </Screen>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case timerActions.INIT_FROM_PARAMS:
      return {
        ...state,
        ...action.params,
      };
    case timerActions.SET_EXERCISE_DATA:
      const finalInterval = action.intervals[action.intervals.length - 1];
      return {
        ...state,
        numberOfExercises: action.numberOfExercises,
        intervals: action.intervals,
        exerciseSecondsRemaining: action.initialDuration,
        totalDuration: finalInterval
          ? finalInterval.startTime + finalInterval.duration
          : 0,
        clockRevision: state.clockRevision + 1,
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
          isPlaying: false,
          exerciseSecondsRemaining: 0,
          totalElapsedTime: state.totalDuration,
          lastTickAt: null,
          clockRevision: state.clockRevision + 1,
        };
      } else {
        return {
          ...state,
          currentIndex: state.currentIndex + 1,
          currentLoop: state.intervals[state.currentIndex + 1]?.currentLoop,
          exerciseSecondsRemaining:
            state.intervals[state.currentIndex + 1]?.duration,
          totalElapsedTime: state.intervals[state.currentIndex + 1]?.startTime,
          lastTickAt: state.isPlaying
            ? Math.max(action.now, state.lastTickAt || 0)
            : null,
          clockRevision: state.clockRevision + 1,
        };
      }
    case timerActions.SKIP_BACKWARD:
      if (state.routineComplete || state.currentIndex === 0) return state;

      return {
        ...state,
        currentIndex: state.currentIndex - 1,
        currentLoop: state.intervals[state.currentIndex - 1]?.currentLoop,
        exerciseSecondsRemaining:
          state.intervals[state.currentIndex - 1]?.duration,
        totalElapsedTime: state.intervals[state.currentIndex - 1]?.startTime,
        lastTickAt: state.isPlaying
          ? Math.max(action.now, state.lastTickAt || 0)
          : null,
        clockRevision: state.clockRevision + 1,
      };
    case timerActions.TICK:
      return advanceTimerTo(state, action.now);
    case timerActions.RESYNC_CLOCK:
      const resyncedState = advanceTimerTo(state, action.now);
      return {
        ...resyncedState,
        clockRevision: resyncedState.clockRevision + 1,
      };
    case timerActions.TOGGLE_IS_PLAYING:
      if (state.isPlaying) {
        const pausedState = advanceTimerTo(state, action.now);
        return {
          ...pausedState,
          isPlaying: false,
          lastTickAt: null,
          clockRevision: pausedState.clockRevision + 1,
        };
      }

      if (state.routineComplete || !state.intervals.length) return state;

      return {
        ...state,
        isPlaying: true,
        lastTickAt: action.now,
        clockRevision: state.clockRevision + 1,
      };
    case timerActions.RESET_TIMER:
      return {
        ...state,
        exerciseSecondsRemaining: state.intervals[state.currentIndex]?.duration,
        totalElapsedTime: state.intervals[state.currentIndex]?.startTime,
        lastTickAt: state.isPlaying
          ? Math.max(action.now, state.lastTickAt || 0)
          : null,
        clockRevision: state.clockRevision + 1,
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

  routineComplete: false,

  lastTickAt: null,
  clockRevision: 0,

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
