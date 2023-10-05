import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Button } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  Easing,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { Circle, G, Svg, Defs, LinearGradient, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width - 40;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = CIRCLE_SIZE * Math.PI;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Timer = ({ duration }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const progress = useSharedValue(0.97);

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
    const strokeDashoffset = (1 - progress.value) * CIRCUMFERENCE;
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
      <Button
        title={isPlaying ? "Pause" : "Play"}
        onPress={() => setIsPlaying((prev) => !prev)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default Timer;
