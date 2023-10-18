import { Alert } from "react-native";

export const confirmedNavigate = (onPress) => {
  Alert.alert(
    "Discard changes?", // title
    "If you go back now, you'll lose your changes.", // message
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Discard",
        onPress: onPress,
      },
    ],
    { cancelable: false },
  );
};
