export default function getExerciseLength(exercise) {
    let total =
        (
            exercise.numberOfRounds * exercise.workTime +
            (exercise.numberOfRounds - 1) * exercise.restBetweenRounds +
            exercise.breakBeforeNext
        );
    return total;
}