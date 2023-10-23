import React, {
  useEffect,
  useCallback,
  useRef,
  useReducer,
  useState,
} from "react";
import * as Haptics from "expo-haptics";
import {
  Button,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import AuxiliaryCard from "../components/AuxiliaryCard";
import DummyInputComponent from "../components/DummyInputComponent";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import { useSettings } from "../contexts/SettingsContext";
import ExerciseCard from "../components/ExerciseCard";
import { Tag, Exercise } from "../classes/Exercise";
import {
  PICKER_BUTTON_FONT_SIZE,
  PICKER_BUTTON_FONT_WEIGHT,
  TAB_BAR_HEIGHT,
  INFO_FONT_SIZE,
  DEFAULT_EXERCISE,
} from "../config/appConstants";
import AppTextButton from "../components/buttons/AppTextButton";
import NavHeader from "../components/NavHeader";
import { useTemplateContext } from "../contexts/TemplateContext";
import formatExerciseInfo from "../utilities/formatExerciseInfo";
import { useRoutineContext } from "../contexts/RoutineContext";
import { BlurView } from "expo-blur";
import getExerciseLength from "../utilities/getExerciseLength";
import formatDurationExact from "../utilities/formatDurationExact";
import { formatMinutesSeconds } from "../utilities/formatDuration";
import {
  createExercise,
  createRoutine,
  getAllUserCreatedRoutines,
  updateExercise,
  updateRoutine,
} from "../db/DBActions";
import { IconButton } from "../components/buttons";
import { ROUTINE_EDIT_MODAL } from "../config/RoutineModalConfig";
import routineEditActions from "../actions/routineEditActions";
import {
  TimeWheelPicker,
  BottomSheetHandle,
  NumberWheelPicker,
} from "../components/pickers";
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
} from "react-native-draggable-flatlist";
import { Routine } from "../classes/Routine";

const MODAL_HEIGHT = 350;

const sortedExercises = (exercises) => {
  return [...exercises].sort((a, b) => a.exerciseOrder - b.exerciseOrder);
};
const getExerciseInfo = (exercises) => {
  let workTime = 0,
    numExercises = 0,
    greatestExerciseOrder = 0;

  exercises.forEach((exercise) => {
    switch (exercise.tag) {
      case Tag.PREROUTINE:
        break;
      case Tag.WORKING:
        workTime += getExerciseLength(exercise);
        numExercises += 1;
        break;
      case Tag.POSTROUTINE:
        greatestExerciseOrder = exercise.exerciseOrder;
        break;
      default:
        null;
    }
  });

  return [workTime, numExercises, greatestExerciseOrder];
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
  const { theme, optionalHapticFunction } = useSettings();
  const styles = getStyles(theme);

  const modalRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalContent, setModalContent] = useState(ROUTINE_EDIT_MODAL.NONE);

  // Initialize state
  useFocusEffect(
    useCallback(() => {
      if (exercises && routine) {
        const warmup = exercises.find((item) => item.tag === Tag.PREROUTINE); // could be optimized
        const cooldown = exercises.find((item) => item.tag === Tag.POSTROUTINE);

        const workingSet = sortedExercises(exercises).slice(1, -1); // The working set is everything between [1, N-1] elements
        const [workTime, numExercises, maxExerciseOrder] =
          getExerciseInfo(exercises);

        dispatch({
          type: routineEditActions.INIT,
          payload: {
            warmup: warmup,
            cooldown: cooldown,
            workingSet: workingSet,
            workTime: workTime,
            numExercises: numExercises,
            maxExerciseOrder: maxExerciseOrder,
            routine: routine,
            numberOfLoops: routine.numberOfLoops,
          },
        });
      } else {
        null; // What to do if exercises is not loaded from context yet?
      }

      return () => {
        // Is there any TEARDOWN NECessary here?
      };
    }, [exercises]), // Depend on exercises so the callback updates if exercises change
  );

  useEffect(() => {
    console.log(
      `New template selected: ${selectedTemplate} id: ${selectedTemplateID}`,
    );
  }, [selectedTemplate]);

  const onModalChange = (isOpen) => {
    if (isOpen === 1) {
      // Opening modal; save value to which to possibly revert.
      dispatch({
        type: routineEditActions.SET_PREVIOUS,
        payload: state[state.activeKey],
      });
    } else {
      // Closing modal
      dispatch({ type: routineEditActions.TOGGLE_REFRESH });
      setModalContent(ROUTINE_EDIT_MODAL.NONE);
    }
  };

  // Helper Functions
  const updateRoutineTitle = (newTitle) => {
    dispatch({
      type: routineEditActions.UPDATE_ROUTINE_TITLE,
      payload: newTitle,
    });
  };
  const renderExerciseItem = (item, getIndex, drag, isActive) => {
    switch (getIndex()) {
      case 0:
        return (
          <ExerciseCard
            title={item.title}
            subTitle={formatExerciseInfo(item)}
            accentColor={theme.accentLightPurple}
            drag={drag}
            style={[
              { borderBottomStartRadius: 0, borderBottomEndRadius: 0 },
              isActive && state.exerciseBeingDragged && styles.activeItem,
            ]}
            onPress={() => handleExerciseEditOnPress(item)}
          />
        );
      case state.numExercises - 1:
        return (
          <ExerciseCard
            title={item.title}
            subTitle={formatExerciseInfo(item)}
            accentColor={theme.accentLightPurple}
            drag={drag}
            style={[
              { borderTopStartRadius: 0, borderTopEndRadius: 0 },
              isActive && state.exerciseBeingDragged && styles.activeItem,
            ]}
            isRoutineEditing={isRoutineEditing}
            isExerciseEditing={true}
            referenceExercise={item}
            onPress={() => handleExerciseEditOnPress(item)}
          />
        );
      default:
        return (
          <ExerciseCard
            title={item.title}
            subTitle={formatExerciseInfo(item)}
            accentColor={theme.accentLightPurple}
            drag={drag}
            style={[
              { borderRadius: 0 },
              isActive && state.exerciseBeingDragged && styles.activeItem,
            ]}
            isRoutineEditing={isRoutineEditing}
            isExerciseEditing={true}
            referenceExercise={item}
            onPress={() => handleExerciseEditOnPress(item)}
          />
        );
    }
  };
  const handleAddExerciseOnPress = () => {
    // Save current state to context so that it can be loaded when navigating back
    setContextExercises([state.warmup, ...state.workingSet, state.cooldown]);
    setContextRoutine({ ...state.routine });

    const newExercise = new Exercise({
      ...DEFAULT_EXERCISE,
      routineID: routine.id,
      exerciseOrder: state.maxExerciseOrder,
    });

    navigation.navigate(routes.EXERCISE_EDIT_SCREEN, {
      isRoutineEditing: isRoutineEditing,
      isExerciseEditing: false,
      referenceExercise: newExercise,
    });
  };

  const handleExerciseEditOnPress = (exerciseItem) => {
    // Save current state to context so that it can be loaded when navigating back
    setContextExercises([state.warmup, ...state.workingSet, state.cooldown]);
    setContextRoutine({ ...state.routine });

    navigation.navigate(routes.EXERCISE_EDIT_SCREEN, {
      isRoutineEditing: isRoutineEditing,
      isExerciseEditing: true,
      referenceExercise: exerciseItem,
    });
  };

  const handleSavePress = async () => {
    const finalExercises = [state.warmup, ...state.workingSet, state.cooldown];
    finalExercises.forEach((exercise, index) => {
      // Update ExerciseOrder of all exercises before saving
      exercise.exerciseOrder = index;
    });
    const finalTime = finalExercises.reduce((sum, exercise, idx) => {
      let exerciseLength = getExerciseLength(exercise);

      // Check if the current exercise is neither the first nor the last
      if (idx !== 0 && idx !== finalExercises.length - 1) {
        exerciseLength *= state.numberOfLoops;
      }

      return sum + exerciseLength;
    }, 0);

    // Done manually instead of in dispatch because of issues encountered with async.
    // Update/Create was being called without the state being re-rendered
    const updatedRoutine = new Routine({
      ...state.routine,
      numberOfLoops: state.numberOfLoops,
      duration: finalTime, // or however you need to structure the updated routine object
    });

    // console.log("updatedRoutine: ", JSON.stringify(updatedRoutine, null, 2));

    if (isRoutineEditing) {
      await updateRoutine(updatedRoutine);
    } else {
      await createRoutine(updatedRoutine);
    }

    finalExercises.forEach((exercise) => {
      exercise.id ? updateExercise(exercise) : createExercise(exercise);
    });
    console.log(isRoutineEditing ? "Routine Updated" : " Routine Created");

    // How to cleanup Context?
    navigation.navigate(routes.ROUTINES_SCREEN);
  };

  const InputModalButton = ({ accentColor, title, text, contentKey, Icon }) => (
    <AuxiliaryCard
      accentColor={accentColor}
      title={title}
      Icon={Icon}
      onPress={() => {
        dispatch({
          type: routineEditActions.SET_ACTIVE_KEY,
          payload: ROUTINE_EDIT_MODAL[contentKey]?.key,
        });
        dispatch({ type: routineEditActions.SET_PREVIOUS });
        dispatch({ type: routineEditActions.TOGGLE_REFRESH });
        setModalContent(ROUTINE_EDIT_MODAL[contentKey]);
        modalRef.current?.expand();
      }}
    >
      <Text style={styles.inputText}>{text}</Text>
    </AuxiliaryCard>
  );

  return !(
    Object.keys(state.warmup).length > 0 &&
    Object.keys(state.cooldown).length > 0
  ) ? (
    <Screen />
  ) : (
    <>
      <Screen>
        <View style={styles.container}>
          <NavHeader
            LeftComponent={
              <AppTextButton
                onPress={() => navigation.navigate(routes.ROUTINES_SCREEN)}
                textStyle={{ fontWeight: "400", color: theme.foreground }}
              >
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
              colors={["#ffffff", "#3397f3"]}
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
        </View>
        <NestableScrollContainer contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(routes.TEMPLATE_SELECTION_SCREEN, {
                edit: isRoutineEditing,
              });
            }}
            style={styles.sectionSeparator}
          >
            <AuxiliaryCard
              title={"Template"}
              InputComponent={() => (
                <DummyInputComponent text={selectedTemplate} />
              )}
            />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Pre-routine</Text>
          <View style={styles.sectionSeparator}>
            <InputModalButton
              accentColor={theme.accentGreen}
              title="Warmup"
              text={formatMinutesSeconds(state.warmup.workTime)}
              contentKey="WARMUP"
            />
          </View>
          <View style={styles.intervalHeader}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
              Intervals
            </Text>
            <View>
              <IconButton
                iconName="plus"
                IconFamily={Feather}
                iconSize={45}
                foregroundColor="white"
                onPress={() => handleAddExerciseOnPress()}
              />
            </View>
          </View>
          {state.workingSet?.length === 0 && (
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
                InputComponent={() => <></>}
              />
            </TouchableOpacity>
          )}
          <NestableDraggableFlatList
            data={state?.workingSet}
            renderItem={({ item, getIndex, drag, isActive }) =>
              renderExerciseItem(item, getIndex, drag, isActive)
            }
            scrollEnabled={false}
            keyExtractor={(item) => item.exerciseOrder}
            onDragBegin={optionalHapticFunction(async () => {
              dispatch({
                type: routineEditActions.TOGGLE_EXERCISE_ITEM_DRAG,
                payload: true,
              });
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            })}
            onDragEnd={({ data }) => {
              dispatch({
                type: routineEditActions.SET_WORKING_SET,
                payload: data,
              });
            }}
            onPlaceholderIndexChange={optionalHapticFunction(async () => {
              await Haptics.selectionAsync();
            })}
            onRelease={() => {
              dispatch({
                type: routineEditActions.TOGGLE_EXERCISE_ITEM_DRAG,
                payload: false,
              });
            }}
            containerStyle={[
              styles.flatlist,
              state.workingSet?.length > 0
                ? styles.flatlistMargin12
                : styles.flatlistMargin22,
            ]}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
          />
          {state.workingSet?.length > 0 && (
            <View style={styles.sectionSeparator}>
              <InputModalButton
                title="Loops"
                text={state.numberOfLoops}
                contentKey="LOOPS"
                Icon={() => (
                  <Feather name="repeat" size={20} color={theme.foreground} />
                )}
              />
            </View>
          )}
          <Text style={styles.sectionTitle}>Post-routine</Text>
          <View style={styles.sectionSeparator}>
            <InputModalButton
              accentColor={theme.accentDarkBlue}
              title="Cooldown"
              text={formatMinutesSeconds(state.cooldown.workTime)}
              contentKey="COOLDOWN"
            />
          </View>
        </NestableScrollContainer>
        <BottomSheet
          ref={modalRef}
          index={-1}
          snapPoints={[MODAL_HEIGHT, MODAL_HEIGHT]}
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
          backdropComponent={BottomSheetBackdrop}
          backgroundStyle={{ backgroundColor: theme.tertiaryBackground }}
          handleComponent={() => (
            <BottomSheetHandle title={modalContent.title} />
          )}
          onChange={onModalChange}
        >
          {modalContent.key === ROUTINE_EDIT_MODAL.WARMUP.key && (
            <TimeWheelPicker
              key={state.refresh}
              startingTime={state.warmup.workTime}
              onValueChange={(data) =>
                dispatch({
                  type: routineEditActions.SET_WARMUP,
                  payload: data,
                })
              }
            />
          )}
          {modalContent.key === ROUTINE_EDIT_MODAL.COOLDOWN.key && (
            <TimeWheelPicker
              key={state.refresh}
              startingTime={state.cooldown.workTime}
              onValueChange={(data) =>
                dispatch({
                  type: routineEditActions.SET_COOLDOWN,
                  payload: data,
                })
              }
            />
          )}
          {modalContent.key === ROUTINE_EDIT_MODAL.LOOPS.key && (
            <NumberWheelPicker
              key={state.refresh}
              number={state.numberOfLoops}
              onValueChange={(data) =>
                dispatch({
                  type: routineEditActions.SET_LOOPS,
                  payload: data,
                })
              }
            />
          )}
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => {
                  dispatch({ type: routineEditActions.REVERT_PREVIOUS });
                  modalRef.current?.close();
                }}
                color={theme.primary}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Apply"
                onPress={() => {
                  modalRef.current?.close();
                }}
                color={theme.blue}
              />
            </View>
          </View>
        </BottomSheet>
      </Screen>
      <BlurView
        style={[
          styles.totalTimeTab,
          { display: modalContent.key !== "none" ? "none" : "flex" },
        ]}
        tint="dark"
        intensity={60}
      >
        <View style={styles.timeTab}>
          <Text style={styles.totalTimeText}>
            {" "}
            {`Total time: ${formatDurationExact(
              state.warmup.workTime +
                state.cooldown.workTime +
                state.numberOfLoops * state.workTime,
            )}`}{" "}
          </Text>
          <View style={styles.timeColorBar}>
            <View
              style={[styles.timeWarmup, { flex: state.warmup.workTime }]}
            />
            <View
              style={[
                styles.timeWorkout,
                { flex: state.workTime * state.numberOfLoops },
              ]}
            />
            <View
              style={[styles.timeCooldown, { flex: state.cooldown.workTime }]}
            />
          </View>
        </View>
      </BlurView>
    </>
  );
}

const initialState = {
  activeKey: "",
  apply: false,
  previous: "",
  refresh: false,
  warmup: {},
  workingSet: [],
  cooldown: {},
  workTime: 0,
  numExercises: 0,
  numberOfLoops: 1,
  maxExerciseOrder: 0,
  exerciseBeingDragged: false,
  routine: new Routine({}),
};

const reducer = (state, action) => {
  switch (action.type) {
    case routineEditActions.INIT:
      return { ...state, ...action.payload };

    case routineEditActions.SET_ACTIVE_KEY:
      return { ...state, activeKey: action.payload };

    case routineEditActions.SET_PREVIOUS:
      return { ...state, previous: action.payload };

    case routineEditActions.REVERT_PREVIOUS:
      return { ...state, [state.activeKey]: state.previous };

    case routineEditActions.SET_WARMUP:
      return {
        ...state,
        warmup: { ...state.warmup, workTime: action.payload },
      };

    case routineEditActions.SET_COOLDOWN:
      return {
        ...state,
        cooldown: { ...state.cooldown, workTime: action.payload },
      };

    case routineEditActions.SET_LOOPS:
      console.log("Setting loops to, ", action.payload);
      return { ...state, numberOfLoops: action.payload };

    case routineEditActions.TOGGLE_APPLY:
      return { ...state, apply: !state.apply };

    case routineEditActions.TOGGLE_REFRESH:
      return { ...state, refresh: !state.refresh };

    case routineEditActions.TOGGLE_EXERCISE_ITEM_DRAG:
      return { ...state, exerciseBeingDragged: action.payload };

    case routineEditActions.SET_WORKING_SET:
      return { ...state, workingSet: action.payload };

    case routineEditActions.UPDATE_ROUTINE_TITLE:
      return { ...state, routine: { ...state.routine, title: action.payload } };

    default:
      console.log("Invalid action.type detected in RoutineEditScreen reducer.");
  }
};

const getStyles = (theme) =>
  StyleSheet.create({
    activeItem: {
      backgroundColor: "rgba(28,28,30,0.8)",
    },
    buttonContainer: {
      marginHorizontal: 16,
      marginTop: 12,
    },
    container: {
      paddingHorizontal: 15,
    },
    timeColorBar: {
      flexDirection: "row",
      backgroundColor: "white",
      borderRadius: 5,
      overflow: "hidden",
    },
    flatlist: {},
    flatlistMargin12: {
      marginBottom: 12,
    },
    flatlistMargin22: {
      marginBottom: 22,
    },
    intervalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // marginBottom: -5,
    },
    listSeparator: {
      backgroundColor: "#38383A",
      height: StyleSheet.hairlineWidth,
    },
    totalTimeTab: {
      position: "absolute",
      bottom: 0,
      height: 109,
      paddingTop: 25,
      backgroundColor: "transparent",
      width: "100%",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    timeTab: {
      width: "90%",
      alignItems: "center",
    },
    totalTimeText: {
      color: "white",
      fontSize: 16,
      marginBottom: 5,
      fontWeight: "500",
    },
    timeWarmup: {
      height: 5,
      backgroundColor: theme.accentGreen,
    },
    timeWorkout: {
      height: 5,
      backgroundColor: theme.accentLightPurple,
    },
    timeCooldown: {
      height: 5,
      backgroundColor: theme.accentDarkBlue,
    },
    emojiBox: {
      backgroundColor: theme.blue,
      height: 30,
      width: 30,
      borderRadius: 7,
      marginRight: 10,
    },
    header: {
      backgroundColor: theme.secondaryBackground,
      paddingBottom: 18,
      paddingHorizontal: 22,
      paddingTop: 10,
      gap: 2,
    },
    headingPanel: {
      marginTop: 22,
      flexDirection: "row",
      height: 40,
      alignItems: "center",
      marginBottom: 25,
    },
    inputText: {
      fontSize: PICKER_BUTTON_FONT_SIZE,
      fontWeight: PICKER_BUTTON_FONT_WEIGHT,
      color: theme.text87,
    },
    title: {
      color: theme.foreground,
      fontSize: 30,
      fontWeight: 600,
    },
    scrollContainer: {
      paddingBottom: TAB_BAR_HEIGHT,
      paddingHorizontal: 15,
    },
    sectionTitle: {
      color: theme.text60,
      fontSize: INFO_FONT_SIZE,
      marginBottom: 12,
    },
    footer: {
      backgroundColor: theme.secondaryBackground,
      bottom: 0,
      flexDirection: "row",
      height: 65,
      justifyContent: "space-between",
      position: "absolute",
      width: "100%",
    },
    sectionSeparator: {
      marginBottom: 22,
    },
  });

export default RoutineEditScreen;
