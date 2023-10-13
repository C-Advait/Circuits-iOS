import { Alert } from "react-native";

export const confirmedNavigate = (onPress) => {
  Alert.alert(
    "Confirm", // title
    "Are you sure you want to end this routine?", // message
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: onPress,
      },
    ],
    { cancelable: false },
  );
};
