import React from 'react';
import {View, StyleSheet}  from 'react-native'

import routes from "../navigation/routes";
import { useTheme } from "../contexts/ThemeContext";

function NavHeader({
    LeftComponent,
    headerText = "Navigation Heading",
    RightComponent
}) {

    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
    <View style={styles.navPanel}>
        <LeftComponent />
        <Header style={[styles.text]}>{headerText}</Header>
        <RightComponent />
      </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
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