import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import routes from "./routes";
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
        <Tab.Navigator>
          <Tab.Screen name={routes.ROUTINES_SCREEN} component={SettingsScreen} />
          <Tab.Screen name={routes.SETTINGS_SCREEN} component={SettingsScreen} />
        </Tab.Navigator>
  );
}

export default AppNavigator;
