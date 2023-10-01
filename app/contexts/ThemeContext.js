import { createContext, useState, useContext } from 'react';
import { lightTheme, darkTheme } from '../config/colors';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // default theme
  const [theme, setTheme] = useState(darkTheme); 

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
