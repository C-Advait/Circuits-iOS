import React from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import navigationIcons from "./navigationIcons";
import { TAB_BAR_HEIGHT } from "../config/appConstants";
import { useTheme } from "../contexts/ThemeContext";

const AppTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();

  return (
    // Currently hard-coded for dark-mode.
    <LinearGradient
      colors={[
        "rgba(30, 30, 30, 0)", // #1e1e1e at 0% opacity
        "rgba(18, 18, 18, 0.75)", // #121212 at 75% opacity
      ]}
      style={styles.bar}
      start={[0, 0]}
      end={[0, 1]}
    >
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const Icon = navigationIcons[route.name];

          const isFocused = state.index === index;
          const color = isFocused
            ? theme.tabBarActiveTintColor
            : theme.tabBarInactiveTintColor;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableWithoutFeedback
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              key={index}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.touchable}
            >
              <>
                <View style={styles.tabGroupContainer}>
                  <Icon size={24} color={color} />
                  <Text style={[styles.label, { color: color }]}>{label}</Text>
                </View>
                <View
                  style={{
                    zIndex: 3,
                    backgroundColor: "dodgerblue",
                    position: "absolute",
                    height: 100,
                  }}
                />
              </>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#1212120c",
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
  label: {
    fontSize: 10,
  },
  tabContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    height: TAB_BAR_HEIGHT,
    justifyContent: "space-around",
    paddingBottom: 15,
    zIndex: 2,
  },
  tabGroupContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  touchable: {
    backgroundColor: "transparent",
  },
});

export default AppTabBar;
