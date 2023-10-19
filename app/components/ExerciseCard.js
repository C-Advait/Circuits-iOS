import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useSettings } from "../contexts/ThemeContext";
import {
  INFO_FONT_SIZE,
  PARAGRAPH_FONT_SIZE,
  PARAGRAPH_FONT_WEIGHT,
} from "../config/appConstants";
import routes from "../navigation/routes";

function ExerciseCard({ title, subTitle, accentColor, drag, style, ...rest }) {
  const { theme } = useSettings();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  accentColor = accentColor ? accentColor : theme.tileBackground;

  const handlePress = () => {
    console.log("Delete Pressed");
    console.log("Delete Pressed");
  };

  const handleExerciseEditNavigation = () => {
    rest.referenceExercise
      ? navigation.navigate(routes.EXERCISE_EDIT_SCREEN, {
          isRoutineEditing: rest.isRoutineEditing,
          isExerciseEditing: rest.isExerciseEditing,
          referenceExercise: rest.referenceExercise,
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
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => handleExerciseEditNavigation()}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.subTitle} numberOfLines={1}>
              {subTitle}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.dragContainer]}>
          <TouchableOpacity onPressIn={drag}>
            <MaterialIcons
              name="drag-indicator"
              size={32}
              color={theme.text60}
            />
          </TouchableOpacity>
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
      width: "60%",
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
      width: "100%",
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
