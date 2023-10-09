import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from "../../contexts/ThemeContext";

function AppTextButton({ children, onPress, buttonStyle, textStyle}) {

    const { theme } = useTheme();
    const styles = getStyles(theme);
    onPress = onPress ? onPress : () => null;

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle]}>
            <Text style={[styles.text, textStyle]}>  {children} </Text>
        </TouchableOpacity>
    );
}

const getStyles = (theme) => StyleSheet.create({
    button: {
        color: theme.blue
    },
    text: {
        fontSize: 18,
        fontWeight: '400',
        color: theme.blue
    }
})

export default AppTextButton;
