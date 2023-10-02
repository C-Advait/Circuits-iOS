import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ROUTINE_PARAGRAPH_FONT_SIZE,
  ROUTINE_TITLE_FONT_SIZE,
} from "../config/appConstants";
import { IconButton } from "./buttons";
import RoutineActionButton from "./buttons/RoutineActionButton";
import formatDuration from "../utilities/formatDuration";
import { useNavigation } from "@react-navigation/native";
import routes from "../navigation/routes";

function RoutineCard({
  accentColour,
  duration, // In seconds
  title,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {accentColour ? (
        <View style={[styles.accent, { backgroundColor: accentColour }]} />
      ) : null}
      <TouchableOpacity 
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.8}>
        <View style={styles.permanentInfoContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.header}>{title}</Text>
            <Text style={styles.duration}>{formatDuration(duration)}</Text>
          </View>
          <View
            style={styles.chevron}
          >
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={26}
              color={theme.text60}
            />
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded ? (
        <>
          <Text style={styles.body}>
            Pushups (3x1min){"\n"}
            Dips (5x60s){"\n"}
            Hammer Curls (4x30s){"\n"}
            Bicep Curls (4x30s){"\n"}
            {"\n"}
            Loops 2 times
          </Text>
          <View style={styles.buttonContainer}>
            <RoutineActionButton
              title="Start"
              onPress={() => navigation.navigate(routes.TIMER_SCREEN)}
              iconName="play-outline"
              IconFamily={Ionicons}
              foregroundColour={theme.text87}
            />
            <RoutineActionButton
              title="Edit"
              onPress={() => navigation.navigate(routes.ROUTINE_EDIT_SCREEN)}
              iconName="edit-2"
              IconFamily={Feather}
              foregroundColour={theme.text87}
            />
            <IconButton
              iconName="trash-can-outline"
              IconFamily={MaterialCommunityIcons}
              foregroundColour={theme.danger}
              onPress={() => Alert.alert("Delete", "Delete")}
            />
          </View>
        </>
      ) : null}
    </View>
  );
}

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
      gap: 20,
      justifyContent: "flex-start",
      marginBottom: 12,
    },
    chevron: {
      alignSelf: "center",
    },
    container: {
      backgroundColor: theme.tileBackground,
      borderRadius: 8,
      overflow: "hidden",
      paddingLeft: 24,
      paddingRight: 16,
    },
    duration: {
      color: theme.text60,
      fontSize: ROUTINE_PARAGRAPH_FONT_SIZE,
      fontWeight: 600,
    },
    header: {
      color: theme.text87,
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
