import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import routes from "./routes";
import RoutineNavigator from "./RoutineNavigator";
import AppTabBar from "./AppTabBar";
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
    </Tab.Navigator>
  );
}

export default AppNavigator;
