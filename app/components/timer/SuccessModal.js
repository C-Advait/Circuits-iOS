import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, Modal, TouchableOpacity } from "react-native";

import LottieView from "lottie-react-native";
import { useSettings } from "../../contexts/SettingsContext";
import Header from "../Header";
import { useNavigation } from "@react-navigation/native";
import routes from "../../navigation/routes";
import timerActions from "../../actions/timerActions";
import { SOUNDS } from "../../config/sounds";
import { useSoundContext } from "../../contexts/SoundContext";

function SuccessModal({ routineTitle, visible, dispatch }) {
  const navigation = useNavigation();
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const animationRef = useRef(null);
  const { playSound } = useSoundContext();

  const { theme } = useSettings();
  const styles = getStyles(theme);

  useEffect(() => {
    if (visible) {
      playSound(SOUNDS.COMPLETION.key);
    }
  }, [visible]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.topContainer}>
          <Text style={styles.routineTitle}>{routineTitle}</Text>
        </View>
        <LottieView
          ref={animationRef}
          source={require("../../assets/lotties/success.json")}
          autoPlay
          loop={false}
          style={{ height: 400, width: 400 }}
          onAnimationFinish={() => {
            setAnimationCompleted(true);
          }}
          progress={animationCompleted ? 1 : 0}
        />
        <View style={styles.completeContainer}>
          <Header>Complete!</Header>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.touchable}
          onPress={() => {
            navigation.navigate(routes.ROUTINES_SCREEN);
            dispatch({ type: timerActions.CLOSE_SUCCESS_MODAL });
          }}
        >
          <Text style={styles.done}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
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
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
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
