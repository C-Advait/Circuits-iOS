import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";

import Screen from "../components/Screen";
import Navheader from "../components/NavHeader";
import { IconButton } from "../components/buttons";
import { useTheme } from "../contexts/ThemeContext";
import routes from "../navigation/routes";
import AuxilaryCard from "../components/AuxiliaryCard";
import TimePickerModal from "../components/TimePickerModal";
import NumberPickerModal from "../components/NumberPickerModal";

import Receiver from "../events/Receiver";
import eventManager from "../events/eventManager";

function ExerciseEditScreen(props) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [restEnabled, setRestEnabled] = useState(false);

  return (
    <Screen style={{ flex: 1 }}>
      <Navheader
        style={styles.navPanel}
        LeftComponent={
          <IconButton
            iconName={"chevron-left"}
            IconFamily={Feather}
            iconSize={52}
            foregroundColor={"#3397f3"}
            onPress={() => navigation.navigate(routes.ROUTINE_EDIT_SCREEN)}
          />
        }
        headerText="Edit Planks"
      />
      <View style={{ gap: 10, paddingHorizontal: 11 }}>
        <AuxilaryCard
          editable={false}
          bold={false}
          title={"Work time"}
          InputComponent={() => (
            <TimePickerModal
              promptTitle="Work time"
              promptSubtitle="Duration of the work round."
              startingMinute=" 1"
            />
          )}
        />
        <AuxilaryCard
          editable={false}
          bold={false}
          title={"Number of rounds"}
          InputComponent={() => (
            <NumberPickerModal
              promptTitle="Number of rounds"
              promptSubtitle="Repetitions of the current exercise."
              onApply={(number) => {
                console.log("number: ", number);
                eventManager.emit("numberOfRounds", number);
              }}
            />
          )}
        />
        <AuxilaryCard
          editable={false}
          bold={false}
          disabled={restEnabled}
          title={"Rest between rounds"}
          InputComponent={() => (
            <Receiver>
              <TimePickerModal
                promptTitle="Rest"
                promptSubtitle="Duration of rest between subsequent rounds."
                startingMinute=" 0"
                startingSecond="30"
                enabled={restEnabled}
              />
            </Receiver>
          )}
        />
        <AuxilaryCard
          editable={false}
          bold={false}
          title={"Break until next exercise"}
          InputComponent={() => (
            <TimePickerModal
              promptTitle="Break"
              promptSubtitle="Duration of break before next exercise."
              startingMinute=" 1"
            />
          )}
        />
      </View>
    </Screen>
  );
}

const getStyles = (theme) => StyleSheet.create({});

export default ExerciseEditScreen;
