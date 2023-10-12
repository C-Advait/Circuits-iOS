import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "./app/contexts/ThemeContext";
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
      <Host>
        <ThemeProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </Host>
    </GestureHandlerRootView>
  ) : null;
}
