import React from 'react';
import { View, StyleSheet, Button, SectionList, Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import {Feather} from '@expo/vector-icons'

import Screen from '../components/Screen';
import Navheader from "../components/NavHeader"
import { IconButton } from '../components/buttons';
import { useTheme } from '../contexts/ThemeContext';
import routes from '../navigation/routes';
import AuxilaryCard from "../components/AuxiliaryCard"
import DummyInputComponent from "../components/DummyInputComponent";

function ExerciseEditScreen(props) {

    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
        <Screen style = {{flex: 1}}>
            <Navheader style={styles.navPanel}
                LeftComponent={
                    <IconButton
                    iconName={"chevron-left"}
                    IconFamily={Feather}
                    iconSize={52}
                    foregroundcolor={theme.blue}
                    onPress={() => navigation.navigate(routes.ROUTINE_EDIT_SCREEN)}
                  />
                }
                headerText='Edit Planks'
            />
            <View style={{gap: 10, paddingHorizontal: 11}}>
                <AuxilaryCard 
                editable={false}
                bold={false}
                title={"Work time"}
                InputComponent={() => <DummyInputComponent text="1 minute"/>}
                />
                <AuxilaryCard 
                editable={false}
                bold={false}
                title={"Number of rounds"}
                InputComponent={() => <DummyInputComponent text="1"/>}
                />
                <AuxilaryCard 
                editable={false}
                bold={false}
                title={"Rest between rounds"}
                InputComponent={() => <DummyInputComponent text="30 seconds"/>}
                />
                <AuxilaryCard 
                editable={false}
                bold={false}
                title={"Break until next exercise"}
                InputComponent={() => <DummyInputComponent text="10 seconds"/>}
                />
            </View>
        </Screen>
    );
}

const getStyles = (theme) => 
    StyleSheet.create({
        
    })

export default ExerciseEditScreen;