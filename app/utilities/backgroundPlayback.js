const MILLIS_IN_SECOND = 1000;

const getBackgroundPlaybackPlan = (state, now) => {
  if (state.isPlaying) {
    return {
      startsAfterCountdown: false,
      startedAt: state.lastTickAt,
      delayUntilStartSeconds: 0,
    };
  }

  if (!state.showCountdown || state.countdownDeadline === null) {
    return null;
  }

  return {
    startsAfterCountdown: true,
    startedAt: state.countdownDeadline,
    delayUntilStartSeconds:
      Math.max(0, state.countdownDeadline - now) / MILLIS_IN_SECOND,
  };
};

module.exports = { getBackgroundPlaybackPlan };
