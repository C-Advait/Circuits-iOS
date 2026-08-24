import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { createAudioPlayer } from "expo-audio";
import { SOUNDS } from "../config/sounds";
import { useAppContext } from "./AppContext";

const { SoundPlaybackController } = require("../utilities/soundPlayback");

const SoundContext = createContext();

export const useSoundContext = () => {
  return useContext(SoundContext);
};

export const SoundProvider = ({ children }) => {
  const [sounds, setSounds] = useState({});
  const soundsRef = useRef({});
  const pendingSoundRef = useRef(null);
  const soundOnRef = useRef(false);
  const playbackControllerRef = useRef(null);

  const { soundOn } = useAppContext();
  soundOnRef.current = soundOn;

  if (!playbackControllerRef.current) {
    playbackControllerRef.current = new SoundPlaybackController({
      getPlayer: (key) => soundsRef.current[key],
      isEnabled: () => soundOnRef.current,
      onPlaybackStart: (key) => {
        console.log(`About to play sound for key ${key}`);
      },
      onError: (action, key, error) => {
        console.error(`Couldn't ${action} the sound for key ${key}`, error);
      },
    });
  }

  const soundFiles = SOUNDS;

  useEffect(() => {
    const loadedSounds = {};
    const subscriptions = [];

    Object.keys(soundFiles).forEach((key) => {
      try {
        const player = createAudioPlayer(soundFiles[key].file, {
          downloadFirst: true,
        });
        const subscription = player.addListener(
          "playbackStatusUpdate",
          (status) => {
            if (!status.didJustFinish) return;

            playbackControllerRef.current.handlePlaybackFinished(player);
          },
        );

        loadedSounds[key] = player;
        subscriptions.push(subscription);
      } catch (error) {
        console.error(`Couldn't create the audio player for key ${key}`, error);
      }
    });

    soundsRef.current = loadedSounds;
    setSounds(loadedSounds);

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
      Object.values(soundsRef.current).forEach((player) => {
        try {
          player.remove();
        } catch (error) {
          console.error("Couldn't release an audio player", error);
        }
      });
      soundsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const pendingKey = pendingSoundRef.current;
    if (!pendingKey || !sounds[pendingKey]) return;

    pendingSoundRef.current = null;
    playSound(pendingKey).catch((error) => {
      console.error(
        `Couldn't play the pending sound for key ${pendingKey}`,
        error,
      );
    });
  }, [sounds]);

  const playSound = async (key) => {
    const result = await playbackControllerRef.current.play(key);
    if (result === "missing") {
      pendingSoundRef.current = key;
    }
  };

  const stopSound = async () => {
    await playbackControllerRef.current.stop();
  };

  return (
    <SoundContext.Provider
      value={{
        playSound,
        stopSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
