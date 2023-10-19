import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import { useSettings } from "../contexts/SettingsContext";
import {
  EDITABLE_TEXT_FONT_SIZE,
  EDITABLE_TEXT_FONT_WEIGHT,
} from "../config/appConstants";

const EditableText = forwardRef((props, ref) => {
  const { theme } = useSettings();
  const { original, placeholder, onSubmit, maxLength } = props;
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

  // Expose 'editing' to wrapping AuxiliaryCard
  useImperativeHandle(ref, () => ({
    activate: () => setIsEditing(true),
  }));

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
});

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
      color: theme.text87,
      fontSize: EDITABLE_TEXT_FONT_SIZE,
      fontWeight: EDITABLE_TEXT_FONT_WEIGHT,
    },
    placeholderText: {
      color: theme.text60,
      fontSize: EDITABLE_TEXT_FONT_SIZE,
      fontWeight: EDITABLE_TEXT_FONT_WEIGHT,
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
