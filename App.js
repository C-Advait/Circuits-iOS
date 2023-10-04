import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";

import { ThemeProvider } from "./app/contexts/ThemeContext"
import AppNavigator from "./app/navigation/AppNavigator";

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}