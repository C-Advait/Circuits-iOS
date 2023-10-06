import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const CIRCLE_SIZE = width - 60;
export const STROKE_WIDTH = 11;
export const CIRCUMFERENCE = CIRCLE_SIZE * Math.PI;
export const RING_STARTING_OFFSET = 0.06;
