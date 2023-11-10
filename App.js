import { useCallback, useState, useEffect } from "react";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import * as SplashScreen from "expo-splash-screen";

import { AppContextProvider } from "./app/contexts/AppContext";
import AppNavigator from "./app/navigation/AppNavigator";
import { initializeDB } from "./app/db/DBSetup";
import { Audio, InterruptionModeIOS } from "expo-av";
import { createUserSubscriptionOnSync, doesUserSubscriptionExist, updateUserSubscriptionOnSync } from "./app/db/DBActions"

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
        Alert.alert(
          "About to configure",
          `Api key: ${process.env.PUBLIC_IOS_SDK_KEY}`,
        );
        Purchases.configure({ apiKey: process.env.PUBLIC_IOS_SDK_KEY });
      } catch (error) {
        console.error("Something went wrong during init.", error);
      } finally {
        setReady(true);
      }
    };

    const handleCustomerInfoUpdate = async (info) => {

      //guard against empty customerInfo object?
      const activeEntitlements = info.entitlements.active["Premium"];
      if (typeof activeEntitlements !== "undefined") {
        const userSubEntryExists = await doesUserSubscriptionExist();
        if (userSubEntryExists) {
          const updateResponse = await updateUserSubscriptionOnSync(info, activeEntitlements);
          Alert.alert("Status subscription update", updateResponse);
        } else {
          const createResponse = await createUserSubscriptionOnSync(info, activeEntitlements);
          Alert.alert("Status subscription creation", createResponse);
        }
      }

      Alert.alert(
        "Purchaser info updated",
        `info: ${JSON.stringify(info, null, 2)}`,
      );
    };

    Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdate);

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
