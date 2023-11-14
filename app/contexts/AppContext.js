import { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { lightTheme, darkTheme } from "../config/colors";
import {
  updateUserSubscriptionOnSync,
  getUserSubscriptionStatus,
  retrieveSetting,
  updateSetting,
  getExpiryNotificationCount,
  setExpiryNotificationCount,
  decrementExpiryNotificationCount,
  getCachedProductID,
  setCrossgrade,
} from "../db/DBActions";
import { SETTINGS_KEYS } from "../config/settingsKeys";
import NetInfo from "@react-native-community/netinfo";
import Purchases from "react-native-purchases";
import { SUBSCRIPTION_GRACE_PERIOD_DAYS } from "../config/appConstants";

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
    console.log(
      "Expiry: ",
      JSON.stringify(customerInfo?.entitlements, null, 2),
    );
    const premiumEntitlement = customerInfo?.entitlements?.active?.Premium;
    if (typeof premiumEntitlement !== "undefined") {
      const cachedProductID = await getCachedProductID();
      // First time seeing crossgrade. Mark complete
      if (cachedProductID !== premiumEntitlement.productIdentifier) {
        await setCrossgrade(0);
      }

      setPremiumPlan(
        extractPlanFromProductIdentifier(premiumEntitlement?.productIdentifier),
      );

      await updateUserSubscriptionOnSync(customerInfo, premiumEntitlement);
    } else {
      setPremiumPlan(undefined);
    }

    await updateUserExperience();
  };

  const syncSubscriptionIfOnline = (async = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        Purchases.getCustomerInfo();
      } else {
        updateUserExperience();
      }
    });
  });

  const updateUserExperience = async () => {
    console.log("Updating user experience");
    // Update context
    const [premiumStatus, isInGracePeriod] = await getUserSubscriptionStatus();
    setIsPremium(premiumStatus);

    console.log("Premium: ", premiumStatus);

    if (!isPremium) await setExpiryNotificationCount();
    if (isInGracePeriod && (await getExpiryNotificationCount()) > 0) {
      NetInfo.fetch().then(async (state) => {
        if (state.isConnected) {
          const customerInfo = await Purchases.getCustomerInfo();
          if (
            typeof customerInfo?.entitlements?.active?.Premium === "undefined"
          )
            onlineGracePeriodAlert();
        } else {
          offlineGracePeriodAlert();
        }
      });
      decrementExpiryNotificationCount();
    }
    console.log(`UserSubscription info updated`);
  };

  const onlineGracePeriodAlert = () => {
    Alert.alert(
      "Subscription expires soon",
      `Within ${SUBSCRIPTION_GRACE_PERIOD_DAYS} days, your account will transition to our free-tier, which allows access to your first three routines only.\n\nPlease note, while routines beyond the third won’t be accessible, they will remain saved in your account.`,
    );
  };

  const offlineGracePeriodAlert = () => {
    Alert.alert(
      "Unable to verify subscription",
      `We're unable to confirm your premium status for the upcoming billing cycle, as you're currently using the app offline.\n\nTo keep enjoying your subscription benefits, please connect to the internet while using the app sometime in the next ${SUBSCRIPTION_GRACE_PERIOD_DAYS} days.\n\nThis will help us ensure your account remains on the premium tier.`,
    );
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
        updateUserExperience,
        syncSubscriptionIfOnline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
