import React, { useEffect, useState, useRef } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { PARAGRAPH_FONT_SIZE } from "../config/appConstants";
import { useTheme } from "../contexts/ThemeContext";

const EditableText = ({ original, placeholder, onSubmit, maxLength }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [text, setText] = useState(original);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setText(original);
  }, [original]);

  const handleFocus = () => {
    if (text === placeholder) {
      setText("");
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== "") {
      onSubmit(text);
      setText(text);
    } else {
      onSubmit(placeholder);
      setText(placeholder);
    }
  };

  const textStyle =
    text && text.length ? styles.text : [styles.text, styles.placeholderText];

  return (
    <TouchableOpacity
      onPress={() => setIsEditing(true)}
      style={styles.touchableArea}
    >
      {isEditing ? (
        <View style={styles.inputContainer}>
          <Text style={[styles.text, styles.fadedSuggestion]} numberOfLines={1}>
            {text === "" ? placeholder : text}
          </Text>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            onBlur={handleBlur}
            onFocus={handleFocus}
            style={[styles.textInput, textStyle]}
            autoFocus={true}
            maxLength={maxLength}
            ellipsizeMode="tail"
            multiline={false}
          />
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <Text style={textStyle} numberOfLines={1}>
            {text || placeholder}
          </Text>
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
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    text: {
      color: theme.primary,
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
      color: theme.foreground,
    },
  });

export default EditableText;
