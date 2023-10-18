export default function formatExerciseInfo(exercise) { //exercise == Exercise Object assumption

    const rounds = exercise.numberOfRounds;

    const workHours = Math.floor(exercise.workTime / 3600);
    const workMinutes = Math.floor((exercise.workTime % 3600) / 60);
    const workSeconds = exercise.workTime % 60;
    const restHours = Math.floor(exercise.restBetweenRounds / 3600);
    const restMinutes = Math.floor((exercise.restBetweenRounds % 3600) / 60);
    const restSeconds = exercise.restBetweenRounds % 60;
    let timeStr = `${rounds} round${(rounds > 1) ? 's' : ''} of `;

    // Add hours, minutes, and seconds to the string only if they are non-zero
    if (workHours > 0) timeStr += `${workHours}h `;
    if (workMinutes > 0) timeStr += `${workMinutes}m `;
    if (workSeconds > 0) timeStr += `${workSeconds}s `;

    if (restSeconds > 0 || restMinutes > 0 || restHours > 0) {
        timeStr += '+ ';
        if (restHours > 0) timeStr += `${restHours}h `;
        if (restMinutes > 0) timeStr += `${restMinutes}m `;
        if (restSeconds > 0) timeStr += `${restSeconds}s`;
        timeStr += ' rest';
    }
    return timeStr.trim();
}