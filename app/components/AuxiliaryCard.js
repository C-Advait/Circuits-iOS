import React from "react";
import { View, StyleSheet, Text } from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import EditableText from "./EditableText";
import { PARAGRAPH_FONT_SIZE } from "../config/appConstants";

function AuxiliaryCard({
  accentColour,
  bold = false,
  editable = true,
  title,
  Icon,
  InputComponent,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const fontWeight = bold ? 600 : 400;
  const textStyle = [styles.header, { fontWeight: fontWeight }];

  return (
    <View style={styles.container}>
      {Icon ? (
        <View style={styles.iconContainer}>
          <Icon />
        </View>
      ) : null}
      {accentColour ? (
        <View style={[styles.accent, { backgroundColor: accentColour }]} />
      ) : null}
      <View style={styles.contentContainer}>
        {editable ? (
          <EditableText placeholder={title} style={textStyle} />
        ) : (
          <Text style={textStyle}>{title}</Text>
        )}
        <InputComponent />
      </View>
    </View>
  );
}

const getStyles = (theme) =>
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
      marginHorizontal: 16,
    },
    contentContainer: {
      alignContent: "center",
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
      padding: 10,
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
  });

export default AuxiliaryCard;
