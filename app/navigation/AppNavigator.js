import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import routes from "./routes";
import RoutineNavigator from "./RoutineNavigator";
import AppTabBar from "./AppTabBar";
import DebugScreen from "../screens/DebugScreen";
import SettingsNavigator from "./SettingsNavigator";

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
      <Tab.Screen name={routes.SETTINGS} component={SettingsNavigator} />
      <Tab.Screen name={routes.DEBUG_SCREEN} component={DebugScreen} />
    </Tab.Navigator>
  );
}

export default AppNavigator;
