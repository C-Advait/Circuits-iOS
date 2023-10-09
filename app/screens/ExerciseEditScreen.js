import React from 'react';
import { View, StyleSheet, Button, SectionList, Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import {Feather} from '@expo/vector-icons'

import Screen from '../components/Screen';
import Navheader from "../components/NavHeader"
import { IconButton } from '../components/buttons';
import { useTheme } from '../contexts/ThemeContext';
import routes from '../navigation/routes';

function ExerciseEditScreen(props) {

    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
        <Screen style = {{flex: 1}}>
            <Navheader
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
                // RightComponent={
                //     <View style={{width: 30}}/>
                // }
            />
        </Screen>
    );
}

const getStyles = (theme) => 
    StyleSheet.create({

    })

export default ExerciseEditScreen;