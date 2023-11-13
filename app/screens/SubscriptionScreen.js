import React, { useEffect, useReducer, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import Screen from "../components/Screen";
import NavHeader from "../components/NavHeader";
import { IconButton, PurchaseContinueButton } from "../components/buttons";
import { useAppContext } from "../contexts/AppContext";
import ImageText from "../components/ImageText";
import {
  PARAGRAPH_FONT_SIZE,
  PARAGRAPH_FONT_WEIGHT,
} from "../config/appConstants";
import { SubscriptionButton } from "../components/buttons";
import subscriptionActions from "../actions/subscriptionActions";
import { PREMIUM_PLANS } from "../config/premiumPlans";
import Purchases from "react-native-purchases";
import OverlayLoader from "../components/OverlayLoader";
import { getUserSubscriptionStatus } from "../db/DBActions";

const SubscriptionScreen = ({ route }) => {
  const navigation = useNavigation();
  const [subscriptionDetails, setSubscriptionDetails] = useState();
  const { theme, premiumPlan } = useAppContext();
  const [loading, setLoading] = useState(false);
  const styles = getStyles(theme);
  const { prevScreen } = route.params;

  const generateSubscriptionDetails = async () => {
    if (typeof premiumPlan === "undefined") {
      setSubscriptionDetails("You are currently on the free tier.");
      return;
    }

    const { expirationDate, unsubscribeDetectedAt } =
      await getUserSubscriptionStatus({ returnSubscription: true });

    const expiry = formatExpiry(expirationDate);
    const isUnsubscribed = unsubscribeDetectedAt !== null;

    if (!isUnsubscribed) {
      setSubscriptionDetails(
        `Your subscription to the ${premiumPlan} pass renews on ${expiry}.`,
      );
    } else if (isUnsubscribed) {
      setSubscriptionDetails(
        `Your subscription to the ${premiumPlan} pass ends on ${expiry}. Afterwards, you will revert to the free-tier.`,
      );
    } // Handle cross-upgrade.
  };

  useEffect(() => {
    generateSubscriptionDetails();
  }, [premiumPlan]);

  useEffect(() => {
    const localizePrices = async () => {
      const offerings = await Purchases.getOfferings();
      const { monthly, annual } = offerings?.current;
      dispatch({
        type: subscriptionActions.SET_PRICE,
        plan: PREMIUM_PLANS.MONTHLY,
        price: monthly?.product?.priceString,
      });
      dispatch({
        type: subscriptionActions.SET_PRICE,
        plan: PREMIUM_PLANS.ANNUAL,
        price: annual?.product?.priceString,
      });
    };

    localizePrices();
  }, []);

  const buy = async (subscriptionDuration) => {
    try {
      setLoading(true);
      const offerings = await Purchases.getOfferings();
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        const packageToBuy = offerings.current[`${subscriptionDuration}`];

        // Purchase it.
        console.log(
          `About to purchase package (${JSON.stringify(
            packageToBuy,
            null,
            2,
          )})`,
        );

        const { customerInfo, _productIdentifier } =
          await Purchases.purchasePackage(packageToBuy);

        if (typeof customerInfo.entitlements.active.Premium !== "undefined") {
          console.log(
            `Purchase of ${subscriptionDuration} package successful!`,
          );
        } else {
          console.log(`Purchase of ${subscriptionDuration} package failed!`);
        }
      } else {
        console.log("WEIRD BRANCH", "offerings.current was null");
      }
    } catch (err) {
      const errorCode = err.code ? `Error Code: ${err.code}` : "";
      const errorMessage = err.message
        ? err.message
        : "An unexpected error occurred.";
      console.log("Error", `${errorCode}\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const restore = async () => {
    try {
      Alert.alert("Attempting restore", "Just a moment");
      const customerInfo = await Purchases.restorePurchases();
      if (typeof customerInfo.entitlements.active.Premium !== "undefined") {
        Alert.alert(
          `Restore of ${customerInfo.entitlements.active.Premium.identifier} package successful!`,
        );
      } else {
        Alert.alert(`Restore unsuccessful`);
      }
    } catch (err) {
      if (!err.userCancelled) {
        const errorCode = err.code ? `Error Code: ${err.code}` : "";
        const errorMessage = err.message
          ? err.message
          : "An unexpected error occurred.";
        console.log("Error", `${errorCode}\n${errorMessage}`);
      }
    }
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case subscriptionActions.SET_PLAN:
        switch (action.payload) {
          case PREMIUM_PLANS.MONTHLY:
            return {
              ...state,
              selectedPlan: PREMIUM_PLANS.MONTHLY,
              continueFunction: () => {
                console.log("loading: ", loading);
                buy(PREMIUM_PLANS.MONTHLY);
              },
            };
          case PREMIUM_PLANS.ANNUAL:
            return {
              ...state,
              selectedPlan: PREMIUM_PLANS.ANNUAL,
              continueFunction: () => buy(PREMIUM_PLANS.ANNUAL),
            };
          default:
            console.error(`Unknown plan: ${action.payload}`);
            return state;
        }

      case subscriptionActions.SET_PRICE:
        if (typeof action.price !== undefined)
          return { ...state, [action.plan]: [action.price] };
    }
  };

  const initialState = {
    monthly: "$0.99",
    annual: "$4.99",
    selectedPlan: PREMIUM_PLANS.MONTHLY,
    continueFunction: () => buy(PREMIUM_PLANS.MONTHLY),
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ImageBackground
      source={require("../assets/backgrounds/subscriptions-background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <OverlayLoader isVisible={loading} />
      <Screen style={styles.container}>
        <View>
          <NavHeader
            LeftComponent={
              <IconButton
                iconName={"chevron-left"}
                IconFamily={Feather}
                iconSize={52}
                foregroundColor={theme.blue}
                onPress={() => {
                  navigation.navigate(prevScreen);
                }}
              />
            }
            headerText={""}
            containerStyle={styles.navHeader}
          />
          <View style={styles.titlePanel}>
            <Image
              source={require("../assets/icon-transparent-bg.png")}
              resizeMode="contain"
              style={{ height: 75, width: 75, margin: 25 }}
            />
            <Text
              style={{ fontSize: 22, fontWeight: "600", color: theme.primary }}
            >
              Circuits° Premium
            </Text>
          </View>
          <View style={styles.featureHighlights}>
            <ImageText
              image={require("../assets/zap.png")}
              text="Create unlimited routines"
            />
            <ImageText
              image={require("../assets/zap.png")}
              text="Access new features early"
            />
          </View>
        </View>

        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Available Plans</Text>
          <View style={styles.plansContainer}>
            <SubscriptionButton
              enabled={state.selectedPlan === PREMIUM_PLANS.MONTHLY}
              purchased={premiumPlan === PREMIUM_PLANS.MONTHLY}
              titleText={"Monthly Pass"}
              priceText={`${state.monthly} monthly`}
              onPress={() =>
                dispatch({
                  type: subscriptionActions.SET_PLAN,
                  payload: PREMIUM_PLANS.MONTHLY,
                })
              }
            />
            <SubscriptionButton
              enabled={state.selectedPlan === PREMIUM_PLANS.ANNUAL}
              purchased={premiumPlan === PREMIUM_PLANS.ANNUAL}
              titleText={"Annual Pass"}
              priceText={`${state.annual} annually`}
              onPress={() =>
                dispatch({
                  type: subscriptionActions.SET_PLAN,
                  payload: PREMIUM_PLANS.ANNUAL,
                })
              }
            />
          </View>
          <PurchaseContinueButton onPress={state.continueFunction} />
          <TouchableOpacity onPress={() => restore()}>
            <Text style={styles.restoreText}>Restore purchase</Text>
          </TouchableOpacity>

          <Text style={styles.descriptionText}>{subscriptionDetails}</Text>
        </View>
      </Screen>
    </ImageBackground>
  );
};

function formatExpiry(isoString) {
  console.log("iso", isoString);
  const date = new Date(isoString);
  const year = date.getFullYear();
  // Add 1 to the month because getMonth() returns 0-11
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      backgroundColor: "transparent",
      justifyContent: "space-between",
      height: "100%",
      width: "100%",
    },
    modalView: {
      alignItems: "center",
      backgroundColor: theme.secondaryBackground,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    modalTitle: {
      fontSize: PARAGRAPH_FONT_SIZE,
      fontWeight: PARAGRAPH_FONT_WEIGHT,
      marginBottom: 24,
      color: theme.secondary,
    },
    featuresList: {
      alignSelf: "stretch",
      marginBottom: 15,
    },
    featureItem: {
      fontSize: 16,
    },
    plansContainer: {
      alignSelf: "stretch",
      gap: 16,
      marginBottom: 17,
    },
    restoreText: {
      color: theme.blue,
      marginBottom: 20,
      fontSize: 15,
      fontWeight: PARAGRAPH_FONT_WEIGHT,
    },
    titlePanel: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 45,
    },
    descriptionText: {
      fontSize: 13,
      fontWeight: "400",
      color: "gray",
      alignSelf: "stretch",
      marginBottom: 10,
    },
    featureHighlights: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    highlightBorder: {
      borderWidth: 3,
      borderColor: "red",
    },
    navHeader: {
      marginBottom: 0,
    },
  });

export default SubscriptionScreen;
