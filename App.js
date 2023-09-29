import { ThemeProvider } from "./app/contexts/ThemeContext"
import AppNavigator from "./app/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />        
      </NavigationContainer>
    </ThemeProvider >
  );
}
