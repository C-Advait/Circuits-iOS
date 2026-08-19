import React from "react";
import { View, StyleSheet, Button, Alert } from "react-native";

import Screen from "../components/Screen";
import Header from "../components/Header";
import { dropTable } from "../db/DBActions";
import { createTables, setDefaultValues } from "../db/DBSetup";

const resetDB = async () => {
  dropTable("Exercise")
    .then(dropTable("Routine"))
    .then(dropTable("Setting"))
    .then(dropTable("RoutineCompletion"))
    .then(createTables())
    .then(setDefaultValues())
    .then(Alert.alert("All tables dropped and recreated!"));
};

function DebugScreen() {
  return (
    <Screen>
      <View style={styles.topPanel}>
        <Header>Debug</Header>
      </View>
      <Button title="Reset DB" onPress={() => resetDB()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
