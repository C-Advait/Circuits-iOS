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
      <Header>Routines</Header>
      <View style={{ padding: "5%", gap: 12 }}>
        <RoutineCard
          accentColour={theme.accentGreen}
          title="Arms"
          duration={3600}
        />
        <RoutineCard
          accentColour={theme.accentPurple}
          title="Leg Workout A"
          duration={5100}
        />
        <RoutineCard
          accentColour={theme.accentDarkBlue}
          title="Climbing Circuit"
          duration={7200}
        />
        <RoutineCard
          accentColour={theme.accentLightBlue}
          title="Morning Meditation"
          duration={300}
        />
        <RoutineCard
          accentColour={theme.accentOrange}
          title="Morning Meditation"
          duration={300}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default RoutinesScreen;
