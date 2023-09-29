import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import Screen from '../components/Screen';
import { useNavigation } from '@react-navigation/core';
import routes from '../navigation/routes';

function RoutinesScreen(props) {
  const navigation = useNavigation();
  return (
    <Screen>
      <Text>RoutinesScreen</Text>
      <Button title={"edit"} onPress={() => navigation.navigate(routes.ROUTINE_EDIT_SCREEN)}/>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default RoutinesScreen;
