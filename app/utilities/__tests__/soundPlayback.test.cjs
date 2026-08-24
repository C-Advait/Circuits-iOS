const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

const { SoundPlaybackController } = require("../soundPlayback");

const createPlayer = () => {
  const calls = [];
  return {
    calls,
    pause: () => calls.push("pause"),
    play: () => calls.push("play"),
    seekTo: async (position) => calls.push(["seekTo", position]),
  };
};

const createController = (players) =>
  new SoundPlaybackController({
    getPlayer: (key) => players[key],
    isEnabled: () => true,
    onPlaybackStart: () => {},
    onError: (action, key, error) => {
      throw new Error(`${action} ${key}`, { cause: error });
    },
  });

describe("SoundPlaybackController", () => {
  it("seeks to the beginning before playing", async () => {
    const player = createPlayer();
    const controller = createController({ START: player });

    assert.equal(await controller.play("START"), "played");
    assert.deepEqual(player.calls, [["seekTo", 0], "play"]);
  });

  it("cancels the previous cue before starting a new one", async () => {
    const completion = createPlayer();
    const start = createPlayer();
    const controller = createController({
      COMPLETION: completion,
      START: start,
    });

    await controller.play("COMPLETION");
    await controller.play("START");

    assert.deepEqual(completion.calls, [["seekTo", 0], "play", "pause"]);
    assert.deepEqual(start.calls, [["seekTo", 0], "play"]);
  });

  it("does not play an older request after its seek resolves", async () => {
    let finishFirstSeek;
    const first = createPlayer();
    first.seekTo = () =>
      new Promise((resolve) => {
        finishFirstSeek = resolve;
      });
    const second = createPlayer();
    const controller = createController({ FIRST: first, SECOND: second });

    const firstRequest = controller.play("FIRST");
    await controller.play("SECOND");
    finishFirstSeek();

    assert.equal(await firstRequest, "cancelled");
    assert.deepEqual(first.calls, ["pause"]);
    assert.deepEqual(second.calls, [["seekTo", 0], "play"]);
  });

  it("ignores completion events from an interrupted player", async () => {
    const completion = createPlayer();
    const start = createPlayer();
    const next = createPlayer();
    const controller = createController({
      COMPLETION: completion,
      START: start,
      NEXT: next,
    });

    await controller.play("COMPLETION");
    await controller.play("START");
    controller.handlePlaybackFinished(completion);
    await controller.play("NEXT");

    assert.equal(start.calls.at(-1), "pause");
    assert.deepEqual(next.calls, [["seekTo", 0], "play"]);
  });

  it("stops and rewinds the active cue", async () => {
    const player = createPlayer();
    const controller = createController({ START: player });

    await controller.play("START");
    await controller.stop();

    assert.deepEqual(player.calls, [
      ["seekTo", 0],
      "play",
      "pause",
      ["seekTo", 0],
    ]);
  });
});
