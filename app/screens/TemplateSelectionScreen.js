import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Screen from "../components/Screen";
import { useAppContext } from "../contexts/AppContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTemplateContext } from "../contexts/TemplateContext";
import { useNavigation } from "@react-navigation/native";
import NavHeader from "../components/NavHeader";
import { IconButton } from "../components/buttons";
import routes from "../navigation/routes";

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
  {
    id: 10,
    title: "Arms",
    userCreated: true,
  },
  {
    id: 11,
    title: "Leg Workout A",
    userCreated: true,
  },
  {
    id: 12,
    title: "Climbing Circuit",
    userCreated: true,
  },
  {
    id: 13,
    title: "Morning Meditation",
    userCreated: true,
  },
  {
    id: 14,
    title: "Cardio",
    userCreated: true,
  },
];

const TemplateSelectionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { theme } = useAppContext();
  const styles = getStyles(theme);
  const isRoutineEditing = route.params.edit;

  const userCreatedData = data.filter((item) => item.userCreated);
  const systemCreatedData = data.filter((item) => !item.userCreated);

  // Default selectedId to 1
  const { selectedTemplateID, setSelectedTemplateID, setSelectedTemplate } =
    useTemplateContext();

  const renderItem = (item, isLast) => (
    <React.Fragment key={item.id}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.item}
        onPress={() => {
          setSelectedTemplateID(item.id);
          setSelectedTemplate(item.title);
        }}
      >
        <Text style={styles.choiceText}>{item.title}</Text>
        {selectedTemplateID === item.id && (
          <Ionicons name="checkmark" color={theme.blue} size={25} />
        )}
      </TouchableOpacity>
      {!isLast ? <View style={styles.separator} /> : null}
    </React.Fragment>
  );

  return (
    <Screen>
      <NavHeader
        LeftComponent={
          <IconButton
            iconName="chevron-left"
            IconFamily={Feather}
            foregroundColor={theme.blue}
            onPress={() =>
              navigation.navigate(routes.ROUTINE_EDIT_SCREEN, {
                edit: isRoutineEditing,
              })
            }
          />
        }
        headerText="Templates"
      />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>System Created Templates</Text>
        <View style={styles.group}>
          {systemCreatedData.map((item, index) =>
            renderItem(item, index === systemCreatedData.length - 1),
          )}
        </View>
        <Text style={styles.sectionTitle}>User Created Templates</Text>
        <View style={styles.group}>
          {userCreatedData.map((item, index) =>
            renderItem(item, index === userCreatedData.length - 1),
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    choiceText: {
      color: theme.primary,
      fontSize: 17,
    },
    container: {
      flex: 1,
    },
    group: {
      borderRadius: 8,
      marginBottom: 23,
      marginHorizontal: 15,
      overflow: "hidden",
    },
    item: {
      alignItems: "center",
      backgroundColor: theme.secondaryBackground,
      flexDirection: "row",
      height: 50,
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 5,
    },
    checkmark: {
      color: theme.blue,
    },
    separator: {
      backgroundColor: "#ebebf540",
      height: 1,
    },
    sectionTitle: {
      color: theme.secondary,
      fontSize: 14,
      fontWeight: 500,
      marginLeft: 16,
      marginBottom: 8,
    },
  });

export default TemplateSelectionScreen;
