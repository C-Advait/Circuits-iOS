import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { useNavigation } from "@react-navigation/core";

import routes from "../navigation/routes";
import Timer from "../components/Timer";

import LabelledIconButton from "../components/buttons/LabelledIconButton";
import { useTheme } from "../contexts/ThemeContext";

function TimerScreen({ route }) {
  const navigation = useNavigation();

  const { theme } = useTheme();
  const styles = getStyles(theme);

  const confirmedNavigate = () => {
    Alert.alert(
      "Confirm", // title
      "Are you sure you want to end this routine?", // message
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate(routes.ROUTINES_SCREEN),
        },
      ],
      { cancelable: false },
    );
  };

  // Check header for length, and potentially truncate!
  return (
    <Screen>
      <View style={styles.topContainer}>
        <Text style={styles.routineTitle}>{route.params.title}</Text>
        <View style={styles.backButtonContainer}>
          <LabelledIconButton
            title={"End"}
            foregroundColor="white"
            onPress={confirmedNavigate}
            style={styles.backButton}
            textStyle={{ fontSize: 17, fontWeight: "bold" }}
          />
        </View>
      </View>
      <Timer duration={30} title="Rest" />
    </Screen>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    backButton: {
      backgroundColor: "rgba(255, 255, 255, 0.14)",
      width: 65,
      height: 35,
      borderRadius: 18,
    },
    routineTitle: {
      color: theme.foreground,
      fontWeight: "bold",
      fontSize: 17,
    },
    topContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 25,
    },
    backButtonContainer: {
      alignItems: "center",
      flexDirection: "row",
      height: "100%",
      position: "absolute",
      right: 22,
    },
  });

export default TimerScreen;
