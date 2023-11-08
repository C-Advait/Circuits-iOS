import React from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import Screen from "../components/Screen";
import Header from "../components/Header";

import { useIAP } from "react-native-iap";

import {
  dropTable,
  getExercisesForRoutine,
  createExercise,
  getAllRoutineNames,
  createRoutine,
  getRoutineByID,
  deleteExercise,
  deleteRoutine,
  updateExercise,
  updateRoutine,
  getSettings,
} from "../db/DBActions";
import { initTables } from "../db/DBSetup";
import { Exercise, Tag } from "../classes/Exercise";
import { Routine } from "../classes/Routine";

const resetDB = async () => {
  dropTable("Exercise")
    .then(dropTable("Routine"))
    .then(dropTable("Setting"))
    .then(initTables())
    .then(Alert.alert("All tables dropped and recreated!"));
};

const dumpDB = async () => {
  const settings = await getSettings();
  console.log("All settings", JSON.stringify(settings, null, 2));
};

const createDummyRoutine = async () => {
  const routine0 = new Routine({
    numberOfLoops: 5,
    title: "Sample Routine",
    duration: 1200, // e.g., 20 minutes
    color: "#AABBCC",
    userCreated: true,
  });

  const routine1 = new Routine({
    numberOfLoops: 3,
    title: "Morning Stretches",
    duration: 600, // e.g., 10 minutes
    color: "#FFDDAA",
    userCreated: true,
  });
  const routinesList = [routine0];

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
    exerciseOrder: 0,
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
    exerciseOrder: 1,
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
    exerciseOrder: 2,
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
    exerciseOrder: 3,
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
    exerciseOrder: 4,
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
    exerciseOrder: 5,
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
    exerciseOrder: 6,
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
    exerciseOrder: 7,
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
    exerciseOrder: 8,
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
    exerciseOrder: 9,
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
    exerciseOrder: 10,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 4,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Uncategorized",
  });

  const eNEW = new Exercise({
    routineID: 1,
    title: "Hammer Curls",
    exerciseOrder: 11,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 1,
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

  const exercises = [
    e1,
    e2,
    e3,
    e4,
    e5,
    e6,
    e7,
    e8,
    e9,
    e10,
    e11,
    e12,
    e13,
    eNEW,
  ];

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

const purchaseSubscription = async () => {};

function DebugScreen() {
  const { getSubscriptions, subscriptions, requestSubscription } = useIAP();

  const sku = "com.circuits.timer.unlimited.routines";

  const handleGetSubs = async () => {
    try {
      // Note: getProducts takes an array directly, not an object with skus key
      // console.log("Skus: ", skus);
      const _subs = await getSubscriptions({ skus: [sku] });
      //   console.err("Couldn't get subs!!! ", err),
      // );
      console.log("Caller received subs: ", subscriptions);
      Alert.alert("subs: ", JSON.stringify(subscriptions, null, 2));
    } catch (error) {
      // Always good to handle and log errors
      console.error("Failed to load products", error);
    }
  };

  subscribe = async (sku, offerToken) => {
    try {
      await requestSubscription({
        sku,
        ...(offerToken && { subscriptionOffers: [{ sku, offerToken }] }),
      });
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  return (
    <Screen>
      <View style={styles.topPanel}>
        <Header>Debug</Header>
      </View>
      <Button title="Reset DB" onPress={() => resetDB()} />
      <Button title="Get Subscriptions" onPress={handleGetSubs} />
      <Button
        title="Request Subscription"
        onPress={() => subscribe(sku, null)}
      />
    </Screen>
  );
}

// <Button
//   title="Create dummy routines"
//   onPress={() => createDummyRoutine()}
// />
// <Button
//   title="Create dummy exercises"
//   onPress={() => createDummyExercises()}
// />
// <Button title="Dump settings" onPress={() => dumpDB()} />

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
export default DebugScreen;
