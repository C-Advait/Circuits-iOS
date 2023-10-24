import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
  Switch,
} from "react-native";
import Header from "../components/Header";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";

import { useSettings } from "../contexts/SettingsContext";
import { Feather } from "@expo/vector-icons";

// localize 'behaviour'?
function SettingsScreen() {
  const { theme } = useSettings();
  const styles = getStyles(theme);
  const [componentSoundOn, setComponentSoundOn] = useState(true);
  const [componentHaptics, setComponentHaptics] = useState(true);

  const { setHaptics, setSoundOn } = useSettings();

  const toggleSound = () => {
    setComponentSoundOn((prev) => !prev);
    setSoundOn((prev) => !prev);
  };
  const toggleHaptics = async () => {
    if (!componentHaptics)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setComponentHaptics((prev) => !prev);
    setHaptics((prev) => !prev);
  };

  const behaviour = [
    {
      id: 1,
      title: "Haptics",
      onTouchablePress: toggleHaptics,
      Component: (
        <Switch
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          onValueChange={toggleHaptics}
          value={componentHaptics}
        />
      ),
    },
    {
      id: 2,
      title: "Sounds",
      onTouchablePress: toggleSound,
      Component: (
        <Switch
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          onValueChange={toggleSound}
          value={componentSoundOn}
        />
      ),
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

  const renderItem = (item, isLast) => (
    <React.Fragment key={item.id}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.item}
        onPress={
          item.onTouchablePress
            ? item.onTouchablePress
            : () => {
                Alert.alert(item.title, item.title);
              }
        }
      >
        <Text style={styles.choiceText}>{item.title}</Text>
        {item.Component ? (
          item.Component
        ) : (
          <Feather name="chevron-right" color={theme.text38} size={25} />
        )}
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
        {renderSection("Behaviour", behaviour)}
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
      backgroundColor: theme.tertiaryBackground,
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
