import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import SettingsScreen from '../screens/SettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import routes from './routes';

const Stack = createStackNavigator();

function SettingsNavigator(props) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={routes.SETTINGS_SCREEN}
                component={SettingsScreen}
            />
            <Stack.Screen
                name={routes.PRIVACY_POLICY_SCREEN}
                component={PrivacyPolicyScreen}
            />
        </Stack.Navigator>
    );
}

export default SettingsNavigator;