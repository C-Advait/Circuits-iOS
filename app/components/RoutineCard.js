import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import {
  ROUTINE_PARAGRAPH_FONT_SIZE,
  ROUTINE_TITLE_FONT_SIZE,
} from "../config/appConstants";

// TODO: Convert minutes to xxh yym

const RoutineCard = ({
  accentColour,
  duration, // Minutes; convert in this component
  title,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {accentColour ? (
        <View style={[styles.accent, { backgroundColor: accentColour }]} />
      ) : null}
      <View style={styles.permanentInfoContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.header}>{title}</Text>
          <Text style={styles.duration}>{duration}m</Text>
        </View>
        <TouchableOpacity
          style={styles.chevron}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Feather
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={26}
            color={theme.text60}
          />
        </TouchableOpacity>
      </View>

      {isExpanded ? (
        <>
          <Text style={styles.body}>Body</Text>
          <View style={styles.buttonContainer}>
            <Button title="start" onPress={() => console.log("start")} />
            <Button title="edit" onPress={() => console.log("edit")} />
            <Button title="delete" onPress={() => console.log("delete")} />
          </View>
        </>
      ) : null}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    accent: {
      borderBottomLeftRadius: 8,
      borderTopLeftRadius: 8,
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
      flexDirection: "row",
      justifyContent: "space-between",
    },
    chevron: {
      alignSelf: "center",
    },
    container: {
      backgroundColor: theme.tileBackground,
      borderRadius: 8,
      paddingLeft: 24,
      paddingRight: 16,
      width: "90%",
    },
    duration: {
      color: theme.text60,
      fontSize: ROUTINE_PARAGRAPH_FONT_SIZE,
      fontWeight: 600,
    },
    header: {
      color: theme.primary,
      fontSize: ROUTINE_TITLE_FONT_SIZE,
      marginBottom: 8,
    },
    permanentInfoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 12,
    },
  });

export default RoutineCard;
