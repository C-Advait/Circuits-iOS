import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { PUBLIC_IOS_SDK_KEY } from "@env";
import * as SplashScreen from "expo-splash-screen";

import { SettingsProvider } from "./app/contexts/SettingsContext";
import AppNavigator from "./app/navigation/AppNavigator";
import { initializeDB } from "./app/db/DBSetup";
import { Audio, InterruptionModeIOS } from "expo-av";

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        SplashScreen.preventAutoHideAsync();
        await initializeDB();
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
        });

        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        Purchases.configure({ apiKey: PUBLIC_IOS_SDK_KEY });
      } catch (error) {
        console.error("Something went wrong during init.", error);
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    };

    init();
  });

  return ready ? (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Host>
        <SettingsProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SettingsProvider>
      </Host>
    </GestureHandlerRootView>
  ) : null;
}

export default App;
