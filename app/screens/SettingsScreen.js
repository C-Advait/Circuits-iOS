import React from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import Screen from "../components/Screen";
import Header from "../components/Header";

import {
  dropTable,
  getExercisesForRoutine,
  createExercise,
  getAllRoutineNames,
  createRoutine,
  createSound,
  getRoutineByID,
  deleteExercise,
  deleteRoutine,
  updateExercise,
  updateRoutine,
} from "../db/DBActions";
import { createTables } from "../db/DBSetup";
import { Exercise, Tag } from "../classes/Exercise";
import { Routine } from "../classes/Routine";
import { Sound } from "../classes/Sound";

const resetDB = async () => {
  dropTable("Exercise")
    .then(dropTable("Routine"))
    .then(dropTable("Sound"))
    .then(createTables())
    .then(Alert.alert("All tables dropped and recreated!"));
};

const dumpDB = async () => {
  const exercises = await getExercisesForRoutine(1);
  console.log(
    "All exercises for routine with id 1",
    JSON.stringify(exercises, null, 2),
  );
};

const createDummySound = async () => {
  const dummySound = new Sound(1, "Beep", "path/to/beep.mp3", "mp3");

  console.log("About to create sound: ", JSON.stringify(dummySound, null, 2));

  const id = await createSound(dummySound);
  console.log("Returned id: ", id);
};

const createDummyRoutine = async () => {
  const sampleRoutine = new Routine({
    numberOfLoops: 5,
    exerciseSoundID: 1,
    restSoundID: 1,
    breakSoundID: 1,
    endSoundID: 1,
    title: "Sample Routine",
    duration: 1200, // e.g., 20 minutes
    color: "#AABBCC",
    userCreated: true,
  });

  console.log(
    "About to create routine: ",
    JSON.stringify(sampleRoutine, null, 2),
  );

  const id = await createRoutine(sampleRoutine);
  console.log("Returned id: ", id);
};

const getNames = async () => {
  const names = await getAllRoutineNames();
  console.log("All routine names: ", JSON.stringify(names, null, 2));
};

const createDummyExercises = async () => {
  const myExercise = new Exercise({
    routineID: 1,
    title: "Jumping Jacks",
    exerciseOrder: 1,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 5,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Cardio",
  });

  const myExercise2 = new Exercise({
    routineID: 1,
    title: "Pushups",
    exerciseOrder: 2,
    tag: Tag.WORKING,
    workTime: 40,
    numberOfRounds: 5,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Strength",
  });
  createExercise(myExercise);
  createExercise(myExercise2);
};

const getDummyExercises = async () => {
  const exercises = await getExercisesForRoutine(1);
  console.log("All exercises: ", JSON.stringify(exercises, null, 2));
};

const getSingleRoutine = async () => {
  const routine = await getRoutineByID(1);
  console.log("Single routine: ", JSON.stringify(routine, null, 2));
  return routine;
};

const deleteEx = async () => {
  const rowsAffected = await deleteExercise(1);
  console.log(rowsAffected);
};

const deleteRo = async () => {
  const rowsAffected = await deleteRoutine(1);
  console.log(rowsAffected);
};

const updateSingleExercise = async () => {
  // Important that we use 'let' instead of 'const'
  let exercise = (await getExercisesForRoutine(1))[0];
  exercise.title = "Modified Jumping Jacks";
  const rowsAffected = await updateExercise(exercise);
  console.log(rowsAffected);
};

const updateSingleRoutine = async () => {
  // Important that we use 'let' instead of 'const'
  let routine = await getSingleRoutine();
  routine.title = "Modified Sample Routine";
  const rowsAffected = await updateRoutine(routine);
  console.log(rowsAffected);
};

function SettingsScreen() {
  return (
    <Screen>
      <View style={styles.topPanel}>
        <Header>Settings</Header>
      </View>
      <Button title="Dump DB" onPress={() => dumpDB()} />
      <Button title="Create dummy sound" onPress={() => createDummySound()} />
      <Button
        title="Create dummy routine"
        onPress={() => createDummyRoutine()}
      />
      <Button
        title="Create dummy exercise"
        onPress={() => createDummyExercises()}
      />
      <Button title="Reset DB" onPress={() => resetDB()} />
      <Button title="Get RoutineNames" onPress={() => getNames()} />
      <Button title="Get exercises" onPress={() => getDummyExercises()} />
      <Button title="Get single routine" onPress={() => getSingleRoutine()} />
      <Button title="Delete exercise" onPress={() => deleteEx()} />
      <Button title="Delete routine" onPress={() => deleteRo()} />
      <Button
        title="Update exercise name"
        onPress={() => updateSingleExercise()}
      />
      <Button
        title="Update routine name"
        onPress={() => updateSingleRoutine()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  topPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 15,
    marginBottom: 34,
    marginHorizontal: 10,
    marginTop: 25,
  },
});
export default SettingsScreen;
