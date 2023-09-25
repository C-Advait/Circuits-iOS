import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Example(props) {
  return (
    <View style={styles.container}>
      <Text>This is an example component. All other components should go in ./app/components</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  }
});
export default Example;
