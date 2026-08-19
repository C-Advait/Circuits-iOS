export const getElapsedAtTime = (state, now) => {
  if (!state.isPlaying || state.lastTickAt === null) {
    return state.totalElapsedTime;
  }

  return Math.min(
    state.totalDuration,
    state.totalElapsedTime + Math.max(0, now - state.lastTickAt) / 1000,
  );
};

export const advanceTimerTo = (state, now) => {
  if (
    !state.isPlaying ||
    state.lastTickAt === null ||
    !state.intervals.length
  ) {
    return state;
  }

  const effectiveNow = Math.max(now, state.lastTickAt);
  const elapsedTime = getElapsedAtTime(state, effectiveNow);

  if (elapsedTime >= state.totalDuration) {
    return {
      ...state,
      totalElapsedTime: state.totalDuration,
      exerciseSecondsRemaining: 0,
      currentIndex: Math.max(0, state.intervals.length - 1),
      routineComplete: true,
      isPlaying: false,
      lastTickAt: null,
      clockRevision: state.clockRevision + 1,
    };
  }

  const currentIndex = state.intervals.findIndex(
    (interval) => interval.startTime + interval.duration > elapsedTime,
  );
  const currentInterval = state.intervals[currentIndex];

  return {
    ...state,
    totalElapsedTime: elapsedTime,
    exerciseSecondsRemaining:
      currentInterval.startTime + currentInterval.duration - elapsedTime,
    currentIndex,
    currentLoop: currentInterval.currentLoop,
    lastTickAt: effectiveNow,
    clockRevision:
      currentIndex === state.currentIndex
        ? state.clockRevision
        : state.clockRevision + 1,
  };
};
