import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Audio } from "expo-av";
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
    async function loadSounds() {
      const loadedSounds = {};

      const loadPromises = Object.keys(soundFiles).map(async (key) => {
        const soundInstance = new Audio.Sound();
        try {
          await soundInstance.loadAsync(soundFiles[key].file);
          loadedSounds[key] = soundInstance;
        } catch (error) {
          console.error(`Couldn't load the sound for key ${key}`, error);
        }
      });

      await Promise.all(loadPromises);
      soundsRef.current = loadedSounds;
      setSounds(loadedSounds);
    }

    loadSounds();

    return () => {
      for (let key in soundsRef.current) {
        if (soundsRef.current[key]) {
          soundsRef.current[key].unloadAsync();
        }
      }
      soundsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const pendingKey = pendingSoundRef.current;
    if (!pendingKey || !sounds[pendingKey]) return;

    pendingSoundRef.current = null;
    playSound(pendingKey);
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
        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            console.log(`Just played sound for key ${key}`);
            activeSoundRef.current = null;
            try {
              await sound.stopAsync();
            } catch (error) {
              console.error(`Couldn't rewind the sound for key ${key}`, error);
            }
          }
        });
        await sound.replayAsync();
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
      await sound.stopAsync();
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
