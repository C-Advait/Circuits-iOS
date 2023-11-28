import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { BlurView } from "expo-blur";

import { TAB_BAR_HEIGHT } from "../config/appConstants";
import { useAppContext } from "../contexts/AppContext";
import navigationIcons from "./navigationIcons";

import shouldShowTabBar from "./shouldShowTabBar";

const AppTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useAppContext();

  return shouldShowTabBar(getCurrentRoute(state)) ? (
    <SafeAreaView style={styles.tabBar}>
      <BlurView
        style={styles.tabBar}
        blurType="extraDark"
        blurAmount={50}
        reducedTransparencyFallbackColor={theme.background}
      >
        <View style={styles.colorOverlay} />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = navigationIcons[route.name];
          const color = isFocused
            ? theme.tabBarActiveTintColor
            : theme.tabBarInactiveTintColor;

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View style={[styles.tabItem, { gap: 5 }]}>
                <Icon size={24} color={color} />
                <Text style={{ fontSize: 12, color: color }}>{label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  ) : null;
};

const getCurrentRoute = (state) => {
  const { routes, index } = state;
  const currentTab = routes[index];
  if (currentTab.state) {
    const { index: innerIndex, routes } = currentTab.state;
    return routes[innerIndex].name;
  }
  return currentTab.name;
};

const styles = StyleSheet.create({
  colorOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.7)", // adjust opacity as needed
  },
  tabBar: {
    flexDirection: "row",
    height: TAB_BAR_HEIGHT,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppTabBar;
