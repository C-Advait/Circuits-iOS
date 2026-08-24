const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

const { getBackgroundPlaybackPlan } = require("../backgroundPlayback");

describe("backgroundPlayback", () => {
  it("anchors playback to a pending countdown deadline", () => {
    const plan = getBackgroundPlaybackPlan(
      {
        isPlaying: false,
        showCountdown: true,
        countdownDeadline: 4_000,
        lastTickAt: null,
      },
      1_000,
    );

    assert.deepEqual(plan, {
      startsAfterCountdown: true,
      startedAt: 4_000,
      delayUntilStartSeconds: 3,
    });
  });

  it("keeps active playback running without another delay", () => {
    const plan = getBackgroundPlaybackPlan(
      {
        isPlaying: true,
        showCountdown: false,
        countdownDeadline: null,
        lastTickAt: 2_000,
      },
      3_000,
    );

    assert.deepEqual(plan, {
      startsAfterCountdown: false,
      startedAt: 2_000,
      delayUntilStartSeconds: 0,
    });
  });

  it("does not run a paused routine", () => {
    const plan = getBackgroundPlaybackPlan(
      {
        isPlaying: false,
        showCountdown: false,
        countdownDeadline: null,
        lastTickAt: null,
      },
      3_000,
    );

    assert.equal(plan, null);
  });
});
