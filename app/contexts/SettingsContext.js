import { createContext, useState, useContext, useEffect } from "react";
import { lightTheme, darkTheme } from "../config/colors";
import { retrieveSetting, updateSetting } from "../db/DBActions";
import { SETTINGS_KEYS } from "../config/settingsKeys";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // default theme
  const [theme, setTheme] = useState(darkTheme);
  const [soundOn, setSoundOn] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  useEffect(() => {
    const loadSettings = async () => {
      const setting = await retrieveSetting(SETTINGS_KEYS.SOUND);
      if (setting) {
        const value = JSON.parse(setting.value);
        setSoundOn(value);
      }
    };

    loadSettings();
  }, []);

  // Right now handles only sound settings.
  const updateSound = async (value) => {
    await updateSetting(SETTINGS_KEYS.SOUND, JSON.stringify(value));
    setSoundOn(value);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        soundOn,
        setSoundOn,
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
