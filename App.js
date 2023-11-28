import { useCallback, useState, useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import * as SplashScreen from "expo-splash-screen";

import { AppContextProvider } from "./app/contexts/AppContext";
import AppNavigator from "./app/navigation/AppNavigator";
import { initializeDB } from "./app/db/DBSetup";
import { Audio, InterruptionModeIOS } from "expo-av";

SplashScreen.preventAutoHideAsync();

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDB();
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
        });

        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        Platform.OS === "ios"
          ? Purchases.configure({ apiKey: process.env.PUBLIC_IOS_SDK_KEY })
          : Purchases.configure({ apiKey: process.env.PUBLIC_ANDROID_SDK_KEY });
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
      await SplashScreen.hideAsync();
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
