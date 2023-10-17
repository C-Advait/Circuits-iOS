import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../contexts/ThemeContext";
import {
  INFO_FONT_SIZE,
  PARAGRAPH_FONT_SIZE,
  PARAGRAPH_FONT_WEIGHT,
} from "../config/appConstants";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import routes from "../navigation/routes";

function ExerciseCard({
  title,
  subTitle,
  accentColor,
  clickDrag = false,
  style,
  ...rest
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  accentColor = accentColor ? accentColor : theme.tileBackground;

  const handlePress = () => {
    console.log("Delete Pressed");
  };

  const handleExerciseEditNavigation = () => {
    rest.exercise
      ? navigation.navigate(routes.EXERCISE_EDIT_SCREEN, {
          isRoutineEditing: rest.isRoutineEditing,
          isExerciseEditing: rest.isExerciseEditing,
          originalExercise: rest.referenceExercise,
          exercise: rest.exercise,
        })
      : null;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <TouchableOpacity style={styles.closeButton} onPress={handlePress}>
        <EvilIcons name="close" size={35} color="white" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <TouchableWithoutFeedback
          style={styles.touchable}
          onPress={() => handleExerciseEditNavigation()}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>{subTitle}</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={[styles.dragContainer]}>
          {clickDrag && (
            <MaterialIcons
              name="drag-indicator"
              size={32}
              color={theme.text60}
            /> // Color needs to be changed
          )}
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    accent: {
      width: 3,
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
    },
    touchable: {
      flexDirection: "row",
    },
    container: {
      backgroundColor: theme.tileBackground,
      borderRadius: 8,
      height: 69,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
      paddingVertical: 10,
    },
    contentContainer: {
      flex: 1,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    closeButton: {
      height: 69,
      width: 60,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 5,
    },
    dragContainer: {
      width: 40,
      marginRight: 7,
    },
    infoContainer: {
      justifyContent: "center",
      width: "80%",
    },
    title: {
      color: theme.text87,
      fontSize: PARAGRAPH_FONT_SIZE,
      fontWeight: PARAGRAPH_FONT_WEIGHT,
      marginBottom: 10,
    },
    subTitle: {
      color: theme.text60,
      fontSize: INFO_FONT_SIZE,
    },
  });

export default ExerciseCard;
