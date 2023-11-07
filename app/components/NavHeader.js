import React from "react";
import { View, StyleSheet } from "react-native";

import { useSettings } from "../contexts/SettingsContext";
import Header from "./Header";

function NavHeader({
  LeftComponent,
  headerText = "Navigation Heading",
  RightComponent,
  containerStyle = {},
}) {
  LeftComponent = LeftComponent ? (
    LeftComponent
  ) : (
    <View style={{ width: 50, height: 50 }} />
  );
  RightComponent = RightComponent ? (
    RightComponent
  ) : (
    <View style={{ width: 50, height: 50 }} />
  );
  const { theme } = useSettings();
  const styles = getStyles(theme);

  return (
    <View style={[styles.navPanel, containerStyle]}>
      <View style={styles.leftView}>{LeftComponent}</View>
      <View>
        <Header style={[styles.text]}>{headerText}</Header>
      </View>
      <View style={styles.rightView}>{RightComponent}</View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    leftView: {
      position: "absolute",
      left: 0,
    },
    navPanel: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 22,
      marginTop: 5,
    },
    rightView: {
      position: "absolute",
      right: 0,
    },
    text: {
      fontSize: 17,
      fontWeight: 500,
    },
    textView: {
      position: "center",
    },
  });

export default NavHeader;
