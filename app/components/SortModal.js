import React, { useState, forwardRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Portal } from "react-native-portalize";

import { useTheme } from "../contexts/ThemeContext";

const SortModal = forwardRef((props, ref) => {
  const { isSheetOpen, setIsSheetOpen, sortOption, setSortOption } = props;

  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Portal>
      <TouchableOpacity
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "#00000050",
            display: isSheetOpen ? "flex" : "none",
          },
        ]}
        onPress={() => {
          setIsSheetOpen(false);
          ref.current?.close();
        }}
      />
      <BottomSheet
        ref={ref}
        index={1}
        snapPoints={[250, 250]}
        enablePanDownToClose={true}
        onChange={(isOpen) =>
          isOpen === 1 ? setIsSheetOpen(true) : setIsSheetOpen(false)
        }
        backgroundStyle={{ backgroundColor: theme.tertiaryBackground }}
        handleIndicatorStyle={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.modalHeader}>Sort by</Text>
          {["Recent", "Recently added", "Alphabetical", "Duration"].map(
            (option) => (
              <TouchableOpacity
                style={styles.optionContainer}
                key={option}
                onPress={() => setSortOption(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
                {sortOption === option && (
                  <Ionicons
                    name="checkmark"
                    color={theme.blue}
                    size={25}
                    style={styles.checkmark}
                  />
                )}
              </TouchableOpacity>
            ),
          )}
        </View>
      </BottomSheet>
    </Portal>
  );
});

const getStyles = (theme) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      padding: 16,
    },
    modalHeader: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 8,
    },
    optionContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    optionText: {
      color: theme.primary,
      fontSize: 16,
      marginVertical: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    checkmark: {
      marginLeft: 10,
    },
  });

export default SortModal;
