import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSettings } from "../../contexts/SettingsContext";

const BottomSheetHandle = ({ title, subtitle }) => {
  const { theme } = useSettings();
  const styles = getStyles(theme);

  return (
    <View style={styles.handleContainer}>
      <View style={styles.handleIndicator} />
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    handleContainer: {
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: theme.secondaryBackground,
      borderRadius: 2.5,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      gap: 10,
      height: 90,
      justifyContent: "center",
      width: "100%",
    },
    handleIndicator: {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      borderRadius: 3,
      height: 5,
      marginBottom: 5,
      width: 90,
    },
    header: {
      gap: 2,
      paddingHorizontal: 22,
      width: "100%",
    },
    subtitle: {
      color: theme.text,
      fontSize: 17,
    },
    title: {
      color: theme.primary,
      fontSize: 17,
      fontWeight: "500",
    },
  });

export default BottomSheetHandle;
