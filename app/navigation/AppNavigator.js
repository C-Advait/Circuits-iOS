import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import routes from "./routes";
import SettingsScreen from '../screens/SettingsScreen';
import RoutineNavigator from './RoutineNavigator';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
        <Tab.Navigator>
          <Tab.Screen name={routes.ROUTINES} component={RoutineNavigator} />
          <Tab.Screen name={routes.SETTINGS_SCREEN} component={SettingsScreen} />
        </Tab.Navigator>
  );
}

export default AppNavigator;
