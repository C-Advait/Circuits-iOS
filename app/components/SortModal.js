import React, { useEffect, forwardRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Portal } from "react-native-portalize";

import { SortCriteria } from "../classes/SortCriteria";
import { useTheme } from "../contexts/ThemeContext";
import { useTemplate } from "../contexts/TemplateContext";

const MODAL_HEIGHT = 270;

const SortModal = forwardRef((props, ref) => {
  const { isSheetOpen, setIsSheetOpen } = props;
  const { sortOption, setSortOption } = useTemplate();

  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Portal>
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={[MODAL_HEIGHT, MODAL_HEIGHT]}
        enablePanDownToClose={true}
        onChange={(isOpen) =>
          isOpen === 1 ? setIsSheetOpen(true) : setIsSheetOpen(false)
        }
        backgroundStyle={{ backgroundColor: theme.tertiaryBackground }}
        backdropComponent={BottomSheetBackdrop}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.modalHeader}>Sort by</Text>
          {[
            SortCriteria.RECENTLY_COMPLETED,
            SortCriteria.RECENTLY_ADDED,
            SortCriteria.ALPHABETICAL,
            SortCriteria.DURATION,
          ].map((option) => (
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
          ))}
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
    handleIndicator: {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      width: 90,
    },
    modalHeader: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
      marginBottom: 25,
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
    },
    checkmark: {
      marginLeft: 10,
    },
  });

export default SortModal;
