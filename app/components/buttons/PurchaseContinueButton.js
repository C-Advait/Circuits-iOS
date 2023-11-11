import React from "react";
import { Alert, View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAppContext } from "../../contexts/AppContext";
import {
  PARAGRAPH_FONT_SIZE,
  PARAGRAPH_FONT_WEIGHT,
} from "../../config/appConstants";

function PurchaseContinueButton({ active, onPress }) {
  const { theme } = useAppContext();
  const styles = active ? getActiveStyles(theme) : getPassiveStyles(theme);

  console.log(JSON.stringify(styles.background, null, 2));

  return (
    <View style={{ width: "100%" }}>
      <TouchableOpacity
        style={styles.background}
        onPress={
          active
            ? onPress
            : () =>
                Alert.alert(
                  "You're already subscribed.",
                  "To change your current plan, please cancel your subscription in settings.",
                )
        }
        activeOpacity={0.8}
      >
        <Text style={styles.text}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const getActiveStyles = (theme) =>
  StyleSheet.create({
    background: {
      backgroundColor: theme.accentDarkBlue,
      borderRadius: 10,
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

const getPassiveStyles = (theme) =>
  StyleSheet.create({
    background: {
      backgroundColor: theme.tertiaryBackground,
      borderRadius: 10,
      height: 58,
      justifyContent: "center",
      marginBottom: 20,
    },
    text: {
      color: theme.tertiary,
      fontWeight: PARAGRAPH_FONT_WEIGHT,
      fontSize: PARAGRAPH_FONT_SIZE,
      textAlign: "center",
    },
  });

export default PurchaseContinueButton;
