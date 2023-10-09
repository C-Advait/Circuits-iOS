import React from "react";
import { View, StyleSheet, Button, SectionList, Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import AuxiliaryCard from "../components/AuxiliaryCard";
import DummyInputComponent from "../components/DummyInputComponent";
import Header from "../components/Header";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import { useTheme } from "../contexts/ThemeContext";
import ExerciseCard from "../components/ExerciseCard";
import {Tag} from "../classes/Exercise"
import { TAB_BAR_HEIGHT } from '../config/appConstants'
import AppTextButton from "../components/buttons/AppTextButton";
import { INFO_FONT_SIZE, PARAGRAPH_FONT_SIZE } from "../config/appConstants";
import NavHeader from "../components/NavHeader";

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
    exerciseOrder: 3,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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
    id: 13,
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
    id: 14,
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
    id: 15,
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

const getNumExercises = () => {
  for (let i = 0; i < DATA.length; i++) {
    if (DATA[i]['title'] === "Exercises") {
      return DATA[i]["data"].length-1;
    }
  }
  throw new Error(" `Exercises` section array not found in DATA object");
};
const paddingBottomValue = TAB_BAR_HEIGHT / 2;

function RoutineEditScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const numExercises = getNumExercises();

  const renderItem = (item, index) => {
    switch (item.tag) {
      case Tag.PREROUTINE:
        return (
            <AuxiliaryCard 
            accentcolor={theme.accentGreen}
            editable={false}
            bold={false}
            title={item.title}
            InputComponent={() => <DummyInputComponent text="10 minutes"/>}
          />
        );
      case Tag.POSTROUTINE:
        return (
            <AuxiliaryCard 
            accentcolor={theme.accentDarkBlue}
            editable={false}
            bold={false}
            title={item.title}
            InputComponent={() => <DummyInputComponent text="10 minutes"/>}
          />
        );
      case Tag.WORKING: {
        return (renderExerciseItem(item, index));
      }
      default:
        throw new Error(
          `${item.tag} does not match any expected tags. ` +
          `Expected one of ${Tag.PREROUTINE}, ${Tag.POSTROUTINE}, ${Tag.WORKING}`
        );
    }
  }

  const renderExerciseItem = (item, index) => {
    switch (index) {
      case 0:
        return (
          <ExerciseCard 
          title={item.title}
          subTitle={item.workTime}
          accentColor={'red'}
          clickDrag={true}
          style={{borderBottomStartRadius: 0}}
          />
        );
      case numExercises:
        return (
          <View style={{gap: 12}}>
            <ExerciseCard 
              title={item.title}
              subTitle={item.workTime}
              accentColor={'red'}
              clickDrag={true}
              style={{borderTopStartRadius: 0}}
            />
            <AuxiliaryCard 
              editable={false}
              bold={false}
              title={"Loops"}
              InputComponent={() => <DummyInputComponent text="Once"/>}
              Icon={() => <Feather name="repeat" size={24} color={theme.foreground} />}
            />
          </View>
        );
      default:
        return (
          <ExerciseCard 
          title={item.title}
          subTitle={item.workTime}
          accentColor={'red'}
          clickDrag={true}
          style={{borderRadius: 0}}
          />
        );
    }
  };

  return (
    <Screen>
      <NavHeader 
        LeftComponent={
          <AppTextButton
            onPress={() => navigation.navigate(routes.ROUTINES_SCREEN)}
            textStyle={{fontWeight: '400', color: theme.foreground}}
          > Cancel
          </AppTextButton>
        }
        headerText="New Routine"
        RightComponent={
          <AppTextButton
            onPress={() => console.log("Routine created")}
            textStyle={{fontWeight: '500'}}
          > Create
          </AppTextButton>
        }
      />
      <SectionList 
        contentContainerStyle ={styles.container}
        ListHeaderComponent={
          <>
          <View style={styles.headingPanel}>
            <LinearGradient
              colors={['#ffffff', '#3397f3', ]} //to be adjusted
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.25 }}
              style={styles.emojiBox}
            />
            <Header style={styles.title}>My Routine #11</Header>
          </View>          
          <View style={styles.templatePanel}>
            <AuxiliaryCard 
              title={"Template"}
              editable={false}
              InputComponent={() => <DummyInputComponent text="Custom" />}
            />
          </View>
          </>
        }
        sections={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => renderItem(item, index)}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        renderSectionFooter={() => <View style={{height: 22}} />}
        ItemSeparatorComponent={() => <View style={{height:StyleSheet.hairlineWidth, backgroundColor:theme.text60}}/>}
      />

    </Screen>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    paddingHorizontal: 15, //consistency between screens important
    paddingBottom: paddingBottomValue
  },
  emojiBox: {
    backgroundColor: theme.blue,
    height: 30,
    width: 30,
    borderRadius: 7,
    marginRight: 10
  },
  headingPanel: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    marginBottom: 15
  },
  navPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30, 
    marginTop: 5,
    paddingHorizontal: 11
  },
  title: {
    color: theme.foreground
  },
  templatePanel: {
    marginBottom: 15
  },
  sectionTitle: {
    color: theme.text60,
    fontSize: INFO_FONT_SIZE,
    marginBottom: 8
  },
});

export default RoutineEditScreen;
