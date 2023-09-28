import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import Example from "./app/components/Example";
import { ThemeProvider } from "./app/contexts/ThemeContext"

export default function App() {
  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Example />
        <StatusBar style="auto" />
      </View>
    </ThemeProvider >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
});
