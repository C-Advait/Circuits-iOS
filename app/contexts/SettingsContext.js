import { createContext, useState, useContext } from "react";
import { lightTheme, darkTheme } from "../config/colors";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // default theme
  const [theme, setTheme] = useState(darkTheme);
  const [haptics, setHaptics] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  const optionalHapticFunction = (asyncHapticFunction) => {
    if (haptics) {
      return asyncHapticFunction;
    } else {
      return () => null;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        haptics,
        setHaptics,
        soundOn,
        setSoundOn,
        optionalHapticFunction,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
