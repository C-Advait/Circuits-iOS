import { NavigationContainer } from "@react-navigation/native";
import { EvilIcons } from '@expo/vector-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler';


import { ThemeProvider } from "./app/contexts/ThemeContext"
import AppNavigator from "./app/navigation/AppNavigator";
import ExerciseCard from "./app/components/ExerciseCard";
import Screen from "./app/components/Screen";
import { darkTheme, lightTheme } from "./app/config/colors";
import { View, StyleSheet } from "react-native";

export default function App() {

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>

      <ThemeProvider>
        <Screen style={{backgroundColor: darkTheme.background}}>
          <View style={styles.container}>
            <ExerciseCard 
              title="Planks" 
              subTitle={"25 seconds"}
              deleteFunc={true}
              accentColor={'tomato'} 
              clickDrag={true}/>
          </View>
        </Screen>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
})