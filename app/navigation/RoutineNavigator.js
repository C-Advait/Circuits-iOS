import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import ExerciseEditScreen from "../screens/ExerciseEditScreen";
import routes from "./routes";
import RoutinesScreen from "../screens/RoutinesScreen";
import { RoutineProvider } from "../contexts/RoutineContext";
import RoutineEditScreen from "../screens/RoutineEditScreen";
import { TemplateProvider } from "../contexts/TemplateContext";
import TimerScreen from "../screens/TimerScreen";
import TemplateSelectionScreen from "../screens/TemplateSelectionScreen";
import { SoundProvider } from "../contexts/SoundContext";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
const Stack = createStackNavigator();

function RoutineNavigator() {
  return (
    <TemplateProvider>
      <SoundProvider>
        <RoutineProvider>
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
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name={routes.TEMPLATE_SELECTION_SCREEN}
              component={TemplateSelectionScreen}
            />
          </Stack.Navigator>
        </RoutineProvider>
      </SoundProvider>
    </TemplateProvider>
  );
}

export default RoutineNavigator;
