export const extractStartingPickerTime = (
  passedExercise,
  field,
  defaultMin = " 1",
  defaultSec = " 0",
) => {
  if (!passedExercise) return [defaultMin, defaultSec];

  const min = Math.floor(passedExercise[field] / 60);
  const sec = passedExercise[field] % 60;
  return [pad(min), pad(sec)];
};

export const extractStartingRounds = (passedExercise) => {
  return passedExercise ? pad(passedExercise.numberOfRounds) : " 1";
};

const pad = (x) => {
  return x.toString().padStart(2, " ");
};
