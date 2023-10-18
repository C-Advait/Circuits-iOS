import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import Constants from "expo-constants";

import { IconButton } from "../components/buttons";

import { useTheme } from "../contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";

const appearance = [
  {
    id: 1,
    title: "Haptics",
  },
  {
    id: 2,
    title: "Something else",
  },
];

const support = [
  {
    id: 4,
    title: "Contact us",
  },
  {
    id: 5,
    title: "Rate us",
  },
];

const privacy = [
  {
    id: 6,
    title: "Privacy policy",
  },
];

// localize 'behaviour'?
function SettingsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderItem = (item, isLast) => (
    <React.Fragment key={item.id}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.item}
        onPress={() => {
          console.log(item);
        }}
      >
        <Text style={styles.choiceText}>{item.title}</Text>
        <Feather name="chevron-right" color={theme.text38} size={25} />
      </TouchableOpacity>
      {!isLast ? <View style={styles.separator} /> : null}
    </React.Fragment>
  );

  const renderSection = (title, data) => (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.group}>
        {data.map((item, index) => renderItem(item, index === data.length - 1))}
      </View>
    </>
  );

  // The IconButton here is purely a hack to
  // align the headers between Tab.Screens.
  return (
    <View style={styles.container}>
      <View style={styles.topPanel}>
        <Header>Settings</Header>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {renderSection("Appearance & Behaviour", appearance)}
        {renderSection("Support", support)}
        {renderSection("Privacy", privacy)}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    choiceText: {
      color: theme.primary,
      fontSize: 17,
    },
    container: {
      backgroundColor: theme.background,
      paddingTop: Constants.statusBarHeight,
      flex: 1,
      // height: "100%"
    },
    group: {
      borderRadius: 8,
      marginBottom: 23,
      marginHorizontal: 15,
      overflow: "hidden",
    },
    item: {
      alignItems: "center",
      backgroundColor: theme.secondaryBackground,
      flexDirection: "row",
      height: 50,
      justifyContent: "space-between",
      paddingLeft: 16,
      paddingRight: 8,
      paddingVertical: 5,
    },
    scrollContainer: {
      flex: 1,
    },
    sectionTitle: {
      color: theme.secondary,
      fontSize: 14,
      fontWeight: 500,
      marginLeft: 16,
      marginBottom: 8,
    },
    separator: {
      backgroundColor: "#ffffff0c",
      height: 1,
    },
    topPanel: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 45,
      marginLeft: 15,
      marginBottom: 34,
      marginHorizontal: 10,
      marginTop: 25,
    },
  });

export default SettingsScreen;
