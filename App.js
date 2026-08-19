import { useCallback, useState, useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";

import { AppContextProvider } from "./app/contexts/AppContext";
import AppNavigator from "./app/navigation/AppNavigator";
import { initializeDB } from "./app/db/DBSetup";
import { setAudioModeAsync } from "expo-audio";

SplashScreen.preventAutoHideAsync().catch((error) => {
  console.error("Couldn't keep the splash screen visible during init.", error);
});

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDB();
        await setAudioModeAsync({
          shouldPlayInBackground: true,
          playsInSilentMode: true,
          interruptionMode: "mixWithOthers",
        });

        if (Platform.OS === "android") {
          await NavigationBar.setVisibilityAsync("hidden");
          await NavigationBar.setBehaviorAsync("overlay-swipe");
        }
      } catch (error) {
        console.error("Something went wrong during init.", error);
      } finally {
        setReady(true);
      }
    };

    init();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("Couldn't hide the splash screen after init.", error);
      }
    }
  }, [ready]);

  return ready ? (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Host>
        <AppContextProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AppContextProvider>
      </Host>
    </GestureHandlerRootView>
  ) : null;
}

export default App;
