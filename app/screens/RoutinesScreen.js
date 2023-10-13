import React, { useState, useCallback } from "react";
import { StyleSheet, FlatList, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Screen from "../components/Screen";

import Header from "../components/Header";
import RoutineCard from "../components/RoutineCard";
import { useTheme } from "../contexts/ThemeContext";
import { View } from "react-native";
import { DEFAULT_COOLDOWN, DEFAULT_WARMUP, DEFAULT_EXERCISE, DEFAULT_ROUTINE, TAB_BAR_HEIGHT } from "../config/appConstants";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { IconButton } from "../components/buttons";
import LabelledIconButton from "../components/buttons/LabelledIconButton";
import routes from "../navigation/routes";
import { getAllUserCreatedRoutines, getNewRoutineID } from "../db/DBActions";
import EmptyRoutinesListComponent from "../components/EmptyRoutinesListComponent";
import { Exercise } from "../classes/Exercise";
import { Routine } from "../classes/Routine";
import { useRoutineContext } from "../contexts/RoutineContext";

function RoutinesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [routines, setRoutines] = useState([]);
  const { setContextRoutine, setContextExercises } = useRoutineContext(); // Manage context variables

  const loadRoutines = async () => {
    const routines = await getAllUserCreatedRoutines();
    setRoutines(routines);
  };

  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, []),
  );

  // Initialize all items as not expanded.
  const [expandedStates, setExpandedStates] = useState(
    new Array(routines.length).fill(false),
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
    if (expandedCount === routines.length) {
      setExpandedStates(new Array(routines.length).fill(false));
      setExpandedCount(0);
    } else {
      setExpandedStates(new Array(routines.length).fill(true));
      setExpandedCount(routines.length);
    }
  }, [expandedCount, routines.length]);

  const handleNewRoutineOnpress = async () => {
    try {
      const routineID = await getNewRoutineID();
      const routine = new Routine({
        ...DEFAULT_ROUTINE,
        id: routineID,
        title: `My Routine #${routineID}`
      });

      const warmup = new Exercise({
        ...DEFAULT_WARMUP,
        routineID: routineID,
        exerciseOrder: 1,
      });
      const exer = new Exercise({
        ...DEFAULT_EXERCISE,
        routineID: routineID,
        exerciseOrder: 1,
      })
      const cooldown = new Exercise({
        ...DEFAULT_COOLDOWN,
        routineID: routineID,
        exerciseOrder: 1
      });
      const exercises = [warmup, cooldown];

      // Set the context variables for ROUTINE_EDIT_SCREEN
      setContextRoutine(routine);
      setContextExercises(exercises);

      navigation.navigate(routes.ROUTINE_EDIT_SCREEN, { edit: false });
    } catch (error) {
      console.error("Error navigating to new routine:", error);
    }
  };

  return (
    <Screen>
      <View style={styles.topPanel}>
        <Header>My Routines</Header>
        <IconButton
          iconName="plus"
          IconFamily={Feather}
          iconSize={55}
          foregroundColor={theme.blue}
          onPress={() =>
            handleNewRoutineOnpress()
          }
        />
      </View>
      <View style={styles.middlePanel}>
        <LabelledIconButton
          iconName="sort-ascending"
          IconFamily={MaterialCommunityIcons}
          foregroundColor={theme.text87}
          title="Recent"
          onPress={() => Alert.alert("Sort", "Sort")}
        />
        <IconButton
          iconName={
            expandedCount === routines.length ? "minimize-2" : "maximize-2"
          }
          IconFamily={Feather}
          iconSize={40}
          foregroundColor={theme.text87}
          onPress={() => expandCollapseAll()}
          style={{ width: 77, height: 50 }}
        />
      </View>
      <FlatList
        data={routines}
        renderItem={({ item, index }) => (
          <RoutineCard
            item={item}
            isExpanded={expandedStates[index]}
            toggleExpand={() => toggleExpand(index)}
            deleteCallback={() => {
              loadRoutines();
              setExpandedCount(0);
              setExpandedStates((prev) =>
                new Array(Math.max(prev.length - 1, 0)).fill(false),
              );
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ marginHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => (
          <View style={{ height: TAB_BAR_HEIGHT - 15 }} />
        )}
        ListEmptyComponent={EmptyRoutinesListComponent}
      />
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
    marginLeft: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default RoutinesScreen;
