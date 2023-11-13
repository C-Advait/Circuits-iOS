import { Exercise, Tag } from "../classes/Exercise";
import { Routine } from "../classes/Routine";

export const defaultRoutines = [
  new Routine({
    numberOfLoops: 1,
    title: "Yoga Beginner Stretch",
    duration: 590, // e.g., 20 minutes
    color: "#AABBCC",
    userCreated: false,
  }),
  new Routine({
    numberOfLoops: 1,
    title: "Hip Mobility",
    duration: 760, // e.g., 20 minutes
    color: "#AABBCC",
    userCreated: false,
  }),
  new Routine({
    numberOfLoops: 1,
    title: "Shoulder Mobility",
    duration: 670, // e.g., 20 minutes
    color: "#AABBCC",
    userCreated: false,
  }),
  new Routine({
    numberOfLoops: 1,
    title: "Knee/Ankle Mobility",
    duration: 720, // e.g., 20 minutes
    color: "#AABBCC",
    userCreated: false,
  }),
  new Routine({
    numberOfLoops: 1,
    title: "Back Mobility",
    duration: 615, // e.g., 20 minutes
    color: "#AABBCC",
    userCreated: false,
  }),
];

export const defaultExercises = [
  // ---------------------------------- Start Yoga exercises
  new Exercise({
    routineID: 1,
    title: "Warmup",
    exerciseOrder: 0,
    tag: Tag.PREROUTINE,
    workTime: 120,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
  }),
  new Exercise({
    routineID: 1,
    title: "Cooldown",
    exerciseOrder: 7,
    tag: Tag.POSTROUTINE,
    workTime: 120,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
  }),

  // Exercise 1: Cat-Cow Stretch
  new Exercise({
    routineID: 1,
    title: "Cat-Cow Stretch",
    exerciseOrder: 1,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 20,
  }),

  // Exercise 2: Downward Dog
  new Exercise({
    routineID: 1,
    title: "Downward Dog",
    exerciseOrder: 2,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 20,
  }),

  // Exercise 3: Warrior II
  new Exercise({
    routineID: 1,
    title: "Warrior II",
    exerciseOrder: 3,
    tag: Tag.WORKING,
    workTime: 40,
    numberOfRounds: 1, // Per side
    restBetweenRounds: 0,
    breakBeforeNext: 15,
  }),

  // Exercise 4: Tree Pose
  new Exercise({
    routineID: 1,
    title: "Tree Pose",
    exerciseOrder: 4,
    tag: Tag.WORKING,
    workTime: 30, // Per side
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 20,
  }),

  // Exercise 5: Child’s Pose
  new Exercise({
    routineID: 1,
    title: "Child’s Pose",
    exerciseOrder: 5,
    tag: Tag.REST,
    workTime: 60,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 15,
  }),

  // Exercise 6: Seated Forward Bend
  new Exercise({
    routineID: 1,
    title: "Seated Forward Bend",
    exerciseOrder: 6,
    tag: Tag.WORKING,
    workTime: 45,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 20,
  }),
  // ---------------------------------- End Yoga exercises

  // ---------------------------------- Start hip mobility exercises
  // Exercise 1: Glute Bridges
  new Exercise({
    routineID: 2,
    title: "Warmup",
    exerciseOrder: 0,
    tag: Tag.PREROUTINE,
    workTime: 120,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
  }),
  new Exercise({
    routineID: 2,
    title: "Cooldown",
    exerciseOrder: 7,
    tag: Tag.POSTROUTINE,
    workTime: 120,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
  }),

  new Exercise({
    routineID: 2,
    title: "Glute Bridges",
    exerciseOrder: 1,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
  }),

  // Exercise 2: Lying Hip Rotations
  new Exercise({
    routineID: 2,
    title: "Lying Hip Rotations",
    exerciseOrder: 2,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
  }),

  // Exercise 3: Pigeon Pose
  new Exercise({
    routineID: 2,
    title: "Pigeon Pose",
    exerciseOrder: 3,
    tag: Tag.WORKING,
    workTime: 40, // Per side
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 20,
  }),

  // Exercise 4: Butterfly Stretch
  new Exercise({
    routineID: 2,
    title: "Butterfly Stretch",
    exerciseOrder: 4,
    tag: Tag.WORKING,
    workTime: 45,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 20,
  }),

  // Exercise 5: Squats
  new Exercise({
    routineID: 2,
    title: "Squats",
    exerciseOrder: 5,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 3,
    restBetweenRounds: 15,
    breakBeforeNext: 20,
  }),

  // Exercise 6: Lunges
  new Exercise({
    routineID: 2,
    title: "Lunges",
    exerciseOrder: 6,
    tag: Tag.WORKING,
    workTime: 30, // Per side
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
  }),
  // ---------------------------------- End back mobility exercises

  // ---------------------------------- Start Shoulder exercises
  new Exercise({
    routineID: 3,
    title: "Warmup",
    exerciseOrder: 0,
    tag: Tag.PREROUTINE,
    workTime: 120,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
  }),
  new Exercise({
    routineID: 3,
    title: "Cooldown",
    exerciseOrder: 7,
    tag: Tag.POSTROUTINE,
    workTime: 120,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
  }),
  // Exercise 1: Arm Circles
  new Exercise({
    routineID: 3,
    title: "Arm Circles",
    exerciseOrder: 1,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
  }),

  // Exercise 2: Wall Slides
  new Exercise({
    routineID: 3,
    title: "Wall Slides",
    exerciseOrder: 2,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 15,
  }),

  // Exercise 3: Pendulum Exercise
  new Exercise({
    routineID: 3,
    title: "Pendulum Exercise",
    exerciseOrder: 3,
    tag: Tag.WORKING,
    workTime: 40, // Per side
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 20,
  }),

  // Exercise 4: External Rotation with Band
  new Exercise({
    routineID: 3,
    title: "External Rotation with Band",
    exerciseOrder: 4,
    tag: Tag.WORKING,
    workTime: 30, // Per side
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
  }),

  // Exercise 5: Doorway Stretch
  new Exercise({
    routineID: 3,
    title: "Doorway Stretch",
    exerciseOrder: 5,
    tag: Tag.WORKING,
    workTime: 40,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 20,
  }),

  // Exercise 6: Scapular Push-ups
  new Exercise({
    routineID: 3,
    title: "Scapular Push-ups",
    exerciseOrder: 6,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 15,
    breakBeforeNext: 20,
  }),
  // ---------------------------------- End Shoulder exercises

  // ---------------------------------- Start knee/ankle exercises
  // Exercise 1: Seated Leg Raises
  new Exercise({
    routineID: 4,
    title: "Warmup",
    exerciseOrder: 0,
    tag: Tag.PREROUTINE,
    workTime: 120,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
  }),
  new Exercise({
    routineID: 4,
    title: "Cooldown",
    exerciseOrder: 7,
    tag: Tag.POSTROUTINE,
    workTime: 120,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
  }),
  new Exercise({
    routineID: 4,
    title: "Seated Leg Raises",
    exerciseOrder: 1,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
  }),

  // Exercise 2: Ankle Circles
  new Exercise({
    routineID: 4,
    title: "Ankle Circles",
    exerciseOrder: 2,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
  }),
  // Exercise 3: Calf Raises
  new Exercise({
    routineID: 4,
    title: "Calf Raises",
    exerciseOrder: 3,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 3,
    restBetweenRounds: 15,
    breakBeforeNext: 20,
  }),

  // Exercise 4: Standing Knee Bends
  new Exercise({
    routineID: 4,
    title: "Standing Knee Bends",
    exerciseOrder: 4,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
  }),

  // Exercise 5: Toe Point and Flex
  new Exercise({
    routineID: 4,
    title: "Toe Point and Flex",
    exerciseOrder: 5,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 15,
  }),
  // ---------------------------------- End knee/ankle exercises

  // ---------------------------------- Start back mobility exercises
  new Exercise({
    routineID: 5,
    title: "Warmup",
    exerciseOrder: 0,
    tag: Tag.PREROUTINE,
    workTime: 120,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
  }),
  new Exercise({
    routineID: 5,
    title: "Cooldown",
    exerciseOrder: 7,
    tag: Tag.POSTROUTINE,
    workTime: 120,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 0,
  }),
  // Exercise 1: Child's Pose
  new Exercise({
    routineID: 5,
    title: "Child's Pose",
    exerciseOrder: 1,
    tag: Tag.REST,
    workTime: 60,
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 15,
  }),

  // Exercise 2: Cobra Pose
  new Exercise({
    routineID: 5,
    title: "Cobra Pose",
    exerciseOrder: 2,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 10,
    breakBeforeNext: 20,
  }),

  // Exercise 3: Cat-Cow Stretch
  new Exercise({
    routineID: 5,
    title: "Cat-Cow Stretch",
    exerciseOrder: 3,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 3,
    restBetweenRounds: 10,
    breakBeforeNext: 20,
  }),

  // Exercise 4: Spinal Twists
  new Exercise({
    routineID: 5,
    title: "Spinal Twists",
    exerciseOrder: 4,
    tag: Tag.WORKING,
    workTime: 40, // Per side
    numberOfRounds: 1,
    restBetweenRounds: 0,
    breakBeforeNext: 20,
  }),

  // Exercise 5: Bridge Pose
  new Exercise({
    routineID: 5,
    title: "Bridge Pose",
    exerciseOrder: 5,
    tag: Tag.WORKING,
    workTime: 30,
    numberOfRounds: 2,
    restBetweenRounds: 15,
    breakBeforeNext: 20,
  }),
  // ---------------------------------- End back mobility exercises
];