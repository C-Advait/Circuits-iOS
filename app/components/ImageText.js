import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { useSettings } from "../contexts/SettingsContext";

function ImageText({ containerStyle, image, imageStyle, text, textStyle }) {
  const { theme } = useSettings();
  const styles = getStyles(theme);
  // console.log(styles);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.unit}>
        <Image source={image} style={[styles.image, imageStyle]} />
        <Text numberOfLines={1} style={[styles.text, textStyle]}>
          {text}
        </Text>
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: 30,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    image: {
      height: 17,
      width: 17,
    },
    text: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.primary,
    },
    unit: {
      gap: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "60%",
      paddingLeft: "2%",
    },
  });

export default ImageText;
