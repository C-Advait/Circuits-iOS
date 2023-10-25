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
  TITLE_FONT_SIZE,
  TITLE_FONT_WEIGHT,
} from "../config/appConstants";

const EditableText = forwardRef((props, ref) => {
  const { theme } = useSettings();
  const { original, originalPlaceholder, onSubmit, maxLength, rightFlush, size = 'regular' } = props;

  const [placeholder, setPlaceholder] = useState(originalPlaceholder);
  const [text, setText] = useState(original);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  let fontSize;
  let fontWeight;

  if (size === "regular") {
    fontSize = EDITABLE_TEXT_FONT_SIZE;
    fontWeight = EDITABLE_TEXT_FONT_WEIGHT;
  } else if (size === "large") {
    fontSize = TITLE_FONT_SIZE;
    fontWeight = TITLE_FONT_WEIGHT;
  } else {
    throw Error("size prop got an unexpected value: ", size)
  }

  const styles = getStyles(theme, fontSize, fontWeight);


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
        <View style={[
          styles.inputContainer,
          rightFlush ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }
        ]}>
          <Text style={[styles.text, styles.fadedSuggestion]} numberOfLines={1}>
            {text === "" ? placeholder : null}
          </Text>
          <TextInput
            ref={inputRef}
            enterKeyHint="done"
            onChangeText={setText}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onSubmitEditing={(event) => {
              event.nativeEvent.text !== "" ?
                setPlaceholder(event.nativeEvent.text) :
                null
            }}
            style={[styles.textInput, textStyle]}
            autoFocus={true}
            maxLength={maxLength}
            ellipsizeMode="tail"
            multiline={false}
          />
        </View>
      ) : (
        <View style={[
          styles.inputContainer,
          rightFlush ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }
        ]}>
          <Text style={textStyle} numberOfLines={1}>
            {text || placeholder}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const getStyles = (theme, fontSize, fontWeight) =>
  StyleSheet.create({
    touchableArea: {
      // width: 200,
    },
    inputContainer: {
      position: "relative",
      flexDirection: "row",
    },
    text: {
      color: theme.text87,
      fontSize: fontSize,
      fontWeight: fontWeight,
    },
    placeholderText: {
      color: theme.text60,
      fontSize: fontSize,
      fontWeight: fontWeight,
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
