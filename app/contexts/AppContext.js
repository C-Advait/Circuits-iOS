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
  const [premiumPlan, setPremiumPlan] = useState();

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

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

  const handleCustomerInfoUpdate = async (customerInfo) => {
    console.log(JSON.stringify(customerInfo, null, 2));

    const premiumEntitlement = customerInfo?.entitlements?.active?.Premium;
    if (typeof premiumEntitlement !== "undefined") {
      setPremiumPlan(
        extractPlanFromProductIdentifier(premiumEntitlement?.productIdentifier),
      );

      await updateUserSubscriptionOnSync(customerInfo, premiumEntitlement);
    } else {
      setPremiumPlan(undefined);
    }

    // Update context
    const [premiumStatus, isInGracePeriod] = await getUserSubscriptionStatus();
    setIsPremium(premiumStatus);
    if (isInGracePeriod) {
      Alert.alert(
        "Subscription expiring soon",
        "To keep access to premium features, please go online and verify subscription status.",
      );
    }

    console.log(`UserSubscription info updated`);
  };

  useEffect(() => {
    // Subscribe to purchaser updates
    Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdate);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate);
    };
  });

  // Return from after second occurrence of '.' to end.
  const extractPlanFromProductIdentifier = (identifier) => {
    const _ = identifier.indexOf(".");
    const idx = identifier.indexOf(".", _ + 1);
    if (idx === -1) return "";
    return identifier.substring(idx + 1);
  };

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
        premiumPlan,
        setPremiumPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
