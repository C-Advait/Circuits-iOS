import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import Screen from '../components/Screen';
import { useNavigation } from '@react-navigation/core';
import Header from '../components/Header';
import routes from '../navigation/routes';

function RoutineEditScreen(props) {
  const navigation = useNavigation();

  return (
    <Screen>
      <Header>RoutineEditScreen</Header>
      <Button title={"routines"} onPress={() => navigation.navigate(routes.ROUTINES_SCREEN)}/>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default RoutineEditScreen;
