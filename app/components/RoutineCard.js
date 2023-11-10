import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useSettings } from "../contexts/SettingsContext";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ROUTINE_PARAGRAPH_FONT_SIZE,
  ROUTINE_TITLE_FONT_SIZE,
} from "../config/appConstants";
import { IconButton, RoutineActionButton } from "./buttons";
import { formatDuration } from "../utilities/formatDuration";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import routes from "../navigation/routes";
import Collapsible from "react-native-collapsible";
import { deleteRoutine, getExercisesForRoutine } from "../db/DBActions";
import { useRoutineContext } from "../contexts/RoutineContext";
import { Tag } from "../classes/Exercise";

function RoutineCard({
  routine,
  isExpanded,
  toggleExpand,
  deleteCallback,
  isEnabled = true,
}) {
  const navigation = useNavigation();
  const { theme } = useSettings();
  const styles = getStyles(theme);
  const [description, setDescription] = useState();
  const { setContextExercises, setContextRoutine } = useRoutineContext(); // Manage Context Variables
  const createDescription = async () => {
    const exercises = await getExercisesForRoutine(routine.id);

    // console.log(JSON.stringify(exercises, null, 2));

    const formattedExerciseString =
      exercises
        .map((exercise) => {
          if (exercise.tag === Tag.WORKING) {
            return `${exercise.title} (${
              exercise.numberOfRounds
            } x ${formatDuration(exercise.workTime)})`;
          } else {
            // Warmup / cooldown shouldnt't display number of rounds
            if (exercise.workTime)
              return `${exercise.title} (${formatDuration(exercise.workTime)})`;
            return "";
          }
        })
        .filter(Boolean)
        .join("\n") + "\n";

    const formattedLoopString =
      routine.numberOfLoops > 1 ? `\nLoops ${routine.numberOfLoops} times` : "";

    setDescription(formattedExerciseString + formattedLoopString);
  };

  useFocusEffect(
    useCallback(() => {
      createDescription();
    }, [routine]),
  );

  const handleEditRoutineOnpress = async () => {
    try {
      const exercises = await getExercisesForRoutine(routine.id); // Duplicated backend call here

      setContextRoutine(routine);
      setContextExercises(exercises);
      navigation.navigate(routes.ROUTINE_EDIT_SCREEN, { edit: true });
    } catch (error) {
      console.log("Error in navigating to edit routine: ", error);
    }
  };

  return !isEnabled ? (
    <View style={styles.container}>
      <View style={[styles.accent, { backgroundColor: "#38383A" }]} />
      <View style={styles.permanentInfoContainer}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Feather name="lock" size={20} color="#646464" />
            <Text
              style={[
                styles.header,
                { fontWeight: "600", color: theme.textDisabled, marginLeft: 6 },
              ]}
            >
              {routine.title}
            </Text>
          </View>
          <Text style={styles.duration}>
            {formatDuration(routine.duration)}
          </Text>
        </View>
        <IconButton
          iconName={"chevron-down"}
          IconFamily={Feather}
          iconSize={52}
          foregroundColor={"#646464"}
          onPress={() => toggleExpand()}
        />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      {routine.color ? (
        <View style={[styles.accent, { backgroundColor: routine.color }]} />
      ) : null}
      <TouchableOpacity onPress={() => toggleExpand()} activeOpacity={0.8}>
        <View style={styles.permanentInfoContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.header}>{routine.title}</Text>
            <Text style={styles.duration}>
              {formatDuration(routine.duration)}
            </Text>
          </View>
          <IconButton
            iconName={isExpanded ? "chevron-up" : "chevron-down"}
            IconFamily={Feather}
            iconSize={52}
            foregroundColor={theme.text60}
            onPress={() => toggleExpand()}
          />
        </View>

        <Collapsible collapsed={!isExpanded} duration={350}>
          <>
            <Text style={styles.body}>{description}</Text>
            <View style={styles.buttonContainer}>
              <RoutineActionButton
                title="Start"
                onPress={() =>
                  navigation.navigate(routes.TIMER_SCREEN, {
                    id: routine.id,
                    numberOfLoops: routine.numberOfLoops,
                    title: routine.title,
                    totalDuration: routine.duration,
                  })
                }
                iconName="play-outline"
                IconFamily={Ionicons}
                foregroundColor={theme.primary}
              />
              <RoutineActionButton
                title="Edit"
                onPress={() => handleEditRoutineOnpress()}
                iconName="edit-2"
                iconSize={40}
                IconFamily={Feather}
                foregroundColor={theme.primary}
              />
              <IconButton
                iconName="trash-can-outline"
                IconFamily={MaterialCommunityIcons}
                foregroundColor={theme.danger}
                onPress={() => confirmDeletion(routine, deleteCallback)}
                style={{ marginLeft: 0, alignItems: "flex-start" }}
              />
            </View>
          </>
        </Collapsible>
      </TouchableOpacity>
    </View>
  );
}

const confirmDeletion = (item, deleteCallback) => {
  Alert.alert(
    "Confirm Deletion", // Alert title
    `Are you sure you want to delete '${item.title}'?`, // Alert message
    [
      // Array of buttons
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel", // iOS style for the cancel button
      },
      {
        text: "Delete",
        onPress: () => {
          deleteRoutine(item.id);
          deleteCallback();
        },
        style: "destructive", // iOS style indicating a destructive action
      },
    ],
    {
      cancelable: true, // Whether tapping outside the alert box will cancel it
    },
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    accent: {
      height: "100%",
      position: "absolute",
      width: 3,
    },
    body: {
      color: theme.text60,
      fontSize: ROUTINE_PARAGRAPH_FONT_SIZE,
      marginBottom: 16,
      marginTop: 8,
    },
    buttonContainer: {
      alignItems: "center",
      flexDirection: "row",
      gap: 18,
      justifyContent: "flex-start",
      marginBottom: 12,
    },
    chevron: {
      alignSelf: "center",
    },
    container: {
      backgroundColor: theme.secondaryBackground,
      borderRadius: 8,
      overflow: "hidden",
      paddingLeft: 24,
      paddingRight: 16,
    },
    duration: {
      color: theme.text60,
      fontSize: ROUTINE_PARAGRAPH_FONT_SIZE,
      fontWeight: "600",
    },
    disabled: {
      color: "#121212",
    },
    header: {
      color: theme.primary,
      fontSize: ROUTINE_TITLE_FONT_SIZE,
      fontWeight: "700",
      marginBottom: 8,
    },
    permanentInfoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 12,
    },
  });

export default RoutineCard;
