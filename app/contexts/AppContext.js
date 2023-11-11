import { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { lightTheme, darkTheme } from "../config/colors";
import {
  updateUserSubscriptionOnSync,
  getUserSubscriptionStatus,
  retrieveSetting,
  updateSetting,
} from "../db/DBActions";
import { SETTINGS_KEYS } from "../config/settingsKeys";
import Purchases from "react-native-purchases";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // default theme
  const [theme, setTheme] = useState(darkTheme);
  const [soundOn, setSoundOn] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  // useEffect(() => {
  //   const loadPremium = async () => {
  //     try {
  //       const customerInfo = await Purchases.getCustomerInfo();
  //       // await handleCustomerInfoUpdate(customerInfo, "useEffect");
  //     } catch (err) {
  //       console.log(
  //         "Couldn't load premium from revenue cat.",
  //         "Defaulting to database",
  //       );
  //     }
  //   };

  //   loadPremium();
  // }, []);

  useEffect(() => {
    const loadSettings = async () => {
      const setting = await retrieveSetting(SETTINGS_KEYS.SOUND);
      if (setting) {
        const value = JSON.parse(setting.value);
        setSoundOn(value);
      }
    };

    loadSettings();
  }, []);

  // Right now handles only sound settings.
  const updateSound = async (value) => {
    await updateSetting(SETTINGS_KEYS.SOUND, JSON.stringify(value));
    setSoundOn(value);
  };

  const handleCustomerInfoUpdate = async (customerInfo, caller) => {

    console.log(JSON.stringify(customerInfo, null, 2));

    const activeEntitlements = customerInfo?.entitlements?.active?.Premium;
    if (typeof activeEntitlements !== "undefined") {
      const updateResponse = await updateUserSubscriptionOnSync(
        customerInfo,
        activeEntitlements,
      );
    }
    // Update context
    const [premiumStatus, isInGracePeriod] = await getUserSubscriptionStatus();
    setIsPremium(premiumStatus);
    if (isInGracePeriod) {
      Alert.alert("Your subscription will expire soon", "To keep access to premium features, please go online and verify subscription status");
    }

    console.log(
      `From ${caller}: UserSubscription info updated`,
      // `info: ${JSON.stringify(customerInfo, null, 2)}`,
    );
  };

  Purchases.addCustomerInfoUpdateListener((info) => {
    handleCustomerInfoUpdate(info, "listener AppContext");
  });

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        soundOn,
        setSoundOn,
        updateSound,
        isPremium,
        setIsPremium,
        handleCustomerInfoUpdate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
