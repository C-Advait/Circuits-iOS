import { createContext, useState, useContext, useEffect } from "react";
import { lightTheme, darkTheme } from "../config/colors";
import { retrieveSetting, saveSetting } from "../db/asyncStorage";
import { SETTINGS_KEYS } from "../config/settingsKeys";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // default theme
  const [theme, setTheme] = useState(darkTheme);
  const [soundOn, setSoundOn] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  // Load settings from asyncStorage initially.
  useEffect(() => {
    const loadSettings = async () => {
      const setting = JSON.parse(await retrieveSetting(SETTINGS_KEYS.SOUND));
      if (setting) {
        setSoundOn(setting);
      }
    };

    loadSettings();
  }, []);

  // Right now handles only sound settings.
  const updateSound = async (value) => {
    await saveSetting(SETTINGS_KEYS.SOUND, JSON.stringify(value));
    setSoundOn(value);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        soundOn,
        updateSound,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
