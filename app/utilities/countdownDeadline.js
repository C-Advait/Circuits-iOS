const getCountdownDelay = (deadline, now) => Math.max(0, deadline - now);

const scheduleCountdownDeadline = ({
  deadline,
  onComplete,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
}) => {
  const timeoutID = setTimer(onComplete, getCountdownDelay(deadline, now()));

  return () => clearTimer(timeoutID);
};

module.exports = { getCountdownDelay, scheduleCountdownDeadline };
