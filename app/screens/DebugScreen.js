import React from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import Screen from "../components/Screen";
import Header from "../components/Header";

import { dropTable } from "../db/DBActions";
import { initTables } from "../db/DBSetup";
import Purchases from "react-native-purchases";

const resetDB = async () => {
  dropTable("Exercise")
    .then(dropTable("Routine"))
    .then(dropTable("Setting"))
    .then(initTables())
    .then(Alert.alert("All tables dropped and recreated!"));
};

const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      Alert.alert("Offerings: ", JSON.stringify(offerings, null, 2));
    } else {
      Alert.alert("WEIRD BRANCH", "offerings.current was null");
      Alert.alert("Offerings: ", JSON.stringify(offerings, null, 2));
    }
  } catch (err) {
    const errorCode = err.code ? `Error Code: ${err.code}` : "";
    const errorMessage = err.message
      ? err.message
      : "An unexpected error occurred.";
    Alert.alert("Error", `${errorCode}\n${errorMessage}`);
  }
};

const getAvailablePackages = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      const availablePackages = offerings.current.availablePackages;
      Alert.alert("Packages: ", JSON.stringify(availablePackages, null, 2));
    } else {
      Alert.alert("WEIRD BRANCH", "offerings.current was null");
    }
  } catch (err) {
    const errorCode = err.code ? `Error Code: ${err.code}` : "";
    const errorMessage = err.message
      ? err.message
      : "An unexpected error occurred.";
    Alert.alert("Error", `${errorCode}\n${errorMessage}`);
  }
};

const purchaseMonthly = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      // Get all packages.
      const availablePackages = offerings.current.availablePackages;
      Alert.alert("Packages: ", JSON.stringify(availablePackages, null, 2));

      // Extract monthly package.
      const monthlyPackage = offerings.current.monthly;
      Alert.alert("Monthly package: ", JSON.stringify(monthlyPackage, null, 2));

      // Purchase it.
      Alert.alert("About to purchase monthly package");
      const purchaseMade = await Purchases.purchasePackage(monthlyPackage);
      if (
        typeof purchaseMade.customerInfo.entitlements.active.Premium !==
        "undefined"
      ) {
        Alert.alert("Purchase of monthly package successful!");
        // Unlock premium.
      } else {
        Alert.alert("Purchase of monthly package failed.");
      }
    } else {
      Alert.alert("WEIRD BRANCH", "offerings.current was null");
    }
  } catch (err) {
    const errorCode = err.code ? `Error Code: ${err.code}` : "";
    const errorMessage = err.message
      ? err.message
      : "An unexpected error occurred.";
    Alert.alert("Error", `${errorCode}\n${errorMessage}`);
  }
};

const purchaseLifetime = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      // Get all packages.
      const availablePackages = offerings.current.availablePackages;
      Alert.alert("Packages: ", JSON.stringify(availablePackages, null, 2));

      // Extract monthly package.
      const lifetimePackage = offerings.current.lifetime;
      Alert.alert(
        "Lifetime package: ",
        JSON.stringify(lifetimePackage, null, 2),
      );

      // Purchase it.
      Alert.alert("About to purchase lifetime package");
      const purchaseMade = await Purchases.purchasePackage(lifetimePackage);
      if (
        typeof purchaseMade.customerInfo.entitlements.active.Premium !==
        "undefined"
      ) {
        Alert.alert("Purchase of lifetime package successful!");
        // Unlock premium.
      } else {
        Alert.alert("Purchase of lifetime package failed.");
      }
    } else {
      Alert.alert("WEIRD BRANCH", "offerings.current was null");
    }
  } catch (err) {
    const errorCode = err.code ? `Error Code: ${err.code}` : "";
    const errorMessage = err.message
      ? err.message
      : "An unexpected error occurred.";
    Alert.alert("Error", `${errorCode}\n${errorMessage}`);
  }
};

const checkSubscriptionStatus = async () => {
  try {
    Alert.alert("Getting info", "Getting customer info...");
    const customerInfo = await Purchases.getCustomerInfo();

    Alert.alert(
      "Info received",
      `Info: ${JSON.stringify(customerInfo, null, 2)}`,
    );
    Alert.alert(
      "Entitlements: ",
      `Entitlements: ${JSON.stringify(customerInfo?.entitlements, null, 2)}`,
    );
    Alert.alert(
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
    Alert.alert("Error", `${errorCode}\n${errorMessage}`);
  }
};

const restore = async () => {
  try {
    Alert.alert("Attempting restore", "Attempting restore...");
    const restore = await Purchases.restorePurchases();
    Alert.alert("Restore", `restore: ${JSON.stringify(restore, null, 2)}`);

    Alert.alert("Getting new customer info", "Getting new customer info...");
    const customerInfo = await Purchases.getCustomerInfo();

    Alert.alert(
      "Info received",
      `Info: ${JSON.stringify(customerInfo, null, 2)}`,
    );
    Alert.alert(
      "Entitlements: ",
      `Entitlements: ${JSON.stringify(customerInfo?.entitlements, null, 2)}`,
    );
    Alert.alert(
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
    Alert.alert("Error", `${errorCode}\n${errorMessage}`);
  }
};

function DebugScreen() {
  return (
    <Screen>
      <View style={styles.topPanel}>
        <Header>Debug</Header>
      </View>
      <Button title="Reset DB" onPress={() => resetDB()} />
      <Button title="Get offerings" onPress={() => getOfferings()} />
      <Button
        title="Get available packages"
        onPress={() => getAvailablePackages()}
      />
      <Button title="Purchase monthly" onPress={() => purchaseMonthly()} />
      <Button title="Purchase lifetime" onPress={() => purchaseLifetime()} />
      <Button
        title="Check subscription status"
        onPress={() => checkSubscriptionStatus()}
      />
      <Button title="Restore" onPress={() => restore()} />
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
