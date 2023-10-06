import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Screen from "../components/Screen";

const data = [
  {
    id: 1,
    title: "Custom (Default)",
    userCreated: false,
  },
  {
    id: 2,
    title: "Giant",
    userCreated: false,
  },
  {
    id: 3,
    title: "HIIT",
    userCreated: false,
  },
  {
    id: 4,
    title: "Tabata",
    userCreated: false,
  },
  {
    id: 5,
    title: "Arms",
    userCreated: true,
  },
  {
    id: 6,
    title: "Leg Workout A",
    userCreated: true,
  },
  {
    id: 7,
    title: "Climbing Circuit",
    userCreated: true,
  },
  {
    id: 8,
    title: "Morning Meditation",
    userCreated: true,
  },
  {
    id: 9,
    title: "Cardio",
    userCreated: true,
  },
];

const TemplateSelectionScreen = () => {
  const userCreatedData = data.filter((item) => item.userCreated);
  const systemCreatedData = data.filter((item) => !item.userCreated);

  // Default selectedId to 1
  const [selectedId, setSelectedId] = useState(1);

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.item}
      onPress={() => setSelectedId(item.id)}
    >
      <Text>{item.title}</Text>
      {selectedId === item.id && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>System Created Templates</Text>
        <View style={styles.group}>
          {systemCreatedData.map((item) => renderItem(item))}
        </View>
        <View style={styles.separator} />
        <Text style={styles.sectionTitle}>User Created Templates</Text>
        <View style={styles.group}>
          {userCreatedData.map((item) => renderItem(item))}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkgrey",
  },
  group: {},
  item: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "grey",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkmark: {
    color: "blue",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
  },
});

export default TemplateSelectionScreen;
