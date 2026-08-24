class SoundPlaybackController {
  constructor({ getPlayer, isEnabled, onPlaybackStart, onError }) {
    this.getPlayer = getPlayer;
    this.isEnabled = isEnabled;
    this.onPlaybackStart = onPlaybackStart;
    this.onError = onError;
    this.activePlayback = null;
    this.requestID = 0;
  }

  async play(key) {
    if (!key) return "ignored";

    const player = this.getPlayer(key);
    if (!player) return "missing";
    if (!this.isEnabled()) return "disabled";

    const requestID = ++this.requestID;
    this.cancelActivePlayback();

    const playback = { key, player, requestID };
    this.activePlayback = playback;

    try {
      await player.seekTo(0);

      if (this.activePlayback !== playback || this.requestID !== requestID) {
        return "cancelled";
      }

      this.onPlaybackStart(key);
      player.play();
      return "played";
    } catch (error) {
      if (this.activePlayback === playback) {
        this.activePlayback = null;
      }
      this.onError("play", key, error);
      return "failed";
    }
  }

  async stop() {
    const playback = this.activePlayback;
    ++this.requestID;
    this.activePlayback = null;

    if (!playback) return;

    try {
      playback.player.pause();
      await playback.player.seekTo(0);
    } catch (error) {
      this.onError("stop", playback.key, error);
    }
  }

  handlePlaybackFinished(player) {
    if (this.activePlayback?.player !== player) return;

    ++this.requestID;
    this.activePlayback = null;
  }

  cancelActivePlayback() {
    const playback = this.activePlayback;
    this.activePlayback = null;

    if (!playback) return;

    try {
      playback.player.pause();
    } catch (error) {
      this.onError("interrupt", playback.key, error);
    }
  }
}

module.exports = { SoundPlaybackController };
