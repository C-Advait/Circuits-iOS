import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Screen from '../components/Screen';
import Header from '../components/Header';

function SettingsScreen(props) {
  return (
    <Screen>
      <Header>Settings</Header>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {}
});
export default SettingsScreen;
