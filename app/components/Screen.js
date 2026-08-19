import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../contexts/AppContext";

function Screen({ children, style }) {
  const { theme } = useAppContext();
  const styles = getStyles(theme);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.screen, style]}
    >
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    screen: {
      backgroundColor: theme.background,
      flex: 1,
    },
    view: {
      flex: 1,
    },
  });

export default Screen;
