import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppNavigator from "./app/navigation/AppNavigator";
import { initializeDB } from "./app/db/DBSetup";

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const init = async () => {
      setReady(await initializeDB());
    };

    init();
  }, []);

  // Should return loading screen -- not null.
  return ready ? (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  ) : null;
}
