import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, SectionList, Text } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import AuxiliaryCard from "../components/AuxiliaryCard";
import DummyInputComponent from "../components/DummyInputComponent";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import { useTheme } from "../contexts/ThemeContext";
import ExerciseCard from "../components/ExerciseCard";
import { Exercise, Tag } from "../classes/Exercise";
import { TAB_BAR_HEIGHT, DEFAULT_ROUTINE, DEFAULT_EXERCISE } from "../config/appConstants";
import AppTextButton from "../components/buttons/AppTextButton";
import { INFO_FONT_SIZE, PARAGRAPH_FONT_SIZE } from "../config/appConstants";
import NavHeader from "../components/NavHeader";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useTemplateContext } from "../contexts/TemplateContext";
import { getExercisesForRoutine, updateRoutine, getRoutineByID } from "../db/DBActions";
import formatExerciseInfo from "../utilities/formatExerciseInfo";
import { Routine } from "../classes/Routine";
import { useRoutineContext } from "../contexts/RoutineContext";

// const paddingBottomValue = TAB_BAR_HEIGHT / 2;

// Global helper functions
const formatDataForSectionList = (data) => {
  // Initialize an object to hold data for each section
  const sections = {
    Warmup: [],
    Exercises: [],
    Cooldown: [],
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
        null;
    }
  });

  // Convert the sections object into an array of section objects for SectionList
  return Object.keys(sections).map((key) => ({
    title: key,
    data: sections[key],
  }));
};
const getNumExercises = (exerciseData) => {
  for (let i = 0; i < exerciseData.length; i++) {
    if (exerciseData[i]["title"] === "Exercises") {
      return exerciseData[i]["data"].length - 1;
    }
  }
  return 0;
};

function RoutineEditScreen({ route }) {

  // Setup Functionality
  const navigation = useNavigation();
  const { edit: isEditing } = route.params;
  const { selectedTemplate, selectedTemplateID } = useTemplateContext();
  const { contextExercises: exercises, contextRoutine: routine, setContextRoutine } = useRoutineContext();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const data = formatDataForSectionList(exercises);
  const numExercises = useMemo(() => getNumExercises(exercises), [exercises]);

  useEffect(() => {
    console.log(
      `New template selected: ${selectedTemplate} id: ${selectedTemplateID}`,
    );
  }, [selectedTemplate]);

  // Helper Functions
  const renderItem = (item, index) => {
    switch (item.tag) {
      case Tag.PREROUTINE:
        return (
          <AuxiliaryCard
            accentcolor={theme.accentGreen}
            editable={false}
            bold={false}
            title={item.title}
            InputComponent={() => <DummyInputComponent text={item.duration} />}
          />
        );
      case Tag.POSTROUTINE:
        return (
          <AuxiliaryCard
            accentcolor={theme.accentDarkBlue}
            editable={false}
            bold={false}
            title={item.title}
            InputComponent={() => <DummyInputComponent text="10 minutes" />}
          />
        );
      case Tag.WORKING: {
        return renderExerciseItem(item, index);
      }
      default:
        null;
    }
  };
  const renderExerciseItem = (item, index) => {
    switch (index) {
      case 0:
        return (
          <ExerciseCard
            title={item.title}
            subTitle={formatExerciseInfo(item)}
            accentColor={theme.accentLightPurple}
            clickDrag={true}
            style={{ borderBottomStartRadius: 0 }}
          />
        );
      case numExercises:
        return (
          <View style={{ gap: 12 }}>
            <ExerciseCard
              title={item.title}
              subTitle={formatExerciseInfo(item)}
              accentColor={theme.accentLightPurple}
              clickDrag={true}
              style={{ borderTopStartRadius: 0 }}
            />
            <AuxiliaryCard
              editable={false}
              bold={false}
              title={"Loops"}
              InputComponent={() => <DummyInputComponent text="Once" />}
              Icon={() => (
                <Feather name="repeat" size={24} color={theme.foreground} />
              )}
            />
          </View>
        );
      default:
        return (
          <ExerciseCard
            title={item.title}
            subTitle={formatExerciseInfo(item)}
            accentColor={theme.accentLightPurple}
            clickDrag={true}
            style={{ borderRadius: 0 }}
          />
        );
    }
  };
  function updateRoutineTitle(newTitle) {
    setContextRoutine({
      ...routine,
      title: newTitle,
    });
  };

  // Rendered Output
  return (!(routine && exercises)) ? (<Screen />) :
    (
      <Screen>
        <NavHeader
          LeftComponent={
            <AppTextButton
              onPress={() => navigation.navigate(routes.ROUTINES_SCREEN)}
              textStyle={{ fontWeight: "400", color: theme.foreground }}
            >
              {" "}
              Cancel
            </AppTextButton>
          }
          headerText={isEditing ? "Edit Routine" : "New Routine"}
          RightComponent={
            <AppTextButton
              onPress={() => console.log("Routine Saved/Created")}
              textStyle={{ fontWeight: "500" }}
            >
              {isEditing ? "Save" : "Create"}
            </AppTextButton>
          }
        />
        <SectionList
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <>
              <View style={styles.headingPanel}>
                <LinearGradient
                  colors={["#ffffff", "#3397f3"]} //to be adjusted
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 0.25 }}
                  style={styles.emojiBox}
                />
                {/* <Header style={styles.title}>My Routine #11</Header> */}
                <TextInput
                  style={styles.title}
                  onChangeText={updateRoutineTitle}
                  multiline={false}
                  keyboardType="default"
                  placeholder={routine ? routine.title : "Loading"}
                  placeholderTextColor={styles.title.color}
                  spellCheck={false}
                  enterKeyHint="done"
                  onSubmitEditing={(item) => {
                    updateRoutineTitle(routineID, item.nativeEvent.text).catch(error => {
                      console.error("Failed to update routine title:", error);
                    });
                  }}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate(routes.TEMPLATE_SELECTION_SCREEN, { edit: isEditing })
                }}
                style={styles.templatePanel}
              >
                <AuxiliaryCard
                  title={"Template"}
                  editable={false}
                  InputComponent={() => (
                    <DummyInputComponent text={selectedTemplate} />
                  )}
                />
              </TouchableOpacity>
            </>
          }
          sections={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => renderItem(item, index)}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionTitle}>{section.title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          renderSectionFooter={() => <View style={{ height: 22 }} />}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: theme.text60,
              }}
            />
          )}
        />
      </Screen>
    )
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      paddingHorizontal: 15, //consistency between screens important
      // paddingBottom: paddingBottomValue,
    },
    emojiBox: {
      backgroundColor: theme.blue,
      height: 30,
      width: 30,
      borderRadius: 7,
      marginRight: 10,
    },
    headingPanel: {
      flexDirection: "row",
      height: 40,
      alignItems: "center",
      marginBottom: 15,
    },
    navPanel: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 30,
      marginTop: 5,
      paddingHorizontal: 11,
    },
    title: {
      color: theme.foreground,
      fontSize: 30,
      fontWeight: 600,
    },
    templatePanel: {
      marginBottom: 15,
    },
    sectionTitle: {
      color: theme.text60,
      fontSize: INFO_FONT_SIZE,
      marginBottom: 8,
    },
  });

export default RoutineEditScreen;
