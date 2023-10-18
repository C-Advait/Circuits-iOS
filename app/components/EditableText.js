import React, { useState, useRef } from 'react';
import { TextInput, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { PARAGRAPH_FONT_SIZE } from "../config/appConstants";
import { useTheme } from "../contexts/ThemeContext";

const EditableText = ({ exercise, onSubmit, maxLength }) => {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleFocus = () => {
    setText('');
    inputRef.current.setNativeProps({ selection: { start: 0, end: 0 } });
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== '') {
      onSubmit(text);
    } else {
      setText(exercise.title);
    }
  };

  const textStyle = text
    ? styles.text
    : [styles.text, styles.placeholderText];

  return (
    <TouchableOpacity
      onPress={() => setIsEditing(true)}
      style={styles.touchableArea}>
      {isEditing ? (
        <View style={styles.inputContainer}>
          <Text style={[styles.text, styles.fadedSuggestion]} numberOfLines={1}>
            {text ? "" : exercise.title}
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
        <Text style={textStyle} numberOfLines={1}>
          {text || exercise.title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (theme) => StyleSheet.create({
  touchableArea: {
    width: 200,
  },
  inputContainer: {
    position: 'relative',
  },
  text: {
    fontSize: PARAGRAPH_FONT_SIZE,
  },
  placeholderText: {
    color: theme.text60,
  },
  fadedSuggestion: {
    position: 'absolute',
    color: theme.text60,
    zIndex: -1,
  },
  textInput: {
    fontSize: PARAGRAPH_FONT_SIZE,
    color: theme.foreground
  },
});

export default EditableText;
