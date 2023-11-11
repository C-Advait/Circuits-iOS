import { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { lightTheme, darkTheme } from "../config/colors";
import {
  createUserSubscriptionOnSync,
  updateUserSubscriptionOnSync,
  doesUserSubscriptionExist,
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

  useEffect(() => {
    const loadPremium = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        await handleCustomerInfoUpdate(customerInfo, "useEffect");
      } catch (err) {
        console.log(
          "Couldn't load premium from revenue cat.",
          "Defaulting to database",
        );
        const premiumStatus = await getUserSubscriptionStatus();
        setIsPremium(premiumStatus);
      }
    };

    loadPremium();
  }, []);

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
    const activeEntitlements = customerInfo?.entitlements?.active?.Premium;
    const userSubEntryExists = await doesUserSubscriptionExist();

    console.log("caller: ", caller);
    console.log("activeEntitlements: ", activeEntitlements);
    console.log("userSubEntryExists: ", userSubEntryExists);

    // Data is there.
    if (typeof activeEntitlements !== "undefined") {
      if (userSubEntryExists) {
        const updateResponse = await updateUserSubscriptionOnSync(
          customerInfo,
          activeEntitlements,
        );
        console.log(
          `From ${caller}: Status subscription update`,
          updateResponse,
        );
      } else {
        const createResponse = await createUserSubscriptionOnSync(
          customerInfo,
          activeEntitlements,
        );
        console.log(
          `From ${caller}: Status subscription creation`,
          createResponse,
        );
      }
    }

    // Update context regardless
    const hasPremium = await getUserSubscriptionStatus();
    setIsPremium(hasPremium);

    console.log(
      `From ${caller}: Purchaser info updated`,
      `info: ${JSON.stringify(customerInfo, null, 2)}`,
    );
  };

  // Purchases.addCustomerInfoUpdateListener((info) => {
  //   handleCustomerInfoUpdate(info, "listener");
  // });

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
