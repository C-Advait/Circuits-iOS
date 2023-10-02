import React from 'react';
import {View, StyleSheet, Text} from 'react-native'
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';
import { INFO_FONT_SIZE, PARAGRAPH_FONT_SIZE, PARAGRAPH_FONT_WEIGHT } from '../config/appConstants';

function ExerciseCard({
  title, 
  subTitle, 
  deleteFunc=false, 
  accentColor,
  clickDrag=false
}) {
    const { theme } = useTheme();
    const styles = getStyles(theme)

    return (
        <View style={styles.container}>
          {accentColor ? (
            <View style={[styles.accent, { backgroundColor: accentColor }]} />
          ) : null}
          {deleteFunc ? (
            <EvilIcons name="close" size={35} color="white"
            style={{marginLeft: 10, marginRight: 12}}/>
          ) : null }
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>{subTitle}</Text>
          </View>
          {clickDrag ? (
            <View style={styles.dragContainer}>
              <MaterialIcons name="drag-indicator" size={40} color={theme.text60}/>
            </View>
          ): null}
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
  accent: {
    width: 3,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0
  },
  container: {
    backgroundColor: theme.tileBackground,
    borderRadius: 8,
    padding: 10,
    height: 80,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentContainer: {
  },
  dragContainer: {
    position: 'absolute',
    right: 20,
    // color: theme.text60
  },
  title: {
    color: theme.text87,
    fontSize: PARAGRAPH_FONT_SIZE,
    fontWeight: PARAGRAPH_FONT_WEIGHT,
    marginBottom: 10,
  },
  subTitle: {
    color: theme.text60,
    fontSize: INFO_FONT_SIZE,
  },
});

export default ExerciseCard;