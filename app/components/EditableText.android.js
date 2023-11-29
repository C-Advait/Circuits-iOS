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
  Keyboard,
} from "react-native";

import { useAppContext } from "../contexts/AppContext";
import {
  EDITABLE_TEXT_FONT_SIZE,
  EDITABLE_TEXT_FONT_WEIGHT,
  TITLE_FONT_SIZE,
  TITLE_FONT_WEIGHT,
} from "../config/appConstants";

const EditableText = forwardRef((props, ref) => {
  const { theme } = useAppContext();
  const { original, onSubmit, maxLength, rightFlush, size = "regular", placeholder } = props;

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
    throw Error("size prop got an unexpected value: ", size);
  }

  const styles = getStyles(theme, fontSize, fontWeight);

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

  // When keyboard hides, call handleBlur
  useEffect(() => {
    // Attach the keyboard hide listener when the component mounts
    const keyboardHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleBlur,
    );

    // Cleanup the listener when the component unmounts
    return () => {
      keyboardHideListener.remove();
    };
  }, [text]);

  // Expose 'editing' to wrapping AuxiliaryCard
  useImperativeHandle(ref, () => ({
    activate: () => setIsEditing(true),
  }));

  const textInputStyle = [
    styles.text,
    rightFlush
      ? { textAlign: 'right' } : null
  ];

  const containerStyle = [
    styles.inputContainer,
    rightFlush
      ? { justifyContent: "flex-end" }
      : { justifyContent: "flex-start" },
  ]

  return (
    <TouchableOpacity
      onPress={() => setIsEditing(true)}
      style={styles.touchableArea}
    >
      {isEditing ? (
        <View style={containerStyle} >
          <TextInput
            ref={inputRef}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor={theme.text60}
            style={textInputStyle}
            autoFocus={true}
            maxLength={maxLength}
            ellipsizeMode="tail"
            multiline={false}
          />
        </View>
      ) : (
        <View style={containerStyle} >
          <Text style={styles.text} numberOfLines={1}>
            {text || placeholder}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const getStyles = (theme, fontSize, fontWeight) =>
  StyleSheet.create({
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
  });

export default EditableText;
