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

const SoundContext = createContext();

export const useSoundContext = () => {
  return useContext(SoundContext);
};

export const SoundProvider = ({ children }) => {
  const [sounds, setSounds] = useState({});
  const soundsRef = useRef({});
  const activeSoundRef = useRef(null);
  const pendingSoundRef = useRef(null);

  const { soundOn } = useAppContext();

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

            activeSoundRef.current = null;
            player.seekTo(0).catch((error) => {
              console.error(`Couldn't rewind the sound for key ${key}`, error);
            });
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
    if (!key || activeSoundRef.current) return;

    const sound = soundsRef.current[key];
    if (!sound) {
      pendingSoundRef.current = key;
      return;
    }

    if (soundOn) {
      console.log(`About to play sound for key ${key}`);
      try {
        activeSoundRef.current = key;
        await sound.seekTo(0);
        sound.play();
      } catch (error) {
        activeSoundRef.current = null;
        console.error(`Couldn't play the sound for key ${key}`, error);
      }
    }
  };

  const stopSound = async () => {
    const activeKey = activeSoundRef.current;
    const sound = soundsRef.current[activeKey];
    if (!activeKey || !sound) return;

    activeSoundRef.current = null;
    try {
      sound.pause();
      await sound.seekTo(0);
    } catch (error) {
      console.error(`Couldn't stop the sound for key ${activeKey}`, error);
    }
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
