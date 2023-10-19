import { createContext, useState, useContext } from "react";
import { lightTheme, darkTheme } from "../config/colors";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // default theme
  const [theme, setTheme] = useState(darkTheme);
  const [haptics, setHaptics] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <SettingsContext.Provider
      value={{ theme, toggleTheme, haptics, setHaptics }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function optionalHapticFunction(hasHaptics, asyncHapticFunction) {
  if (hasHaptics) {
    return asyncHapticFunction;
  } else {
    return () => null;
  }
}

export const useSettings = () => {
  return useContext(SettingsContext);
};
