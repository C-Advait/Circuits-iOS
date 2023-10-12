import { Tag, Exercise } from "../classes/Exercise";
import { Routine } from "../classes/Routine";

export const TAB_BAR_HEIGHT = 90;

export const PARAGRAPH_FONT_SIZE = 17;
export const ROUTINE_TITLE_FONT_SIZE = 18;
export const ROUTINE_PARAGRAPH_FONT_SIZE = 15;
export const PARAGRAPH_FONT_WEIGHT = '600';
export const INFO_FONT_SIZE = 13;

export const DEFAULT_ROUTINE = new Routine({ // missing routineID && Title incomplete
  numberOfLoop: 1,
  exerciseSoundID: 1,
  restSoundID: 1,
  breakSoundID: 1,
  endSoundID: 1,
  title: "My Routine #",
  duration: 1200, // e.g., 20 minutes
  color: "#AABBCC",
  userCreated: true,
})

// These do not include associated routineID's
export const DEFAULT_WARMUP = new Exercise({ // missing routineID
    title: "Warmup",
    exerciseOrder: 1,
    tag: Tag.PREROUTINE,
    workTime: 30,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
    category: "Uncategorized",
  });

export const DEFAULT_EXERCISE = new Exercise({ // missing routineID
  title: "Plank",
  exerciseOrder: 1,
  tag: Tag.WORKING,
  workTime: 30,
  numberOfRounds: 1,
  restBetweenRounds: 0,
  breakBeforeNext: 0,
  category: "Uncategorized",
});

export const DEFAULT_COOLDOWN = new Exercise({ // missing routineID
    title: "Cooldown",
    exerciseOrder: 1,
    tag: Tag.POSTROUTINE,
    workTime: 3000,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
    category: "Uncategorized",
  });