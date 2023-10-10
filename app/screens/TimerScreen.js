import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
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

function TimerScreen({ route }) {
  const navigation = useNavigation();

  const { id: routineID, numberOfLoops, title } = route.params;

  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [totalElapsed, setTotalElapsed] = useState(563);
  const [isPlaying, setIsPlaying] = useState(false);

  const [intervals, setIntervals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numberOfExercises, setNumberOfExercises] = useState();
  const [currentLoop, setCurrentLoop] = useState(1);

  const createTimerSequence = async () => {
    const exercises = await getExercisesForRoutine(routineID);

    // Decompress exercises
    setNumberOfExercises(exercises.length); // Does this include warmup yet?
    setIntervals(processExerciseList(exercises));
    console.log(JSON.stringify(processExerciseList(exercises), null, 2));
  };

  useEffect(() => {
    createTimerSequence();
  }, []);

  const handleTimerFinish = () => {
    // If we've reached the end of 'intervals', then either
    //   a) We need to restart from the beginning and
    //      increment currentLoop, or
    //   b) We are done the routine.
    if (currentIndex === intervals.length - 1) {
      setCurrentLoop((prev) => prev + 1);
      if (currentLoop === numberOfLoops) {
        console.log("Routine is complete.");
        setCurrentIndex(intervals.length + 1);
      } else {
        setCurrentIndex(0);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const confirmedNavigate = () => {
    Alert.alert(
      "Confirm", // title
      "Are you sure you want to end this routine?", // message
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate(routes.ROUTINES_SCREEN),
        },
      ],
      { cancelable: false },
    );
  };

  // Check header for length, and potentially truncate!
  return (
    <Screen>
      <View style={styles.topContainer}>
        <Text style={styles.routineTitle}>{title}</Text>
        <View style={styles.backButtonContainer}>
          <LabelledIconButton
            title={"End"}
            foregroundColor="white"
            onPress={confirmedNavigate}
            style={styles.backButton}
          />
        </View>
      </View>
      <Timer
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        duration={intervals[currentIndex]?.duration}
        onFinish={handleTimerFinish}
        title={intervals[currentIndex]?.title}
        tag={intervals[currentIndex]?.tag}
      />
      <View style={styles.nextContainer}>
        <Text style={styles.upNext}>UP NEXT:</Text>
        <Text style={styles.nextExercise}>Squats</Text>
      </View>
      <View style={styles.controlRow}>
        <SkipButton shouldSkipForward={false} />
        <PlayPause isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        <SkipButton shouldSkipForward={true} />
      </View>
      <View style={styles.progressRow}>
        <InfoWidget
          title="Round"
          current={intervals[currentIndex]?.currentRound}
          total={intervals[currentIndex]?.numberOfRounds}
        />
        <InfoWidget
          title="Exercise"
          current={intervals[currentIndex]?.exerciseOrder}
          total={numberOfExercises}
        />
        <InfoWidget title="Loop" current={currentLoop} total={numberOfLoops} />
      </View>
      <View style={styles.sliderContainer}>
        <ProgressSlider elapsed={totalElapsed} total={1774} />
      </View>
    </Screen>
  );
}

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
