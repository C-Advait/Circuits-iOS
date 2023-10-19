import React from "react";
import Constants from "expo-constants";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { useSettings } from "../contexts/ThemeContext";

function Screen({ children, style }) {
  const { theme } = useSettings();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    screen: {
      backgroundColor: theme.background,
      paddingTop: Constants.statusBarHeight,
      flex: 1,
    },
    view: {
      flex: 1,
    },
  });

export default Screen;
