import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { EvilIcons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, interpolate, Extrapolate } from 'react-native-reanimated';

import { useTheme } from '../contexts/ThemeContext';
import { INFO_FONT_SIZE, PARAGRAPH_FONT_SIZE, PARAGRAPH_FONT_WEIGHT } from '../config/appConstants';

const { width } = Dimensions.get('window');

function ExerciseCard({
  title, 
  subTitle, 
  showDeleteIcon=false, 
  accentColor,
  clickDrag=false
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      // Prevent swiping to the right
      if (ctx.startX + event.translationX > 0) {
        translateX.value = 0;
      } else {
        translateX.value = Math.max(ctx.startX + event.translationX, -width * 0.5);
      }
    },
    onEnd: (event) => {
      if (event.velocityX < -100 || event.translationX < -width * 0.25) {
        // Reveal red view
        translateX.value = withSpring(-width * 0.25);
      } else {
        // Reset position
        translateX.value = withSpring(0, {damping: 12});
      }
    },
  });

  const tileAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handlePress = () => {
    console.log('pressed');
  }
  const hiddenViewStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      right: 0,
      height: 100,
      backgroundColor: 'red',
      width: -translateX.value,
      zIndex: 1,
      opacity: translateX.value === 0 ? 0 : 1,
      transform: [{ translateX: translateX.value + width * 0.25 }],
      alignItems: 'center',
      justifyContent: 'center'
    };
  });

  return (
    <View style={styles.container}>
      {accentColor && (
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
      )}     
      <View style={styles.swipeContainer}>
        <Animated.View style={hiddenViewStyle}>
          <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />
        </Animated.View>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[tileAnimatedStyle, styles.animatedTile]}>
            {showDeleteIcon && (
              <TouchableOpacity onPress={handlePress}>
                <EvilIcons name="close" size={35} color="white"
                style={{marginLeft: 10, marginRight: 12}}/>
              </TouchableOpacity>
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subTitle}>{subTitle}</Text>
            </View>
            {clickDrag && (
              <View style={styles.dragContainer}>
                <MaterialIcons name="drag-indicator" size={40} color={theme.text60}/>
              </View>
            )}
          </Animated.View>
        </PanGestureHandler> 
      </View>
    </View>
  );
  
}

const getStyles = (theme) => StyleSheet.create({
  animatedTile: {
    width, 
    height: 100, 
    alignItems: 'center',
    flexDirection:'row'
  },
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
    // padding: 10,
    height: 80,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dragContainer: {
    position: 'absolute',
    right: 20,
  },
  infoContainer: {
    marginLeft: 5
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
  swipeContainer: { 
    flex: 1, 
    alignItems: 'flex-start', 
    flexDirection: 'row', 
    height: 100,
    marginLeft: 10
  }
});

export default ExerciseCard;

// import React, { useRef, useState} from 'react';
// import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
// import Swipeable, {RectButton} from 'react-native-gesture-handler/Swipeable';
// import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

// import { useTheme } from '../contexts/ThemeContext';
// import { INFO_FONT_SIZE, PARAGRAPH_FONT_SIZE, PARAGRAPH_FONT_WEIGHT } from '../config/appConstants';

//     return (
//         <Swipeable 
//           ref={swipeableRef}
//           renderRightActions={(progress, dragX) => rightAction(progress, dragX)}
//         >
//             <View style={styles.container}>
//                 {accentColor && (
//                     <View style={[styles.accent, { backgroundColor: accentColor }]} />
//                 )}
//                 {showDeleteIcon && (
//                     <TouchableOpacity onPress={handlePress}>
//                         <EvilIcons name="close" size={35} color="white"
//                         style={{marginLeft: 10, marginRight: 12}}/>
//                     </TouchableOpacity>
//                 )}
//                 <View style={styles.contentContainer}>
//                     <Text style={styles.title}>{title}</Text>
//                     <Text style={styles.subTitle}>{subTitle}</Text>
//                 </View>
//                 {clickDrag && !isSwipeableOpen && (
//                     <View style={styles.dragContainer}>
//                         <MaterialIcons name="drag-indicator" size={40} color={theme.text60}/>
//                     </View>
//                 )}
//             </View>
//         </Swipeable>
//     );
// }


// export default ExerciseCard;