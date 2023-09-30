import React from "react";
import { StyleSheet, Button } from "react-native";
import Screen from "../components/Screen";
import { useNavigation } from "@react-navigation/core";
import Header from "../components/Header";
import routes from "../navigation/routes";
import AuxiliaryCard from "../components/AuxiliaryCard";
import { useTheme } from "../contexts/ThemeContext";
import DummyInputComponent from "../components/DummyInputComponent";

function RoutineEditScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <Screen>
      <Header>RoutineEditScreen</Header>
      <Button
        title="Back to routines"
        onPress={() => navigation.navigate(routes.ROUTINES_SCREEN)}
      />
      <AuxiliaryCard
        title="Warmup"
        accentColour={theme.accentGreen}
        InputComponent={DummyInputComponent}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default RoutineEditScreen;
