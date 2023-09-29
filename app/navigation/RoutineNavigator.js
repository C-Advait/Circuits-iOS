import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import RoutinesScreen from '../screens/RoutinesScreen';
import RoutineEditScreen from '../screens/RoutineEditScreen';
import routes from './routes';

const Stack = createStackNavigator();

function RoutineNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.ROUTINES_SCREEN} component={RoutinesScreen} />
      <Stack.Screen name={routes.ROUTINE_EDIT_SCREEN} component={RoutineEditScreen} />
    </Stack.Navigator>
  );
}

export default RoutineNavigator;

