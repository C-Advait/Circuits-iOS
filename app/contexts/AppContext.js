import { createContext, useState, useContext, useEffect } from "react";
import { lightTheme, darkTheme } from "../config/colors";
import {
  getUserSubscriptionStatus,
  retrieveSetting,
  updateSetting,
} from "../db/DBActions";
import { SETTINGS_KEYS } from "../config/settingsKeys";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // default theme
  const [theme, setTheme] = useState(darkTheme);
  const [soundOn, setSoundOn] = useState(true);
  const [isPremium, setIsPremium] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  useEffect(() => {
    const loadPremium = async () => {
      const premiumStatus = await getUserSubscriptionStatus();
      setIsPremium(premiumStatus);
    };

    loadPremium();
  }, []);

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
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        soundOn,
        setSoundOn,
        updateSound,
        isPremium,
        setIsPremium,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
