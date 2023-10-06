import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Button, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  Easing,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { Circle, G, Svg, Defs, LinearGradient, Stop } from "react-native-svg";
import NumericalTimer from "./NumericalTimer";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width - 60;
const STROKE_WIDTH = 11;
const CIRCUMFERENCE = CIRCLE_SIZE * Math.PI;
const STARTING_OFFSET = 0.06;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Timer = ({ isPlaying, setIsPlaying, title, duration }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(duration);
  const progress = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      progress.value = withTiming(0, {
        duration: duration * 1000,
        easing: Easing.linear,
      });
    } else {
      cancelAnimation(progress);
    }
  }, [isPlaying]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset =
      (1 - progress.value + STARTING_OFFSET) * CIRCUMFERENCE;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} fill="transparent">
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#9180FF" />
            <Stop offset="100%" stopColor="#4DB4FF" />
          </LinearGradient>
        </Defs>
        <G rotation="-90" origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}>
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={CIRCLE_SIZE / 2 - STROKE_WIDTH}
            strokeWidth={STROKE_WIDTH}
            stroke="rgba(255, 255, 255, 0.11)"
          />
          <AnimatedCircle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={CIRCLE_SIZE / 2 - STROKE_WIDTH}
            strokeWidth={STROKE_WIDTH}
            stroke="url(#gradient)"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
        <NumericalTimer
          isPlaying={isPlaying}
          secondsRemaining={secondsRemaining}
          setSecondsRemaining={setSecondsRemaining}
        />
        <Button
          title="Reset"
          onPress={() => {
            setSecondsRemaining(duration);
            setIsPlaying(false);
            progress.value = 1;
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  overlay: {
    position: "absolute",
    top: CIRCLE_SIZE / 3 - 10,
    alignItems: "center",
  },
  title: {
    fontSize: 27,
    fontWeight: 500,
    color: "white",
    marginBottom: 10,
  },
  timer: {
    fontSize: 20,
    color: "white",
    marginBottom: 10,
  },
});

export default Timer;
