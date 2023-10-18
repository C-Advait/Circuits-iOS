import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet, SectionList, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import AuxiliaryCard from "../components/AuxiliaryCard";
import DummyInputComponent from "../components/DummyInputComponent";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import { useTheme } from "../contexts/ThemeContext";
import ExerciseCard from "../components/ExerciseCard";
import { Tag, Exercise } from "../classes/Exercise";
import { TAB_BAR_HEIGHT } from "../config/appConstants";
import AppTextButton from "../components/buttons/AppTextButton";
import { PARAGRAPH_FONT_SIZE, DEFAULT_EXERCISE } from "../config/appConstants";
import NavHeader from "../components/NavHeader";
import { useTemplateContext } from "../contexts/TemplateContext";
import formatExerciseInfo from "../utilities/formatExerciseInfo";
import { useRoutineContext } from "../contexts/RoutineContext";
import { BlurView } from "expo-blur";
import getExerciseLength from "../utilities/getExerciseLength";
import formatDurationExact from "../utilities/formatDurationExact";
import { createExercise, createRoutine, updateExercise, updateRoutine } from "../db/DBActions";
import { IconButton } from "../components/buttons";
import TimePickerModal from "../components/TimePickerModal";
import DraggableFlatList from "react-native-draggable-flatlist";

const sortedExercises = (exercises) => {
  return [...exercises].sort((a, b) => a.exerciseOrder - b.exerciseOrder);
}
const getExerciseInfo = (exercises) => {

  let warmupTime = 0, workingTime = 0, cooldownTime = 0, numExercises = 0, greatestExerciseOrder = 0;

  exercises.forEach(exercise => {
    if (exercise.exerciseOrder > greatestExerciseOrder) greatestExerciseOrder = exercise.exerciseOrder;
    switch (exercise.tag) {
      case Tag.PREROUTINE:
        warmupTime += getExerciseLength(exercise);
        break;
      case Tag.WORKING:
        workingTime += getExerciseLength(exercise);
        numExercises += 1;
        break;
      case Tag.POSTROUTINE:
        cooldownTime += getExerciseLength(exercise);
        break;
      default:
        null;
    }
  });

  return [warmupTime, workingTime, cooldownTime, numExercises, greatestExerciseOrder];
}
function RoutineEditScreen({ route }) {

  // Setup Functionality
  const navigation = useNavigation();
  const { edit: isRoutineEditing } = route.params;
  const { selectedTemplate, selectedTemplateID, setSelectedTemplateID, setSelectedTemplate } = useTemplateContext();
  const { contextExercises: exercises, contextRoutine: routine, setContextRoutine, setContextExercises } = useRoutineContext();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [workingSet, setWorkingSet] = useState(sortedExercises(exercises).slice(1, -1)); // The working set is everything between 1st & last elements
  const [warmupTime, workingTime, cooldownTime, numExercises, maxExerciseOrder] = getExerciseInfo(exercises);
  const totalRoutineTime = warmupTime + workingTime + cooldownTime;

  useEffect(() => {
    console.log(
      `New template selected: ${selectedTemplate} id: ${selectedTemplateID}`,
    );
  }, [selectedTemplate]);


  useFocusEffect(
    useCallback(() => {
      setWorkingSet(sortedExercises(exercises).slice(1, -1));
      return () => {
        // You can add any cleanup logic here if necessary.
      };
    }, [exercises]) // Depend on exercises so the callback updates if exercises change
  );

  // Helper Functions
  const renderExerciseItem = (item, getIndex, drag, isActive) => {
    // console.log(getIndex());
    switch (getIndex()) {
      case 0:
        return (
          <ExerciseCard
            title={item.title}
            subTitle={formatExerciseInfo(item)}
            accentColor={theme.accentLightPurple}
            drag={drag}
            style={[{ borderBottomStartRadius: 0 }, isActive && styles.activeItem]}
            isRoutineEditing={isRoutineEditing}
            isExerciseEditing={true}
            referenceExercise={item} // pass reference
          />
        );
      case (numExercises - 1):
        return (
          <ExerciseCard
            title={item.title}
            subTitle={formatExerciseInfo(item)}
            accentColor={theme.accentLightPurple}
            drag={drag}
            style={[{ borderTopStartRadius: 0 }, isActive && styles.activeItem]}
            isRoutineEditing={isRoutineEditing}
            isExerciseEditing={true} // Is the exercise being edited?
            referenceExercise={item} // pass reference
          />
        );
      default:
        return (
          <ExerciseCard
            title={item.title}
            subTitle={formatExerciseInfo(item)}
            accentColor={theme.accentLightPurple}
            drag={drag}
            style={[{ borderRadius: 0 }, isActive && styles.activeItem]}
            isRoutineEditing={isRoutineEditing}
            isExerciseEditing={true} // Is the exercise being edited?
            referenceExercise={item} // pass reference
          />
        );
    }
  };
  const updateRoutineTitle = (newTitle) => {
    setContextRoutine({
      ...routine,
      title: newTitle,
    });
  };
  const handleAddExerciseOnPress = () => {
    const newExercise = new Exercise({
      ...DEFAULT_EXERCISE,
      routineID: routine.id,
      exerciseOrder: maxExerciseOrder
    });

    navigation.navigate(routes.EXERCISE_EDIT_SCREEN, {
      isRoutineEditing: isRoutineEditing,
      isExerciseEditing: false,
      referenceExercise: newExercise,
    });
  };

  const handleSavePress = async () => {

    const exerciseOrderSorted = sortedExercises(exercises);

    const finalExercises = [exerciseOrderSorted[0], ...workingSet, exerciseOrderSorted[exercises.length - 1]];
    finalExercises.forEach((exercise, index) => { // final fix
      exercise.exerciseOrder = index;
    });

    if (isRoutineEditing) { // need to know which exercises are created and which are updated (.id parameter)?
      updateRoutine(routine);
    } else {
      createRoutine(routine);
    }
    finalExercises.forEach((exercise) => {
      exercise.id ? updateExercise(exercise) : createExercise(exercise);
    });
    console.log(isRoutineEditing ? "Routine Updated" : " Routine Created");

    // How to cleanup Context?
    navigation.navigate(routes.ROUTINES_SCREEN);
  };

  // Rendered Output
  return (!(routine && exercises)) ? (<Screen />) :
    (
      <>
        <Screen>
          <NavHeader // Navigation Header
            LeftComponent={
              <AppTextButton
                onPress={() => navigation.navigate(routes.ROUTINES_SCREEN)}
                textStyle={{ fontWeight: "400", color: theme.foreground }}
              >
                {" "}
                Cancel
              </AppTextButton>
            }
            headerText={isRoutineEditing ? "Edit Routine" : "New Routine"}
            RightComponent={
              <AppTextButton
                onPress={() => handleSavePress()}
                textStyle={{ fontWeight: "500" }}
              >
                {isRoutineEditing ? "Save" : "Create"}
              </AppTextButton>
            }
          />
          <View style={styles.headingPanel}>
            <LinearGradient
              colors={["#ffffff", "#3397f3"]} //to be adjusted
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.25 }}
              style={styles.emojiBox}
            />
            <TextInput
              style={styles.title}
              onChangeText={updateRoutineTitle}
              multiline={false}
              keyboardType="default"
              onpre
              placeholder={routine ? routine.title : "Loading"}
              placeholderTextColor={styles.title.color}
              spellCheck={false}
              enterKeyHint="done"
              onSubmitEditing={(item) => {
                updateRoutineTitle(item.nativeEvent.text);
              }}
            />
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 70 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate(routes.TEMPLATE_SELECTION_SCREEN, { edit: isRoutineEditing })
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
            <Text style={styles.sectionTitle}>Pre-routine</Text>
            <View style={{ marginBottom: 22 }}>
              <AuxiliaryCard
                title={"Warmup"}
                editable={false}
                InputComponent={() => (
                  <DummyInputComponent text={`${formatDurationExact(exercises[0].workTime)}`} />
                )}
                accentcolor={theme.accentGreen}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>Intervals</Text>
              <View style={{ marginBottom: 0 }}>
                <IconButton
                  iconName="plus"
                  IconFamily={Feather}
                  iconSize={45}
                  foregroundColor={'white'}
                  onPress={() => handleAddExerciseOnPress()}
                />
              </View>
            </View>
            {workingSet.length === 0 && (
              <TouchableOpacity activeOpacity={0.8} onPress={() => handleAddExerciseOnPress()}>
                <AuxiliaryCard
                  title={"Add Exercise"}
                  Icon={() => (
                    <IconButton
                      iconName="plus"
                      IconFamily={Feather}
                      iconSize={45}
                      foregroundColor={'white'}
                      onPress={() => handleAddExerciseOnPress()}
                    />
                  )}
                  editable={false}
                  InputComponent={() => (
                    <></>
                  )}
                />
              </TouchableOpacity>
            )}
            <DraggableFlatList
              data={workingSet}
              renderItem={({ item, getIndex, drag, isActive }) => renderExerciseItem(item, getIndex, drag, isActive)}
              scrollEnabled={false}
              keyExtractor={(item) => item.exerciseOrder}
              onDragEnd={({ data }) => {
                setWorkingSet(data)
              }}
              containerStyle={{ marginBottom: 22 }}
            />
            <View style={{ marginBottom: 22 }}>
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
            <View style={{}}>
              <AuxiliaryCard
                title={"Cooldown"}
                editable={false}
                InputComponent={() => (
                  <DummyInputComponent text={`${formatDurationExact(exercises[exercises.length - 1].workTime)}`} />
                )}
                accentcolor={theme.accentDarkBlue}
              />
            </View>
          </ScrollView>
        </Screen>
        <BlurView style={styles.timeTabContainer}
          tint="dark"
          intensity={60}
        >
          <View style={styles.timeTab}>
            <Text style={{
              color: 'white',
              fontSize: 16,
              marginBottom: 5,
              fontWeight: '500'
            }}> {`Total time: ${formatDurationExact(totalRoutineTime)}`} </Text>
            <View style={styles.timeColorBar}>
              <View style={[styles.timeWarmup, { flex: warmupTime }]} />
              <View style={[styles.timeWorkout, { flex: workingTime }]} />
              <View style={[styles.timeCooldown, { flex: cooldownTime }]} />
            </View>
          </View>
        </BlurView>
      </>
    )
}

const getStyles = (theme) =>
  StyleSheet.create({
    timeColorBar: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 5,
      overflow: 'hidden'
    },
    timeTabContainer: {
      position: 'absolute',
      bottom: 0,
      height: TAB_BAR_HEIGHT,
      // paddingBottom: ,
      paddingTop: 15,
      backgroundColor: "transparent",
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    timeTab: {
      // position: 'absolute',
      // bottom: 15,
      width: '90%',
      alignItems: 'center'
    },
    timeWarmup: {
      // flex: { warmupTime },
      height: 5,
      backgroundColor: theme.accentGreen,
    },
    timeWorkout: {
      // flex: { exerciseTime },
      height: 5,
      backgroundColor: theme.accentLightPurple,
    },
    timeCooldown: {
      // flex: { cooldownTime },
      height: 5,
      backgroundColor: theme.accentDarkBlue,
    },
    container: {
      backgroundColor: theme.background,
      paddingHorizontal: 15, //consistency between screens important
      paddingBottom: 45,
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
    title: {
      color: theme.foreground,
      fontSize: 30,
      fontWeight: 600,
    },
    templatePanel: {
      marginBottom: 22,
    },
    sectionTitle: {
      color: theme.text60,
      fontSize: PARAGRAPH_FONT_SIZE,
      marginBottom: 8,
    },
    activeItem: {
      backgroundColor: "rgba(128,128,128,0.8)",
    },
  });

export default RoutineEditScreen;
