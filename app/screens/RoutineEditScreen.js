import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";

import AuxiliaryCard from "../components/AuxiliaryCard";
import DummyInputComponent from "../components/DummyInputComponent";
import Header from "../components/Header";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import { useTheme } from "../contexts/ThemeContext";
import ExerciseCard from "../components/ExerciseCard";

function RoutineEditScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <Screen>
      <Header>RoutineEditScreen</Header>
      <Button
        title="Back to routines"
        onPress={() => navigation.navigate(routes.ROUTINES_SCREEN)}
      />
      <View style={{ gap: 10 }}>
        <AuxiliaryCard
          title="Warm-up"
          accentcolor={theme.accentGreen}
          InputComponent={DummyInputComponent}
        />
        <AuxiliaryCard
          title="Cool down"
          accentcolor={theme.accentDarkBlue}
          InputComponent={DummyInputComponent}
        />
        <AuxiliaryCard
          title="Loop Exercise"
          bold={true}
          editable={false}
          Icon={() => <Feather name="repeat" color={theme.primary} size={24} />}
          InputComponent={() => <DummyInputComponent text="Once" />}
        />
        <AuxiliaryCard
          title="Sounds"
          editable={false}
          InputComponent={() => <DummyInputComponent text="Chimes" />}
        />
        <ExerciseCard 
          title="Planks" 
          subTitle={"25 seconds"}
          accentColor={'tomato'} 
          clickDrag={true}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default RoutineEditScreen;
