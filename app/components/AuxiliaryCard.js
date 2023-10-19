import React from "react";
import { View, StyleSheet, Text } from "react-native";

import { useSettings } from "../contexts/SettingsContext";
import EditableText from "./EditableText";
import { PARAGRAPH_FONT_SIZE } from "../config/appConstants";
import { TouchableOpacity } from "react-native-gesture-handler";

function AuxiliaryCard({
  accentColor = "transparent",
  bold = false,
  editable = false,
  title,
  Icon,
  onPress,
  children,
}) {
  const { theme } = useSettings();
  const styles = getStylesActive(theme); // disabled ? getStylesDisabled(theme) : getStylesActive(theme);
  accentColor = accentColor || theme.backgroundFaded;

  const fontWeight = bold ? 600 : 400;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={onPress}
    >
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      {Icon ? (
        <View style={styles.iconContainer}>
          <Icon />
        </View>
      ) : null}
      <View style={styles.contentContainer}>
        {editable ? (
          <EditableText
            placeholder={title}
            style={[styles.textStyle, { fontWeight: fontWeight }]}
          />
        ) : (
          <Text style={[styles.textStyle, { fontWeight: fontWeight }]}>
            {title}
          </Text>
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
}

const getStylesActive = (theme) =>
  StyleSheet.create({
    accent: {
      width: 3,
      height: "100%",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    container: {
      alignItems: "center",
      backgroundColor: theme.secondaryBackground,
      borderRadius: 8,
      flexDirection: "row",
      height: 42,
      overflow: "hidden",
    },
    contentContainer: {
      alignContent: "center",
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
      padding: 10,
      paddingHorizontal: 16,
    },
    header: {
      color: theme.text87,
      fontSize: PARAGRAPH_FONT_SIZE,
    },
    iconContainer: {
      marginLeft: 10,
    },
    subtitle: {
      fontSize: 18,
      marginTop: 5,
    },
    textStyle: {
      color: theme.text87,
      fontSize: PARAGRAPH_FONT_SIZE,
    },
  });

const getStylesDisabled = (theme) =>
  StyleSheet.create({
    accent: {
      width: 3,
      height: "100%",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    container: {
      alignItems: "center",
      backgroundColor: theme.tileBackground,
      borderRadius: 8,
      flexDirection: "row",
      height: 42,
      overflow: "hidden",
    },
    contentContainer: {
      alignContent: "center",
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
      padding: 10,
      paddingHorizontal: 16,
    },
    header: {
      color: theme.text87,
      fontSize: PARAGRAPH_FONT_SIZE,
    },
    iconContainer: {
      marginLeft: 16,
      marginRight: 8,
    },
    subtitle: {
      fontSize: 18,
      marginTop: 5,
    },
    textStyle: {
      color: theme.textDisabled,
      fontSize: PARAGRAPH_FONT_SIZE,
    },
  });

export default AuxiliaryCard;
