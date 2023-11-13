import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppContext } from "../contexts/AppContext";

function Example() {
  const { theme } = useAppContext();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        This is an example component. All other components should go in
        ./app/components
      </Text>
    </View>
  );
}

// Recall that hooks can't be called outside
// components. So, in order for the following
// styles object to know about 'theme', it
// must be passed as an
const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      margin: 10,
    },
    message: {
      color: theme.foreground,
    },
  });
export default Example;
