import React, { createContext, useContext, useState, useEffect } from "react";
import { Audio } from "expo-av";
import { SOUNDS } from "../config/sounds";
import { useSettings } from "./SettingsContext";

const SoundContext = createContext();

export const useSoundContext = () => {
  return useContext(SoundContext);
};

export const SoundProvider = ({ children }) => {
  const [sounds, setSounds] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  const { soundOn } = useSettings();

  const soundFiles = SOUNDS;

  useEffect(() => {
    async function loadSounds() {
      const loadedSounds = {};

      const loadPromises = Object.keys(soundFiles).map(async (key) => {
        const soundInstance = new Audio.Sound();
        try {
          await soundInstance.loadAsync(soundFiles[key].file);
          loadedSounds[key] = soundInstance;
          console.log(`Successfully loaded the sound for key ${key}`);
        } catch (error) {
          console.error(`Couldn't load the sound for key ${key}`, error);
        }
      });

      await Promise.all(loadPromises);
      setSounds(loadedSounds);
    }

    loadSounds();

    return () => {
      for (let key in sounds) {
        if (sounds[key]) {
          sounds[key].unloadAsync();
        }
      }
    };
  }, []);

  const playSound = async (key) => {
    console.log("Inside playSound");
    if (isPlaying) return;

    if (sounds[key] && soundOn) {
      console.log(`About to play sound for key ${key}`);
      try {
        setIsPlaying(true);
        await sounds[key].playAsync();
        sounds[key].setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            console.log(`Just played sound for key ${key}`);
            setIsPlaying(false);
            await sounds[key].setPositionAsync(0);
          }
        });
      } catch (error) {
        setIsPlaying(false);
        console.error(`Couldn't play the sound for key ${key}`, error);
      }
    }
  };

  const pauseSound = async (key) => {
    if (sounds[key]) {
      try {
        setIsPlaying(false);
        await sounds[key].pauseAsync();
      } catch (error) {
        setIsPlaying(true);
        console.error(`Couldn't pause the sound for key ${key}`, error);
      }
    }
  };

  return (
    <SoundContext.Provider
      value={{
        playSound,
        pauseSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
