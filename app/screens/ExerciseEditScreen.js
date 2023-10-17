import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";

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

function ExerciseEditScreen({ route }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [infoChanged, setInfoChanged] = useState(false);
  const {
    isRoutineEditing,
    isExerciseEditing,
    referenceExercise,
    exercise: passedExercise,
  } = route.params;

  const { contextExercises, setContextExercises } = useRoutineContext();
  const [exercise, setExercise] = useState(referenceExercise);

  // Update the exercise title and trigger a re-render
  const updateTitle = (newTitle) => {
    setExercise((prevExercise) => ({
      ...prevExercise,
      title: newTitle,
    }));
  };

  const handleWorkTimeUpdate = (selectedMinute, selectedSecond) => {
    setExercise((prevExercise) => ({
      ...prevExercise,
      workTime: parseInt(selectedMinute) * 60 + parseInt(selectedSecond),
    }));
    setInfoChanged(true);
    console.log(exercise);
  };

  const handleNumberRoundsUpdate = ({ number }) => {
    null;
    // eventManager.emit("numberOfRounds", number);
    // null;
    // setExercise(prevExercise => ({
    //   ...prevExercise,
    //   numberOfRounds: (parseInt(number))
    // }));
    // console.log(exercise);
  };

  const handleSaveOnPress = () => {
    //Set changed state exercise object to the reference object
    Object.assign(referenceExercise, exercise);
    if (!isExerciseEditing) {
      // Is a new exercise
      // Append new exercise to the exercises array managed by context
      // Handles rendering
      setContextExercises([...contextExercises, referenceExercise]);
    }
    navigation.navigate(routes.ROUTINE_EDIT_SCREEN, { edit: isRoutineEditing });
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
        headerText={`Edit ${exercise.title}`}
        RightComponent={
          infoChanged ? (
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
          title={"Name"}
          InputComponent={() => (
            <EditableText
              exercise={exercise}
              onSubmit={(text) => {
                updateTitle(text);
                setInfoChanged(true);
              }}
            />
          )}
        />
        <AuxilaryCard
          editable={false}
          bold={false}
          title={"Work time"}
          InputComponent={() => {
            const [startingMinute, startingSecond] = extractStartingPickerTime(
              passedExercise,
              "workTime",
            );

            return (
              <TimePickerModal
                promptTitle="Work time"
                promptSubtitle="Duration of the work round."
                startingMinute={startingMinute}
                startingSecond={startingSecond}
                onSubmit={(minutes, seconds) => {
                  handleWorkTimeUpdate(minutes, seconds);
                }}
              />
            );
          }}
        />
        <AuxilaryCard
          editable={false}
          bold={false}
          title={"Number of rounds"}
          InputComponent={() => (
            <NumberPickerModal
              promptTitle="Number of rounds"
              promptSubtitle="Repetitions of the current exercise."
              startingNumber={extractStartingRounds(passedExercise)}
              onSubmit={(number) => console.log("numberOfRounds", number)}
            />
          )}
        />
        <AuxilaryCard
          editable={false}
          bold={false}
          title={"Rest between rounds"}
          InputComponent={() => {
            const [startingMinute, startingSecond] = extractStartingPickerTime(
              passedExercise,
              "restBetweenRounds",
              " 0",
              "30",
            );

            return (
              <Receiver>
                <TimePickerModal
                  promptTitle="Rest"
                  promptSubtitle="Duration of rest between subsequent rounds."
                  startingMinute={startingMinute}
                  startingSecond={startingSecond}
                  enabled={parseInt(extractStartingRounds(passedExercise)) > 1}
                />
              </Receiver>
            );
          }}
        />
        <AuxilaryCard
          editable={false}
          bold={false}
          title={"Break until next exercise"}
          InputComponent={() => {
            const [startingMinute, startingSecond] = extractStartingPickerTime(
              passedExercise,
              "breakBeforeNext",
              " 0",
              "30",
            );

            return (
              <TimePickerModal
                promptTitle="Break"
                promptSubtitle="Duration of break before next exercise."
                startingMinute={startingMinute}
                startingSecond={startingSecond}
              />
            );
          }}
        />
      </View>
    </Screen>
  );
}

const getStyles = (theme) => StyleSheet.create({});

export default ExerciseEditScreen;
