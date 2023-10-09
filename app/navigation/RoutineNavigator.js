import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { TemplateProvider } from "../contexts/TemplateContext";
import routes from "./routes";
import RoutinesScreen from "../screens/RoutinesScreen";
import TimerScreen from "../screens/TimerScreen";
import RoutineEditScreen from "../screens/RoutineEditScreen";
import ExerciseEditScreen from "../screens/ExerciseEditScreen";
import TemplateSelectionScreen from "../screens/TemplateSelectionScreen";

const Stack = createStackNavigator();

function RoutineNavigator() {
  return (
    <TemplateProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name={routes.ROUTINES_SCREEN}
          component={RoutinesScreen}
        />
        <Stack.Screen
          name={routes.ROUTINE_EDIT_SCREEN}
          component={RoutineEditScreen}
        />
        <Stack.Screen
          name={routes.TIMER_SCREEN}
          component={TimerScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={routes.EXERCISE_EDIT_SCREEN}
          component={ExerciseEditScreen}
        />
        <Stack.Screen
          name={routes.TEMPLATE_SELECTION_SCREEN}
          component={TemplateSelectionScreen}
        />
      </Stack.Navigator>
    </TemplateProvider>
  );
}

export default RoutineNavigator;
