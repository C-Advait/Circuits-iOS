import React from "react";
import { View, StyleSheet, Modal } from "react-native";

import LottieView from "lottie-react-native";

function CountdownModal({ visible }) {
  // Currently, countdown lottie is in dark mode only.
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <LottieView
          source={require("../../assets/lotties/countdown.json")}
          autoPlay
          loop={false}
          style={{ height: 322, width: 750 }}
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
    paddingBottom: "70%",
  },
});
export default CountdownModal;
