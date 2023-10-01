import { Feather } from "@expo/vector-icons";
import routes from "./routes";

export default Object.freeze({
  [routes.ROUTINES]: ({ size, color }) => <Feather name="list" size={size} color={color} />,
  [routes.SETTINGS_SCREEN]: ({ size, color }) => <Feather name="settings" size={size} color={color} />,
});
