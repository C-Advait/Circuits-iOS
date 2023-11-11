import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useAppContext } from "../contexts/AppContext";
import { INFO_FONT_SIZE } from "../config/appConstants";

function ExerciseCard({
  title,
  subTitle,
  accentColor,
  drag,
  style,
  contentOnpress,
  deleteOnpress,
}) {
  const { theme } = useAppContext();
  const styles = getStyles(theme);

  accentColor = accentColor ? accentColor : "transparent";
  accentColor = accentColor ? accentColor : "transparent";

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <TouchableOpacity style={styles.closeButton} onPress={deleteOnpress}>
        <EvilIcons name="close" size={28} color={theme.closeIcon} />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.touchable} onPress={contentOnpress}>
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
          <TouchableOpacity onPressIn={drag} style={styles.draggableOpacity}>
            <MaterialIcons
              name="drag-handle"
              size={28}
              color={theme.waffleIcon}
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
    draggableOpacity: {
      backgroundColor: "transparent",
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    touchable: {
      flexDirection: "row",
      width: "60%",
    },
    container: {
      backgroundColor: theme.secondaryBackground,
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
      height: 40,
      marginRight: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    infoContainer: {
      justifyContent: "center",
      width: "100%",
    },
    title: {
      color: theme.primary,
      fontSize: 17,
      fontWeight: "500",
      marginBottom: 7,
    },
    subTitle: {
      color: theme.text60,
      fontSize: INFO_FONT_SIZE,
    },
  });

export default ExerciseCard;
