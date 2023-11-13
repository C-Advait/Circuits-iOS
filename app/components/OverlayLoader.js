import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Animated } from "react-native";
import { useAppContext } from "../contexts/AppContext";

const OverlayLoader = ({ isVisible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const { theme } = useAppContext();
  const styles = getStyles(theme);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0, // Animate to opacity: 1, or 0
      duration: 200, // 200ms
      useNativeDriver: true,
    }).start();
  }, [isVisible, fadeAnim]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.overlay,
        { opacity: fadeAnim }, // Bind opacity to animated value
      ]}
    >
      <ActivityIndicator size="large" color={theme.blue} />
    </Animated.View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly transparent
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    },
  });

export default OverlayLoader;
