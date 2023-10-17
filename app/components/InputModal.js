import React, { forwardRef } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Portal } from "react-native-portalize";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { useTheme } from "../contexts/ThemeContext";

const MODAL_HEIGHT = 390;

const InputModal = forwardRef((props, ref) => {
  const { onChange, onCancel, onApply, children, promptTitle, promptSubtitle } =
    props;
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={[MODAL_HEIGHT, MODAL_HEIGHT]}
      enablePanDownToClose={true}
      backdropComponent={BottomSheetBackdrop}
      backgroundStyle={{ backgroundColor: theme.tertiaryBackground }}
      handleStyle={{
        backgroundColor: theme.secondaryBackground,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleIndicatorStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        width: 90,
      }}
      onChange={(isOpen) => onChange(isOpen)}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{promptTitle}</Text>
        <Text style={styles.subtitle}>{promptSubtitle}</Text>
      </View>
      {children}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={onCancel} color={theme.primary} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Apply" onPress={onApply} color={theme.blue} />
        </View>
      </View>
    </BottomSheet>
  );
});

const getStyles = (theme) =>
  StyleSheet.create({
    activationButton: {
      color: theme.primary,
      fontSize: 15,
    },
    buttonContainer: {
      marginHorizontal: 16,
      marginTop: 12,
    },
    disabledButton: {
      color: theme.textDisabled,
      fontSize: 15,
    },
    footer: {
      backgroundColor: theme.secondaryBackground,
      bottom: 0,
      flexDirection: "row",
      height: 65,
      justifyContent: "space-between",
      position: "absolute",
      width: "100%",
    },
    header: {
      backgroundColor: theme.secondaryBackground,
      paddingBottom: 18,
      paddingHorizontal: 22,
      paddingTop: 10,
      gap: 2,
    },
    picker: {
      backgroundColor: "#333",
      width: "100%",
      height: 215,
      alignSelf: "center",
    },
    subtitle: {
      color: theme.text,
      fontSize: 17,
    },
    title: {
      color: theme.primary,
      fontSize: 17,
      fontWeight: 500,
    },
  });

export default InputModal;
