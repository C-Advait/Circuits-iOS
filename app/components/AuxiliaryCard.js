import React from "react";
import { View, StyleSheet, Text, ActionSheetIOS } from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import EditableText from "./EditableText";
import { PARAGRAPH_FONT_SIZE } from "../config/appConstants";

function AuxiliaryCard({
  accentcolor,
  bold = false,
  editable = true,
  title,
  Icon,
  InputComponent,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  accentcolor = accentcolor || theme.backgroundFaded;

  const fontWeight = bold ? 600 : 400;
  const textStyle = [styles.header, { fontWeight: fontWeight }];

  return (
    <View style={styles.container}>
      <View style={[styles.accent, { backgroundColor: accentcolor }]} />
      {Icon ? (
        <View style={styles.iconContainer}>
          <Icon />
        </View>
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
