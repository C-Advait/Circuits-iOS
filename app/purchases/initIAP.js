import * as RNIap from "react-native-iap";

export default async function initIAP() {
  try {
    const conn = await RNIap.initConnection();
  } catch (err) {
    console.warn(err); // standardized error handling
  }
}
