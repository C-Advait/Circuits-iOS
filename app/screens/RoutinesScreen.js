import React, { useState, useCallback } from "react";
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
    {
      id: 6,
      title: "Arms",
      duration: 3600,
      accentColour: theme.accentOrange,
    },
    {
      id: 7,
      title: "Leg Workout A",
      duration: 5100,
      accentColour: theme.accentLightBlue,
    },
    {
      id: 8,
      title: "Climbing Circuit",
      duration: 7200,
      accentColour: theme.accentDarkBlue,
    },
    {
      id: 9,
      title: "Morning Meditation",
      duration: 300,
      accentColour: theme.accentPurple,
    },
    {
      id: 10,
      title: "Morning Meditation",
      duration: 300,
      accentColour: theme.accentGreen,
    },
    {
      id: 11,
      title: "Arms",
      duration: 3600,
      accentColour: theme.accentOrange,
    },
    {
      id: 12,
      title: "Leg Workout A",
      duration: 5100,
      accentColour: theme.accentLightBlue,
    },
    {
      id: 13,
      title: "Climbing Circuit",
      duration: 7200,
      accentColour: theme.accentDarkBlue,
    },
    {
      id: 14,
      title: "Morning Meditation",
      duration: 300,
      accentColour: theme.accentPurple,
    },
    {
      id: 15,
      title: "Morning Meditation",
      duration: 300,
      accentColour: theme.accentGreen,
    },
  ];

  // Initialize all items as not expanded.
  const [expandedStates, setExpandedStates] = useState(
    new Array(data.length).fill(false),
  );

  // State to track if all items are expanded or collapsed.
  const [expandedCount, setExpandedCount] = useState(0);

  const toggleExpand = useCallback(
    (index) => {
      // If the current item is expanded, decrement, else increment
      if (expandedStates[index]) {
        setExpandedCount((prevCount) => prevCount - 1);
      } else {
        setExpandedCount((prevCount) => prevCount + 1);
      }

      // Toggle the specific item's state
      const newStates = [...expandedStates];
      newStates[index] = !newStates[index];
      setExpandedStates(newStates);
    },
    [expandedStates],
  );

  const expandCollapseAll = useCallback(() => {
    if (expandedCount === data.length) {
      setExpandedStates(new Array(data.length).fill(false));
      setExpandedCount(0);
    } else {
      setExpandedStates(new Array(data.length).fill(true));
      setExpandedCount(data.length);
    }
  }, [expandedCount, data.length]);

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
            iconName={
              expandedCount === data.length ? "minimize-2" : "maximize-2"
            }
            IconFamily={Feather}
            iconSize={40}
            foregroundColour={theme.text87}
            style={{ marginRight: 10 }}
            onPress={() => expandCollapseAll()}
          />
        </View>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <RoutineCard
              item={item}
              isExpanded={expandedStates[index]}
              toggleExpand={() => toggleExpand(index)}
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
