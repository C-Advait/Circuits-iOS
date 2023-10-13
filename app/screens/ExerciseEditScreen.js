import React, { useState } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Feather } from '@expo/vector-icons'

import Screen from '../components/Screen';
import Navheader from "../components/NavHeader"
import { IconButton } from '../components/buttons';
import { useTheme } from '../contexts/ThemeContext';
import routes from '../navigation/routes';
import AuxilaryCard from "../components/AuxiliaryCard"
import DummyInputComponent from "../components/DummyInputComponent";
import { TouchableOpacity } from 'react-native-gesture-handler';
import formatDuration from '../utilities/formatDuration';
import AppTextButton from '../components/buttons/AppTextButton';
import { Exercise } from '../classes/Exercise';
import { useRoutineContext } from '../contexts/RoutineContext';

function ExerciseEditScreen({ route }) {

    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const [restEnabled, setRestEnabled] = useState(false);
    const [infoChanged, setInfoChanged] = useState(false);
    const { isRoutineEditing, isExerciseEditing, referenceExercise, exercise } = route.params;
    const { contextExercises, setContextExercises } = useRoutineContext();

    // Define a state variable to track the exercise title
    const [exerciseTitle, setExerciseTitle] = useState(exercise.title); // POC to verify if input changes propogated


    const handleSaveOnPress = () => {
        //Set reference exercise object to the exercise object
        exercise.title = exerciseTitle;
        Object.assign(referenceExercise, exercise);
        if (!isExerciseEditing) { // Is a new exercise
            // Add exercise to the exercises array so it is added
            setContextExercises([...contextExercises, referenceExercise]);
        }

        navigation.navigate(routes.ROUTINE_EDIT_SCREEN, { edit: isRoutineEditing });
    }

    return (
        <Screen style={{ flex: 1 }}>
            <Navheader style={styles.navPanel}
                LeftComponent={
                    <IconButton
                        iconName={"chevron-left"}
                        IconFamily={Feather}
                        iconSize={52}
                        foregroundColor={theme.blue}
                        onPress={() => navigation.navigate(routes.ROUTINE_EDIT_SCREEN, { edit: isRoutineEditing })}
                    />
                }
                headerText={`Edit ${exerciseTitle}`}
                RightComponent={
                    infoChanged ?
                        (
                            <AppTextButton
                                onPress={() => handleSaveOnPress()}
                                textStyle={{ fontWeight: "500" }}
                            >
                                {isExerciseEditing ? "Save" : "Create"}
                            </AppTextButton>
                        ) :
                        null
                }
            />
            <View style={{ gap: 10, paddingHorizontal: 11 }}>
                <TouchableOpacity onPress={() => {
                    setInfoChanged(true);
                    exerciseTitle === "Changed Name" ? setExerciseTitle("Pushups") : setExerciseTitle("Changed Name");
                }}>
                    <AuxilaryCard
                        editable={false}
                        bold={false}
                        title={"Name"}
                        InputComponent={() => <DummyInputComponent text={`${exerciseTitle}`} />}
                    />
                </TouchableOpacity>
                <AuxilaryCard
                    editable={false}
                    bold={false}
                    title={"Work time"}
                    InputComponent={() => <DummyInputComponent text={`${formatDuration(exercise.workTime)}`} />}
                />
                <TouchableOpacity onPress={() => restEnabled ? setRestEnabled(false) : setRestEnabled(true)}>
                    <AuxilaryCard
                        editable={false}
                        bold={false}
                        title={"Number of rounds"}
                        InputComponent={() => <DummyInputComponent text={`${exercise.numberOfRounds}`} />}
                    />
                </TouchableOpacity>
                <AuxilaryCard
                    editable={false}
                    bold={false}
                    disabled={restEnabled}
                    title={"Rest between rounds"}
                    InputComponent={() => <DummyInputComponent text={`${formatDuration(exercise.restBetweenRounds)}`} disabled={restEnabled} />}
                />
                <AuxilaryCard
                    editable={false}
                    bold={false}
                    title={"Break until next exercise"}
                    InputComponent={() => <DummyInputComponent text={`${formatDuration(exercise.breakBeforeNext)}`} />}
                />
            </View>
        </Screen>
    );
}

const getStyles = (theme) =>
    StyleSheet.create({
    })

export default ExerciseEditScreen;