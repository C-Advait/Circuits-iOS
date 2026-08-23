const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

const {
  getCountdownDelay,
  scheduleCountdownDeadline,
} = require("../countdownDeadline");

describe("countdownDeadline", () => {
  it("schedules completion for the remaining deadline duration", () => {
    let scheduledCallback;
    let scheduledDelay;
    let completionCount = 0;
    const onComplete = () => {
      completionCount += 1;
    };

    scheduleCountdownDeadline({
      deadline: 4_000,
      onComplete,
      now: () => 1_000,
      setTimer: (callback, delay) => {
        scheduledCallback = callback;
        scheduledDelay = delay;
        return 42;
      },
    });

    assert.equal(scheduledCallback, onComplete);
    assert.equal(scheduledDelay, 3_000);

    scheduledCallback();
    assert.equal(completionCount, 1);
  });

  it("cancels the scheduled completion during cleanup", () => {
    let clearedTimer;

    const cleanup = scheduleCountdownDeadline({
      deadline: 4_000,
      onComplete: () => {},
      now: () => 1_000,
      setTimer: () => 42,
      clearTimer: (timerID) => {
        clearedTimer = timerID;
      },
    });

    cleanup();

    assert.equal(clearedTimer, 42);
  });

  it("completes immediately when the deadline has passed", () => {
    assert.equal(getCountdownDelay(4_000, 4_500), 0);
  });
});
