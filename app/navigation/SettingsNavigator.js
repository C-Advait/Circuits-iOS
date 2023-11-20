import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SettingsScreen from "../screens/SettingsScreen";
import routes from "./routes";
import SubscriptionScreen from "../screens/SubscriptionScreen";

const Stack = createStackNavigator();

function SettingsNavigator(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.SETTINGS_SCREEN} component={SettingsScreen} />
      <Stack.Screen
        name={routes.SUBSCRIPTION_SCREEN}
        component={SubscriptionScreen}
      />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
