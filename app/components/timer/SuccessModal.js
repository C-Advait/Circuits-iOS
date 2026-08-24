import React, { useEffect, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import LottieView from "lottie-react-native";
import { useAppContext } from "../../contexts/AppContext";
import Header from "../Header";
import { useNavigation } from "@react-navigation/native";
import routes from "../../navigation/routes";
import { logRoutineCompletion } from "../../db/DBActions";

function SuccessModal({ routineTitle, routineID }) {
  const navigation = useNavigation();
  const animationRef = useRef(null);
  const animationPlayedRef = useRef(false);
  const { theme } = useAppContext();
  const styles = getStyles(theme);

  useEffect(() => {
    logRoutineCompletion(routineID);
  }, [routineID]);

  useEffect(() => {
    if (animationPlayedRef.current) return;

    animationPlayedRef.current = true;
    animationRef.current?.play();
  }, []);

  return (
    <View
      accessibilityViewIsModal
      style={[StyleSheet.absoluteFill, styles.overlay]}
    >
      <View style={styles.topContainer}>
        <Text style={styles.routineTitle}>{routineTitle}</Text>
      </View>
      <LottieView
        ref={animationRef}
        source={require("../../assets/lotties/success.json")}
        loop={false}
        style={{ height: 400, width: 400 }}
      />
      <View style={styles.completeContainer}>
        <Header>Complete!</Header>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.touchable}
        onPress={() => navigation.popTo(routes.ROUTINES_SCREEN)}
      >
        <Text style={styles.done}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    completeContainer: {
      alignItems: "center",
      marginBottom: 50,
    },
    done: {
      color: theme.successGreen,
      fontSize: 16,
      fontWeight: "500",
    },
    overlay: {
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    routineTitle: {
      color: theme.foreground,
      fontWeight: "bold",
      fontSize: 17,
    },
    topContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
    },
    touchable: {
      alignItems: "center",
      backgroundColor: theme.successGreenBackground,
      borderRadius: 12,
      height: 45,
      justifyContent: "center",
      width: "90%",
    },
  });
export default SuccessModal;
