import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./app/contexts/ThemeContext"
import AppNavigator from "./app/navigation/AppNavigator";

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />        
      </NavigationContainer>
    </ThemeProvider >
  );
}
