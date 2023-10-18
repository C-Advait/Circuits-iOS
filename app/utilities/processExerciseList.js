import { Tag } from "../classes/Exercise";

// Given a list of exercises,
// decompresses into a Timer-friendly format.
const decompress = (arr) => {
  return arr.flatMap((item, idx, originalArr) => {
    // Generate round objects
    const roundObjects = Array.from(
      { length: item.numberOfRounds },
      (_, index) => {
        return {
          ...item,
          duration: item.workTime,
          currentRound: index + 1,
        };
      },
    );

    // Interleave with 'rest' objects
    const withRest = [];
    roundObjects.forEach((roundObj, idx) => {
      withRest.push(roundObj);
      if (idx < roundObjects.length - 1 && item.restBetweenRounds) {
        withRest.push({
          ...roundObj,
          title: "Rest",
          duration: item.restBetweenRounds,
          tag: Tag.REST,
        });
      }
    });

    // Append 'break' object if necessary
    if (item.breakBeforeNext) {
      // && idx < originalArr.length - 1) {
      withRest.push({
        ...withRest[withRest.length - 1],
        title: "Break",
        duration: item.breakBeforeNext,
        tag: Tag.BREAK,
      });
    }

    return withRest;
  });
};

// Accumulates durations. Given an array, arr,
// of objects, each of which has a `duration` field,
// this function produces an array of objects augmented with
// `startTime`, defined as the sum of durations for all preceding objects.
// The `startTime` of the first object is 0.
const augmentWithCumulativeTimes = (arr) => {
  let accumulatedDuration = 0;

  const ret = arr.map((obj) => {
    const startTime = accumulatedDuration;
    accumulatedDuration += obj.duration;
    return {
      ...obj,
      startTime: startTime,
    };
  });

  return ret;
};

export const processExerciseList = (arr) => {
  return augmentWithCumulativeTimes(decompress(arr));
};
