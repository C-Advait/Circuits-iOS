import React from "react";
import { StyleSheet, Text } from "react-native";
import { useSettings } from "../contexts/ThemeContext";

function Header({ children, style }) {
  const { theme } = useSettings();
  const styles = getStyles(theme);

  return <Text style={[styles.title, style]}>{children}</Text>;
}

const getStyles = (theme) =>
  StyleSheet.create({
    title: {
      color: theme.foreground,
      fontSize: 30,
      fontWeight: 600,
    },
  });

export default Header;
