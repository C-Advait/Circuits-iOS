import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, FlatList, Alert, Text } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import Header from "../components/Header";
import RoutineCard from "../components/RoutineCard";
import { useAppContext } from "../contexts/AppContext";
import { View } from "react-native";
import {
  DEFAULT_COOLDOWN,
  DEFAULT_WARMUP,
  DEFAULT_ROUTINE,
  TAB_BAR_HEIGHT,
} from "../config/appConstants";
import { Feather } from "@expo/vector-icons";
import { IconButton } from "../components/buttons";
import routes from "../navigation/routes";
import { getAllRoutines } from "../db/DBActions";
import EmptyRoutinesListComponent from "../components/EmptyRoutinesListComponent";
import { Exercise } from "../classes/Exercise";
import { Routine } from "../classes/Routine";
import { useRoutineContext } from "../contexts/RoutineContext";
import Screen from "../components/Screen";
import { routineAccentColors } from "../config/colors";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function RoutinesScreen() {
  const navigation = useNavigation();
  const { theme, isPremium } = useAppContext();
  const styles = getStyles(theme);

  const [routines, setRoutines] = useState([]);
  const [userRoutines, setUserRoutines] = useState([]);
  const [defaultRoutines, setDefaultRoutines] = useState([]);
  const { setContextRoutine, setContextExercises } = useRoutineContext(); // Manage context variables
  const [dataHash, setDataHash] = useState(null);

  const loadRoutines = async () => {
    const newRoutines = await getAllRoutines();
    const newHash = hashString(JSON.stringify(newRoutines));

    if (newHash !== dataHash) {
      const userCreatedRoutines = [];
      const defRoutines = [];

      newRoutines.forEach((element) => {
        if (element.userCreated) {
          userCreatedRoutines.push(element);
        } else {
          defRoutines.push(element);
        }
      });

      setRoutines(newRoutines);
      setUserRoutines(userCreatedRoutines);
      setDefaultRoutines(defRoutines);
      setDataHash(newHash);
    }
  };

  useFocusEffect(() => {
    loadRoutines();
  });

  // Initialize all items as not expanded.
  const [expandedStates, setExpandedStates] = useState(
    new Array(routines.length).fill(false),
  );

  const toggleExpand = useCallback(
    (index) => {
      const newStates = [...expandedStates];
      newStates[index] = !newStates[index];
      setExpandedStates(newStates);
    },
    [expandedStates],
  );

  const handleNewRoutineOnpress = async () => {
    try {
      const accentColorsArray = Object.values(routineAccentColors);
      const randomAccentColor =
        accentColorsArray[Math.floor(Math.random() * accentColorsArray.length)];

      const routine = new Routine({
        ...DEFAULT_ROUTINE,
        title: `New Routine`,
        color: randomAccentColor,
      });

      const warmup = new Exercise({
        ...DEFAULT_WARMUP,
        exerciseOrder: 0,
      });
      const cooldown = new Exercise({
        ...DEFAULT_COOLDOWN,
        exerciseOrder: 1,
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

  const handleBlockedRoutineCreation = () => {
    Alert.alert(
      "You are on the Free Tier.", // Alert Title
      "Create unlimited routines and more with Circuits Premium.", // Alert Message
      [
        {
          text: "View Circuits Premium", // First button text
          onPress: () =>
            navigation.navigate(routes.SUBSCRIPTION_SCREEN, {
              prevScreen: routes.ROUTINES_SCREEN,
            }), // Handler for button press
          isPreferred: true,
        },
        {
          text: "Got it", // Second button text
          onPress: () => null, // Handler for button press
          // style: "cancel", // Style for the button, 'cancel' will make it the less prominent button
        },
      ],
      {
        cancelable: true, // Whether to close the dialog on tapping outside
        onDismiss: () => null,
        userInterfaceStyle: "dark",
      },
    );
  };

  const combineData = () => {
    let ret = [];

    if (userRoutines.length) {
      ret.push({
        section: true,
        id: "user-routines-title",
        title: "Custom routines",
      });
      ret = ret.concat(userRoutines);
    }

    if (defaultRoutines.length) {
      ret.push({
        section: true,
        id: "default-routines-title",
        title: "Default routines",
      });
      ret = ret.concat(defaultRoutines);
    }

    return ret;
  };

  const renderRoutineCard = ({ item: routine, index }) => {
    if (!routine.section)
      return (
        <RoutineCard
          routine={routine}
          isExpanded={expandedStates[index]}
          toggleExpand={() => toggleExpand(index)}
          deleteCallback={() => {
            loadRoutines();
            setExpandedStates((prev) =>
              new Array(Math.max(prev.length - 1, 0)).fill(false),
            );
          }}
          isEnabled={isPremium ? true : !routine.userCreated || index <= 3}
        />
      );
    else
      return (
        <View style={styles.sectionBreak}>
          <Text style={styles.sectionText}>{routine.title}</Text>
        </View>
      );
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
          onPress={() => {
            isPremium
              ? handleNewRoutineOnpress()
              : userRoutines.length < 10
                ? handleNewRoutineOnpress()
                : handleBlockedRoutineCreation();
          }}
        />
      </View>
      <FlatList
        data={combineData()}
        renderItem={renderRoutineCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ marginHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: TAB_BAR_HEIGHT }} />}
        ListEmptyComponent={EmptyRoutinesListComponent}
      />
    </Screen>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    topPanel: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 45,
      marginLeft: 15,
      marginBottom: 24,
      marginHorizontal: 10,
      marginTop: 25,
    },
    middlePanel: {
      height: 25,
      marginLeft: 16,
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    sectionBreak: {
      alignItems: "flex-end",
      flexDirection: "row",
      height: 18,
      justifyContent: "flex-start",
      marginTop: 10,
      backgroundColor: 'transparent'
    },
    sectionText: {
      color: theme.secondary,
      fontSize: 14,
      fontWeight: "500",
    },
  });

export default RoutinesScreen;
