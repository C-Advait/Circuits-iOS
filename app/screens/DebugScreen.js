import React from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import Screen from "../components/Screen";
import Header from "../components/Header";

import { dropTable } from "../db/DBActions";
import { initTables } from "../db/DBSetup";
import Purchases from "react-native-purchases";
import { getUserSubscriptionTable } from "../db/DBActions";

const resetDB = async () => {
  dropTable("Exercise")
    .then(dropTable("Routine"))
    .then(dropTable("Setting"))
    .then(dropTable("RoutineCompletion"))
    .then(initTables())
    .then(Alert.alert("All tables dropped and recreated!"));
};

const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      console.log("Offerings: ", JSON.stringify(offerings, null, 2));
    } else {
      console.log("WEIRD BRANCH", "offerings.current was null");
      console.log("Offerings: ", JSON.stringify(offerings, null, 2));
    }
  } catch (err) {
    const errorCode = err.code ? `Error Code: ${err.code}` : "";
    const errorMessage = err.message
      ? err.message
      : "An unexpected error occurred.";
    console.log("Error", `${errorCode}\n${errorMessage}`);
  }
};

const getAvailablePackages = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      const availablePackages = offerings.current.availablePackages;
      console.log("Packages: ", JSON.stringify(availablePackages, null, 2));
    } else {
      console.log("WEIRD BRANCH", "offerings.current was null");
    }
  } catch (err) {
    const errorCode = err.code ? `Error Code: ${err.code}` : "";
    const errorMessage = err.message
      ? err.message
      : "An unexpected error occurred.";
    console.log("Error", `${errorCode}\n${errorMessage}`);
  }
};

const purchaseMonthly = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      // Get all packages.
      const availablePackages = offerings.current.availablePackages;
      console.log("Packages: ", JSON.stringify(availablePackages, null, 2));

      // Extract monthly package.
      const monthlyPackage = offerings.current.monthly;
      console.log("Monthly package: ", JSON.stringify(monthlyPackage, null, 2));

      // Purchase it.
      console.log("About to purchase monthly package");
      const purchaseMade = await Purchases.purchasePackage(monthlyPackage);
      if (
        typeof purchaseMade.customerInfo.entitlements.active.Premium !==
        "undefined"
      ) {
        console.log("Purchase of monthly package successful!");
        // Unlock premium.
      } else {
        console.log("Purchase of monthly package failed.");
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
  }
};

const purchaseLifetime = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      // Get all packages.
      const availablePackages = offerings.current.availablePackages;
      console.log("Packages: ", JSON.stringify(availablePackages, null, 2));

      // Extract monthly package.
      const lifetimePackage = offerings.current.lifetime;
      console.log(
        "Lifetime package: ",
        JSON.stringify(lifetimePackage, null, 2),
      );

      // Purchase it.
      console.log("About to purchase lifetime package");
      const purchaseMade = await Purchases.purchasePackage(lifetimePackage);
      if (
        typeof purchaseMade.customerInfo.entitlements.active.Premium !==
        "undefined"
      ) {
        console.log("Purchase of lifetime package successful!");
        // Unlock premium.
      } else {
        console.log("Purchase of lifetime package failed.");
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
  }
};

const checkSubscriptionStatus = async () => {
  try {
    console.log("Getting info", "Getting customer info...");
    const customerInfo = await Purchases.getCustomerInfo();

    console.log(
      "Info received",
      `Info: ${JSON.stringify(customerInfo, null, 2)}`,
    );
    console.log(
      "Entitlements: ",
      `Entitlements: ${JSON.stringify(customerInfo?.entitlements, null, 2)}`,
    );
    console.log(
      "Active entitlements: ",
      `Active entitlements: ${JSON.stringify(
        customerInfo?.entitlements?.active,
        null,
        2,
      )}`,
    );
  } catch (err) {
    const errorCode = err.code ? `Error Code: ${err.code}` : "";
    const errorMessage = err.message
      ? err.message
      : "An unexpected error occurred.";
    console.log("Error", `${errorCode}\n${errorMessage}`);
  }
};

const restore = async () => {
  try {
    console.log("Attempting restore", "Attempting restore...");
    const restore = await Purchases.restorePurchases();
    console.log("Restore", `restore: ${JSON.stringify(restore, null, 2)}`);

    console.log("Getting new customer info", "Getting new customer info...");
    const customerInfo = await Purchases.getCustomerInfo();

    console.log(
      "Info received",
      `Info: ${JSON.stringify(customerInfo, null, 2)}`,
    );
    console.log(
      "Entitlements: ",
      `Entitlements: ${JSON.stringify(customerInfo?.entitlements, null, 2)}`,
    );
    console.log(
      "Active entitlements: ",
      `Active entitlements: ${JSON.stringify(
        customerInfo?.entitlements?.active,
        null,
        2,
      )}`,
    );
  } catch (err) {
    const errorCode = err.code ? `Error Code: ${err.code}` : "";
    const errorMessage = err.message
      ? err.message
      : "An unexpected error occurred.";
    console.log("Error", `${errorCode}\n${errorMessage}`);
  }
};

const dumpCompletions = async () => {
  const completions = await getAllRoutineCompletions();
  console.log(JSON.stringify(completions, null, 2));
};

const logSubscriptions = async () => {
  getUserSubscriptionTable()
    .then((tableRows) => console.log("UserSubscription Table Rows:\n", JSON.stringify(tableRows, null, 2)))
    .catch((error) => console.error("Error fetching UserSubscription table:", error));
}

function DebugScreen() {
  return (
    <Screen>
      <View style={styles.topPanel}>
        <Header>Debug</Header>
      </View>
      <Button title="Reset DB" onPress={() => resetDB()} />
      <Button title="Get Subscriptions" onPress={() => null} />
      <Button title="Request Subscription" onPress={() => null} />
      <Button title="Dump completions" onPress={() => dumpCompletions()} />
      <Button title="Log Subscriptions table" onPress={() => logSubscriptions()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  topPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 15,
    marginBottom: 34,
    marginHorizontal: 10,
    marginTop: 25,
  },
});
export default DebugScreen;
