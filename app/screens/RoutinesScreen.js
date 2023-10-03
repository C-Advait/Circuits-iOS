import React from "react";
import { StyleSheet, FlatList, Alert } from "react-native";
import Screen from "../components/Screen";

import Header from "../components/Header";
import RoutineCard from "../components/RoutineCard";
import { useTheme } from "../contexts/ThemeContext";

import { View } from "react-native";
import { TAB_BAR_HEIGHT } from "../config/appConstants";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { IconButton } from "../components/buttons";
import LabelledIconButton from "../components/buttons/LabelledIconButton";

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
        <View style={styles.topPanel}>
          <Header>Routines</Header>
          <IconButton
            iconName="plus"
            IconFamily={Feather}
            iconSize={55}
            foregroundColour={theme.blue}
            style={{ marginRight: 10 }}
            onPress={() => Alert.alert("Add new routine", "Add")}
          />
        </View>
        <View style={styles.middlePanel}>
          <LabelledIconButton
            iconName="sort-ascending"
            IconFamily={MaterialCommunityIcons}
            foregroundColour={theme.text87}
            title="Recent"
            onPress={() => Alert.alert("Sort", "Sort")}
          />
          <IconButton
            iconName="maximize-2"
            IconFamily={Feather}
            iconSize={40}
            foregroundColour={theme.text87}
            style={{ marginRight: 10 }}
            onPress={() => Alert.alert("Expand all", "Expand")}
          />
        </View>
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
  topPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 15,
    marginBottom: 34,
    marginHorizontal: 10,
    marginTop: 25,
  },
  middlePanel: {
    height: 25,
    marginHorizontal: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default RoutinesScreen;
