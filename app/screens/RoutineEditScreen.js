import React from "react";
import { View, StyleSheet, Button, SectionList, Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";

import AuxiliaryCard from "../components/AuxiliaryCard";
import DummyInputComponent from "../components/DummyInputComponent";
import Header from "../components/Header";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import { useTheme } from "../contexts/ThemeContext";
import ExerciseCard from "../components/ExerciseCard";
import {Tag} from "../classes/Exercise"

const formatDataForSectionList = (data) => {
  // Initialize an object to hold data for each section
  const sections = {
    Warmup: [],
    Exercises: [],
    Cooldown: []
  };

  // Iterate through the data, adding items to the appropriate section
  data.forEach((item) => {
    switch (item.tag) {
      case Tag.PREROUTINE:
        sections.Warmup.push(item);
        break;
      case Tag.WORKING:
        sections.Exercises.push(item);
        break;
      case Tag.POSTROUTINE:
        sections.Cooldown.push(item);
        break;
      default:
        console.warn(`Unexpected tag: ${item.tag}`);
        break;
    }
  });
  
  // Convert the sections object into an array of section objects for SectionList
  return Object.keys(sections).map((key) => ({
    title: key,
    data: sections[key],
  }));
};

const DATA = formatDataForSectionList([
  {
    id: 1,
    routineID: 1,
    title: "Warmup",
    exerciseOrder: 1,
    tag: Tag.PREROUTINE,
    workTime: 150,
    numberOfRounds: 1,
    restBetweenRounds: 50,
    breakBeforeNext: 0,
    category: null
  },
  {
    id: 2,
    routineID: 1,
    title: "Plank",
    exerciseOrder: 2,
    tag: Tag.WORKING,
    workTime: 150,
    numberOfRounds: 1,
    restBetweenRounds: 50,
    breakBeforeNext: 0,
    category: null
  },
  {
    id: 3,
    routineID: 1,
    title: "Plank",
    exerciseOrder: 3,
    tag: Tag.WORKING,
    workTime: 150,
    numberOfRounds: 1,
    restBetweenRounds: 50,
    breakBeforeNext: 0,
    category: null
  },
  {
    id: 4,
    routineID: 1,
    title: "Plank",
    exerciseOrder: 4,
    tag: Tag.WORKING,
    workTime: 150,
    numberOfRounds: 1,
    restBetweenRounds: 50,
    breakBeforeNext: 0,
    category: null
  },
  {
    id: 5,
    routineID: 1,
    title: "Cooldown",
    exerciseOrder: 5,
    tag: Tag.POSTROUTINE,
    workTime: 150,
    numberOfRounds: 1,
    restBetweenRounds: 50,
    breakBeforeNext: 0,
    category: null
  },
]);



function RoutineEditScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Screen style={styles.container}>
      <Header>RoutineEditScreen</Header>
      <Button
          title="Back to routines"
          onPress={() => navigation.navigate(routes.ROUTINES_SCREEN)}
        />
      <SectionList 
        sections={DATA}
        // keyExtractor={(item, index) => item.id + '-' + index}
        renderItem={({item}) => (
          <>
            {((item.tag === Tag.PREROUTINE) || (item.tag === Tag.POSTROUTINE)) && 
            <AuxiliaryCard 
              accentcolor={'dodgerblue'}
              editable={false}
              bold={false}
              title={item.title}
              InputComponent={DummyInputComponent}
            />} 
            {
              (item.tag === Tag.WORKING) && 
              <ExerciseCard 
                title={item.title}
                subTitle={item.workTime}
                showDeleteIcon={true}
                accentColor={'red'}
                clickDrag={true}
              />
            }
          </>
        )}
        renderSectionHeader={({section}) => (
          <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>{section.title}</Text>
        )}
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
          style={{borderTopLeftRadius: 0, borderTopRightRadius: 0}}
        />
      </View>
    </Screen>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    padding: 10, //consistency between screens importants
  },
  message: {
    color: theme.foreground,
  }
});

export default RoutineEditScreen;
