import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import Screen from '../components/Screen';
import { useNavigation } from '@react-navigation/core';

import Header from '../components/Header';
import routes from '../navigation/routes';

function TimerScreen() {
  const navigation = useNavigation();

  return (
    <Screen>
      <Header>TimerScreen</Header>
      <Button title={"Back to routines"} onPress={() => navigation.navigate(routes.ROUTINES_SCREEN)}/>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default TimerScreen;
