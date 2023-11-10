import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useAppContext } from "../contexts/AppContext";

function EmptyRoutinesListComponent() {
  const { theme } = useAppContext();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.emptyRoutinesText}>
        Please add a new routine to get started.
      </Text>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      height: 500,
      justifyContent: "center",
    },
    emptyRoutinesText: {
      fontSize: 18,
      color: theme.primary,
    },
  });

export default EmptyRoutinesListComponent;
