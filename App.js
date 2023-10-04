import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import AppNavigator from "./app/navigation/AppNavigator";
import { initializeDB } from "./app/db/DBSetup";

export default function App() {
  useEffect(() => {
    initializeDB();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
