import React from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import Screen from "../components/Screen";
import Header from "../components/Header";

import {
  dropTable,
  getExercisesForRoutine,
  createExercise,
} from "../db/DBActions";
import { createTables } from "../db/DBSetup";
import { Exercise, Tag } from "../classes/Exercise";

const resetDB = async () => {
  dropTable("Exercise")
    .then(createTables())
    .then(Alert.alert("Table 'Exercise' dropped and recreated!"));
};

const dumpDB = async () => {
  const exercises = await getExercisesForRoutine("routine_001");
  console.log(
    "All exercises for routine 'routine_001'",
    JSON.stringify(exercises, null, 2),
  );
};

const addDummyExercise = async () => {
  const myExercise = new Exercise({
    routineID: "routine_001",
    title: "Jumping Jacks",
    tag: Tag.GENERIC,
    workTime: 30,
    numberOfRounds: 5,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
    category: "Cardio",
  });

  console.log(
    "About to create exercise: ",
    JSON.stringify(myExercise, null, 2),
  );
  createExercise(myExercise);
};

function SettingsScreen() {
  return (
    <Screen>
      <View style={styles.topPanel}>
        <Header>Settings</Header>
      </View>
      <Button title="Dump DB" onPress={() => dumpDB()} />
      <Button
        title="Create dummy exercise"
        onPress={() => addDummyExercise()}
      />
      <Button title="Reset DB" onPress={() => resetDB()} />
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
