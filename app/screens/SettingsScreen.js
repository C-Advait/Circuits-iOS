import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
  Switch,
  Linking,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Rate from "react-native-rate";
import { useNavigation } from "@react-navigation/core";
import routes from "../navigation/routes";

import Screen from "../components/Screen";
import Header from "../components/Header";
import { useAppContext } from "../contexts/AppContext";
import { PRIVACY_STATEMENT_URL } from "../config/appConstants";

// localize 'behaviour'?
function SettingsScreen() {
  const { theme } = useAppContext();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { soundOn, updateSound } = useAppContext();

  const toggleSound = () => {
    updateSound(!soundOn);
  };

  const contactSupport = () => {
    const url = "mailto:circuit.timer@gmail.com";
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          console.log("support is: ", supported);
          return Linking.openURL(url);
        } else {
          Alert.alert("Unable to open email client");
          // console.log("Unable to open email client")
          // throw new Error("Unable to open email client");
        }
      })
      .catch((error) => {
        Alert.alert("Mail Error: \n", error.message);
      });
  };

  const rateUs = () => {
    const options = {
      AppleAppID: "6471159497",
      GooglePackageName: "com.mywebsite.myapp", // TODO: CORRECT TO REAL PACKAGE
      preferInApp: true,
      openAppStoreIfInAppFails: true,
    };
    Rate.rate(options, (_success, errorMessage) => {
      if (errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  const navPrivacyPolicy = () => {
    const url = PRIVACY_STATEMENT_URL;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const behaviour = [
    {
      id: 1,
      title: "Sounds",
      onTouchablePress: () => null,
      Component: (
        <Switch
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          onValueChange={toggleSound}
          value={soundOn}
        />
      ),
    },
  ];
  const account = [
    {
      id: 1,
      title: "Subscription Plan",
      onTouchablePress: () =>
        navigation.navigate(routes.SUBSCRIPTION_SCREEN, {
          prevScreen: routes.SETTINGS_SCREEN,
        }),
    },
  ];

  const support = [
    {
      id: 4,
      title: "Contact Us",
      onTouchablePress: contactSupport,
    },
    {
      id: 5,
      title: "Rate Us",
      onTouchablePress: rateUs,
    },
  ];
  const privacy = [
    {
      id: 6,
      title: "Privacy Policy",
      onTouchablePress: navPrivacyPolicy,
    },
  ];

  const renderItem = (item, isLast) => (
    <React.Fragment key={item.id}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.item}
        onPress={
          item.onTouchablePress
            ? item.onTouchablePress
            : () => {
                Alert.alert(item.title, item.title);
              }
        }
      >
        <Text style={styles.choiceText}>{item.title}</Text>
        {item.Component ? (
          item.Component
        ) : (
          <Feather name="chevron-right" color={theme.text38} size={25} />
        )}
      </TouchableOpacity>
      {!isLast ? <View style={styles.separator} /> : null}
    </React.Fragment>
  );
  const renderSection = (title, data) => (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.group}>
        {data.map((item, index) => renderItem(item, index === data.length - 1))}
      </View>
    </>
  );

  // The IconButton here is purely a hack to
  // align the headers between Tab.Screens.
  return (
    <Screen>
      <View style={styles.topPanel}>
        <Header>Settings</Header>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {renderSection("Behaviour", behaviour)}
        {renderSection("My Account", account)}
        {renderSection("Support", support)}
        {renderSection("Privacy", privacy)}
      </ScrollView>
    </Screen>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    choiceText: {
      color: theme.primary,
      fontSize: 17,
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
      paddingLeft: 16,
      paddingRight: 8,
      paddingVertical: 5,
    },
    scrollContainer: {
      flex: 1,
    },
    sectionTitle: {
      color: theme.secondary,
      fontSize: 14,
      fontWeight: "500",
      marginLeft: 16,
      marginBottom: 8,
    },
    separator: {
      backgroundColor: theme.tertiaryBackground,
      height: 1,
    },
    topPanel: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 45,
      marginLeft: 15,
      marginBottom: 34,
      marginHorizontal: 10,
      marginTop: 25,
    },
  });

export default SettingsScreen;
