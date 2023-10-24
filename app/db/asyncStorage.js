import AsyncStorage from "@react-native-async-storage/async-storage";

// To Save a Setting:
export const saveSetting = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("There was an error saving the setting", error);
  }
};

// To Retrieve a Setting:
export const retrieveSetting = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.error("There was an error retrieving the setting", error);
  }
};
