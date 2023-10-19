import { Tag, Exercise } from "../classes/Exercise";
import { Routine } from "../classes/Routine";

export const TAB_BAR_HEIGHT = 90;

// Font
export const PARAGRAPH_FONT_SIZE = 17;
export const ROUTINE_TITLE_FONT_SIZE = 18;
export const ROUTINE_PARAGRAPH_FONT_SIZE = 15;
export const PARAGRAPH_FONT_WEIGHT = "600";
export const INFO_FONT_SIZE = 14;

export const PICKER_BUTTON_FONT_SIZE = 17;
export const PICKER_BUTTON_FONT_WEIGHT = 400;
export const EDITABLE_TEXT_FONT_SIZE = 17;
export const EDITABLE_TEXT_FONT_WEIGHT = 400;

export const DEFAULT_ROUTINE = new Routine({
  // missing routineID && Title incomplete
  numberOfLoop: 1,
  exerciseSoundID: 1,
  restSoundID: 1,
  breakSoundID: 1,
  endSoundID: 1,
  title: "My Routine #",
  duration: 1200, // e.g., 20 minutes
  color: "#AABBCC",
  userCreated: true,
});

// These do not include associated routineID's
export const DEFAULT_WARMUP = new Exercise({
  // missing routineID && ID && exerciseOrder
  title: "Warmup",
  tag: Tag.PREROUTINE,
  workTime: 300,
  numberOfRounds: 1,
  restBetweenRounds: 0,
  breakBeforeNext: 0,
  category: "Uncategorized",
});

export const DEFAULT_EXERCISE = new Exercise({
  // missing routineID && ID && exerciseOrder
  title: "Exercise",
  tag: Tag.WORKING,
  workTime: 60,
  numberOfRounds: 1,
  restBetweenRounds: 0,
  breakBeforeNext: 0,
  category: "Uncategorized",
});

export const DEFAULT_COOLDOWN = new Exercise({
  // missing routineID && ID && exerciseOrder
  title: "Cooldown",
  tag: Tag.POSTROUTINE,
  workTime: 300,
  numberOfRounds: 1,
  restBetweenRounds: 0,
  breakBeforeNext: 0,
  category: "Uncategorized",
});

// Sound
export const COUNTDOWN_BEEP_SOUND = require("../assets/sounds/short_beep.mp3");
export const BEGIN_EXERCISE_SOUND = require("../assets/sounds/begin_exercise_beep.mp3");
export const REST_SOUND = require("../assets/sounds/triangle_rest.mp3");
