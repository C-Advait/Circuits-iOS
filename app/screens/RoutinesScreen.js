import React from "react";
import { StyleSheet, Button } from "react-native";
import Screen from "../components/Screen";
import { useNavigation } from "@react-navigation/core";

import Header from "../components/Header";
import routes from "../navigation/routes";
import RoutineCard from "../components/RoutineCard";
import { useTheme } from "../contexts/ThemeContext";

import { View } from "react-native";

function RoutinesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <Screen>
      <Header>RoutinesScreen</Header>
      <Button
        title={"Edit"}
        onPress={() => navigation.navigate(routes.ROUTINE_EDIT_SCREEN)}
      />
      <Button
        title={"Go to timer"}
        onPress={() => navigation.navigate(routes.TIMER_SCREEN)}
      />
      <View style={{ padding: "5%" }}>
        <RoutineCard
          accentColour={theme.accentGreen}
          title="Arms"
          duration={40}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default RoutinesScreen;
