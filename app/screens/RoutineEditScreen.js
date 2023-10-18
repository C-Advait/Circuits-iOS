import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
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
import {
  createExercise,
  createRoutine,
  updateExercise,
  updateRoutine,
} from "../db/DBActions";
import { IconButton } from "../components/buttons";

const formatDataForSectionList = (data) => {
  // Initialize an object to hold data for each section
  let WarmupTime = 0;
  let ExerciseTime = 0;
  let CooldownTime = 0;
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
        WarmupTime += getExerciseLength(item);
        break;
      case Tag.WORKING:
        sections.Exercises.push(item);
        ExerciseTime += getExerciseLength(item);
        break;
      case Tag.POSTROUTINE:
        sections.Cooldown.push(item);
        CooldownTime += getExerciseLength(item);
        break;
      default:
        null;
    }
  });

  // Convert the sections object into an array of section objects for SectionList
  return [
    Object.keys(sections).map((key) => ({
      title: key,
      data: sections[key],
    })),
    WarmupTime,
    ExerciseTime,
    CooldownTime,
  ];
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
  const { edit: isRoutineEditing } = route.params;
  const {
    selectedTemplate,
    selectedTemplateID,
    setSelectedTemplateID,
    setSelectedTemplate,
  } = useTemplateContext();
  const {
    contextExercises: exercises,
    contextRoutine: routine,
    setContextRoutine,
    setContextExercises,
  } = useRoutineContext();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  // const [maxExerciseOrder, setMaxExerciseOrder] = useState(0);
  // const [maxExerciseID, setMaxExerciseID] = useState(0);

  const [formattedExercises, warmupTime, exerciseTime, cooldownTime] =
    formatDataForSectionList(exercises);
  const totalRoutineTime = warmupTime + exerciseTime + cooldownTime;
  const numExercises = useMemo(
    () => getNumExercises(formattedExercises),
    [formattedExercises],
  );

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
            InputComponent={() => <DummyInputComponent />}
          />
        );
      case Tag.POSTROUTINE:
        return (
          <AuxiliaryCard
            accentcolor={theme.accentDarkBlue}
            editable={false}
            bold={false}
            title={item.title}
            InputComponent={() => <DummyInputComponent />}
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
            isRoutineEditing={isRoutineEditing}
            isExerciseEditing={true}
            referenceExercise={item} // pass reference
            exercise={new Exercise({ ...item })} // pass a copy to edit
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
              isRoutineEditing={isRoutineEditing}
              isExerciseEditing={true} // Is the exercise being edited?
              referenceExercise={item} // pass reference
              exercise={new Exercise({ ...item })} // pass a copy to edit
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
            isRoutineEditing={isRoutineEditing}
            isExerciseEditing={true} // Is the exercise being edited?
            referenceExercise={item} // pass reference
            exercise={new Exercise({ ...item })} // pass a copy to edit
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
  const renderSectionHeader = (section) => {
    if (section.title === "Warmup")
      return renderAuxiliarySectionHeader(section);
    if (section.title === "Exercises")
      return renderExerciseSectionHeader(section);
    if (section.title === "Cooldown")
      return renderAuxiliarySectionHeader(section);
  };
  const renderAuxiliarySectionHeader = (section) => {
    return <Text style={styles.sectionTitle}>{section.title}</Text>;
  };
  const handleAddExerciseOnPress = () => {
    exer = new Exercise({
      ...DEFAULT_EXERCISE,
      routineID: routine.id,
      exerciseOrder: numExercises, // Bind exerciseOrder to number of exercises ATM
    });

    navigation.navigate(routes.EXERCISE_EDIT_SCREEN, {
      isRoutineEditing: isRoutineEditing,
      isExerciseEditing: false,
      referenceExercise: exer,
      exercise: exer,
    });
  };

  const renderExerciseSectionHeader = (section) => {
    if (section.data.length === 0) {
      return (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={{ marginBottom: 0 }}>
              <IconButton
                iconName="plus"
                IconFamily={Feather}
                iconSize={45}
                foregroundColor={"white"}
                onPress={() => handleAddExerciseOnPress()}
              />
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleAddExerciseOnPress()}
          >
            <AuxiliaryCard
              title={"Add Exercise"}
              Icon={() => (
                <IconButton
                  iconName="plus"
                  IconFamily={Feather}
                  iconSize={45}
                  foregroundColor={"white"}
                  onPress={() => handleAddExerciseOnPress()}
                />
              )}
              editable={false}
              InputComponent={() => <></>}
            />
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={{ marginBottom: 0 }}>
            <IconButton
              iconName="plus"
              IconFamily={Feather}
              iconSize={45}
              foregroundColor={"white"}
              onPress={() => handleAddExerciseOnPress()}
            />
          </View>
        </View>
      );
    }
  };

  //  Clear up context variables (??)
  // const handleContextCleanup = async () => {
  //   setContextRoutine(null);
  //   setContextExercises([]);
  //   setSelectedTemplate("Custom");
  //   setSelectedTemplateID(1);
  // }

  const handleSavePress = async () => {
    if (isRoutineEditing) {
      updateRoutine(routine);
      exercises.map((exercise) => updateExercise(exercise));
    } else {
      createRoutine(routine);
      exercises.map((exercise) => createExercise(exercise));
    }
    console.log(isRoutineEditing ? "Routine Updated" : " Routine Created");

    // How to cleanup Context?

    navigation.navigate(routes.ROUTINES_SCREEN);
  };

  // Rendered Output
  return !(routine && exercises) ? (
    <Screen />
  ) : (
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
        <SectionList // SectionList
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            // Title and Header (added here so it does not "stick", i.e. scrolls along with List)
            <>
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
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate(routes.TEMPLATE_SELECTION_SCREEN, {
                    edit: isRoutineEditing,
                  });
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
          sections={formattedExercises}
          keyExtractor={(item) => item.exerciseOrder}
          renderItem={({ item, index }) => renderItem(item, index)}
          renderSectionHeader={
            ({ section }) => renderSectionHeader(section)
            //<Text style=//{styles.sectionTitle}>{section.title}</Text>
          }
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
      <BlurView style={styles.timeTabContainer} tint="dark" intensity={60}>
        <View style={styles.timeTab}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              marginBottom: 5,
              fontWeight: "500",
            }}
          >
            {" "}
            {`Total time: ${formatDurationExact(totalRoutineTime)}`}{" "}
          </Text>
          <View style={styles.timeColorBar}>
            <View style={[styles.timeWarmup, { flex: warmupTime }]} />
            <View style={[styles.timeWorkout, { flex: exerciseTime }]} />
            <View style={[styles.timeCooldown, { flex: cooldownTime }]} />
          </View>
        </View>
      </BlurView>
    </>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    timeColorBar: {
      flexDirection: "row",
      backgroundColor: "white",
      borderRadius: 5,
      overflow: "hidden",
    },
    timeTabContainer: {
      position: "absolute",
      bottom: 0,
      height: TAB_BAR_HEIGHT,
      // paddingBottom: ,
      paddingTop: 15,
      backgroundColor: "transparent",
      width: "100%",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    timeTab: {
      // position: 'absolute',
      // bottom: 15,
      width: "90%",
      alignItems: "center",
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
      marginBottom: 15,
    },
    sectionTitle: {
      color: theme.text60,
      fontSize: PARAGRAPH_FONT_SIZE,
      marginBottom: 8,
    },
  });

export default RoutineEditScreen;
