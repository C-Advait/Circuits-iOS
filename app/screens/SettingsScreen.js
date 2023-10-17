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
  const id = await createSound(dummySound);
};

const createDummyRoutine = async () => {
  const routine0 = new Routine({
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

  const routine1 = new Routine({
    numberOfLoops: 3,
    exerciseSoundID: 1,
    restSoundID: 1,
    breakSoundID: 1,
    endSoundID: 1,
    title: "Morning Stretches",
    duration: 600, // e.g., 10 minutes
    color: "#FFDDAA",
    userCreated: true,
  });

  const routine2 = new Routine({
    numberOfLoops: 6,
    exerciseSoundID: 1,
    restSoundID: 1,
    breakSoundID: 1,
    endSoundID: 1,
    title: "Cardio Blast",
    duration: 1800, // e.g., 30 minutes
    color: "#CCFFAA",
    userCreated: true,
  });

  const routine3 = new Routine({
    numberOfLoops: 4,
    exerciseSoundID: 1,
    restSoundID: 1,
    breakSoundID: 1,
    endSoundID: 1,
    title: "Evening Cool Down",
    duration: 900, // e.g., 15 minutes
    color: "#AACCFF",
    userCreated: true,
  });

  const routine4 = new Routine({
    numberOfLoops: 2,
    exerciseSoundID: 1,
    restSoundID: 1,
    breakSoundID: 1,
    endSoundID: 1,
    title: "Uncategorized Training",
    duration: 2400, // e.g., 40 minutes
    color: "#FFAACC",
    userCreated: true,
  });

  const routinesList = [routine0, routine1, routine2, routine3, routine4];

  Promise.all(routinesList.map((r) => createRoutine(r)));
};

const getNames = async () => {
  const names = await getAllRoutineNames();
  console.log("All routine names: ", JSON.stringify(names, null, 2));
};

const createDummyExercises = async () => {
  const e1 = new Exercise({
    routineID: 1,
    title: "Warmup",
    exerciseOrder: 1,
    tag: Tag.PREROUTINE,
    workTime: 60,
    numberOfRounds: 3,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Warmup",
  });

  const e2 = new Exercise({
    routineID: 1,
    title: "Dips",
    exerciseOrder: 2,
    tag: Tag.WORKING,
    workTime: 45,
    numberOfRounds: 5,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e3 = new Exercise({
    routineID: 1,
    title: "Hammer Curls",
    exerciseOrder: 3,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e4 = new Exercise({
    routineID: 1,
    title: "Hammer Curls",
    exerciseOrder: 4,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e5 = new Exercise({
    routineID: 1,
    title: "Hammer Curls",
    exerciseOrder: 5,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e6 = new Exercise({
    routineID: 1,
    title: "Hammer Curls",
    exerciseOrder: 6,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e7 = new Exercise({
    routineID: 1,
    title: "Hammer Curls",
    exerciseOrder: 7,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e8 = new Exercise({
    routineID: 1,
    title: "Hammer Curls",
    exerciseOrder: 8,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e9 = new Exercise({
    routineID: 1,
    title: "Hammer Curls",
    exerciseOrder: 9,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e10 = new Exercise({
    routineID: 1,
    title: "Hammer Curls",
    exerciseOrder: 10,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e11 = new Exercise({
    routineID: 1,
    title: "Hammer Curls",
    exerciseOrder: 11,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e12 = new Exercise({
    routineID: 1,
    title: "Biceps curls",
    exerciseOrder: 12,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const e13 = new Exercise({
    routineID: 1,
    title: "Cooldown",
    exerciseOrder: 13,
    tag: Tag.POSTROUTINE,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const exercises = [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11, e12, e13];

  Promise.all(exercises.map((e) => createExercise(e)));
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
      <Button title="Create 1 dummy sound" onPress={() => createDummySound()} />
      <Button
        title="Create 5 dummy routines"
        onPress={() => createDummyRoutine()}
      />
      <Button
        title="Create 8 dummy exercises"
        onPress={() => createDummyExercises()}
      />
      <Button title="Reset DB" onPress={() => resetDB()} />
    </Screen>
  );
}

// <Button title="Dump DB" onPress={() => dumpDB()} />
// <Button title="Get RoutineNames" onPress={() => getNames()} />
// <Button title="Get exercises" onPress={() => getDummyExercises()} />
// <Button title="Get single routine" onPress={() => getSingleRoutine()} />
// <Button title="Delete exercise" onPress={() => deleteEx()} />
// <Button title="Delete routine" onPress={() => deleteRo()} />
// <Button
//   title="Update exercise name"
//   onPress={() => updateSingleExercise()}
// />
// <Button
//   title="Update routine name"
//   onPress={() => updateSingleRoutine()}
// />

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
