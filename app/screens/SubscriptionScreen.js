import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import Screen from "../components/Screen";
import NavHeader from "../components/NavHeader";
import { IconButton } from "../components/buttons";
import { useSettings } from "../contexts/SettingsContext";
import ImageText from "../components/ImageText";
import {
  PARAGRAPH_FONT_SIZE,
  PARAGRAPH_FONT_WEIGHT,
} from "../config/appConstants";
import { SubscriptionButton } from "../components/buttons";

const SubscriptionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { theme } = useSettings();
  const styles = getStyles(theme);
  const { prevScreen } = route.params;

  const [selectedPlan, setSelectedPlan] = useState(1);

  return (
    <ImageBackground
      source={require("../assets/backgrounds/subscriptions-background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <Screen style={styles.container}>
        <View>
          <NavHeader
            LeftComponent={
              <IconButton
                iconName={"chevron-left"}
                IconFamily={Feather}
                iconSize={52}
                foregroundColor={theme.blue}
                onPress={() => {
                  navigation.navigate(prevScreen);
                }}
              />
            }
            headerText={""}
            containerStyle={styles.navHeader}
          />
          <View style={styles.titlePanel}>
            <Image
              source={require("../assets/icon-transparent-bg.png")}
              resizeMode="contain"
              style={{ height: 75, width: 75, margin: 25 }}
            />
            <Text
              style={{ fontSize: 22, fontWeight: "600", color: theme.primary }}
            >
              Circuits° Premium
            </Text>
          </View>
          <View style={styles.featureHighlights}>
            <ImageText
              image={require("../assets/zap.png")}
              text="Create unlimited routines"
            />
            <ImageText
              image={require("../assets/zap.png")}
              text="Enjoy extensive premium routines"
            />
            <ImageText
              image={require("../assets/zap.png")}
              text="Access new features early"
            />
          </View>
        </View>

        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Available Plans</Text>
          <View style={styles.plansContainer}>
            <SubscriptionButton
              enabled={selectedPlan === 1}
              titleText={"Monthly Pass"}
              priceText={"$0.99/month"}
              onPress={() => {
                setSelectedPlan(1);
              }}
            />
            <SubscriptionButton
              enabled={selectedPlan === 2}
              titleText={"Lifetime Access"}
              priceText={"$9.99, one-time payment"}
              onPress={() => {
                setSelectedPlan(2);
              }}
            />
          </View>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => null}>
            <Text style={styles.restoreText}>Restore purchase</Text>
          </TouchableOpacity>

          <Text style={styles.descriptionText}>
            Description of how purchases will be handled. Charged to your Apple
            ID account ....
          </Text>
        </View>
      </Screen>
    </ImageBackground>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      backgroundColor: "transparent",
      justifyContent: "space-between",
      height: "100%",
      width: "100%",
    },
    modalView: {
      alignItems: "center",
      backgroundColor: theme.secondaryBackground,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    modalTitle: {
      fontSize: PARAGRAPH_FONT_SIZE,
      fontWeight: PARAGRAPH_FONT_WEIGHT,
      marginBottom: 24,
      color: theme.secondary,
    },
    featuresList: {
      alignSelf: "stretch",
      marginBottom: 15,
    },
    featureItem: {
      fontSize: 16,
    },
    plansContainer: {
      alignSelf: "stretch",
      gap: 16,
      marginBottom: 17,
    },
    continueButton: {
      backgroundColor: theme.accentDarkBlue,
      width: "100%",
      borderRadius: 10,
      height: 58,
      justifyContent: "center",
      marginBottom: 20,
    },
    continueText: {
      color: theme.primary,
      fontWeight: PARAGRAPH_FONT_WEIGHT,
      fontSize: PARAGRAPH_FONT_SIZE,
      textAlign: "center",
    },
    restoreText: {
      color: theme.blue,
      marginBottom: 20,
      fontSize: 15,
      fontWeight: PARAGRAPH_FONT_WEIGHT,
    },
    titlePanel: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 28,
    },
    descriptionText: {
      fontSize: 13,
      fontWeight: "400",
      color: "gray",
      alignSelf: "stretch",
      marginBottom: 10,
    },
    featureHighlights: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    highlightBorder: {
      borderWidth: 3,
      borderColor: "red",
    },
    navHeader: {
      marginBottom: 0,
    },
  });

export default SubscriptionScreen;
