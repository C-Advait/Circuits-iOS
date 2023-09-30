import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { PARAGRAPH_FONT_SIZE } from "../config/constants";
import { useTheme } from "../contexts/ThemeContext";

// TODO: Emit error when name is empty
const EditableText = ({ placeholder, maxLength, style }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(placeholder);

  const { theme } = useTheme();
  const styles = getStyles(theme);

  const textStyle = text
    ? [styles.text, style]
    : [styles.text, styles.placeholderText];

  return (
    <TouchableOpacity
      onPress={() => setIsEditing(true)}
      style={styles.touchableArea}
    >
      {!isEditing ? (
        <Text style={textStyle}>{text || placeholder}</Text>
      ) : (
        <View style={styles.inputContainer}>
          <Text style={[styles.text, styles.fadedSuggestion]}>
            {text ? "" : placeholder}
          </Text>
          <TextInput
            style={[styles.textInput, style]}
            value={text}
            onChangeText={setText}
            onBlur={() => setIsEditing(false)}
            autoFocus={true}
            maxLength={maxLength}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    touchableArea: {
      width: 200,
    },
    inputContainer: {
      position: "relative",
    },
    text: {
      fontSize: PARAGRAPH_FONT_SIZE,
    },
    placeholderText: {
      color: theme.text60,
    },
    fadedSuggestion: {
      position: "absolute",
      color: theme.text60,
      zIndex: -1,
    },
    textInput: {
      fontSize: PARAGRAPH_FONT_SIZE,
    },
  });

export default EditableText;
