import React, { useRef, useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated from 'react-native-reanimated';

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
    const styles = getStyles(theme);
    const swipeableRef = useRef(null);
    const [isSwipeableOpen, setIsSwipeableOpen] = useState(false);

    const handlePress = () => {
        swipeableRef.current?.openRight();
    };

    return (
        <Swipeable 
          ref={swipeableRef}
          renderRightActions={() => (
            <Animated.View style={[styles.trashContainer, ]}>
              <EvilIcons name="trash" size={40} color="white" />
            </Animated.View>
          )}
          // onSwipeableWillOpen={() => setIsSwipeableOpen(true)}
          // onSwipeableClose={() => setIsSwipeableOpen(false)}
        >
            <View style={styles.container}>
                {accentColor && (
                    <View style={[styles.accent, { backgroundColor: accentColor }]} />
                )}
                {deleteFunc && (
                    <TouchableOpacity onPress={handlePress}>
                        <EvilIcons name="close" size={35} color="white"
                        style={{marginLeft: 10, marginRight: 12}}/>
                    </TouchableOpacity>
                )}
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subTitle}>{subTitle}</Text>
                </View>
                {clickDrag && !isSwipeableOpen && (
                    <View style={styles.dragContainer}>
                        <MaterialIcons name="drag-indicator" size={40} color={theme.text60}/>
                    </View>
                )}
            </View>
        </Swipeable>
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
  trashContainer: {
    width: 50,
    height: '100%',
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subTitle: {
    color: theme.text60,
    fontSize: INFO_FONT_SIZE,
  },
});

export default ExerciseCard;