import React from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import Screen from "../components/Screen";
import Header from "../components/Header";

import {
  dropTable, getAllUserCreatedRoutines, getSettings,
} from "../db/DBActions";
import { initTables } from "../db/DBSetup";


const resetDB = async () => {
  dropTable("Exercise")
    .then(dropTable("Routine"))
    .then(dropTable("Setting"))
    .then(initTables())
    .then(Alert.alert("All tables dropped and recreated!"));
};

function DebugScreen() {
  return (
    <Screen>
      <View style={styles.topPanel}>
        <Header>Debug</Header>
      </View>
      <Button title="Reset DB" onPress={() => resetDB()} />
      <Button title="Get Subscriptions" onPress={() => null} />
      <Button title="Request Subscription" onPress={() => null} />
      <Button title="Get routines table" onPress={() => console.log(getAllUserCreatedRoutines())} />
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
export default DebugScreen;
