import React from "react";
import { StyleSheet, FlatList } from "react-native";
import Screen from "../components/Screen";

import Header from "../components/Header";
import RoutineCard from "../components/RoutineCard";
import { useTheme } from "../contexts/ThemeContext";

import { View } from "react-native";
import { TAB_BAR_HEIGHT } from "../config/appConstants";

function RoutinesScreen() {
  const { theme } = useTheme();

  const data = [
    {
      id: 1,
      title: "Arms",
      duration: 3600,
      accentColour: theme.accentOrange,
    },
    {
      id: 2,
      title: "Leg Workout A",
      duration: 5100,
      accentColour: theme.accentLightBlue,
    },
    {
      id: 3,
      title: "Climbing Circuit",
      duration: 7200,
      accentColour: theme.accentDarkBlue,
    },
    {
      id: 4,
      title: "Morning Meditation",
      duration: 300,
      accentColour: theme.accentPurple,
    },
    {
      id: 5,
      title: "Morning Meditation",
      duration: 300,
      accentColour: theme.accentGreen,
    },
  ];

  return (
    <Screen>
      <View style={{ height: "100%" }}>
        <Header>Routines</Header>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <RoutineCard
              title={item.title}
              duration={item.duration}
              accentColour={item.accentColour}
            />
          )}
          keyExtractor={(item) => item.id}
          style={{ marginHorizontal: 10 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListFooterComponent={() => (
            <View style={{ height: TAB_BAR_HEIGHT - 15 }} />
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default RoutinesScreen;
