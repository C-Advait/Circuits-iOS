import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAppContext } from "../../contexts/AppContext";
import {
  PARAGRAPH_FONT_SIZE,
  PARAGRAPH_FONT_WEIGHT,
} from "../../config/appConstants";
import LottieView from "lottie-react-native";

function PurchaseContinueButton({ loading, onPress }) {
  const { theme } = useAppContext();
  const styles = getStyles(theme);

  return (
    <View style={{ width: "100%" }}>
      {loading ? (
        <View style={styles.background}>
          <LottieView
            source={require("../../assets/lotties/loading.json")}
            autoPlay
            loop={true}
            style={{ height: 100, width: 100 }}
          />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.background}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.text}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      alignItems: "center",
      backgroundColor: theme.accentDarkBlue,
      borderRadius: 10,
      flexDirection: "row",
      overflow: "hidden",
      height: 58,
      justifyContent: "center",
      marginBottom: 20,
    },
    text: {
      color: theme.primary,
      fontWeight: PARAGRAPH_FONT_WEIGHT,
      fontSize: PARAGRAPH_FONT_SIZE,
      textAlign: "center",
    },
  });

export default PurchaseContinueButton;
