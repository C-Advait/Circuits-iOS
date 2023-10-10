import React, { useEffect, useReducer } from "react";
import { StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { useNavigation } from "@react-navigation/core";

import routes from "../navigation/routes";

import LabelledIconButton from "../components/buttons/LabelledIconButton";
import { useTheme } from "../contexts/ThemeContext";
import { PlayPause, SkipButton, Timer } from "../components/timer";
import InfoWidget from "../components/timer/InfoWidget";
import ProgressSlider from "../components/timer/ProgressSlider";
import { getExercisesForRoutine } from "../db/DBActions";
import { processExerciseList } from "../utilities/processExerciseList";
import { confirmedNavigate } from "../alerts/endRoutine";
import timerActions from "../actions/timerActions";

function TimerScreen({ route }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: timerActions.INIT_FROM_PARAMS, params: route.params });
    createTimerSequence(route.params.id, dispatch);
  }, []);

  // Check header for length, and potentially truncate!
  return (
    <Screen>
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
      // isPlaying={isPlaying}
      // setIsPlaying={setIsPlaying}
      // duration={intervals[currentIndex]?.duration}
      // onFinish={handleTimerFinish}
      // title={intervals[currentIndex]?.title}
      // tag={intervals[currentIndex]?.tag}
      />
      <View style={styles.nextContainer}>
        <Text style={styles.upNext}>UP NEXT:</Text>
        <Text style={styles.nextExercise}>Squats</Text>
      </View>
      <View style={styles.controlRow}>
        <SkipButton
          shouldSkipForward={false}
          dispatch={dispatch}
          active={
            (state.currentIndex !== 0 || state.currentLoop !== 1) &&
            !state.routineComplete
          }
        />
        <PlayPause isPlaying={state.isPlaying} dispatch={dispatch} />
        <SkipButton
          shouldSkipForward={true}
          dispatch={dispatch}
          active={
            state.currentIndex !== state.intervals.length - 1 ||
            state.currentLoop !== state.numberOfLoops
          }
        />
      </View>
      <View style={styles.progressRow}>
        <InfoWidget
          title="Round"
          current={state.intervals[state.currentIndex]?.currentRound}
          total={state.intervals[state.currentIndex]?.numberOfRounds}
        />
        <InfoWidget
          title="Exercise"
          current={state.intervals[state.currentIndex]?.exerciseOrder}
          total={state?.numberOfExercises}
        />
        <InfoWidget
          title="Loop"
          current={state?.currentLoop}
          total={state?.numberOfLoops}
        />
      </View>
      <View style={styles.sliderContainer}>
        <ProgressSlider
          elapsed={state.totalElapsedTime}
          total={state.totalDuration}
        />
      </View>
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
      console.log(`Setting exercise data: ${JSON.stringify(action, null, 2)}`);
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
        if (state.currentLoop === state.numberOfLoops) {
          console.log("Routine is complete.");
          return {
            ...state,
            // currentLoop: state.currentLoop + 1,
            // currentIndex: state.currentIndex + 1,
            routineComplete: true,
          };
        } else {
          return {
            ...state,
            shouldResetTimer: true,
            currentLoop: state.currentLoop + 1,
            currentIndex: 0,
            exerciseSecondsRemaining: state.intervals[0]?.duration,
          };
        }
      } else {
        return {
          ...state,
          shouldResetTimer: true,
          currentIndex: state.currentIndex + 1,
          exerciseSecondsRemaining:
            state.intervals[state.currentIndex + 1]?.duration,
        };
      }
    case timerActions.SKIP_BACKWARD:
      if (state.routineComplete) return state;

      if (state.currentIndex !== 0) {
        return {
          ...state,
          shouldResetTimer: true,
          currentIndex: state.currentIndex - 1,
          exerciseSecondsRemaining:
            state.intervals[state.currentIndex - 1]?.duration,
        };
      } else {
        return state;
      }
    case timerActions.DECREMENT_TIMER:
      return {
        ...state,
        exerciseSecondsRemaining: state.exerciseSecondsRemaining - 1,
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
      };
    case timerActions.MARK_TIMER_LOAD_COMPLETE:
      return {
        ...state,
        shouldResetTimer: false,
      };
  }
}

const createTimerSequence = async (id, dispatch) => {
  const exercises = await getExercisesForRoutine(id);

  dispatch({
    type: timerActions.SET_EXERCISE_DATA,
    numberOfExercises: exercises.length,
    intervals: processExerciseList(exercises),
    initialDuration: exercises[0]?.workTime,
  });
  // console.log(JSON.stringify(processExerciseList(exercises), null, 2));
};

const initialState = {
  totalElapsedTime: 0,
  totalDuration: 0,

  exerciseSecondsRemaining: 0,
  isPlaying: false,

  intervals: [{ title: "", tag: "" }], // Might be causing Nan:Nan on startup
  currentIndex: 0,

  numberOfExercises: 0,

  currentLoop: 1,
  numberOfLoops: 1,

  shouldResetTimer: false,
  routineComplete: false,
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
      marginBottom: 55,
    },
    nextContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    nextExercise: {
      color: theme.secondary,
      fontWeight: 500,
      fontSize: 27,
      marginBottom: 25,
    },
    progressRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginHorizontal: 15,
      marginBottom: 22,
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
    },
    upNext: {
      color: theme.primary,
      fontSize: 17,
    },
  });

export default TimerScreen;
