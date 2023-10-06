import React from 'react';
import {View, StyleSheet}  from 'react-native'

import routes from "../navigation/routes";
import { useTheme } from "../contexts/ThemeContext";
import Header from './Header';
import AppTextButton from './buttons/AppTextButton';

function NavHeader({
    LeftComponent,
    headerText = "Navigation Heading",
    RightComponent
}) {

    LeftComponent = LeftComponent ? LeftComponent : <AppTextButton>Replace me</AppTextButton>
    RightComponent = RightComponent ? RightComponent : <AppTextButton>Replace me</AppTextButton>
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
    <View style={styles.navPanel}>
        {LeftComponent}
        <Header style={[styles.text]}>{headerText}</Header>
        {RightComponent}
      </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    defaultLeftComponent: {

    },
    navPanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30, 
        marginTop: 5,
        paddingHorizontal: 11
      },
    text: {
        fontSize: 18,
        fontWeight: 'bold'
    },
})

export default NavHeader;