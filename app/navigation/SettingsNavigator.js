import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SettingsScreen from "../screens/SettingsScreen";
import routes from "./routes";

const Stack = createStackNavigator();

function SettingsNavigator(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.SETTINGS_SCREEN} component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
