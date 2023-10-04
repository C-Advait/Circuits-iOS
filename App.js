import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import AppNavigator from "./app/navigation/AppNavigator";
import { createTables, getDBConnection } from "./app/db/DBService";

export default function App() {
  useEffect(() => {
    getDBConnection().then(() => {
      createTables();
    });
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
