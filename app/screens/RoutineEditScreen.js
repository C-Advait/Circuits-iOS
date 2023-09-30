import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import Screen from "../components/Screen";
import { useNavigation } from "@react-navigation/core";
import Header from "../components/Header";
import routes from "../navigation/routes";
import AuxiliaryCard from "../components/AuxiliaryCard";
import { useTheme } from "../contexts/ThemeContext";

function RoutineEditScreen(props) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <Screen>
      <Header>RoutineEditScreen</Header>
      <Button
        title="Back to routines"
        onPress={() => navigation.navigate(routes.ROUTINES_SCREEN)}
      />
      <AuxiliaryCard title="Warmup" accentColour={theme.accentGreen} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default RoutineEditScreen;
