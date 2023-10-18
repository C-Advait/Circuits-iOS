import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import routes from "./routes";
import SettingsScreen from "../screens/SettingsScreen";
import RoutineNavigator from "./RoutineNavigator";
import AppTabBar from "./AppTabBar";
import DebugScreen from "../screens/DebugScreen";

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name={routes.ROUTINES} component={RoutineNavigator} />
      <Tab.Screen name={routes.SETTINGS_SCREEN} component={SettingsScreen} />
      <Tab.Screen name={routes.DEBUG_SCREEN} component={DebugScreen} />
    </Tab.Navigator>
  );
}

export default AppNavigator;
