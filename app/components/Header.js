import React from "react";
import { StyleSheet, Text } from "react-native";
import { useAppContext } from "../contexts/AppContext";

function Header({ children, style }) {
  const { theme } = useAppContext();
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
