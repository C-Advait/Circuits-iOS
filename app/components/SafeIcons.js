import {
  Entypo as ExpoEntypo,
  EvilIcons as ExpoEvilIcons,
  Feather as ExpoFeather,
  Ionicons as ExpoIonicons,
  MaterialCommunityIcons as ExpoMaterialCommunityIcons,
  MaterialIcons as ExpoMaterialIcons,
} from "@expo/vector-icons";

const withHandledFontLoading = (IconFamily) =>
  class SafeIcon extends IconFamily {
    async componentDidMount() {
      try {
        await super.componentDidMount();
      } catch (error) {
        console.log(
          `Couldn't load the ${IconFamily.getFontFamily()} icon font.`,
          error,
        );
      }
    }
  };

export const Entypo = withHandledFontLoading(ExpoEntypo);
export const EvilIcons = withHandledFontLoading(ExpoEvilIcons);
export const Feather = withHandledFontLoading(ExpoFeather);
export const Ionicons = withHandledFontLoading(ExpoIonicons);
export const MaterialCommunityIcons = withHandledFontLoading(
  ExpoMaterialCommunityIcons,
);
export const MaterialIcons = withHandledFontLoading(ExpoMaterialIcons);
