import React from "react";
import { View, StyleSheet, Modal } from "react-native";

import LottieView from "lottie-react-native";

function CountdownModal({
  isAnimationVisible,
  setIsAnimationVisible,
  onClose,
}) {
  // Currently, countdown lottie is in dark mode only.
  return (
    <Modal animationType="fade" transparent={true} visible={isAnimationVisible}>
      <View style={styles.overlay}>
        <LottieView
          source={require("../../assets/lotties/countdown.json")}
          autoPlay
          loop={false}
          style={{ height: 422, width: 750 }}
          onAnimationFinish={() => {
            onClose();
            setIsAnimationVisible(false);
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // This is an example semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
});
export default CountdownModal;
